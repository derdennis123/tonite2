'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatDateTime, getScarcityText, getScarcityLevel } from '@/lib/utils/format'
import type { Event } from '@/types'

interface HeroEventProps {
  event: Event & { venueName?: string }
}

export function HeroEvent({ event }: HeroEventProps) {
  const remaining = event.contingentTotal - event.contingentSold
  const scarcityText = getScarcityText(remaining)
  const scarcityLevel = getScarcityLevel(remaining)

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        {/* Background Image */}
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A0F 50%, #12121A 100%)',
            }}
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-4">
          {/* Scarcity */}
          {scarcityLevel !== 'available' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(255, 69, 58, 0.15)',
                color: '#FF453A',
                border: '1px solid rgba(255, 69, 58, 0.2)',
              }}
            >
              {scarcityText}
            </span>
          )}

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.name}
            </h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)]">
              {event.venueName || 'Venue'} · {formatDateTime(event.datetime)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ab {formatPrice(event.flashPrice)}
            </span>

            <span
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
              }}
            >
              Jetzt buchen
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
