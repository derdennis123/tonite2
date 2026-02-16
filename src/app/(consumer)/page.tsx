import { HeroEvent } from '@/components/consumer/HeroEvent'
import { EventCard } from '@/components/consumer/EventCard'
import { SearchBar } from '@/components/consumer/SearchBar'
import { getEvents } from '@/lib/data/events'

export default async function HomePage() {
  const events = await getEvents()

  const featuredEvent = events[0]
  const nearbyEvents = events.filter(e => (e.distanceKm ?? 0) < 10)
  const otherEvents = events.filter(e => (e.distanceKm ?? 0) >= 10)

  if (!featuredEvent) {
    return (
      <div className="min-h-screen pb-32 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Noch keine Events</h2>
        <p className="text-sm text-[var(--text-secondary)]">Schau bald wieder vorbei!</p>
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
      <section className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Alle', 'Heute', 'Variet\u00e9', 'Comedy', 'Konzert', 'Theater', 'Family'].map((cat, i) => (
            <button
              key={cat}
              type="button"
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

      {/* Nearby Events */}
      {nearbyEvents.length > 1 && (
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">In deiner N\u00e4he</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Essen &middot; unter 10 km</p>
            </div>
            <button type="button" className="text-xs font-medium text-[#A855F7]">
              Alle anzeigen
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {nearbyEvents.slice(1).map((event) => (
              <div key={event.id} className="flex-shrink-0 w-[260px]">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hot Events */}
      <section className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#FF453A' }}
            />
            <h2 className="text-base font-bold text-[var(--text-primary)]">Beliebt gerade</h2>
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
