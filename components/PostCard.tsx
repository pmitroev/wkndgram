import { useAuth } from '@/app/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
  userid: string
}

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()
  const { toast } = useToast()
  const [likesCount, setLikesCount] = useState<number>(post.likes)
  const [isLiked, setIsLiked] = useState<boolean>(false)
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

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id)
      if (!error) {
        toast({
          title: 'Success!',
          description: 'Post successfully deleted.',
        })

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        console.error('Error deleting post:', error.message)
      }
    } catch (err) {
      console.error('Error during delete:', err)
    }
  }

  const handleEdit = () => {
    router.push(`/edit-post/${post.id}`)
  }

  if (loading) return null

  return (
    <div className="bg-black p-4 shadow-md border border-gray-800  relative">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-white">@{post.username}</h4>
        {user?.id === post.userid && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="text-white cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-red-800">
              <DropdownMenuItem onClick={handleEdit} className="text-white">
                <Pencil className="mr-2 h-4 w-4 text-white" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-white">
                <Trash2 className="mr-2 h-4 w-4 text-white" /> Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="text-gray-300 mb-2">{post.description}</p>

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

      <div className="flex justify-between items-center">
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
  )
}
