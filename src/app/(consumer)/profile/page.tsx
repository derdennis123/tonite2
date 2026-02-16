import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileView } from './ProfileView'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('first_name, last_name, email, city')
    .eq('id', user.id)
    .single()

  const { data: reward } = await supabase
    .from('customer_rewards')
    .select('current_tier')
    .eq('customer_id', user.id)
    .single()

  const profileData = {
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    email: customer?.email || user.email || '',
    city: customer?.city || '',
    tier: reward?.current_tier || 'explorer',
  }

  return <ProfileView user={profileData} />
}
