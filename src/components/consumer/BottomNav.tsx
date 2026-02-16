'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const navItems = [
  {
    href: '/',
    label: 'Entdecken',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'url(#navGrad)' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6C5CE7"/><stop offset="100%" stopColor="#A855F7"/></linearGradient></defs>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/tickets',
    label: 'Tickets',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#A855F7' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
      </svg>
    ),
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#A855F7' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#A855F7' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="mx-3 mb-2 rounded-2xl flex items-center justify-around px-2 py-1.5"
        style={{
          background: 'rgba(18, 18, 26, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-300 min-w-[56px]',
                isActive
                  ? 'text-white'
                  : 'text-[var(--text-tertiary)]'
              )}
            >
              {item.icon(isActive)}
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                isActive ? 'text-[#A855F7]' : ''
              )}>
                {item.label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
