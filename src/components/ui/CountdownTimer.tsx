'use client'

import { cn } from '@/lib/utils/cn'
import { getCountdown } from '@/lib/utils/format'
import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  target: string
  className?: string
}

export function CountdownTimer({ target, className }: CountdownTimerProps) {
  const [text, setText] = useState(() => getCountdown(target))

  useEffect(() => {
    // Update immediately in case SSR value differs
    setText(getCountdown(target))

    const interval = setInterval(() => {
      setText(getCountdown(target))
    }, 60_000) // every minute

    return () => clearInterval(interval)
  }, [target])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]',
        'px-2.5 py-1 rounded-[var(--radius-full)]',
        'border border-[var(--glass-border)]',
        className
      )}
      style={{ background: 'var(--bg-glass)' }}
    >
      {/* Clock icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-60"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>

      {text}
    </span>
  )
}
