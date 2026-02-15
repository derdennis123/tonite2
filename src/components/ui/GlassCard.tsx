import { cn } from '@/lib/utils/cn'
import { type ElementType, type ComponentPropsWithoutRef } from 'react'

type GlassCardProps<T extends ElementType = 'div'> = {
  as?: T
  hover?: boolean
  className?: string
  children?: React.ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'hover' | 'className' | 'children'>

export function GlassCard<T extends ElementType = 'div'>({
  as,
  hover = false,
  className,
  children,
  ...rest
}: GlassCardProps<T>) {
  const Component = as || 'div'

  return (
    <Component
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--glass-border)]',
        'shadow-[var(--glass-shadow)]',
        'transition-all duration-300',
        hover && [
          'hover:border-[rgba(255,255,255,0.15)]',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]',
        ],
        className
      )}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        ...(hover
          ? {}
          : {}),
      }}
      onMouseEnter={
        hover
          ? (e: React.MouseEvent<HTMLElement>) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--bg-glass-hover)'
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e: React.MouseEvent<HTMLElement>) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--bg-glass)'
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Component>
  )
}
