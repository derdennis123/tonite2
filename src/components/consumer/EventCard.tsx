'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatPrice, formatDate, formatTime, getScarcityLevel, getScarcityText } from '@/lib/utils/format'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event & { venueName?: string }
  variant?: 'default' | 'large' | 'compact'
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&q=80'

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const imageUrl = event.coverImageUrl || FALLBACK_IMAGE
  const remaining = event.contingentTotal - event.contingentSold
  const scarcityLevel = getScarcityLevel(remaining)
  const scarcityText = getScarcityText(remaining)

  const scarcityColors: Record<string, string> = {
    available: '#34C759',
    selling: '#FF9F0A',
    few: '#FF6B35',
    last: '#FF453A',
  }

  if (variant === 'large') {
    return (
      <Link href={`/event/${event.slug}`} className="group block">
        <div className="relative rounded-3xl overflow-hidden aspect-[3/4]">
          {/* Full background image */}
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-primary)',
              }}
            >
              {formatDate(event.datetime)}
            </span>
            <span
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-xl flex items-center gap-1.5',
                scarcityLevel === 'last' && 'animate-pulse'
              )}
              style={{
                background: `${scarcityColors[scarcityLevel]}15`,
                color: scarcityColors[scarcityLevel],
                border: `1px solid ${scarcityColors[scarcityLevel]}25`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: scarcityColors[scarcityLevel] }}
              />
              {scarcityText}
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{event.name}</h3>
              <p className="text-sm text-white/60 mt-1">
                {event.venueName} &middot; {formatTime(event.datetime)} Uhr
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ab {formatPrice(event.flashPrice)}
              </span>
              <span
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                  boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
                }}
              >
                Buchen
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/event/${event.slug}`} className="group block">
        <div
          className="flex gap-4 p-3 rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              sizes="80px"
            />
            <div
              className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
              style={{
                background: 'rgba(0,0,0,0.6)',
                color: scarcityColors[scarcityLevel],
                backdropFilter: 'blur(4px)',
              }}
            >
              {remaining} left
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-white transition-colors">
              {event.name}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {event.venueName}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-[var(--text-tertiary)]">
                {formatDate(event.datetime)} &middot; {formatTime(event.datetime)}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end justify-center flex-shrink-0">
            <span
              className="text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatPrice(event.flashPrice)}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)]">Flash</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default card variant
  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:translate-y-[-2px]"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />

          {/* Scarcity Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-xl',
                scarcityLevel === 'last' && 'animate-pulse'
              )}
              style={{
                background: `${scarcityColors[scarcityLevel]}15`,
                color: scarcityColors[scarcityLevel],
                border: `1px solid ${scarcityColors[scarcityLevel]}25`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: scarcityColors[scarcityLevel] }}
              />
              {scarcityText}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-white transition-colors">
              {event.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {event.venueName} &middot; {formatDate(event.datetime)}, {formatTime(event.datetime)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span
              className="text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ab {formatPrice(event.flashPrice)}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
              Flash-Preis
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
