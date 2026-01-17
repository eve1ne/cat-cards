'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Folder = {
  id: string
  name: string
  parent_id: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])

  // Get user info
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

  // Fetch folders
  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setFolders(data ?? [])
      }
    }

    fetchFolders()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:')
    if (folderName) {
      const { error } = await supabase.from('folders').insert([
        {
          name: folderName,
          parent_id: null,
        },
      ])

      if (error) {
        console.error(error)
      } else {
        // Refresh folder list
        const { data } = await supabase
          .from('folders')
          .select('*')
          .order('created_at', { ascending: true })
        setFolders(data ?? [])
      }
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Logged in as {email ?? 'Unknown'}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Log Out
      </button>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Folders</h2>
        {folders.length === 0 ? (
          <p className="text-gray-500">No folders yet</p>
        ) : (
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li key={folder.id} className="p-2 bg-gray-100 rounded">
                {folder.name}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleCreateFolder}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Folder
        </button>
      </div>
    </main>
  )
}
