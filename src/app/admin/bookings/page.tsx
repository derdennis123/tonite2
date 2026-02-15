export default function AdminBookingsPage() {
  const bookings = [
    { id: 'b1', customer: 'Max M.', event: 'IGNITE', venue: 'GOP Essen', tickets: 2, total: 98, channel: 'flash', date: '15.02.2026 14:32' },
    { id: 'b2', customer: 'Julia S.', event: 'IGNITE', venue: 'GOP Essen', tickets: 3, total: 120, channel: 'crew', date: '15.02.2026 13:15' },
    { id: 'b3', customer: 'Tim K.', event: 'PASSION', venue: 'GOP Essen', tickets: 2, total: 85, channel: 'offer', date: '15.02.2026 11:48' },
    { id: 'b4', customer: 'Anna L.', event: 'STAUNEN', venue: 'GOP Bonn', tickets: 4, total: 156, channel: 'flash', date: '14.02.2026 19:22' },
    { id: 'b5', customer: 'David W.', event: 'ELECTRA', venue: 'GOP Essen', tickets: 2, total: 130, channel: 'flash', date: '14.02.2026 17:05' },
  ]

  const channelStyles: Record<string, React.CSSProperties> = {
    flash: { background: 'rgba(108,92,231,0.15)', color: '#A855F7' },
    offer: { background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' },
    crew: { background: 'rgba(90,200,250,0.15)', color: '#5AC8FA' },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Buchungen</h1>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 p-4 text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span>Kunde</span><span>Event</span><span>Venue</span><span>Tickets</span><span>Kanal</span><span className="text-right">Gesamt</span>
        </div>
        {bookings.map((booking) => (
          <div key={booking.id} className="grid grid-cols-6 gap-4 p-4 items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div><p className="text-sm text-[var(--text-primary)]">{booking.customer}</p><p className="text-xs text-[var(--text-tertiary)]">{booking.date}</p></div>
            <span className="text-sm text-[var(--text-primary)]">{booking.event}</span>
            <span className="text-sm text-[var(--text-secondary)]">{booking.venue}</span>
            <span className="text-sm text-[var(--text-primary)]">{booking.tickets}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium w-fit" style={channelStyles[booking.channel]}>{booking.channel}</span>
            <span className="text-sm font-semibold text-[var(--text-primary)] text-right">€{booking.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
