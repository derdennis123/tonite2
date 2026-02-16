import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRewardsForUser } from '@/lib/data/rewards'
import { RewardsView } from './RewardsView'

export default async function RewardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const reward = await getRewardsForUser(user.id)

  return <RewardsView reward={reward} />
}
