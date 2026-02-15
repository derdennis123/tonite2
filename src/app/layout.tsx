import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TONITE — Last-Minute Erlebnisse',
    template: '%s | TONITE',
  },
  description: 'Entdecke exklusive Last-Minute Erlebnisse in deiner Stadt. Theater, Varieté, Shows — zum besten Preis.',
  keywords: ['Events', 'Last-Minute', 'Theater', 'Varieté', 'Shows', 'Tickets', 'Essen', 'Bonn'],
  authors: [{ name: 'TONITE' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'TONITE',
    title: 'TONITE — Last-Minute Erlebnisse',
    description: 'Entdecke exklusive Last-Minute Erlebnisse in deiner Stadt.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TONITE — Last-Minute Erlebnisse',
    description: 'Entdecke exklusive Last-Minute Erlebnisse in deiner Stadt.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TONITE',
  },
}

export const viewport: Viewport = {
  themeColor: '#6C5CE7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
