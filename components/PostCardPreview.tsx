import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Image from 'next/image'

type Post = {
  content: string
  imageUrl?: string | null
  user: {
    username: string
  }
}

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-black p-4 shadow-md border border-gray-800">
      <div className="flex items-center mb-2">
        <h4 className="text-lg font-semibold text-white">
          @{post.user.username}
        </h4>
      </div>

      {/* Post Description */}
      <p className="text-gray-300 mb-2">{post.content}</p>

      {/* Post Image */}
      {post.imageUrl ? (
        <div className="w-full max-w-md h-96 mx-auto mb-4 relative">
          <Image
            src={post.imageUrl}
            alt="Post image"
            layout="fill"
            objectFit="contain" // Ensure the image covers the container while keeping its aspect ratio
            className="rounded-xl border border-gray-800"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg">
          <p className="text-center text-gray-500">Image goes here</p>
        </div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <span className="text-white">0 Likes</span>
        <FavoriteBorderIcon className="text-white" />
      </div>
    </div>
  )
}
