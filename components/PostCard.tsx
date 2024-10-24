import { useAuth } from '@/app/context/AuthContext'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Image from 'next/image'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
}

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()

  return (
    <div className="bg-black p-4 shadow-md border border-gray-800">
      <div className="flex items-center mb-2">
        <h4 className="text-lg font-semibold text-white">@{post.username}</h4>
      </div>

      {/* Post Description */}
      <p className="text-gray-300 mb-2">{post.description}</p>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full max-w-md h-96 mx-auto mb-4 relative">
          <Image
            src={post.imageUrl}
            alt="Post image"
            layout="fill"
            objectFit="contain" // Ensure the image covers the container while keeping its aspect ratio
            className="rounded-xl border border-gray-800"
          />
        </div>
      )}

      {/* Like Button */}
      <div className="flex justify-between items-center">
        <span className="text-white">{post.likes} Likes</span>
        {user && <FavoriteBorderIcon className="text-white" />}
      </div>
    </div>
  )
}
