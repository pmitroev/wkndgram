'use client'

import PostCard from '@/components/PostCard'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  username: string
  likes: number
}

export default function HomePage() {
  const supabase = createClient()
  const [randomPosts, setRandomPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    const fetchRandomPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, description, imageUrl, username, likes')
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
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://accorstadium.com.au/wp-content/uploads/sites/4/2024/08/16/The-Weeknd-Live-2048x1366.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center h-full px-10 space-y-4 md:space-y-0 md:space-x-6">
        <div className="p-5 rounded-lg shadow-md text-white w-full md:w-2/3 lg:w-1/2 max-w-4xl">
          <h2 className="text-center text-xl font-semibold mb-4">
            Post of the Day
          </h2>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {randomPosts &&
              randomPosts.map((post) => (
                <div key={post.id} className="w-full md:w-2/3 lg:w-1/2">
                  <PostCard post={post} />
                </div>
              ))}
          </div>
        </div>

        <Link href="/feed">
          <button className="w-full md:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition">
            Go to Feed
          </button>
        </Link>
      </div>
    </div>
  )
}
