'use client'

import { CreatePostButton } from '@/components/CreatePostButton'
import PostCard from '@/components/PostCard'
import PostModal from '@/components/PostModal'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
  userid: string
}

export default function Feed() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null) // State for selected post
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, description, imageUrl, likes, username, userid')
          .order('created_at', { ascending: false })

        if (error) throw error

        setPosts(data || [])
      } catch (err) {
        setError(`Failed to load posts: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
  }

  const closeModal = () => {
    setSelectedPost(null)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <>
      <>
        <title>wkndgram | feed</title>
      </>
      <div className="min-h-screen bg-black flex justify-center mb-8">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl text-center font-semibold text-white mb-4">
            FEED
          </h2>

          {posts.map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post)}>
              <PostCard post={post} />
            </div>
          ))}

          {selectedPost && (
            <PostModal post={selectedPost} onClose={closeModal} />
          )}
        </div>

        <CreatePostButton />
      </div>
    </>
  )
}
