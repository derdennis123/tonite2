'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { getCrewDiscount, getNextCrewThreshold, formatPrice } from '@/lib/utils/format'

interface PageProps {
  params: Promise<{ code: string }>
}

interface CrewData {
  id: string
  invite_code: string
  event_name: string
  venue_name: string
  flash_price: number
  status: 'open' | 'locked' | 'completed' | 'expired'
  members: Array<{
    id: string
    name: string
    status: 'joined' | 'paid' | 'dropped'
  }>
}

const discountTiers = [
  { count: 2, discount: 10 },
  { count: 3, discount: 20 },
  { count: 5, discount: 30 },
  { count: 7, discount: 35 },
]

export default function CrewLobbyPage({ params }: PageProps) {
  const { code } = use(params)
  const [copied, setCopied] = useState(false)
  const [crew, setCrew] = useState<CrewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCrew() {
      try {
        const response = await fetch(`/api/crew?code=${encodeURIComponent(code)}`)
        if (response.ok) {
          const data = await response.json()
          setCrew(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCrew()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!crew) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Crew nicht gefunden</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Der Einladungslink ist ungültig oder abgelaufen.</p>
        <Link href="/" className="text-sm font-medium" style={{ color: '#6C5CE7' }}>Zurück zur Startseite</Link>
      </div>
    )
  }

  const memberCount = crew.members.length
  const currentDiscount = getCrewDiscount(memberCount)
  const nextThreshold = getNextCrewThreshold(memberCount)
  const discountedPrice = crew.flash_price * (1 - currentDiscount)
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/crew/${code}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const text = `Hey! Ich hab eine Crew für ${crew.event_name} gestartet. Tritt bei und wir bekommen alle Rabatt! ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Crew</h1>
          <p className="text-sm text-[var(--text-secondary)]">{crew.event_name}</p>
        </div>
      </div>

      {/* Current Discount */}
      <div className="p-6 rounded-2xl text-center space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Aktueller Crew-Rabatt</p>
        <p className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {Math.round(currentDiscount * 100)}%
        </p>
        <p className="text-lg text-[var(--text-primary)]">{formatPrice(discountedPrice)} pro Ticket</p>
        {nextThreshold && (
          <p className="text-sm text-[var(--text-secondary)]">
            Lade {nextThreshold.needed} weitere Person(en) ein für {Math.round(nextThreshold.discount * 100)}% Rabatt
          </p>
        )}
      </div>

      {/* Discount Progress */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">Rabatt-Fortschritt</p>
        <div className="flex items-center gap-1">
          {discountTiers.map((tier) => (
            <div key={tier.count} className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: memberCount >= tier.count ? '100%' : '0%', background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }} />
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-1">{tier.count}+ = {tier.discount}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Mitglieder ({memberCount})</p>
        </div>
        {crew.members.map((member) => (
          <div key={member.id} className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>
                {member.name[0]}
              </div>
              <span className="text-sm text-[var(--text-primary)]">{member.name}</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={member.status === 'paid' ? { background: 'rgba(52,199,89,0.15)', color: '#34C759' } : { background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' }}>
              {member.status === 'paid' ? 'Bezahlt' : 'Beigetreten'}
            </span>
          </div>
        ))}
      </div>

      {/* Share Actions */}
      <div className="space-y-3">
        <button type="button" onClick={shareWhatsApp} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: '#25D366' }}>
          Via WhatsApp teilen
        </button>
        <button type="button" onClick={copyLink} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}>
          {copied ? 'Link kopiert!' : 'Link kopieren'}
        </button>
      </div>

      {/* Book CTA */}
      <Link href={`/checkout?event=${crew.id}&price=${discountedPrice}&channel=crew`} className="block w-full text-center py-4 rounded-xl text-base font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}>
        Jetzt buchen — {formatPrice(discountedPrice)}
      </Link>
    </div>
  )
}
