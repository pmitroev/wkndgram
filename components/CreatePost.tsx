'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function CreatePost() {
  const supabase = createClient()

  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = supabase.auth.getUser()

      if (!user) {
        setError('User not logged in')
        return
      }

      const { error } = await supabase.from('posts').insert([
        {
          // user_id: (await user).data.user?.id,
          content,
          image_url: imageUrl,
        },
      ])

      if (error) throw error

      setContent('')
      setImageUrl('')
      setError(null)
      alert('Post created successfully!')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            className="mt-10 text-center text-lg font-bold leading-9 tracking-tight text-red-600 font-mono"
            htmlFor="content"
          >
            Post Content:
          </label>
          <input
            className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write something..."
          />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            className="mt-10 text-center text-lg font-bold leading-9 tracking-tight text-red-600 font-mono"
            htmlFor="imageUrl"
          >
            Image URL:
          </label>
          <input
            className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-3">
          <button
            className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            type="submit"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  )
}
