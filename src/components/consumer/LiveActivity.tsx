'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface LiveViewerProps {
  eventId: string
  className?: string
}

export function LiveViewerCount({ eventId, className }: LiveViewerProps) {
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    // Simulate initial viewer count (in production, this uses Supabase Realtime Presence)
    const base = Math.floor(Math.random() * 15) + 3
    setViewerCount(base)

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(1, prev + change)
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [eventId])

  if (viewerCount < 2) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs',
        className
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-[var(--text-secondary)]">
        {viewerCount} Personen sehen sich das gerade an
      </span>
    </div>
  )
}

interface BookingToastProps {
  eventId: string
}

const firstNames = ['Sarah', 'Max', 'Julia', 'Tim', 'Lena', 'Felix', 'Anna', 'Paul', 'Marie', 'David']

export function BookingToast({ eventId }: BookingToastProps) {
  const [toast, setToast] = useState<{ name: string; count: number } | null>(null)

  useEffect(() => {
    const showToast = () => {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)]
      const count = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 2 : 2
      setToast({ name, count })

      setTimeout(() => setToast(null), 4000)
    }

    // Show first toast after random delay
    const initialDelay = Math.floor(Math.random() * 20000) + 10000
    const timeout = setTimeout(showToast, initialDelay)

    // Then show periodically
    const interval = setInterval(showToast, Math.floor(Math.random() * 30000) + 25000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [eventId])

  if (!toast) return null

  return (
    <div
      className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 animate-[slideInFromBottom_0.4s_ease-out]"
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--text-primary)] font-medium">{toast.name}</span>
          {' '}hat gerade {toast.count} Tickets gebucht
        </p>
      </div>
    </div>
  )
}
