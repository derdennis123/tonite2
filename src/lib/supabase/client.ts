import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !key) {
    // Return a non-functional client instead of crashing.
    // This happens when NEXT_PUBLIC_* vars are not set at build time.
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder')
  }

  return createBrowserClient(url, key)
}
