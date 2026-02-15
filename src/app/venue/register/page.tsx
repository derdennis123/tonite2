'use client'

import { useState } from 'react'

const steps = ['Firmendaten', 'Vertrag', 'Google Ads', 'Zahlung']

export default function VenueRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TONITE</h1>
          <p className="text-sm text-[var(--text-secondary)]">Venue registrieren</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={i <= currentStep ? { background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {i < currentStep ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-xs text-[var(--text-secondary)] hidden md:block">{step}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {currentStep === 0 && (
            <>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Firmendaten</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Venue-Name" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                <input type="text" placeholder="Adresse" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Stadt" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <input type="text" placeholder="USt-IdNr." className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <input type="text" placeholder="Ansprechpartner" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                <input type="email" placeholder="E-Mail" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                <input type="tel" placeholder="Telefon" className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            </>
          )}
          {currentStep === 1 && (
            <>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Vermittlungsvertrag</h2>
              <div className="p-4 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed space-y-2 max-h-60 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p>Hiermit wird bestätigt, dass TONITE als Handelsvertreter gemäß §84 HGB agiert und nicht als Verkäufer der Tickets.</p>
                <p>Das Venue bestätigt die Durchführung der gelisteten Events und ist verantwortlich für Stornierungen und Erstattungen.</p>
                <p>TONITE erhält eine vereinbarte Provision als Stripe Application Fee.</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Ich akzeptiere den Vermittlungsvertrag</span>
              </label>
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Google Ads Vollmacht</h2>
              <p className="text-sm text-[var(--text-secondary)]">TONITE schaltet Google Ads Kampagnen für deine Events. TONITE trägt 100% der Werbekosten.</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Ich erteile die Vollmacht zur Schaltung von Google Ads im Namen meines Venues</span>
              </label>
            </>
          )}
          {currentStep === 3 && (
            <>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Stripe Connect</h2>
              <p className="text-sm text-[var(--text-secondary)]">Verbinde oder erstelle ein Stripe-Konto, damit Zahlungen direkt an dich gehen.</p>
              <button className="w-full py-3.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#635BFF' }}>
                Mit Stripe verbinden
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 py-3.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}>
              Zurück
            </button>
          )}
          <button onClick={() => currentStep < 3 ? setCurrentStep(currentStep + 1) : null} className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', boxShadow: '0 0 20px rgba(108,92,231,0.3)' }}>
            {currentStep < 3 ? 'Weiter' : 'Registrierung abschließen'}
          </button>
        </div>
      </div>
    </div>
  )
}
