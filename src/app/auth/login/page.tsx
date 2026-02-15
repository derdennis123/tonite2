'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In production: call Supabase auth.signInWithOtp({ email })
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1000)
  }

  const handleGoogleLogin = () => {
    // In production: call Supabase auth.signInWithOAuth({ provider: 'google' })
  }

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Prüfe deine E-Mails!</h1>
        <p className="text-base text-[var(--text-secondary)] max-w-sm">Wir haben dir einen Anmelde-Link an <span className="text-[var(--text-primary)] font-medium">{email}</span> geschickt.</p>
        <button onClick={() => setSent(false)} className="mt-8 text-sm text-[var(--accent-primary)]">Andere E-Mail verwenden</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TONITE</h1>
          <p className="text-sm text-[var(--text-secondary)]">Melde dich an für personalisierte Erlebnisse</p>
        </div>

        {/* Google Login */}
        <button onClick={handleGoogleLogin} className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:bg-[var(--bg-glass-hover)]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Mit Google anmelden
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs text-[var(--text-tertiary)]">oder</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Magic Link */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail-Adresse" required className="w-full px-4 py-3.5 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <button type="submit" disabled={loading || !email} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}>
            {loading ? 'Wird gesendet...' : 'Magic Link senden'}
          </button>
        </form>

        {/* Legal */}
        <p className="text-xs text-[var(--text-tertiary)] text-center">
          Mit der Anmeldung akzeptierst du unsere{' '}
          <Link href="#" className="text-[var(--accent-primary)] hover:underline">Nutzungsbedingungen</Link>{' '}und{' '}
          <Link href="#" className="text-[var(--accent-primary)] hover:underline">Datenschutzerklärung</Link>.
        </p>
      </div>
    </div>
  )
}
