import { createClient } from '@/lib/supabase/server'

export interface UserReward {
  current_tier: 'explorer' | 'regular' | 'vip' | 'legend'
  total_stars: number
  current_streak_weeks: number
  longest_streak_weeks: number
  unique_venues_visited: number
  next_tier_stars: number
}

const tierThresholds: Record<string, number> = {
  explorer: 3,
  regular: 8,
  vip: 20,
  legend: Infinity,
}

export async function getRewardsForUser(userId: string): Promise<UserReward> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_rewards')
    .select('*')
    .eq('customer_id', userId)
    .single()

  if (error || !data) {
    return {
      current_tier: 'explorer',
      total_stars: 0,
      current_streak_weeks: 0,
      longest_streak_weeks: 0,
      unique_venues_visited: 0,
      next_tier_stars: 3,
    }
  }

  return {
    current_tier: data.current_tier,
    total_stars: data.total_stars,
    current_streak_weeks: data.current_streak_weeks,
    longest_streak_weeks: data.longest_streak_weeks,
    unique_venues_visited: data.unique_venues_visited,
    next_tier_stars: tierThresholds[data.current_tier] || 3,
  }
}
