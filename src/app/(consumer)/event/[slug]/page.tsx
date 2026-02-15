import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { LiveViewerCount, BookingToast } from '@/components/consumer/LiveActivity'
import { formatPrice, formatDateFull, formatTime, getScarcityLevel, getScarcityText, getCountdown } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

// Fallback images when DB events have no cover image
const FALLBACK_IMAGES: Record<string, string> = {
  'ignite': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  'passion': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop&q=80',
  'staunen': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop&q=80',
  'electra': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
  'cosmos': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&q=80',
}

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop&q=80'

function getFallbackImage(eventName: string): string {
  const lower = eventName.toLowerCase()
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (lower.includes(key)) return url
  }
  return HERO_FALLBACK
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: row } = await supabase
    .from('events')
    .select('*, venues(name, address, city)')
    .eq('slug', slug)
    .single()

  if (!row) {
    notFound()
  }

  const venueData = row.venues as { name: string; address: string; city: string } | { name: string; address: string; city: string }[] | null
  const venue = venueData ? (Array.isArray(venueData) ? venueData[0] : venueData) : null
  const venueName = venue?.name ?? 'Unbekannter Veranstaltungsort'
  const venueAddress = venue?.address ?? undefined
  const name = row.name as string
  const coverImageUrl = (row.cover_image_url as string) || getFallbackImage(name)

  const remaining = (row.contingent_total as number) - (row.contingent_sold as number)
  const scarcityLevel = getScarcityLevel(remaining)
  const scarcityText = getScarcityText(remaining)
  const countdown = getCountdown(row.datetime as string)

  const scarcityColors: Record<string, string> = {
    available: '#34C759',
    selling: '#FF9F0A',
    few: '#FF6B35',
    last: '#FF453A',
  }

  return (
    <div className="min-h-screen -mt-14">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[350px] max-h-[500px] overflow-hidden">
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-16 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>

        {/* Countdown badge */}
        <div className="absolute top-16 right-4 z-10">
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md"
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
      <div className="px-4 md:px-8 -mt-20 relative z-10 max-w-2xl mx-auto space-y-6 pb-32">
        {/* Event Info */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {name}
          </h1>
          <p className="text-base text-[var(--text-secondary)]">
            {venueName} · {formatDateFull(row.datetime as string)} · {formatTime(row.datetime as string)} Uhr
          </p>

          {/* Scarcity */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${scarcityLevel === 'last' ? 'animate-pulse' : ''}`}
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
            <LiveViewerCount eventId={row.id as string} />
          </div>
        </div>

        {/* Flash-Preis CTA */}
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Flash-Preis</p>
              <p
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatPrice(row.flash_price as number)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">pro Ticket</p>
            </div>
          </div>
          <Link
            href={`/checkout?event=${row.id}&price=${row.flash_price}&channel=flash`}
            className="block w-full text-center py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
              boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
            }}
          >
            Jetzt buchen
          </Link>
        </div>

        {/* Make-an-Offer CTA */}
        {row.make_offer_enabled && (
          <div
            className="p-5 rounded-2xl space-y-3"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <p className="text-base font-semibold text-[var(--text-primary)]">Mach dein Angebot</p>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">Nenn deinen Preis</p>
            </div>
            <Link
              href={`/event/${row.slug}/offer`}
              className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-[var(--bg-glass-hover)]"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-primary)',
              }}
            >
              Verhandlung starten
            </Link>
          </div>
        )}

        {/* Crew CTA */}
        <div
          className="p-5 rounded-2xl space-y-3"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">Crew starten</p>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">Mehr Leute = mehr Rabatt</p>
          </div>
          <Link
            href={`/checkout?event=${row.id}&price=${row.flash_price}&channel=crew`}
            className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-[var(--bg-glass-hover)]"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
            }}
          >
            Crew erstellen
          </Link>
        </div>

        {/* Surprise Seat Note */}
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{
            background: 'rgba(90, 200, 250, 0.05)',
            border: '1px solid rgba(90, 200, 250, 0.1)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5AC8FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-sm text-[var(--text-primary)] font-medium">Überraschungs-Platz</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Keine Sitzplatz-Auswahl — Dein Platz wird dir am Eingang zugewiesen.
            </p>
          </div>
        </div>

        {/* Description */}
        {row.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Über das Event
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {row.description}
            </p>
          </div>
        )}

        {/* Venue Location */}
        <div
          className="p-4 rounded-xl space-y-2"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm font-medium text-[var(--text-primary)]">{venueName}</span>
          </div>
          {venueAddress && (
            <p className="text-xs text-[var(--text-secondary)] ml-6">{venueAddress}</p>
          )}
          <button
            className="ml-6 text-xs font-medium transition-colors"
            style={{ color: '#6C5CE7' }}
          >
            Karte anzeigen
          </button>
        </div>
      </div>

      {/* Booking Toast */}
      <BookingToast eventId={row.id as string} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('name, description, slug, venues(name)')
    .eq('slug', slug)
    .single()

  if (!event) {
    return { title: 'Event nicht gefunden' }
  }

  const venues = event.venues as { name: string } | { name: string }[] | null
  const venueName = venues ? (Array.isArray(venues) ? venues[0]?.name : venues.name) : ''

  return {
    title: `${event.name} | TONITE`,
    description: event.description || `${event.name} bei ${venueName}`,
    openGraph: {
      title: event.name,
      description: event.description || `${event.name} bei ${venueName}`,
      type: 'website',
      locale: 'de_DE',
    },
  }
}
