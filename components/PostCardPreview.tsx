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
    <div className="border-0 rounded-lg shadow-md p-4 mb-4 bg-gray-600">
      <div className="flex items-center mb-4">
        <h4 className="ml-3 text-lg font-semibold font-mono">
          @{post.user.username}
        </h4>
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.imageUrl && (
        <div className="w-full h-auto">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={500}
            height={300}
            className="rounded-lg"
            objectFit="cover"
          />
        </div>
      )}
    </div>
  )
}
