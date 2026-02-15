export default function AdminDashboardPage() {
  const stats = {
    todaySales: 24,
    activeEvents: 6,
    liveVenues: 2,
    revenue: 3450,
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Heutige Sales', value: stats.todaySales.toString(), color: '#6C5CE7' },
          { label: 'Aktive Events', value: stats.activeEvents.toString(), color: '#34C759' },
          { label: 'Live Venues', value: stats.liveVenues.toString(), color: '#5AC8FA' },
          { label: 'Umsatz (heute)', value: `€${stats.revenue.toLocaleString('de-DE')}`, color: '#FF9F0A' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Kampagnen — Genehmigung ausstehend</h2>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' }}>3</span>
        </div>
        {[
          { event: 'IGNITE — Die Varieté-Show', venue: 'GOP Essen', date: '16.02.', budget: '€45', variants: 3 },
          { event: 'PASSION — Tanz & Akrobatik', venue: 'GOP Essen', date: '17.02.', budget: '€38', variants: 3 },
          { event: 'STAUNEN — Die Zaubershow', venue: 'GOP Bonn', date: '18.02.', budget: '€52', variants: 3 },
        ].map((campaign, i) => (
          <div key={i} className="p-4 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{campaign.event}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{campaign.venue} · {campaign.date} · Budget: {campaign.budget} · {campaign.variants} Ad-Varianten</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>Genehmigen</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Letzte Aktivität</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { action: 'Buchung', detail: 'Max M. — 2x IGNITE (Flash)', time: 'vor 5 Min.', color: '#34C759' },
            { action: 'Angebot', detail: 'Julia S. — PASSION Verhandlung', time: 'vor 12 Min.', color: '#FF9F0A' },
            { action: 'Crew', detail: 'Tim K. — Crew für STAUNEN erstellt', time: 'vor 28 Min.', color: '#5AC8FA' },
            { action: 'Check-in', detail: 'Anna L. — ELECTRA eingecheckt', time: 'vor 1 Std.', color: '#A855F7' },
          ].map((activity, i) => (
            <div key={i} className="p-4 flex items-center gap-3" style={i < 3 ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : undefined}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: activity.color }} />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-primary)]"><span className="font-medium">{activity.action}:</span> {activity.detail}</p>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
