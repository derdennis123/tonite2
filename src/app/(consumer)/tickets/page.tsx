export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTicketsForUser } from '@/lib/data/bookings'
import { TicketsList } from './TicketsList'

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const tickets = await getTicketsForUser(user.id)

  return <TicketsList tickets={tickets} />
}
