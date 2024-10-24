'use client'

import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
}

export default function Home() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the top 3 most liked posts
  useEffect(() => {
    const fetchTopLikedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, description, imageUrl, likes, username')
          .order('likes', { ascending: false })
          .limit(3)

        if (error) throw error

        setPosts(data || [])
      } catch (err) {
        setError(`Failed to load posts: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchTopLikedPosts()
  }, [supabase])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="w-full max-w-6xl flex justify-around space-x-4">
        {/* Map the top 3 posts into the row */}
        {posts.map((post) => (
          <div key={post.id} className="w-1/3">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
