'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export default function ProfilePage() {
  const [pushEnabled, setPushEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)

  // Mock user data
  const user = {
    first_name: 'Max',
    last_name: 'Mustermann',
    email: 'max@example.com',
    city: 'Essen',
    tier: 'Explorer',
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Profil</h1>

      {/* User Info */}
      <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>
          {user.first_name[0]}{user.last_name[0]}
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--text-primary)]">{user.first_name} {user.last_name}</p>
          <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(108,92,231,0.15)', color: '#A855F7' }}>
            {user.tier}
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-1 mb-3">Einstellungen</h3>

        {/* City */}
        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            <span className="text-sm text-[var(--text-primary)]">Stadt</span>
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{user.city}</span>
        </div>

        {/* Push Notifications */}
        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="text-sm text-[var(--text-primary)]">Push-Benachrichtigungen</span>
          </div>
          <button onClick={() => setPushEnabled(!pushEnabled)} className="w-11 h-6 rounded-full p-0.5 transition-all duration-300" style={{ background: pushEnabled ? 'linear-gradient(135deg, #6C5CE7, #A855F7)' : 'rgba(255,255,255,0.1)' }}>
            <div className={cn('w-5 h-5 rounded-full bg-white transition-transform duration-300', pushEnabled ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>

        {/* Email Notifications */}
        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <span className="text-sm text-[var(--text-primary)]">E-Mail-Benachrichtigungen</span>
          </div>
          <button onClick={() => setEmailEnabled(!emailEnabled)} className="w-11 h-6 rounded-full p-0.5 transition-all duration-300" style={{ background: emailEnabled ? 'linear-gradient(135deg, #6C5CE7, #A855F7)' : 'rgba(255,255,255,0.1)' }}>
            <div className={cn('w-5 h-5 rounded-full bg-white transition-transform duration-300', emailEnabled ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-1">
        <Link href="/venue/register" className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex' }}>
          <span className="text-sm text-[var(--text-primary)]">Venue registrieren</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
        </Link>

        <button className="w-full p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-sm text-[var(--danger)]">Abmelden</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
        </button>
      </div>
    </div>
  )
}
