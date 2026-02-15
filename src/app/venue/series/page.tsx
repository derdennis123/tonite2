import Link from 'next/link'

export default function VenueSeriesPage() {
  const series = [
    { id: 's1', name: 'IGNITE', days: 'Mi–So', time: '19:30', contingent: 30, minPrice: 35, status: 'active', autoRelease: true, eventsGenerated: 24 },
    { id: 's2', name: 'PASSION', days: 'Fr–Sa', time: '20:00', contingent: 25, minPrice: 39, status: 'active', autoRelease: true, eventsGenerated: 12 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event-Serien</h1>
        <Link href="/venue/series/new" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>
          Serie erstellen
        </Link>
      </div>

      <div className="space-y-3">
        {series.map((s) => (
          <div key={s.id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{s.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>Aktiv</span>
              </div>
              {s.autoRelease && <span className="text-xs text-[var(--text-tertiary)]">Auto-Release</span>}
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><p className="text-xs text-[var(--text-tertiary)]">Tage</p><p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{s.days}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Uhrzeit</p><p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{s.time}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Kontingent</p><p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{s.contingent}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Events</p><p className="text-sm text-[var(--text-primary)] font-medium mt-0.5">{s.eventsGenerated}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
