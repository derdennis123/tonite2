'use client'

import { cn } from '@/lib/utils/cn'
import type { UserReward } from '@/lib/data/rewards'

const tiers = [
  { key: 'explorer', label: 'Explorer', requirement: '0 Buchungen', color: '#8E8E93' },
  { key: 'regular', label: 'Regular', requirement: '3 Buchungen', color: '#5AC8FA' },
  { key: 'vip', label: 'VIP', requirement: '8 Buchungen', color: '#A855F7' },
  { key: 'legend', label: 'Legend', requirement: '20 Buchungen', color: '#FF9F0A' },
]

interface RewardsViewProps {
  reward: UserReward
}

export function RewardsView({ reward }: RewardsViewProps) {
  const currentTierIndex = tiers.findIndex((t) => t.key === reward.current_tier)
  const progressPct = Math.min(100, (reward.total_stars / reward.next_tier_stars) * 100)

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Rewards</h1>

      {/* Current Tier */}
      <div className="p-6 rounded-2xl text-center space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: `${tiers[currentTierIndex].color}20`, border: `2px solid ${tiers[currentTierIndex].color}` }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={tiers[currentTierIndex].color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{tiers[currentTierIndex].label}</p>
          <p className="text-sm text-[var(--text-secondary)]">{reward.total_stars} Sterne</p>
        </div>

        {/* Progress to next tier */}
        {currentTierIndex < tiers.length - 1 && (
          <div className="space-y-2">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progressPct}%`, background: 'linear-gradient(135deg, #6C5CE7, #A855F7)' }} />
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Noch {reward.next_tier_stars - reward.total_stars} Buchungen bis {tiers[currentTierIndex + 1].label}
            </p>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Streak</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{reward.current_streak_weeks} Wochen</p>
          </div>
          <div className="text-3xl" style={{ color: reward.current_streak_weeks > 0 ? '#FF9F0A' : 'var(--text-tertiary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill={reward.current_streak_weeks > 0 ? '#FF9F0A' : 'none'} stroke={reward.current_streak_weeks > 0 ? '#FF9F0A' : 'var(--text-tertiary)'} strokeWidth="1.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
          </div>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">Buche jede Woche um deinen Streak aufzubauen</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{reward.unique_venues_visited}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Venues besucht</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{reward.longest_streak_weeks}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Längster Streak</p>
        </div>
      </div>

      {/* Tier Overview */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">Alle Tiers</h3>
        {tiers.map((tier, i) => (
          <div key={tier.key} className={cn('p-4 rounded-xl flex items-center gap-4', i <= currentTierIndex ? 'opacity-100' : 'opacity-50')} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${i === currentTierIndex ? tier.color + '40' : 'rgba(255,255,255,0.08)'}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${tier.color}15` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={i <= currentTierIndex ? tier.color : 'none'} stroke={tier.color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{tier.label}</p>
              <p className="text-xs text-[var(--text-secondary)]">{tier.requirement}</p>
            </div>
            {i <= currentTierIndex && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tier.color} strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
