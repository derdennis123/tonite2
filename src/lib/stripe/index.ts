import type Stripe from 'stripe'

let _stripe: Stripe | null = null

export async function getStripe(): Promise<Stripe> {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    const { default: Stripe } = await import('stripe')
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return _stripe
}
