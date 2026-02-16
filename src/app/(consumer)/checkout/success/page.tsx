'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#6C5CE7', '#A855F7', '#34C759', '#FF9F0A', '#5AC8FA', '#FF453A'][i % 6],
                animation: `confettiFall ${2 + Math.random() * 3}s ease-in forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Success Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
          boxShadow: '0 0 40px rgba(108, 92, 231, 0.4)',
          animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        Buchung bestätigt!
      </h1>
      <p className="text-base text-[var(--text-secondary)] mb-8 max-w-sm">
        Deine Tickets findest du unter &quot;Meine Tickets&quot;. Wir haben dir auch eine Bestätigung per E-Mail geschickt.
      </p>

      <div className="space-y-3 w-full max-w-sm">
        <Link
          href="/tickets"
          className="block w-full text-center py-4 rounded-xl text-base font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}
        >
          Meine Tickets anzeigen
        </Link>
        <Link
          href="/"
          className="block w-full text-center py-3.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Weitere Events entdecken
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
