'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/venues', label: 'Venues' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/campaigns', label: 'Kampagnen' },
  { href: '/admin/bookings', label: 'Buchungen' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      {/* Admin sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-64 hidden md:flex flex-col z-40"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/admin/dashboard">
            <span
              className="text-xl font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #6C5CE7, #A855F7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TONITE
            </span>
            <span className="text-xs text-[var(--text-tertiary)] ml-2 uppercase tracking-widest">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]'
                )}
                style={
                  isActive
                    ? {
                        background: 'rgba(108, 92, 231, 0.15)',
                        border: '1px solid rgba(108, 92, 231, 0.2)',
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Zurück zur Consumer-App
          </Link>
        </div>
      </aside>

      <main className="md:ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
