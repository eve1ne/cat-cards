'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)


  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      } else {
        setEmail(data.user.email ?? null)
      }
    }

   
    getUser()
  }, [router])

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="mt-36 text-2xl font-bold mb-4">Profile</h1>
      <p>Profile Picture: {profilePicture ? <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full" /> : 'No profile picture'}</p>
      <button
        className="mb-4 bg-[#453750] text-white px-6 py-3 transition duration-300 ease-in-out hover:bg-[#5b4769] hover:scale-105 hover:shadow-lg"
      >
        Edit Picture
      </button>  
      <p>Email: {email}</p>
      <p>Password: ********</p>
    </main>
  )
}

/*
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ...


type ProfileUser = { id: string; email: string }

export default function Account({ user }: { user: ProfileUser }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [user])

_  async function updateProfile(event, avatar_url) {
    event.preventDefault()

    setLoading(true)

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatar_url,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatar_url)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className="form-widget">


      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}*/
