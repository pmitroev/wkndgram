import { useAuth } from '@/app/context/AuthContext'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/utils/supabase/client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { X } from 'lucide-react'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
  userid: string
}

type PostModalProps = {
  post: Post
  onClose: () => void
}

const PostModal: FC<PostModalProps> = ({ post, onClose }) => {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const supabase = createClient()
  const [likesCount, setLikesCount] = useState<number>(post.likes)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Fetch likes data
    const fetchLikesData = async () => {
      try {
        const { count, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('post_id', post.id)

        if (error) {
          console.error('Error fetching likes count:', error.message)
          return
        }
        setLikesCount(count || 0)

        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('user_id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)

          setIsLiked(!!likeData?.length)
        }
      } catch (err) {
        console.error('Error fetching likes data:', err)
      } finally {
        setLoading(false)
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
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: post.id, user_id: user.id })

      if (!error) {
        setLikesCount((prev) => prev + 1)
        setIsLiked(true)
      }
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
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id)

      if (!error) {
        setLikesCount((prev) => prev - 1)
        setIsLiked(false)
      }
    } catch (err) {
      console.error('Error during unlike:', err)
    }
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as Element).id === 'modal-overlay') {
      onClose()
    }
  }

  if (!post) return null
  if (loading) return null

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleOutsideClick}
    >
      <div className="relative flex flex-col md:flex-row mx-3 bg-black rounded-lg max-w-4xl w-full">
        {/* Left Section - Image */}
        {post.imageUrl && (
          <div className="relative w-full md:w-1/2 h-64 md:h-[80vh]">
            <Image
              src={post.imageUrl}
              alt="Post image"
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
        )}

        {/* Right Section - Post Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white"
          >
            <X />
          </button>

          <div className="flex flex-col mb-4">
            <h4 className="text-lg font-semibold text-white mb-2">
              @{post.username}
            </h4>
            <Separator className="my-3 bg-gray-700" />
            <p className="text-gray-300 mb-4">{post.description}</p>
          </div>

          <div className="flex flex-col">
            <Separator className="mb-4 bg-gray-700" />
            <div className="flex items-center justify-between">
              <span className="text-white">{likesCount} Likes</span>
              {user && (
                <button
                  onClick={isLiked ? handleUnlike : handleLike}
                  className="text-white"
                >
                  {isLiked ? (
                    <FavoriteIcon className="text-red-600" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostModal
