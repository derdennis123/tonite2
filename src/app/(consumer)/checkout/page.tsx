'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = searchParams.get('event') || ''
  const price = parseFloat(searchParams.get('price') || '0')
  const channel = searchParams.get('channel') || 'flash'

  const [ticketCount, setTicketCount] = useState(2)
  const [guestNames, setGuestNames] = useState<string[]>(['', ''])
  const [loading, setLoading] = useState(false)

  const totalPrice = price * ticketCount

  const handleTicketCountChange = (count: number) => {
    setTicketCount(count)
    setGuestNames((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill('')]
      }
      return prev.slice(0, count)
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          ticket_count: ticketCount,
          guest_names: guestNames,
          price_per_ticket: price,
          channel,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Buchung abschließen</h1>
      </div>

      {/* Ticket Count */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Anzahl Tickets</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => handleTicketCountChange(n)}
              className="w-12 h-12 rounded-xl text-sm font-semibold transition-all"
              style={
                ticketCount === n
                  ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Names */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Namen der Gäste</label>
        <p className="text-xs text-[var(--text-tertiary)]">Personalisierte Tickets — Ausweis am Eingang bereithalten</p>
        {guestNames.map((name, i) => (
          <input
            key={i}
            type="text"
            value={name}
            onChange={(e) => {
              const updated = [...guestNames]
              updated[i] = e.target.value
              setGuestNames(updated)
            }}
            placeholder={`Gast ${i + 1} — Vor- und Nachname`}
            className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Zusammenfassung</h3>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">{ticketCount}x Ticket</span>
          <span className="text-[var(--text-primary)]">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price)} pro Ticket</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between">
          <span className="text-base font-semibold text-[var(--text-primary)]">Gesamt</span>
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalPrice)}
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || guestNames.some((n) => !n.trim())}
        className="w-full py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}
      >
        {loading ? 'Wird verarbeitet...' : 'Jetzt bezahlen'}
      </button>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
