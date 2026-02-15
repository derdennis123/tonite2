import { TopBar } from '@/components/consumer/TopBar'
import { BottomNav } from '@/components/consumer/BottomNav'

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopBar />
      <main className="pt-14">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
