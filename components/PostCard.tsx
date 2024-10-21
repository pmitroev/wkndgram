import { useAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import { useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  user: { username: string }[] // Change user to be an array of objects
}

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState<number>(post.likes)
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const handleLike = () => {
    if (user) {
      setLikes((prev) => prev + (isLiked ? -1 : 1))
      setIsLiked(!isLiked)
    } else {
      alert('Please log in to like posts.')
    }
  }

  return (
    <div className="rounded-lg shadow-md p-4 mb-4 bg-gray-600">
      <div className="flex items-center mb-2">
        <h4 className="text-white text-lg font-semibold font-mono">
          {post.user[0]?.username}
        </h4>
      </div>

      <p className="text-white mb-4 font-mono">{post.description}</p>

      {post.imageUrl && (
        <div className="w-full h-auto mb-4">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-gray-600">{likes} likes</span>

        {user && (
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              isLiked ? 'bg-red-500' : 'bg-gray-500'
            }`}
          >
            {isLiked ? 'Unlike' : 'Like'}
          </button>
        )}
      </div>
    </div>
  )
}
