'use client'

import { useAuth } from '@/app/context/AuthContext'
import PostModal from '@/components/PostModal'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type Post = {
  id: string
  description: string
  imageUrl: string | null
  likes: number
  username: string
  userid: string
}

type UserProfile = {
  username: string
  bio?: string
  photoUrl?: string
}

export default function Profile() {
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState<boolean>(false)

  // Define fetchUserProfile with useCallback to prevent unnecessary re-renders
  const fetchUserProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('username, bio, photoUrl')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error.message)
    } else {
      setUserProfile(data)
    }
  }, [supabase, user?.id])

  const fetchUserPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, description, imageUrl, likes, username, userid')
      .eq('userid', user?.id)

    if (error) {
      console.error('Error loading posts:', error.message)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }, [supabase, user?.id])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetchUserProfile()
    }
  }, [user, authLoading, router, fetchUserProfile])

  useEffect(() => {
    if (user?.id) fetchUserPosts()
  }, [user, fetchUserPosts])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      await uploadProfileImage(file)
    }
  }

  const uploadProfileImage = async (file: File) => {
    if (!user || !file) return

    const filePath = `public/${user.id}_${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Profile photo upload error:', uploadError.message)
      setError('Failed to upload profile photo.')
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(uploadData.path)

    const newPhotoUrl = publicUrlData?.publicUrl || null

    if (newPhotoUrl) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ photoUrl: newPhotoUrl })
        .eq('id', user.id)

      if (updateError) {
        console.error(
          'Failed to update user profile photo URL:',
          updateError.message
        )
        setError('Failed to save profile photo.')
      } else {
        setUserProfile((prev) =>
          prev ? { ...prev, photoUrl: newPhotoUrl } : prev
        )
      }
    }
  }

  const handlePostClick = (post: Post) => setSelectedPost(post)
  const closeModal = () => setSelectedPost(null)

  if (authLoading || loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return user ? (
    <>
      <>
        <title>wkndgram | profile</title>
      </>
      <div className="flex flex-col items-center min-h-screen p-4 bg-black sm:p-6">
        <div className="flex flex-col items-center w-full mb-6 text-white sm:w-1/2 lg:w-1/4">
          <div
            onClick={() =>
              document.getElementById('profileImageInput')?.click()
            }
            className="relative flex items-center justify-center w-32 h-32 mb-4 bg-gray-600 rounded-full cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {previewUrl || userProfile?.photoUrl ? (
              <Image
                src={
                  previewUrl || userProfile?.photoUrl || '/default-profile.png'
                }
                alt={`${userProfile?.username}'s profile`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <p className="text-sm text-gray-400">Upload Photo</p>
            )}
            <input
              type="file"
              id="profileImageInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="font-semibold text-white">Change</span>
              </div>
            )}
          </div>

          <h3 className="mb-2 text-2xl font-semibold">
            @{userProfile?.username}
          </h3>
          <p className="px-4 mb-4 text-center text-gray-400">
            {userProfile?.bio || 'No bio added yet.'}
          </p>
          <p className="text-lg font-semibold">{posts.length} Posts</p>
        </div>

        <div className="grid w-full grid-cols-3 gap-1 p-4 sm:gap-2 sm:p-6 md:w-3/4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <Image
                  src={post.imageUrl || '/placeholder.jpg'}
                  alt="Post thumbnail"
                  width={150}
                  height={150}
                  className="object-cover w-full h-auto rounded-md cursor-pointer"
                />
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-white">No posts yet.</p>
          )}
        </div>

        {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
      </div>
    </>
  ) : null
}
