'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const cities = ['Essen', 'Bonn']

export function TopBar() {
  const [selectedCity, setSelectedCity] = useState('Essen')
  const [showCityPicker, setShowCityPicker] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* City Selector */}
        <button
          onClick={() => setShowCityPicker(!showCityPicker)}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {selectedCity}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1
            className="text-xl font-bold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TONITE
          </h1>
        </Link>

        {/* Auth/Profile shortcut */}
        <Link
          href="/profile"
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>

      {/* City Picker Dropdown */}
      {showCityPicker && (
        <div
          className="absolute top-full left-0 right-0 p-4"
          style={{
            background: 'rgba(18, 18, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Deine Stadt</p>
          <div className="flex gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city)
                  setShowCityPicker(false)
                }}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  selectedCity === city
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
                style={
                  selectedCity === city
                    ? {
                        background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                        boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }
                }
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
