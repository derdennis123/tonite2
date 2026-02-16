import { createClient } from '@/lib/supabase/server'

export interface TicketWithEvent {
  id: string
  guest_name: string
  qr_code_data: string
  checked_in: boolean
  checked_in_at: string | null
  event_name: string
  venue_name: string
  datetime: string
  status: 'active' | 'past'
}

export async function getTicketsForUser(userId: string): Promise<TicketWithEvent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tickets')
    .select(`
      id, guest_name, qr_code_data, checked_in, checked_in_at,
      events(name, datetime, status, venues(name))
    `)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const now = new Date()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((ticket: any) => {
    const event = Array.isArray(ticket.events) ? ticket.events[0] : ticket.events
    const venue = event?.venues
      ? (Array.isArray(event.venues) ? event.venues[0] : event.venues)
      : null

    return {
      id: ticket.id,
      guest_name: ticket.guest_name,
      qr_code_data: ticket.qr_code_data,
      checked_in: ticket.checked_in,
      checked_in_at: ticket.checked_in_at,
      event_name: event?.name || '',
      venue_name: venue?.name || '',
      datetime: event?.datetime || '',
      status: new Date(event?.datetime || '') > now ? 'active' as const : 'past' as const,
    }
  })
}
