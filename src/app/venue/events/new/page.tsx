'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CreateEventPage() {
  const [makeOfferEnabled, setMakeOfferEnabled] = useState(true)
  const [formData, setFormData] = useState({
    name: '', description: '', date: '', time: '19:30',
    contingent: 30, minPrice: 35, flashPrice: 49,
    maxDiscount: 30, offerMinPrice: 35,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to Supabase
    void formData
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/venue/events" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Event erstellen</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Event-Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="z.B. IGNITE — Die Varieté-Show" required className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Beschreibung</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Beschreibe das Event..." className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Datum</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Uhrzeit</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Preise & Kontingent</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Kontingent</label>
              <input type="number" value={formData.contingent} onChange={(e) => setFormData({ ...formData, contingent: parseInt(e.target.value) })} min={1} className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Mindestpreis (€)</label>
              <input type="number" value={formData.minPrice} onChange={(e) => setFormData({ ...formData, minPrice: parseFloat(e.target.value) })} min={1} step={0.01} className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1 block">Flash-Preis (€)</label>
              <input type="number" value={formData.flashPrice} onChange={(e) => setFormData({ ...formData, flashPrice: parseFloat(e.target.value) })} min={1} step={0.01} className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          </div>
        </div>

        {/* Make-an-Offer */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Verhandlung</h3>
            <button type="button" onClick={() => setMakeOfferEnabled(!makeOfferEnabled)} className="w-11 h-6 rounded-full p-0.5 transition-all duration-300" style={{ background: makeOfferEnabled ? 'linear-gradient(135deg, #6C5CE7, #A855F7)' : 'rgba(255,255,255,0.1)' }}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${makeOfferEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          {makeOfferEnabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Max. Rabatt (%)</label>
                <input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) })} min={0} max={50} className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">Mindest-Angebot (€)</label>
                <input type="number" value={formData.offerMinPrice} onChange={(e) => setFormData({ ...formData, offerMinPrice: parseFloat(e.target.value) })} min={1} step={0.01} className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Confirmation */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-4 h-4 rounded accent-[var(--accent-primary)]" />
          <span className="text-sm text-[var(--text-secondary)]">Ich bestätige, dass dieses Event wie gelistet stattfindet.</span>
        </label>

        <button type="submit" className="w-full py-4 rounded-xl text-base font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}>
          Event erstellen
        </button>
      </form>
    </div>
  )
}
