'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)


  useEffect(() => {
    const getUser = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()

      setEmail(user.email ?? null)
      setUsername(profile?.username ?? null)
      setWebsite(profile?.website ?? null)
      setAvatarUrl(profile?.avatar_url ?? null)
    }
   
    getUser()
  }, [router])

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="mt-36 text-2xl font-bold mb-4">Profile</h1>

      <p>Email: {email}</p>
      <p>Username: {username}</p>
      <p>Website: {website}</p>
      <p>Avatar URL: {avatar_url}</p>
    </main>
  )
}
