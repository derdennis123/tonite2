import { cn } from '@/lib/utils/cn'
import { getScarcityLevel, getScarcityText } from '@/lib/utils/format'

interface ScarcityBadgeProps {
  remaining: number
  className?: string
}

const scarcityColors: Record<ReturnType<typeof getScarcityLevel>, {
  bg: string
  text: string
  border: string
}> = {
  available: {
    bg: 'rgba(52, 199, 89, 0.15)',
    text: 'var(--scarcity-available)',
    border: 'rgba(52, 199, 89, 0.3)',
  },
  selling: {
    bg: 'rgba(255, 159, 10, 0.15)',
    text: 'var(--scarcity-selling)',
    border: 'rgba(255, 159, 10, 0.3)',
  },
  few: {
    bg: 'rgba(255, 107, 53, 0.15)',
    text: 'var(--scarcity-few)',
    border: 'rgba(255, 107, 53, 0.3)',
  },
  last: {
    bg: 'rgba(255, 69, 58, 0.15)',
    text: 'var(--scarcity-last)',
    border: 'rgba(255, 69, 58, 0.3)',
  },
}

export function ScarcityBadge({ remaining, className }: ScarcityBadgeProps) {
  const level = getScarcityLevel(remaining)
  const text = getScarcityText(remaining)
  const colors = scarcityColors[level]
  const shouldPulse = remaining <= 5

  return (
    <span
      className={cn(
        'absolute top-3 right-3 z-10',
        'inline-flex items-center px-2.5 py-1',
        'text-xs font-semibold',
        'rounded-[var(--radius-full)]',
        'border',
        shouldPulse && 'animate-[pulse-scarcity_2s_ease-in-out_infinite]',
        className
      )}
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {text}
    </span>
  )
}
