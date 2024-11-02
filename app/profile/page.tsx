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
      <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-6">
        <div className="flex flex-col items-center w-full sm:w-1/2 lg:w-1/4 text-white mb-6">
          <div
            onClick={() =>
              document.getElementById('profileImageInput')?.click()
            }
            className="relative w-32 h-32 mb-4 rounded-full bg-gray-600 cursor-pointer flex items-center justify-center"
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
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">Change</span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-semibold mb-2">
            @{userProfile?.username}
          </h3>
          <p className="text-gray-400 mb-4 text-center px-4">
            {userProfile?.bio || 'No bio added yet.'}
          </p>
          <p className="text-lg font-semibold">{posts.length} Posts</p>
        </div>

        <div className="w-full grid grid-cols-3 gap-1 sm:gap-2 p-4 sm:p-6 md:w-3/4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <Image
                  src={post.imageUrl || '/placeholder.jpg'}
                  alt="Post thumbnail"
                  width={150}
                  height={150}
                  className="rounded-md object-cover cursor-pointer w-full h-auto"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-white col-span-3">No posts yet.</p>
          )}
        </div>

        {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
      </div>
    </>
  ) : null
}
