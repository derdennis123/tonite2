import { createClient } from '@/lib/supabase/server'

export interface CrewWithMembers {
  id: string
  invite_code: string
  event_name: string
  venue_name: string
  flash_price: number
  status: 'open' | 'locked' | 'completed' | 'expired'
  members: Array<{
    id: string
    name: string
    status: 'joined' | 'paid' | 'dropped'
  }>
}

export async function getCrewByCode(inviteCode: string): Promise<CrewWithMembers | null> {
  const supabase = await createClient()

  const { data: crew, error } = await supabase
    .from('crews')
    .select(`
      *,
      crew_members(id, customer_id, status, customers(first_name, last_name)),
      events(name, flash_price, venues(name))
    `)
    .eq('invite_code', inviteCode)
    .single()

  if (error || !crew) return null

  return {
    id: crew.id,
    invite_code: crew.invite_code,
    event_name: crew.events?.name || '',
    venue_name: crew.events?.venues?.name || '',
    flash_price: crew.events?.flash_price || 0,
    status: crew.status,
    members: (crew.crew_members || []).map((m: { id: string; status: string; customers?: { first_name?: string; last_name?: string } }) => ({
      id: m.id,
      name: `${m.customers?.first_name || ''} ${(m.customers?.last_name || '')[0] || ''}.`.trim(),
      status: m.status,
    })),
  }
}
