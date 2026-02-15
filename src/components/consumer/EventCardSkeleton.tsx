export function EventCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Image skeleton */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          {/* Title */}
          <div
            className="h-5 rounded-lg w-3/4"
            style={{
              background: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
          {/* Subtitle */}
          <div
            className="h-4 rounded-lg w-1/2"
            style={{
              background: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: '0.2s',
            }}
          />
        </div>
        {/* Price */}
        <div className="flex items-center justify-between">
          <div
            className="h-7 rounded-lg w-24"
            style={{
              background: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: '0.4s',
            }}
          />
          <div
            className="h-3 rounded-lg w-16"
            style={{
              background: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: '0.6s',
            }}
          />
        </div>
      </div>
    </div>
  )
}
