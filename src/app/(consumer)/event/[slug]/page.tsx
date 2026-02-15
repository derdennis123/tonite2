import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { LiveViewerCount, BookingToast } from '@/components/consumer/LiveActivity'
import { formatPrice, formatDateFull, formatTime, getScarcityLevel, getScarcityText, getCountdown } from '@/lib/utils/format'
import type { Event } from '@/types'

// Same mock data - in production this comes from Supabase
const mockEvents: (Event & { venueName: string; venueAddress?: string })[] = [
  {
    id: '1',
    venueId: 'v1',
    seriesId: null,
    name: 'IGNITE — Die Varieté-Show',
    slug: 'ignite-variete-show',
    description: 'Eine atemberaubende Varieté-Show mit Weltklasse-Artisten, Magie und Live-Musik. Ein Abend voller Staunen und Unterhaltung. Erlebe die neue Show im GOP Varieté-Theater Essen — mit internationalen Künstlern, die dich in ihren Bann ziehen werden.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:30',
    datetime: new Date(Date.now() + 86400000 + 70200000).toISOString(),
    contingentTotal: 30,
    contingentSold: 18,
    contingentRemaining: 12,
    minPrice: 35,
    flashPrice: 49,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 35,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live' as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
    venueAddress: 'Rottstr. 30, 45127 Essen',
  },
  {
    id: '2',
    venueId: 'v1',
    seriesId: null,
    name: 'PASSION — Tanz & Akrobatik',
    slug: 'passion-tanz-akrobatik',
    description: 'Eine leidenschaftliche Show die Tanz, Akrobatik und Emotionen vereint.',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '20:00',
    datetime: new Date(Date.now() + 172800000 + 72000000).toISOString(),
    contingentTotal: 25,
    contingentSold: 20,
    contingentRemaining: 5,
    minPrice: 39,
    flashPrice: 55,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.25,
    offerMinPrice: 39,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live' as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
    venueAddress: 'Rottstr. 30, 45127 Essen',
  },
  {
    id: '3',
    venueId: 'v2',
    seriesId: null,
    name: 'STAUNEN — Die Zaubershow',
    slug: 'staunen-zaubershow',
    description: 'Magie hautnah erleben. Eine Show die dich sprachlos macht.',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    time: '19:00',
    datetime: new Date(Date.now() + 259200000 + 68400000).toISOString(),
    contingentTotal: 40,
    contingentSold: 8,
    contingentRemaining: 32,
    minPrice: 29,
    flashPrice: 42,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 29,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live' as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Bonn',
    venueAddress: 'Münsterplatz 17, 53111 Bonn',
  },
  {
    id: '4',
    venueId: 'v2',
    seriesId: null,
    name: 'ELECTRA — Die Neon-Show',
    slug: 'electra-neon-show',
    description: 'UV-Licht, Neon-Kostüme und atemberaubende Performances in einer einzigartigen Atmosphäre.',
    date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    time: '21:00',
    datetime: new Date(Date.now() + 345600000 + 75600000).toISOString(),
    contingentTotal: 20,
    contingentSold: 17,
    contingentRemaining: 3,
    minPrice: 45,
    flashPrice: 65,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.20,
    offerMinPrice: 45,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live' as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Essen',
    venueAddress: 'Rottstr. 30, 45127 Essen',
  },
  {
    id: '5',
    venueId: 'v1',
    seriesId: null,
    name: 'COSMOS — Reise durch die Galaxie',
    slug: 'cosmos-reise-galaxie',
    description: 'Eine interstellare Varieté-Reise mit atemberaubender Projektionstechnik und Weltklasse-Artistik.',
    date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
    time: '20:00',
    datetime: new Date(Date.now() + 432000000 + 72000000).toISOString(),
    contingentTotal: 35,
    contingentSold: 2,
    contingentRemaining: 33,
    minPrice: 32,
    flashPrice: 45,
    makeOfferEnabled: true,
    offerMaxDiscountPct: 0.30,
    offerMinPrice: 32,
    coverImageUrl: '',
    videoUrl: null,
    tixuEventId: null,
    tixuTotalCapacity: null,
    tixuTotalSold: null,
    status: 'live' as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    venueName: 'GOP Varieté-Theater Bonn',
    venueAddress: 'Münsterplatz 17, 53111 Bonn',
  },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = mockEvents.find((e) => e.slug === slug)

  if (!event) {
    notFound()
  }

  const remaining = event.contingentTotal - event.contingentSold
  const scarcityLevel = getScarcityLevel(remaining)
  const scarcityText = getScarcityText(remaining)
  const countdown = getCountdown(event.datetime)

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
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A0F 50%, #6C5CE7 200%)',
            }}
          />
        )}
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
            {event.name}
          </h1>
          <p className="text-base text-[var(--text-secondary)]">
            {event.venueName} · {formatDateFull(event.datetime)} · {formatTime(event.datetime)} Uhr
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
            <LiveViewerCount eventId={event.id} />
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
                {formatPrice(event.flashPrice)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">pro Ticket</p>
            </div>
          </div>
          <Link
            href={`/checkout?event=${event.id}&price=${event.flashPrice}&channel=flash`}
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
        {event.makeOfferEnabled && (
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
              href={`/event/${event.slug}/offer`}
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
            href={`/checkout?event=${event.id}&price=${event.flashPrice}&channel=crew`}
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
        {event.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Über das Event
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {event.description}
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
            <span className="text-sm font-medium text-[var(--text-primary)]">{event.venueName}</span>
          </div>
          {event.venueAddress && (
            <p className="text-xs text-[var(--text-secondary)] ml-6">{event.venueAddress}</p>
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
      <BookingToast eventId={event.id} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = mockEvents.find((e) => e.slug === slug)

  if (!event) {
    return { title: 'Event nicht gefunden' }
  }

  return {
    title: `${event.name} | TONITE`,
    description: event.description || `${event.name} bei ${event.venueName}`,
    openGraph: {
      title: event.name,
      description: event.description || `${event.name} bei ${event.venueName}`,
      type: 'website',
      locale: 'de_DE',
    },
  }
}
