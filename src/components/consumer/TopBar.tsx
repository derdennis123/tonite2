'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function TopBar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(10, 10, 15, 0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Location */}
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(108, 92, 231, 0.12)',
              border: '1px solid rgba(108, 92, 231, 0.2)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">Dein Standort</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">NRW, DE</span>
          </div>
        </div>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1
            className="text-lg font-bold tracking-[0.2em]"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TONITE
          </h1>
        </Link>

        {/* Notification + Profile */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#FF453A' }}
            />
          </button>
          <Link
            href={user ? '/profile' : '/auth/login'}
            className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: user
                ? 'linear-gradient(135deg, #6C5CE7, #A855F7)'
                : 'rgba(255, 255, 255, 0.05)',
              border: user ? undefined : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {user ? (
              <span className="text-xs font-bold text-white">{initials}</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
