import Link from 'next/link'

export default function VenueEventsPage() {
  const events = [
    { id: '1', name: 'IGNITE — Die Varieté-Show', date: '16.02.2026', time: '19:30', status: 'live', sold: 18, total: 30, flashPrice: 49 },
    { id: '2', name: 'PASSION — Tanz & Akrobatik', date: '17.02.2026', time: '20:00', status: 'live', sold: 20, total: 25, flashPrice: 55 },
    { id: '3', name: 'IGNITE — Die Varieté-Show', date: '18.02.2026', time: '19:30', status: 'scheduled', sold: 0, total: 30, flashPrice: 49 },
    { id: '4', name: 'IGNITE — Die Varieté-Show', date: '19.02.2026', time: '19:30', status: 'draft', sold: 0, total: 30, flashPrice: 49 },
  ]

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    live: { bg: 'rgba(52,199,89,0.15)', text: '#34C759', label: 'Live' },
    scheduled: { bg: 'rgba(90,200,250,0.15)', text: '#5AC8FA', label: 'Geplant' },
    draft: { bg: 'rgba(142,142,147,0.15)', text: '#8E8E93', label: 'Entwurf' },
    sold_out: { bg: 'rgba(255,69,58,0.15)', text: '#FF453A', label: 'Ausverkauft' },
    past: { bg: 'rgba(72,72,74,0.15)', text: '#48484A', label: 'Vergangen' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Events</h1>
        <Link href="/venue/events/new" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>
          Event erstellen
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const status = statusColors[event.status] || statusColors.draft
          return (
            <div key={event.id} className="p-5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{event.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: status.bg, color: status.text }}>{status.label}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{event.date} · {event.time} Uhr</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--text-primary)] font-medium">{event.sold}/{event.total} verkauft</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">€{event.flashPrice} Flash-Preis</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
