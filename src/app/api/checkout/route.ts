import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, ticket_count, guest_names, price_per_ticket, channel = 'flash', value_add_ids = [] } = body

    if (!event_id || !ticket_count || !price_per_ticket) {
      return NextResponse.json(
        { error: 'event_id, ticket_count, und price_per_ticket sind erforderlich' },
        { status: 400 }
      )
    }

    if (ticket_count < 1 || ticket_count > 6) {
      return NextResponse.json(
        { error: 'Ticket-Anzahl muss zwischen 1 und 6 liegen' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch event with venue
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, venues(*)')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event nicht gefunden' }, { status: 404 })
    }

    if (event.status !== 'live') {
      return NextResponse.json({ error: 'Event ist nicht verfügbar' }, { status: 400 })
    }

    const remaining = event.contingent_total - event.contingent_sold
    if (remaining < ticket_count) {
      return NextResponse.json(
        { error: `Nur noch ${remaining} Tickets verfügbar` },
        { status: 400 }
      )
    }

    if (price_per_ticket < event.min_price) {
      return NextResponse.json(
        { error: 'Preis liegt unter dem Mindestpreis' },
        { status: 400 }
      )
    }

    const venue = event.venues
    if (!venue?.stripe_account_id) {
      return NextResponse.json(
        { error: 'Venue hat keine Zahlungseinrichtung' },
        { status: 400 }
      )
    }

    const totalPrice = price_per_ticket * ticket_count
    const commissionRate = venue.commission_rate || 0.15
    const commissionAmount = Math.round(totalPrice * commissionRate * 100) / 100

    // Build line items
    const lineItems: Array<{
      price_data: {
        currency: string
        product_data: { name: string; description?: string }
        unit_amount: number
      }
      quantity: number
    }> = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: event.name,
            description: `${ticket_count}x Ticket — ${venue.name}`,
          },
          unit_amount: Math.round(price_per_ticket * 100),
        },
        quantity: ticket_count,
      },
    ]

    // Create Stripe Checkout Session with Connected Account
    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/event/${event.slug}`,
      payment_intent_data: {
        application_fee_amount: Math.round(commissionAmount * 100),
        transfer_data: {
          destination: venue.stripe_account_id,
        },
      },
      metadata: {
        event_id: event.id,
        ticket_count: ticket_count.toString(),
        price_per_ticket: price_per_ticket.toString(),
        channel,
        guest_names: JSON.stringify(guest_names || []),
        value_add_ids: JSON.stringify(value_add_ids),
      },
    })

    return NextResponse.json({ url: session.url, session_id: session.id })
  } catch {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Checkout-Session' },
      { status: 500 }
    )
  }
}
