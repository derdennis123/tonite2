export default function VenueSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Einstellungen</h1>

      {/* Venue Info */}
      <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Venue-Informationen</h3>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Name</span><span className="text-sm text-[var(--text-primary)]">GOP Varieté-Theater Essen</span></div>
          <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Adresse</span><span className="text-sm text-[var(--text-primary)]">Rottstr. 30, 45127 Essen</span></div>
          <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Ansprechpartner</span><span className="text-sm text-[var(--text-primary)]">Maria Schmidt</span></div>
          <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">E-Mail</span><span className="text-sm text-[var(--text-primary)]">events@gop-essen.de</span></div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Integrationen</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-primary)]">Stripe Connect</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>Verbunden</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-primary)]">Google Ads Vollmacht</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>Erteilt</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-primary)]">Vermittlungsvertrag</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>Unterschrieben</span>
          </div>
        </div>
      </div>

      {/* Commission */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Provision</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">TONITE Provision</span>
          <span className="text-lg font-bold" style={{ color: '#6C5CE7' }}>15%</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Provision wird als Stripe Application Fee automatisch abgezogen.</p>
      </div>

      {/* Pause TONITE */}
      <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,69,58,0.05)', border: '1px solid rgba(255,69,58,0.15)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">TONITE pausieren</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Alle Events werden vorübergehend deaktiviert</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--danger)] transition-all hover:bg-[rgba(255,69,58,0.1)]" style={{ border: '1px solid rgba(255,69,58,0.2)' }}>
            Pausieren
          </button>
        </div>
      </div>
    </div>
  )
}
