'use client'

import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditPost() {
  const supabase = createClient()
  const { id } = useParams()
  const { toast } = useToast()
  const router = useRouter()

  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('description')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching post:', error.message)
      } else {
        setDescription(data.description || '')
      }
      setLoading(false)
    }

    fetchPost()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('posts')
      .update({ description })
      .eq('id', id)

    if (!error) {
      toast({
        title: 'Success!',
        description: 'Post successfully updated.',
      })
      router.push('/feed')
    } else {
      console.error('Error updating post:', error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen justify-center items-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-black p-6 rounded-md shadow-md"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Edit Post</h1>
        <label htmlFor="description" className="block text-white mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 rounded-md bg-gray-800 text-white focus:ring-red-600"
          placeholder="Update your description..."
        />
        <button
          type="submit"
          className="mt-4 w-full px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
