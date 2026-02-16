import { format, formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns'
import { de } from 'date-fns/locale'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPriceExact(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "EEE, d. MMM", { locale: de })
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "EEEE, d. MMMM yyyy", { locale: de })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "HH:mm", { locale: de })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return format(date, "EEE, d. MMM · HH:mm 'Uhr'", { locale: de })
}

export function getCountdown(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const hours = differenceInHours(date, now)
  const minutes = differenceInMinutes(date, now) % 60

  if (hours > 48) {
    return formatDistanceToNow(date, { locale: de, addSuffix: true })
  }
  if (hours > 0) {
    return `Beginn in ${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `Beginn in ${minutes}m`
  }
  return 'Jetzt!'
}

export function getScarcityLevel(remaining: number): 'available' | 'selling' | 'few' | 'last' {
  if (remaining > 20) return 'available'
  if (remaining > 10) return 'selling'
  if (remaining > 5) return 'few'
  return 'last'
}

export function getScarcityText(remaining: number): string {
  if (remaining > 20) return 'Verfügbar'
  if (remaining > 10) return 'Geht schnell weg'
  if (remaining > 5) return `Nur noch ${remaining}`
  return `Letzte ${remaining}!`
}

export function getCrewDiscount(memberCount: number): number {
  if (memberCount >= 7) return 0.35
  if (memberCount >= 5) return 0.30
  if (memberCount >= 3) return 0.20
  if (memberCount >= 2) return 0.10
  return 0
}

export function getNextCrewThreshold(memberCount: number): { needed: number; discount: number } | null {
  if (memberCount < 2) return { needed: 2 - memberCount, discount: 0.10 }
  if (memberCount < 3) return { needed: 3 - memberCount, discount: 0.20 }
  if (memberCount < 5) return { needed: 5 - memberCount, discount: 0.30 }
  if (memberCount < 7) return { needed: 7 - memberCount, discount: 0.35 }
  return null
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
