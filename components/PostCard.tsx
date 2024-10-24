import { useAuth } from '@/app/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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
  const supabase = createClient()

  const [likesCount, setLikesCount] = useState<number>(post.likes) // Count of likes
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchLikesData = async () => {
      if (user) {
        try {
          // Fetch if the post is liked by the user
          const { data: likeData, error: likeError } = await supabase
            .from('likes')
            .select('user_id')
            .eq('post_id', post.id)

          if (likeError) {
            console.error('Error checking like status:', likeError.message)
          } else {
            setIsLiked(likeData.length > 0) // Set isLiked to true if any like exists
          }

          // Fetch the total likes count for the post
          const { count, error: countError } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id)

          if (countError) {
            console.error('Error fetching likes count:', countError.message)
            return
          }

          setLikesCount(count || 0)
        } catch (err) {
          console.error('Error fetching likes data:', err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchLikesData()
  }, [user, post.id, supabase])

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts.')
      return
    }

    try {
      // Add like (insert into 'likes' table)
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: post.id, user_id: user.id })

      if (error) {
        console.error('Error liking the post:', error.message)
        return
      }

      setLikesCount((prev) => prev + 1)
      setIsLiked(true)
    } catch (err) {
      console.error('Error during like:', err)
    }
  }

  const handleUnlike = async () => {
    if (!user) {
      alert('Please log in to unlike posts.')
      return
    }

    try {
      // Remove like (delete from 'likes' table)
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error unliking the post:', error.message)
        return
      }

      setLikesCount((prev) => prev - 1)
      setIsLiked(false)
    } catch (err) {
      console.error('Error during unlike:', err)
    }
  }

  if (loading) return null // Optional: show loading spinner or placeholder

  return (
    <div className="bg-black p-4 shadow-md border border-gray-800 rounded-lg">
      <div className="flex items-center mb-2">
        <h4 className="text-lg font-mono font-semibold text-white">
          @{post.username}
        </h4>
      </div>

      {/* Post Description */}
      <p className="text-gray-300 mb-2 font-mono">{post.description}</p>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full max-w-md h-96 mx-auto mb-4 relative">
          <Image
            src={post.imageUrl}
            alt="Post image"
            layout="fill"
            objectFit="contain"
            className="rounded-xl border border-gray-800"
          />
        </div>
      )}

      {/* Like Button */}
      <div className="flex justify-between items-center">
        <span className="text-white font-mono">{likesCount} Likes</span>
        {user && (
          <button
            onClick={isLiked ? handleUnlike : handleLike}
            className="text-white"
          >
            {isLiked ? (
              <FavoriteIcon className="text-red-600" />
            ) : (
              <FavoriteBorderIcon className="text-white" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
