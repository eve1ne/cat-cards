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

type Note = {
  id: string
  title: string
  content: string
  folder_id: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()

  const [email, setEmail] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderStack, setFolderStack] = useState<string[]>([])

  /* ---------------- AUTH ---------------- */

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

  /* ---------------- FETCH FOLDERS ---------------- */

  useEffect(() => {
    const fetchFolders = async () => {
      let query = supabase.from('folders').select('*').order('created_at', { ascending: true })

      if (currentFolderId === null) {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', currentFolderId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase fetchFolders error:', error)
      } else {
        setFolders(data ?? [])
      }
    }

    fetchFolders()
  }, [currentFolderId])

  /* ---------------- FETCH NOTES ---------------- */

  useEffect(() => {
    const fetchNotes = async () => {
      let query = supabase.from('notes').select('*').order('created_at', { ascending: true })

      if (currentFolderId === null) {
        query = query.is('folder_id', null)
      } else {
        query = query.eq('folder_id', currentFolderId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase fetchNotes error:', error)
      } else {
        setNotes(data ?? [])
      }
    }

    fetchNotes()
  }, [currentFolderId])

  /* ---------------- NAVIGATION ---------------- */

  const enterFolder = (folderId: string) => {
    setFolderStack((prev) => [...prev, currentFolderId ?? 'root'])
    setCurrentFolderId(folderId)
  }

  const goBack = () => {
    const stack = [...folderStack]
    const prev = stack.pop()

    setFolderStack(stack)
    setCurrentFolderId(prev === 'root' ? null : prev ?? null)
  }

  /* ---------------- ACTIONS ---------------- */

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleCreateFolder = async () => {
    const name = prompt('Folder name?')
    if (!name?.trim()) return

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name: name.trim(),
        parent_id: currentFolderId,
        user_id: userData.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
    }
    else if (data) {
      setFolders((prev) => [...prev, data])
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    const { error } = await supabase.from('folders').delete().eq('id', folderId)

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
    }
    else {
      setFolders((prev) => prev.filter((f) => f.id !== folderId))
    }
  }

  const handleCreateNote = async () => {
    const title = prompt('Note title?')
    if (!title?.trim()) return

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: title.trim(),
        content: '',
        folder_id: currentFolderId,
        user_id: userData.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
    }
    else if (data) {
      setNotes((prev) => [...prev, data])
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-gray-600">Logged in as {email ?? 'Unknown'}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Log Out
      </button>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Folders</h2>

          {currentFolderId && (
            <button
              onClick={goBack}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>
          )}
        </div>

        {folders.length === 0 ? (
          <p className="text-gray-500">No folders here</p>
        ) : (
          <ul className="space-y-2">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className="p-3 bg-gray-100 rounded flex justify-between items-center cursor-pointer hover:bg-gray-200"
                onClick={() => enterFolder(folder.id)}
              >
                <span>{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFolder(folder.id)
                  }}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Notes</h3>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes here</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id} className="p-3 bg-gray-100 rounded">
                {note.title}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleCreateFolder}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Folder
          </button>

          <button
            onClick={handleCreateNote}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Note
          </button>
        </div>
      </div>
    </main>
  )
}
