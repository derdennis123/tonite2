import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'available' | 'selling' | 'few' | 'last' | 'default' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  pulse?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
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
  default: {
    bg: 'var(--bg-glass)',
    text: 'var(--text-secondary)',
    border: 'var(--glass-border)',
  },
  info: {
    bg: 'rgba(90, 200, 250, 0.15)',
    text: 'var(--info)',
    border: 'rgba(90, 200, 250, 0.3)',
  },
}

export function Badge({
  variant = 'default',
  pulse = false,
  className,
  children,
}: BadgeProps) {
  const styles = variantStyles[variant]
  const shouldPulse = pulse || variant === 'last'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-full)]',
        'border',
        shouldPulse && 'animate-[pulse-scarcity_2s_ease-in-out_infinite]',
        className
      )}
      style={{
        background: styles.bg,
        color: styles.text,
        borderColor: styles.border,
      }}
    >
      {children}
    </span>
  )
}
