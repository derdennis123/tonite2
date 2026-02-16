'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/lib/hooks/useAuth'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
  accepted?: boolean
  counterPrice?: number
}

interface OfferChatProps {
  eventId: string
  eventName: string
  flashPrice: number
  maxAttempts?: number
}

export function OfferChat({ eventId, eventName, flashPrice, maxAttempts = 3 }: OfferChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: `Willkommen bei TONITE! Du möchtest Tickets für "${eventName}"? Der Flash-Preis liegt bei ${flashPrice}€. Nenn mir deinen Preisvorschlag!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [dealAccepted, setDealAccepted] = useState(false)
  const [ticketCount, setTicketCount] = useState(2)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendOffer = async () => {
    if (!input.trim() || loading || attempts >= maxAttempts || dealAccepted || !user) return

    const priceMatch = input.match(/(\d+)/)
    if (!priceMatch) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() },
        { id: (Date.now() + 1).toString(), role: 'bot', content: 'Nenn mir bitte einen konkreten Preis pro Ticket, z.B. "35 Euro".', timestamp: new Date() },
      ])
      setInput('')
      return
    }

    const offeredPrice = parseInt(priceMatch[1])
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          ticket_count: ticketCount,
          offered_price: offeredPrice,
          customer_id: user?.id || '',
        }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.response || 'Entschuldigung, da ist etwas schiefgelaufen.',
        timestamp: new Date(),
        accepted: data.accepted,
        counterPrice: data.counterPrice,
      }

      setMessages((prev) => [...prev, botMessage])
      setAttempts((prev) => prev + 1)

      if (data.accepted) {
        setDealAccepted(true)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'bot', content: 'Verbindungsfehler. Bitte versuche es erneut.', timestamp: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[600px]">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Mach dein Angebot</h3>
            <p className="text-xs text-[var(--text-secondary)]">{eventName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-tertiary)]">Tickets:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setTicketCount(n)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                    style={
                      ticketCount === n
                        ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,159,10,0.15)', color: '#FF9F0A' }}>
              {maxAttempts - attempts} Versuche
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn('max-w-[80%] px-4 py-3 rounded-2xl text-sm', message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md')}
              style={
                message.role === 'user'
                  ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }
              }
            >
              <p>{message.content}</p>
              {message.accepted && (
                <a
                  href={`/checkout?event=${eventId}&price=${message.counterPrice || flashPrice}&channel=offer`}
                  className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #34C759, #30B350)' }}
                >
                  Jetzt bezahlen
                </a>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {attempts >= maxAttempts && !dealAccepted ? (
          <div className="text-center py-2">
            <p className="text-sm text-[var(--text-secondary)]">Keine Versuche mehr übrig</p>
            <button type="button" className="mt-2 text-xs font-medium" style={{ color: '#6C5CE7' }}>
              Benachrichtige mich bei passenden Deals
            </button>
          </div>
        ) : dealAccepted ? (
          <div className="text-center py-2">
            <p className="text-sm font-semibold" style={{ color: '#34C759' }}>Deal abgeschlossen!</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Schließe die Buchung in 15 Minuten ab</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendOffer()}
              placeholder="Dein Preisvorschlag..."
              className="flex-1 px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              disabled={loading || !user}
            />
            <button
              type="button"
              onClick={sendOffer}
              disabled={loading || !input.trim() || !user}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}
              aria-label="Angebot senden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
