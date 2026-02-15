'use client'

import { useState } from 'react'
import Link from 'next/link'

const weekdays = [
  { value: 0, label: 'Mo' }, { value: 1, label: 'Di' }, { value: 2, label: 'Mi' },
  { value: 3, label: 'Do' }, { value: 4, label: 'Fr' }, { value: 5, label: 'Sa' }, { value: 6, label: 'So' },
]

export default function CreateSeriesPage() {
  const [selectedDays, setSelectedDays] = useState<number[]>([2, 3, 4, 5, 6])
  const [autoRelease, setAutoRelease] = useState(true)
  const [formData, setFormData] = useState({
    name: '', description: '', startDate: '', endDate: '',
    time: '19:30', contingent: 30, minPrice: 35,
    releaseDays: 5, maxDiscount: 30,
  })

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort())
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/venue/series" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Serie erstellen</h1>
      </div>

      <form className="space-y-6">
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Serien-Details</h3>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Serienname (z.B. IGNITE)" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="Beschreibung..." className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        {/* Recurrence */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Wiederholung</h3>
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-2 block">Wochentage</label>
            <div className="flex gap-2">
              {weekdays.map((day) => (
                <button key={day.value} type="button" onClick={() => toggleDay(day.value)} className="w-10 h-10 rounded-xl text-xs font-semibold transition-all" style={selectedDays.includes(day.value) ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Startdatum</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} /></div>
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Enddatum</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} /></div>
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Uhrzeit</label><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} /></div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Standard-Einstellungen</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Kontingent</label><input type="number" value={formData.contingent} onChange={(e) => setFormData({ ...formData, contingent: parseInt(e.target.value) })} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} /></div>
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Mindestpreis (€)</label><input type="number" value={formData.minPrice} onChange={(e) => setFormData({ ...formData, minPrice: parseFloat(e.target.value) })} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} /></div>
            <div><label className="text-xs text-[var(--text-secondary)] mb-1 block">Release (Tage)</label><input type="number" value={formData.releaseDays} onChange={(e) => setFormData({ ...formData, releaseDays: parseInt(e.target.value) })} min={3} max={5} className="w-full px-3 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} /></div>
          </div>
        </div>

        {/* Auto Release */}
        <div className="p-5 rounded-2xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Auto-Release</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Events automatisch veröffentlichen</p>
          </div>
          <button type="button" onClick={() => setAutoRelease(!autoRelease)} className="w-11 h-6 rounded-full p-0.5 transition-all duration-300" style={{ background: autoRelease ? 'linear-gradient(135deg, #6C5CE7, #A855F7)' : 'rgba(255,255,255,0.1)' }}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${autoRelease ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <button type="submit" className="w-full py-4 rounded-xl text-base font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}>
          Serie erstellen
        </button>
      </form>
    </div>
  )
}
