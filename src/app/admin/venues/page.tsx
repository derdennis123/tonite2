export default function AdminVenuesPage() {
  const venues = [
    { id: 'v1', name: 'GOP Varieté-Theater Essen', city: 'Essen', status: 'active', stripe: true, ads: true, events: 12, revenue: 8200 },
    { id: 'v2', name: 'GOP Varieté-Theater Bonn', city: 'Bonn', status: 'active', stripe: true, ads: true, events: 8, revenue: 4250 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Venues</h1>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>Venue hinzufügen</button>
      </div>

      <div className="space-y-3">
        {venues.map((venue) => (
          <div key={venue.id} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{venue.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{venue.city}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>Aktiv</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div><p className="text-xs text-[var(--text-tertiary)]">Stripe</p><p className="text-sm mt-0.5" style={{ color: venue.stripe ? '#34C759' : '#FF453A' }}>{venue.stripe ? 'Verbunden' : 'Ausstehend'}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Google Ads</p><p className="text-sm mt-0.5" style={{ color: venue.ads ? '#34C759' : '#FF453A' }}>{venue.ads ? 'Autorisiert' : 'Ausstehend'}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Events</p><p className="text-sm text-[var(--text-primary)] mt-0.5">{venue.events}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Umsatz</p><p className="text-sm text-[var(--text-primary)] mt-0.5">€{venue.revenue.toLocaleString('de-DE')}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
