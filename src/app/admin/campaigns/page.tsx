export default function AdminCampaignsPage() {
  const campaigns = [
    { id: 'c1', event: 'IGNITE — Die Varieté-Show', venue: 'GOP Essen', date: '16.02.2026', budget: 45, status: 'pending_approval', variants: [
      { headline: 'Heute Abend ins Varieté?', description: 'Sichere dir Last-Minute Tickets für IGNITE' },
      { headline: 'IGNITE erleben — ab 49€', description: 'Weltklasse-Artistik im GOP Essen' },
      { headline: 'Noch Plätze frei: IGNITE', description: 'Varieté-Show heute Abend — jetzt buchen' },
    ]},
    { id: 'c2', event: 'PASSION', venue: 'GOP Essen', date: '17.02.2026', budget: 38, status: 'pending_approval', variants: [
      { headline: 'PASSION — Tanz & Emotionen', description: 'Die neue Show im GOP' },
      { headline: 'Last-Minute: PASSION', description: 'Akrobatik und Tanz — jetzt Tickets sichern' },
      { headline: 'Morgen Abend: PASSION', description: 'Erlebe eine unvergessliche Show' },
    ]},
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Kampagnen-Genehmigung</h1>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{campaign.event}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{campaign.venue} · {campaign.date} · Budget: €{campaign.budget}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' }}>Ausstehend</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Ad-Varianten</p>
              {campaign.variants.map((variant, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{variant.headline}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{variant.description}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>Genehmigen</button>
              <button className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>Bearbeiten</button>
              <button className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: 'var(--danger)', border: '1px solid rgba(255,69,58,0.2)' }}>Ablehnen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
