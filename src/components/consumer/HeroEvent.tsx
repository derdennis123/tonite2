'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatTime, getScarcityText, getScarcityLevel } from '@/lib/utils/format'
import type { Event } from '@/types'

interface HeroEventProps {
  event: Event & { venueName?: string }
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop&q=80'

export function HeroEvent({ event }: HeroEventProps) {
  const imageUrl = event.coverImageUrl || FALLBACK_IMAGE
  const remaining = event.contingentTotal - event.contingentSold
  const scarcityText = getScarcityText(remaining)
  const scarcityLevel = getScarcityLevel(remaining)

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div className="relative h-[55vh] min-h-[400px] max-h-[550px] overflow-hidden rounded-b-[2rem]">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
          sizes="100vw"
        />

        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/8 to-transparent" />

        {/* Live indicator */}
        <div className="absolute top-20 left-5">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FF453A',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF453A] animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
          {/* Scarcity */}
          {scarcityLevel !== 'available' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{
                background: 'rgba(255, 69, 58, 0.12)',
                color: '#FF453A',
                border: '1px solid rgba(255, 69, 58, 0.2)',
              }}
            >
              {scarcityText}
            </span>
          )}

          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Featured Event</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {event.name}
            </h2>
            <p className="text-sm text-white/50 mt-1.5">
              {event.venueName} &middot; Heute, {formatTime(event.datetime)} Uhr
            </p>
          </div>

          <div className="flex items-center gap-3">
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

            <span
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                boxShadow: '0 0 24px rgba(108, 92, 231, 0.4)',
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
