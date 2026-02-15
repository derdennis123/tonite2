export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Events</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}>Von tixu importieren</button>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>Event erstellen</button>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">Event-Verwaltung und tixu-Import werden hier angezeigt.</p>
    </div>
  )
}
