import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCrewDiscount } from '@/lib/utils/format'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, event_id, customer_id, invite_code } = body

    const supabase = createAdminClient()

    if (action === 'create') {
      // Create new crew
      const { data: crew, error } = await supabase
        .from('crews')
        .insert({
          event_id,
          creator_customer_id: customer_id,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Crew konnte nicht erstellt werden' }, { status: 500 })
      }

      // Add creator as first member
      await supabase.from('crew_members').insert({
        crew_id: crew.id,
        customer_id,
      })

      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/crew/${crew.invite_code}`

      return NextResponse.json({
        crew_id: crew.id,
        invite_code: crew.invite_code,
        share_url: shareUrl,
        current_discount: 0,
        member_count: 1,
      })
    }

    if (action === 'join') {
      // Find crew by invite code
      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('*, crew_members(*)')
        .eq('invite_code', invite_code)
        .single()

      if (crewError || !crew) {
        return NextResponse.json({ error: 'Crew nicht gefunden' }, { status: 404 })
      }

      if (crew.status !== 'open') {
        return NextResponse.json({ error: 'Crew ist bereits gesperrt' }, { status: 400 })
      }

      // Check if already a member
      const existingMember = crew.crew_members?.find(
        (m: { customer_id: string }) => m.customer_id === customer_id
      )
      if (existingMember) {
        return NextResponse.json({ error: 'Du bist bereits in dieser Crew' }, { status: 400 })
      }

      // Add member
      await supabase.from('crew_members').insert({
        crew_id: crew.id,
        customer_id,
      })

      const memberCount = (crew.crew_members?.length || 0) + 1
      const discount = getCrewDiscount(memberCount)

      return NextResponse.json({
        crew_id: crew.id,
        member_count: memberCount,
        current_discount: discount,
        event_id: crew.event_id,
      })
    }

    return NextResponse.json({ error: 'Ungültige Aktion' }, { status: 400 })
  } catch (error) {
    console.error('Crew error:', error)
    return NextResponse.json({ error: 'Crew-Fehler' }, { status: 500 })
  }
}
