import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { negotiateOffer } from '@/lib/ai/negotiation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, ticket_count: ticketCount = 2, offered_price, customer_id } = body

    if (!event_id || !offered_price) {
      return NextResponse.json(
        { error: 'event_id und offered_price sind erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch event with venue and value adds
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        venues(name),
        event_value_adds(
          *,
          venue_value_adds(*)
        )
      `)
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event nicht gefunden' }, { status: 404 })
    }

    // Check attempt count
    const { count: existingOffers } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id)
      .eq('customer_id', customer_id)

    const attemptNumber = (existingOffers || 0) + 1

    if (attemptNumber > 3) {
      return NextResponse.json({
        response: 'Heute passt es leider nicht — soll ich dich benachrichtigen wenn ein Deal in deiner Preisklasse kommt?',
        accepted: false,
        no_more_attempts: true,
      })
    }

    // Prepare value adds
    const availableValueAdds = (event.event_value_adds || [])
      .filter((eva: { enabled: boolean }) => eva.enabled)
      .map((eva: { venue_value_adds: { name: string; retail_value: number; description: string } }) => ({
        name: eva.venue_value_adds.name,
        retailValue: eva.venue_value_adds.retail_value,
        description: eva.venue_value_adds.description,
      }))

    // Call Claude API for negotiation
    const result = await negotiateOffer({
      offerMinPrice: event.offer_min_price || event.min_price,
      offerMaxDiscountPct: event.offer_max_discount_pct || 0.3,
      flashPrice: event.flash_price,
      availableValueAdds,
      attemptNumber,
      ticketCount,
      offeredPrice: offered_price,
      eventName: event.name,
      venueName: event.venues?.name || 'Venue',
    })

    // Save offer to database
    const { data: offer } = await supabase
      .from('offers')
      .insert({
        customer_id,
        event_id,
        ticket_count: ticketCount,
        offered_price,
        counter_price: result.counterPrice,
        counter_value_adds: result.includedValueAdds || [],
        attempt_number: attemptNumber,
        status: result.accepted ? 'accepted' : 'countered',
        ai_response: result.response,
        expires_at: result.accepted
          ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
          : null,
      })
      .select()
      .single()

    return NextResponse.json({
      ...result,
      offer_id: offer?.id,
      attempt_number: attemptNumber,
      attempts_remaining: 3 - attemptNumber,
    })
  } catch {
    return NextResponse.json(
      { error: 'Fehler bei der Verhandlung' },
      { status: 500 }
    )
  }
}
