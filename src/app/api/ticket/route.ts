import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'QR-Code erforderlich' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select(`
      *,
      events(name, datetime, venue_id),
      bookings(ticket_count, status)
    `)
    .eq('qr_code_data', code)
    .single()

  if (error || !ticket) {
    return NextResponse.json({
      valid: false,
      message: 'Ungültiges Ticket',
    })
  }

  if (ticket.checked_in) {
    return NextResponse.json({
      valid: false,
      message: 'Bereits eingecheckt',
      checked_in_at: ticket.checked_in_at,
      guest_name: ticket.guest_name,
    })
  }

  // Mark as checked in
  await supabase
    .from('tickets')
    .update({
      checked_in: true,
      checked_in_at: new Date().toISOString(),
    })
    .eq('id', ticket.id)

  return NextResponse.json({
    valid: true,
    message: 'Gültiges Ticket',
    guest_name: ticket.guest_name,
    event_name: ticket.events?.name,
    event_datetime: ticket.events?.datetime,
    ticket_count: ticket.bookings?.ticket_count,
  })
}
