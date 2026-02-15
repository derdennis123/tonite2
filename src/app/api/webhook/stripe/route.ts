import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let stripeEvent: Stripe.Event

  try {
    const stripe = await getStripe()
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (!metadata?.event_id) {
      return NextResponse.json({ error: 'Missing event metadata' }, { status: 400 })
    }

    const eventId = metadata.event_id
    const ticketCount = parseInt(metadata.ticket_count || '1')
    const pricePerTicket = parseFloat(metadata.price_per_ticket || '0')
    const channel = (metadata.channel || 'flash') as 'flash' | 'offer' | 'crew'
    const guestNames: string[] = JSON.parse(metadata.guest_names || '[]')
    const totalPrice = pricePerTicket * ticketCount

    // Fetch event for commission calculation
    const { data: event } = await supabase
      .from('events')
      .select('*, venues(commission_rate)')
      .eq('id', eventId)
      .single()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const commissionRate = event.venues?.commission_rate || 0.15
    const commissionAmount = Math.round(totalPrice * commissionRate * 100) / 100
    const venuePayoutAmount = totalPrice - commissionAmount

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: session.client_reference_id || session.customer as string,
        event_id: eventId,
        ticket_count: ticketCount,
        price_per_ticket: pricePerTicket,
        total_price: totalPrice,
        commission_amount: commissionAmount,
        venue_payout_amount: venuePayoutAmount,
        booking_channel: channel,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        status: 'confirmed',
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation failed:', bookingError)
      return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 })
    }

    // Create tickets
    const tickets = Array.from({ length: ticketCount }, (_, i) => ({
      booking_id: booking.id,
      event_id: eventId,
      customer_id: booking.customer_id,
      guest_name: guestNames[i] || `Gast ${i + 1}`,
    }))

    await supabase.from('tickets').insert(tickets)

    // Update event sold count
    await supabase
      .from('events')
      .update({ contingent_sold: event.contingent_sold + ticketCount })
      .eq('id', eventId)

    // Check if sold out
    if (event.contingent_sold + ticketCount >= event.contingent_total) {
      await supabase
        .from('events')
        .update({ status: 'sold_out' })
        .eq('id', eventId)
    }
  }

  return NextResponse.json({ received: true })
}
