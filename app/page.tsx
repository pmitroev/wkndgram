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
        <div className="relative z-10 flex flex-col sm:flex-row h-full justify-around items-center px-10 py-12">
          {/* Left Side: Title and Button */}
          <div className="flex flex-col space-y-6 max-w-lg text-center sm:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-red-500 to-red-900 bg-clip-text text-transparent">
              Discover moments of The Weeknd&apos;s concert from different POVs
            </h1>
            <Link href="/feed">
              <button className="px-6 py-3 bg-gradient-to-tr from-white to-red-900 text-black font-semibold rounded-full shadow-md transition-transform transform hover:scale-105">
                Explore Now
              </button>
            </Link>
          </div>

          {/* Right Side: Post of the Day Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-lg shadow-md text-white w-full max-w-xs mt-4">
            <h2 className="text-center text-xl font-semibold mb-4">
              Post of the Day
            </h2>
            <div className="flex flex-col">
              {randomPosts &&
                randomPosts.map((post) => (
                  <div key={post.id} className="w-full">
                    <PostCard post={post} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
