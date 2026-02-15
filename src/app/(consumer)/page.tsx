import { HeroEvent } from '@/components/consumer/HeroEvent'
import { EventCard } from '@/components/consumer/EventCard'
import type { Event } from '@/types'

// Mock events for development - will be replaced with Supabase queries
const mockEvents: (Event & { venueName?: string })[] = [
  {
    id: '1',
    venueId: 'v1',
    seriesId: null,
    name: 'IGNITE — Die Varieté-Show',
    slug: 'ignite-variete-show',
    description: 'Eine atemberaubende Varieté-Show mit Weltklasse-Artisten, Magie und Live-Musik. Ein Abend voller Staunen und Unterhaltung.',
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
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
  },
  {
    id: '2',
    venueId: 'v1',
    seriesId: null,
    name: 'PASSION — Tanz & Akrobatik',
    slug: 'passion-tanz-akrobatik',
    description: 'Eine leidenschaftliche Show die Tanz, Akrobatik und Emotionen vereint.',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '20:00',
    datetime: new Date(Date.now() + 172800000 + 72000000).toISOString(),
    contingentTotal: 25,
    contingentSold: 20,
    contingentRemaining: 5,
    minPrice: 39,
    flashPrice: 55,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.25,
    offerMinPrice: 39,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
  },
  {
    id: '3',
    venueId: 'v2',
    seriesId: null,
    name: 'STAUNEN — Die Zaubershow',
    slug: 'staunen-zaubershow',
    description: 'Magie hautnah erleben. Eine Show die dich sprachlos macht.',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    time: '19:00',
    datetime: new Date(Date.now() + 259200000 + 68400000).toISOString(),
    contingentTotal: 40,
    contingentSold: 8,
    contingentRemaining: 32,
    minPrice: 29,
    flashPrice: 42,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 29,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Bonn',
  },
  {
    id: '4',
    venueId: 'v2',
    seriesId: null,
    name: 'ELECTRA — Die Neon-Show',
    slug: 'electra-neon-show',
    description: 'UV-Licht, Neon-Kostüme und atemberaubende Performances in einer einzigartigen Atmosphäre.',
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    time: '21:00',
    datetime: new Date(Date.now() + 345600000 + 75600000).toISOString(),
    contingentTotal: 20,
    contingentSold: 17,
    contingentRemaining: 3,
    minPrice: 45,
    flashPrice: 65,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.20,
    offerMinPrice: 45,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
  },
  {
    id: '5',
    venueId: 'v1',
    seriesId: null,
    name: 'COSMOS — Reise durch die Galaxie',
    slug: 'cosmos-reise-galaxie',
    description: 'Eine interstellare Varieté-Reise mit atemberaubender Projektionstechnik und Weltklasse-Artistik.',
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
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Bonn',
  },
]

export default function HomePage() {
  const featuredEvent = mockEvents[0]
  const otherEvents = mockEvents.slice(1)

  return (
    <div className="min-h-screen">
      {/* Hero Featured Event */}
      <section className="-mt-14">
        <HeroEvent event={featuredEvent} />
      </section>

      {/* Event Grid */}
      <section className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Kommende Events
          </h2>
          <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
            {mockEvents.length} Events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Empty State - shown when no events */}
      {mockEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'rgba(108, 92, 231, 0.1)',
              border: '1px solid rgba(108, 92, 231, 0.2)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4" /><path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Aktuell keine Events verfügbar
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            Schau später nochmal vorbei — neue Events werden regelmäßig veröffentlicht.
          </p>
        </div>
      )}
    </div>
  )
}
