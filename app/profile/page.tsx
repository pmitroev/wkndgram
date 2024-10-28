'use client'

import { useAuth } from '@/app/context/AuthContext'
import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
  userid: string
}

export default function Profile() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id) return
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, description, imageUrl, likes, username, userid')
          .eq('userid', user.id)

        if (error) throw error
        setPosts(data || [])
      } catch (err) {
        setError(`Failed to load posts: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPosts()
  }, [supabase, user?.id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return user ? (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-3xl ">
        <h2 className="text-xl text-center font-semibold text-white mb-4">
          Your Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-white text-center">No posts yet</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  ) : null
}
