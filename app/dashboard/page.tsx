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
  file_url?: string
  content?: string
  folder_id: string | null
  created_at: string
}




export default function DashboardPage() {
  
  const router = useRouter()

  const [email, setEmail] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

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

  /* ---------------- FETCH ALL FOLDERS (SIDEBAR) ---------------- */

  useEffect(() => {
    const fetchFolders = async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase fetchFolders error:', error)
      } else {
        setFolders(data ?? [])
      }
    }

    fetchFolders()
  }, [])

  const getChildren = (parentId: string | null) =>
    folders.filter((f) => f.parent_id === parentId)

  /* ---------------- FETCH NOTES (MAIN PANEL) ---------------- */

  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentFolderId) {
        setNotes([])
        return
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('folder_id', currentFolderId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase fetchNotes error:', error)
      } else {
        setNotes(data ?? [])
      }
    }

    fetchNotes()
  }, [currentFolderId])

  /* ---------------- ACTIONS ---------------- */

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleCreateFolder = async () => {
    const name = prompt('Folder name?')
    if (!name?.trim()) return

    const isSubfolder = currentFolderId
    ? confirm('Make this a subfolder of the currently selected folder?')
    : false

    const parentId = isSubfolder ? currentFolderId : null

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data, error } = await supabase
    .from('folders')
    .insert({
    name: name.trim(),
    parent_id: parentId,
    user_id: userData.user.id,
    })
    .select()
    .single()

    if (error) {
      console.error('Supabase error:', error)
    } else if (data) {
      setFolders((prev) => [...prev, data])
    }
  }


  const handleUploadNote = async (folderId: string) => {
    if (!folderId) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.docx,.txt,.md';

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        return;
      }
      const userId = user.id;

      // Unique file path
      const timestamp = Date.now();
      const filePath = `${userId}/${folderId}/${timestamp}-${file.name}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      // Insert note row in db
      const { data: note, error: insertError } = await supabase
        .from('notes')
        .insert({
          folder_id: folderId,
          user_id: userId,
          title: `${timestamp}-${file.name}`, // unique
          file_url: uploadData.path,
          content: '', // avoid null constraint
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert note error:', insertError, 'Note data:', {
          folderId,
          userId,
          title: `${timestamp}-${file.name}`,
          file_url: uploadData.path,
        });
      } else if (note) {
        setNotes((prev) => [...prev, note]);
      }
    };

    fileInput.click();
  };



  /* ---------------- UI ---------------- */

  const FolderItem = ({ folder }: { folder: Folder }) => {
    const children = getChildren(folder.id)

    return (
      <div className="ml-2">
        <button
          onClick={() => setCurrentFolderId(folder.id)}
          className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${
            currentFolderId === folder.id ? 'bg-gray-200 font-medium' : ''
          }`}
        >
          <img src="images/black-folder.svg" alt="Folder" className="inline w-5 h-5 mr-1" />
          {folder.name}
        </button>

        {children.length > 0 && (
          <div className="ml-4">
            {children.map((child) => (
              <FolderItem key={child.id} folder={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        <h1 className="text-lg font-bold mb-2">Folders</h1>
        {getChildren(null).map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}

        <button
          onClick={handleCreateFolder}
          className="mt-4 w-full text-white px-3 py-2 bg-[#453750] transition duration-300 ease-in-out hover:bg-[#5b4769] hover:scale-105 hover:shadow-lg"
        >
          + New Folder
        </button>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Notes</h2>
            <p className="text-sm text-gray-600">Logged in as {email ?? 'Unknown'}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => currentFolderId && handleUploadNote(currentFolderId)}
              className="text-white px-4 py-2 bg-[#453750] transition duration-300 ease-in-out hover:bg-[#5b4769] hover:scale-105 hover:shadow-lg"
            >
              + Add Note
            </button>

            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 bg-[#7F3A3A] transition duration-300 ease-in-out hover:bg-[#A55757] hover:scale-105 hover:shadow-lg"
            >
              Log Out
            </button>
          </div>
        </div>

        {currentFolderId === null ? (
          <p className="text-gray-500">Select a folder to view notes</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes in this folder</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 border rounded-lg hover:shadow cursor-pointer"
              >
                <img src="images/black-note.svg" alt="Note" className="inline w-5 h-5 mr-1" />
                <p className="mt-2 font-medium truncate">{note.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
