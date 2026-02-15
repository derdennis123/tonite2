'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatPrice, formatDateTime, getScarcityLevel, getScarcityText, getCountdown } from '@/lib/utils/format'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event & { venueName?: string }
  featured?: boolean
}

export function EventCard({ event, featured = false }: EventCardProps) {
  const remaining = event.contingentTotal - event.contingentSold
  const scarcityLevel = getScarcityLevel(remaining)
  const scarcityText = getScarcityText(remaining)
  const countdown = getCountdown(event.datetime)

  const scarcityColors = {
    available: '#34C759',
    selling: '#FF9F0A',
    few: '#FF6B35',
    last: '#FF453A',
  }

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl transition-all duration-500',
          featured ? 'aspect-[16/9]' : ''
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Hero Image */}
        <div className={cn('relative overflow-hidden', featured ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A0F 100%)',
              }}
            />
          )}

          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />

          {/* Scarcity Badge - top right */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md',
                scarcityLevel === 'last' && 'animate-pulse'
              )}
              style={{
                background: `${scarcityColors[scarcityLevel]}20`,
                color: scarcityColors[scarcityLevel],
                border: `1px solid ${scarcityColors[scarcityLevel]}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: scarcityColors[scarcityLevel] }}
              />
              {scarcityText}
            </span>
          </div>

          {/* Countdown - top left */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {countdown}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-white transition-colors">
              {event.name}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              {event.venueName || 'Venue'} · {formatDateTime(event.datetime)}
            </p>
          </div>

          {/* Price - prominent, no strikethrough */}
          <div className="flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ab {formatPrice(event.flashPrice)}
            </span>
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              Flash-Preis
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
