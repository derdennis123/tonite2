'use client'

import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-md)]',
  md: 'px-5 py-2.5 text-sm rounded-[var(--radius-lg)]',
  lg: 'px-7 py-3.5 text-base rounded-[var(--radius-lg)]',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'text-[var(--text-primary)] font-semibold',
    'shadow-[var(--accent-glow)]',
    'hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_0_12px_rgba(108,92,231,0.3)]',
  ].join(' '),
  secondary: [
    'bg-[var(--bg-glass)] text-[var(--text-primary)] font-semibold',
    'border border-[var(--glass-border)]',
    'hover:bg-[var(--bg-glass-hover)] hover:border-[rgba(255,255,255,0.2)] hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--text-secondary)] font-medium',
    'hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]',
    'active:scale-[0.98]',
  ].join(' '),
  danger: [
    'bg-[var(--danger)] text-white font-semibold',
    'shadow-[0_0_20px_rgba(255,69,58,0.3)]',
    'hover:shadow-[0_0_30px_rgba(255,69,58,0.5)] hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98] active:shadow-[0_0_12px_rgba(255,69,58,0.2)]',
  ].join(' '),
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'transition-all duration-200',
        'cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        sizeClasses[size],
        variantClasses[variant],
        loading && 'relative overflow-hidden',
        className
      )}
      style={{
        ...(variant === 'primary' && !isDisabled
          ? { background: 'var(--accent-gradient)' }
          : variant === 'primary' && isDisabled
            ? { background: 'var(--accent-gradient)', opacity: 0.5 }
            : {}),
        fontFamily: 'var(--font-primary)',
        ...style,
      }}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <>
          <span className="opacity-0">{children}</span>
          <span
            className="absolute inset-0 rounded-[inherit]"
            style={{
              background:
                'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </>
      ) : (
        children
      )}
    </button>
  )
}
