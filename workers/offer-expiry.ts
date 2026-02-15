// Offer Expiration Worker
// Expires accepted offers that haven't been paid within 15 minutes

async function expireOffers() {
  console.log('[offer-expiry] Checking for expired offers...')

  // In production: query Supabase for accepted offers past their expires_at
  // UPDATE offers SET status = 'expired' WHERE status = 'accepted' AND expires_at < NOW()

  console.log('[offer-expiry] Check complete')
}

// Run every 5 minutes
const CHECK_INTERVAL = 5 * 60 * 1000

expireOffers()
setInterval(expireOffers, CHECK_INTERVAL)
