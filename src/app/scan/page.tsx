'use client'

import { useState, useRef, useEffect } from 'react'

type ScanResult = {
  valid: boolean
  message: string
  guest_name?: string
  event_name?: string
  ticket_count?: number
} | null

export default function ScanPage() {
  const [result, setResult] = useState<ScanResult>(null)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Request camera access
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.log('Camera access denied:', err)
      }
    }
    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const validateTicket = async (code: string) => {
    try {
      const response = await fetch(`/api/ticket?code=${encodeURIComponent(code)}`)
      const data = await response.json()
      setResult(data)

      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000)
    } catch {
      setResult({ valid: false, message: 'Verbindungsfehler' })
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      validateTicket(manualCode.trim())
      setManualCode('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TONITE</h1>
          <p className="text-sm text-[var(--text-secondary)]">Check-in</p>
        </div>

        {/* Camera View */}
        <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          {/* Scan frame overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 rounded-2xl" style={{ borderColor: 'rgba(108,92,231,0.5)' }}>
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: '#6C5CE7' }} />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: '#6C5CE7' }} />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: '#6C5CE7' }} />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: '#6C5CE7' }} />
            </div>
          </div>
          {!result && (
            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-[var(--text-secondary)]">QR-Code scannen...</p>
          )}
        </div>

        {/* Manual Entry */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Code manuell eingeben" className="flex-1 px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <button type="submit" className="px-4 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}>Prüfen</button>
        </form>

        {/* Result */}
        {result && (
          <div className={`p-6 rounded-2xl text-center space-y-3 animate-[scaleIn_0.3s_ease-out]`} style={result.valid ? { background: 'rgba(52,199,89,0.1)', border: '2px solid rgba(52,199,89,0.3)' } : { background: 'rgba(255,69,58,0.1)', border: '2px solid rgba(255,69,58,0.3)' }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: result.valid ? 'rgba(52,199,89,0.2)' : 'rgba(255,69,58,0.2)' }}>
              {result.valid ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="2.5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              )}
            </div>
            <p className="text-lg font-bold" style={{ color: result.valid ? '#34C759' : '#FF453A' }}>
              {result.valid ? 'Gültiges Ticket' : result.message}
            </p>
            {result.guest_name && (
              <div className="space-y-1">
                <p className="text-base text-[var(--text-primary)] font-medium">{result.guest_name}</p>
                {result.event_name && <p className="text-sm text-[var(--text-secondary)]">{result.event_name}</p>}
                {result.ticket_count && <p className="text-xs text-[var(--text-tertiary)]">{result.ticket_count} Tickets</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
