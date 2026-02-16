import { HeroEvent } from '@/components/consumer/HeroEvent'
import { EventCard } from '@/components/consumer/EventCard'
import { SearchBar } from '@/components/consumer/SearchBar'
import type { Event } from '@/types'

// Unsplash images for mock events
const MOCK_IMAGES = {
  ignite: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  passion: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop&q=80',
  staunen: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop&q=80',
  electra: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
  cosmos: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&q=80',
  heroWide: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop&q=80',
}

// Mock events sorted by relevance (nearest date + closest venue first)
const mockEvents: (Event & { venueName?: string; distanceKm?: number })[] = [
  {
    id: '1',
    venueId: 'v1',
    seriesId: null,
    name: 'IGNITE \u2014 Die Variet\u00e9-Show',
    slug: 'ignite-variete-show',
    description: 'Eine atemberaubende Variet\u00e9-Show mit Weltklasse-Artisten, Magie und Live-Musik.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:30',
    datetime: new Date(Date.now() + 86400000 + 70200000).toISOString(),
    contingentTotal: 30,
    contingentSold: 18,
    contingentRemaining: 12,
    minPrice: 35,
    flashPrice: 49,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 35,
    coverImageUrl: MOCK_IMAGES.heroWide,
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Variet\u00e9-Theater Essen',
    distanceKm: 1.2,
  },
  {
    id: '4',
    venueId: 'v2',
    seriesId: null,
    name: 'ELECTRA \u2014 Die Neon-Show',
    slug: 'electra-neon-show',
    description: 'UV-Licht, Neon-Kost\u00fcme und atemberaubende Performances in einer einzigartigen Atmosph\u00e4re.',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '21:00',
    datetime: new Date(Date.now() + 172800000 + 75600000).toISOString(),
    contingentTotal: 20,
    contingentSold: 17,
    contingentRemaining: 3,
    minPrice: 45,
    flashPrice: 65,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.20,
    offerMinPrice: 45,
    coverImageUrl: MOCK_IMAGES.electra,
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Variet\u00e9-Theater Essen',
    distanceKm: 1.2,
  },
  {
    id: '2',
    venueId: 'v1',
    seriesId: null,
    name: 'PASSION \u2014 Tanz & Akrobatik',
    slug: 'passion-tanz-akrobatik',
    description: 'Eine leidenschaftliche Show die Tanz, Akrobatik und Emotionen vereint.',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    time: '20:00',
    datetime: new Date(Date.now() + 259200000 + 72000000).toISOString(),
    contingentTotal: 25,
    contingentSold: 20,
    contingentRemaining: 5,
    minPrice: 39,
    flashPrice: 55,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.25,
    offerMinPrice: 39,
    coverImageUrl: MOCK_IMAGES.passion,
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Variet\u00e9-Theater Essen',
    distanceKm: 1.2,
  },
  {
    id: '3',
    venueId: 'v2',
    seriesId: null,
    name: 'STAUNEN \u2014 Die Zaubershow',
    slug: 'staunen-zaubershow',
    description: 'Magie hautnah erleben. Eine Show die dich sprachlos macht.',
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    time: '19:00',
    datetime: new Date(Date.now() + 345600000 + 68400000).toISOString(),
    contingentTotal: 40,
    contingentSold: 8,
    contingentRemaining: 32,
    minPrice: 29,
    flashPrice: 42,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 29,
    coverImageUrl: MOCK_IMAGES.staunen,
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Variet\u00e9-Theater Bonn',
    distanceKm: 85,
  },
  {
    id: '5',
    venueId: 'v1',
    seriesId: null,
    name: 'COSMOS \u2014 Reise durch die Galaxie',
    slug: 'cosmos-reise-galaxie',
    description: 'Eine interstellare Variet\u00e9-Reise mit atemberaubender Projektionstechnik.',
    date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    time: '20:00',
    datetime: new Date(Date.now() + 432000000 + 72000000).toISOString(),
    contingentTotal: 35,
    contingentSold: 2,
    contingentRemaining: 33,
    minPrice: 32,
    flashPrice: 45,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 32,
    coverImageUrl: MOCK_IMAGES.cosmos,
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Variet\u00e9-Theater Bonn',
    distanceKm: 85,
  },
]

export default function HomePage() {
  const featuredEvent = mockEvents[0]
  const nearbyEvents = mockEvents.filter(e => (e.distanceKm ?? 999) < 10)
  const otherEvents = mockEvents.filter(e => (e.distanceKm ?? 999) >= 10)

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
      <section className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Alle', 'Heute', 'Variet\u00e9', 'Comedy', 'Konzert', 'Theater', 'Family'].map((cat, i) => (
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

      {/* Nearby Events — In deiner N\u00e4he */}
      {nearbyEvents.length > 1 && (
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">In deiner N\u00e4he</h2>
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
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#FF453A' }}
            />
            <h2 className="text-base font-bold text-[var(--text-primary)]">Beliebt gerade</h2>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">{mockEvents.length} Events</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mockEvents.slice(1, 3).map((event) => (
            <EventCard key={event.id} event={event} variant="large" />
          ))}
        </div>
      </section>

      {/* Further away section */}
      {otherEvents.length > 0 && (
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Weitere Events</h2>
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
