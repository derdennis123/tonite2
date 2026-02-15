import { VenueSidebar } from '@/components/venue/VenueSidebar'

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <VenueSidebar />
      <main className="md:ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
