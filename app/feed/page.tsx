'use client'

import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  user: { username: string }[] // Change user to be an array of objects
}

export default function Feed() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from the database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select(`
            id,
            description,
            imageUrl,
            likes,
            user:users(username)
          `) // Fetch all posts

        if (error) throw error

        setPosts(data || [])
        console.log(data)
      } catch (err) {
        setError(`Failed to load posts: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div>No posts available</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
