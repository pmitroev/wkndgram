'use client'

import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  username: string
  likes: number
  userid: string
}

export default function HomePage() {
  const supabase = createClient()
  const [randomPosts, setRandomPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    const fetchRandomPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, description, imageUrl, username, likes, userid')
        .limit(1)
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching random posts:', error)
      } else {
        setRandomPosts(data)
      }
    }

    fetchRandomPosts()
  }, [supabase])

  return (
    <>
      <title>wkndgram | home</title>
      <div className="relative w-full overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-red-800"></div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-around h-full px-10 py-12 sm:flex-row">
          {/* Left Side: Title and Button */}
          <div className="flex flex-col max-w-lg space-y-6 text-center sm:text-left">
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-white via-red-500 to-red-900 bg-clip-text">
              Discover moments of The Weeknd&apos;s concert from different POVs
            </h1>
            <Link href="/feed">
              <button className="px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                Go to Feed
              </button>
            </Link>
          </div>
        </div>

        {/* Disclaimer Overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-red-600">
              Project Paused
            </h2>
            <p className="mt-4 text-center text-gray-700">
              The project is currently paused. We&apos;ll be back ASAP.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {randomPosts &&
          randomPosts.map((post) => (
            <div key={post.id} className="w-full">
              <PostCard post={post} />
            </div>
          ))}
      </div>
    </>
  )
}
