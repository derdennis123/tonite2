import { HeroEvent } from '@/components/consumer/HeroEvent'
import { EventCard } from '@/components/consumer/EventCard'
import { SearchBar } from '@/components/consumer/SearchBar'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

// Fallback images when DB events have no cover image
const FALLBACK_IMAGES: Record<string, string> = {
  'ignite': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  'passion': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop&q=80',
  'staunen': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop&q=80',
  'electra': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
  'cosmos': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&q=80',
}

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop&q=80'

function getFallbackImage(eventName: string): string {
  const lower = eventName.toLowerCase()
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (lower.includes(key)) return url
  }
  return HERO_FALLBACK
}

// Map snake_case DB row to camelCase Event type
function mapEvent(row: Record<string, unknown>): Event & { venueName?: string; venueCity?: string; distanceKm?: number } {
  const venueName = row.venues && typeof row.venues === 'object' ? (row.venues as Record<string, unknown>).name as string : undefined
  const venueCity = row.venues && typeof row.venues === 'object' ? (row.venues as Record<string, unknown>).city as string : undefined
  const name = row.name as string

  return {
    id: row.id as string,
    venueId: row.venue_id as string,
    seriesId: (row.series_id as string) ?? null,
    name,
    slug: row.slug as string,
    description: (row.description as string) ?? null,
    date: row.date as string,
    time: row.time as string,
    datetime: row.datetime as string,
    contingentTotal: row.contingent_total as number,
    contingentSold: row.contingent_sold as number,
    contingentRemaining: (row.contingent_total as number) - (row.contingent_sold as number),
    minPrice: row.min_price as number,
    flashPrice: row.flash_price as number,
    makeOfferEnabled: row.make_offer_enabled as boolean,
    offerMaxDiscountPct: (row.offer_max_discount_pct as number) ?? null,
    offerMinPrice: (row.offer_min_price as number) ?? null,
    coverImageUrl: (row.cover_image_url as string) || getFallbackImage(name),
    videoUrl: (row.video_url as string) ?? null,
    tixuEventId: (row.tixu_event_id as string) ?? null,
    tixuTotalCapacity: (row.tixu_total_capacity as number) ?? null,
    tixuTotalSold: (row.tixu_total_sold as number) ?? null,
    status: row.status as Event['status'],
    publishedAt: (row.published_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    venueName,
    venueCity,
    // Placeholder distance — in production use user geolocation
    distanceKm: venueCity === 'Essen' ? 1.2 : 85,
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: rows, error } = await supabase
    .from('events')
    .select('*, venues(name, city, address, lat, lng)')
    .eq('status', 'live')
    .order('datetime', { ascending: true })

  const events = (rows ?? []).map(mapEvent)

  const featuredEvent = events[0]
  const nearbyEvents = events.filter(e => (e.distanceKm ?? 999) < 10)
  const otherEvents = events.filter(e => (e.distanceKm ?? 999) >= 10)

  if (!featuredEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Keine Events verfügbar</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {error ? `Fehler: ${error.message}` : 'Aktuell gibt es keine live Events. Schau später nochmal vorbei!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Featured Event */}
      <section className="-mt-14">
        <HeroEvent event={featuredEvent} />
      </section>

      {/* Search Bar - Sticky */}
      <section className="sticky top-14 z-40 px-4 -mt-6">
        <SearchBar />
      </section>

      {/* Category Pills */}
      <section className="px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Alle', 'Heute', 'Varieté', 'Comedy', 'Konzert', 'Theater', 'Family'].map((cat, i) => (
            <button
              key={cat}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={
                i === 0
                  ? {
                      background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                      color: 'white',
                      boxShadow: '0 0 16px rgba(108, 92, 231, 0.3)',
                    }
                  : {
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Nearby Events — In deiner Nähe */}
      {nearbyEvents.length > 1 && (
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">In deiner Nähe</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Essen &middot; unter 10 km</p>
            </div>
            <button className="text-xs font-medium text-[#A855F7]">
              Alle anzeigen
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {nearbyEvents.slice(1).map((event) => (
              <div key={event.id} className="flex-shrink-0 w-[260px]">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hot Events — Two-column grid */}
      <section className="mt-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#FF453A' }}
            />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Beliebt gerade</h2>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">{events.length} Events</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {events.slice(1, 3).map((event) => (
            <EventCard key={event.id} event={event} variant="large" />
          ))}
        </div>
      </section>

      {/* Further away section */}
      {otherEvents.length > 0 && (
        <section className="mt-10 px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Weitere Events</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Bonn &amp; Umgebung</p>
            </div>
          </div>

          <div className="space-y-3">
            {otherEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Ambient glow decoration */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.03] z-0"
        style={{
          background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
