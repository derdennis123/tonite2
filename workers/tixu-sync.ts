// tixu Availability Sync Worker
// Runs as a cron job to sync event availability from tixu API

interface TixuEvent {
  id: string
  name: string
  date: string
  time: string
  total_capacity: number
  total_sold: number
  venue_id: string
}

const TIXU_API_URL = process.env.TIXU_API_URL || ''
const TIXU_API_KEY = process.env.TIXU_API_KEY || ''

async function fetchTixuEvents(): Promise<TixuEvent[]> {
  if (!TIXU_API_URL || !TIXU_API_KEY) {
    console.log('tixu API not configured, skipping sync')
    return []
  }

  const response = await fetch(`${TIXU_API_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${TIXU_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`tixu API error: ${response.status}`)
  }

  return response.json()
}

async function syncEvents() {
  console.log('[tixu-sync] Starting sync...')

  try {
    const tixuEvents = await fetchTixuEvents()
    console.log(`[tixu-sync] Fetched ${tixuEvents.length} events from tixu`)

    for (const event of tixuEvents) {
      // Update local database with tixu availability data
      // In production: update via Supabase admin client
      console.log(`[tixu-sync] Event ${event.id}: ${event.total_sold}/${event.total_capacity} sold`)
    }

    console.log('[tixu-sync] Sync complete')
  } catch (error) {
    console.error('[tixu-sync] Sync failed:', error)
  }
}

// Run every 5 minutes
const SYNC_INTERVAL = 5 * 60 * 1000

syncEvents()
setInterval(syncEvents, SYNC_INTERVAL)
