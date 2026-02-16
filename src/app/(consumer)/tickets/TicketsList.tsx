'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import QRCode from 'react-qr-code'
import type { TicketWithEvent } from '@/lib/data/bookings'

type Tab = 'active' | 'past'

interface TicketsListProps {
  tickets: TicketWithEvent[]
}

export function TicketsList({ tickets }: TicketsListProps) {
  const [tab, setTab] = useState<Tab>('active')
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)

  const activeTickets = tickets.filter((t) => t.status === 'active')
  const pastTickets = tickets.filter((t) => t.status !== 'active')

  const currentTickets = tab === 'active' ? activeTickets : pastTickets

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Meine Tickets</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['active', 'past'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all')}
            style={
              tab === t
                ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }
            }
          >
            {t === 'active' ? 'Aktive Tickets' : 'Vergangene Events'}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      {currentTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Noch keine Tickets</h3>
          <p className="text-sm text-[var(--text-secondary)]">Entdecke Events und sichere dir Tickets</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTickets.map((ticket) => (
            <div key={ticket.id}>
              <button
                type="button"
                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                className="w-full text-left p-4 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-[var(--text-primary)]">{ticket.event_name}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{ticket.venue_name}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">{ticket.guest_name}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" className={cn('transition-transform', expandedTicket === ticket.id && 'rotate-180')}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* QR Code Expanded */}
              {expandedTicket === ticket.id && (
                <div className="mt-2 p-6 rounded-2xl flex flex-col items-center space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="bg-white p-4 rounded-xl">
                    <QRCode value={ticket.qr_code_data} size={200} level="H" />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] font-mono">{ticket.qr_code_data}</p>
                  {ticket.checked_in && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759' }}>
                      Eingecheckt
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
