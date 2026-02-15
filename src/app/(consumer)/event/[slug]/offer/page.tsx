import { notFound } from 'next/navigation'
import Link from 'next/link'
import { OfferChat } from '@/components/consumer/OfferChat'

// Same mock events
const mockEvents = [
  { id: '1', slug: 'ignite-variete-show', name: 'IGNITE — Die Varieté-Show', flashPrice: 49, makeOfferEnabled: true },
  { id: '2', slug: 'passion-tanz-akrobatik', name: 'PASSION — Tanz & Akrobatik', flashPrice: 55, makeOfferEnabled: true },
  { id: '3', slug: 'staunen-zaubershow', name: 'STAUNEN — Die Zaubershow', flashPrice: 42, makeOfferEnabled: true },
  { id: '4', slug: 'electra-neon-show', name: 'ELECTRA — Die Neon-Show', flashPrice: 65, makeOfferEnabled: true },
  { id: '5', slug: 'cosmos-reise-galaxie', name: 'COSMOS — Reise durch die Galaxie', flashPrice: 45, makeOfferEnabled: true },
]

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OfferPage({ params }: PageProps) {
  const { slug } = await params
  const event = mockEvents.find((e) => e.slug === slug)

  if (!event || !event.makeOfferEnabled) {
    notFound()
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Link
          href={`/event/${event.slug}`}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      </div>

      {/* Chat */}
      <div
        className="mx-4 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <OfferChat
          eventId={event.id}
          eventName={event.name}
          flashPrice={event.flashPrice}
        />
      </div>
    </div>
  )
}
