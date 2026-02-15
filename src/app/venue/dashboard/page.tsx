export default function VenueDashboardPage() {
  // Mock data
  const stats = {
    totalRevenue: 12450,
    ticketsSold: 287,
    upcomingEvents: 8,
    activeEvents: 3,
  }

  const recentBookings = [
    { id: 'b1', event: 'IGNITE — Die Varieté-Show', tickets: 2, total: 98, channel: 'flash', date: '14.02.2026' },
    { id: 'b2', event: 'IGNITE — Die Varieté-Show', tickets: 3, total: 120, channel: 'crew', date: '14.02.2026' },
    { id: 'b3', event: 'PASSION — Tanz & Akrobatik', tickets: 2, total: 85, channel: 'offer', date: '13.02.2026' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gesamtumsatz', value: `€${stats.totalRevenue.toLocaleString('de-DE')}`, color: '#6C5CE7' },
          { label: 'Tickets verkauft', value: stats.ticketsSold.toString(), color: '#34C759' },
          { label: 'Kommende Events', value: stats.upcomingEvents.toString(), color: '#5AC8FA' },
          { label: 'Aktive Events', value: stats.activeEvents.toString(), color: '#FF9F0A' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Letzte Buchungen</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {recentBookings.map((booking, i) => (
            <div key={booking.id} className="p-4 flex items-center justify-between" style={i < recentBookings.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : undefined}>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{booking.event}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{booking.tickets} Tickets · {booking.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--text-primary)]">€{booking.total}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={
                  booking.channel === 'flash' ? { background: 'rgba(108,92,231,0.15)', color: '#A855F7' } :
                  booking.channel === 'offer' ? { background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' } :
                  { background: 'rgba(90,200,250,0.15)', color: '#5AC8FA' }
                }>{booking.channel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
