'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface SearchBarProps {
  onSearch?: (query: string) => void
  isSearching?: boolean
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = [
    'Shows heute Abend',
    'Events f\u00fcr Kinder',
    'Akrobatik & Varieté',
    'Date Night Ideen',
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim())
    }
  }

  function handleSuggestion(suggestion: string) {
    setQuery(suggestion)
    onSearch?.(suggestion)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300',
          )}
          style={{
            background: isFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
            border: isFocused
              ? '1px solid rgba(108, 92, 231, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: isFocused
              ? '0 0 24px rgba(108, 92, 231, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 4px 16px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* AI Sparkle Icon */}
          <div className="flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z"
                fill="url(#sparkleGrad)"
              />
              <defs>
                <linearGradient id="sparkleGrad" x1="2" y1="2" x2="22" y2="22">
                  <stop offset="0%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Was suchst du heute Abend?"
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
          />

          {/* Send button */}
          {query.trim() && (
            <button
              type="submit"
              disabled={isSearching}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                boxShadow: '0 0 12px rgba(108, 92, 231, 0.3)',
              }}
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Quick Suggestions */}
      {!query && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
