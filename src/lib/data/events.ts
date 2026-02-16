import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

export type EventWithVenue = Event & { venueName?: string; venueAddress?: string; distanceKm?: number }

export async function getEvents(): Promise<EventWithVenue[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, venues(name, address, city, lat, lng)')
    .in('status', ['live', 'sold_out'])
    .order('datetime', { ascending: true })

  if (error || !data) return []

  return data.map((event) => ({
    ...event,
    contingentRemaining: event.contingent_total - event.contingent_sold,
    venueName: event.venues?.name,
    venueAddress: event.venues?.address,
  }))
}

export async function getEventBySlug(slug: string): Promise<EventWithVenue | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, venues(name, address, city)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return {
    ...data,
    contingentRemaining: data.contingent_total - data.contingent_sold,
    venueName: data.venues?.name,
    venueAddress: data.venues?.address,
  }
}

export async function getEventById(id: string): Promise<EventWithVenue | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*, venues(name, address, city)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    ...data,
    contingentRemaining: data.contingent_total - data.contingent_sold,
    venueName: data.venues?.name,
    venueAddress: data.venues?.address,
  }
}
