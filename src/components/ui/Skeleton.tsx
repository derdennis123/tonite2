import { cn } from '@/lib/utils/cn'

type SkeletonRounded = 'sm' | 'md' | 'lg' | 'full'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: SkeletonRounded
}

const roundedMap: Record<SkeletonRounded, string> = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
}

export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  return (
    <div
      className={cn('animate-[shimmer_1.5s_ease-in-out_infinite]', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: roundedMap[rounded],
        background: `linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-elevated) 50%, var(--bg-secondary) 75%)`,
        backgroundSize: '200% 100%',
      }}
    />
  )
}

interface SkeletonTextProps {
  className?: string
  width?: string | number
  lines?: number
}

export function SkeletonText({
  className,
  width,
  lines = 1,
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={
            i === lines - 1 && lines > 1
              ? '60%'
              : width || '100%'
          }
          rounded="sm"
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--glass-border)] overflow-hidden',
        className
      )}
      style={{ background: 'var(--bg-glass)' }}
    >
      {/* Image area */}
      <Skeleton
        height={200}
        width="100%"
        rounded="sm"
        className="!rounded-none"
      />

      {/* Content area */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <SkeletonText width="75%" />

        {/* Subtitle / date */}
        <SkeletonText width="50%" />

        {/* Price and badge row */}
        <div className="flex items-center justify-between mt-2">
          <Skeleton width={80} height={24} rounded="md" />
          <Skeleton width={60} height={22} rounded="full" />
        </div>
      </div>
    </div>
  )
}
