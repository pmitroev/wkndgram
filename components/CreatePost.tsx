'use client'

import { useAuth } from '@/app/context/AuthContext'
import PostCard from '@/components/PostCardPreview'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function CreatePost() {
  const { toast } = useToast()
  const supabase = createClient()
  const { user } = useAuth()
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', user?.id)
          .single()

        if (data) {
          setUsername(data.username)
        } else if (error) {
          console.error('Error fetching username: ', error.message)
        }
      }
    }

    fetchUsername()
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!user) {
        setError('User not logged in')
        return
      }

      let uploadedImageUrl = null

      if (imageFile) {
        const filePath = `public/${Date.now()}_${imageFile.name}`

        // Upload the image to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(uploadData.path)

        uploadedImageUrl = publicUrlData?.publicUrl || null
      }

      // Insert the post into the database with the image URL
      const { error: postError } = await supabase.from('posts').insert([
        {
          description,
          imageUrl: uploadedImageUrl, // URL from the upload (or null if no image)
          likes: 0,
          username: username, // Ensure the username comes from the user context
          userid: user.id, // Ensure you store the user's ID for reference
          created_at: new Date(), // Track when the post is created
        },
      ])

      if (postError) throw postError

      // Reset the form after successful submission
      setDescription('')
      setImageFile(null)
      setPreviewUrl(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }

    toast({
      title: 'Success!',
      description: 'Post successfully added.',
    })

    router.push('/feed')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file)) // For showing image preview
    }
  }

  return user ? (
    <div className="flex min-h-full flex-col lg:flex-row flex-1 justify-center px-6 py-12 lg:px-8">
      {/* Form Section */}
      <div className="w-full lg:max-w-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-2">
            <input
              className="flex-grow rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description..."
            />

            {/* Upload Button */}
            <Button
              className="hover:bg-red-600 h-fit"
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddToPhotosIcon />}
              color="error"
            >
              Upload
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </Button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            className="mt-4 flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            type="submit"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* Preview section */}
      <div className="w-full lg:max-w-sm mt-6 lg:mt-0 lg:ml-10">
        <h3 className="text-left text-lg font-bold leading-9 tracking-tight text-red-600 font-mono">
          How your post will look like:
        </h3>
        <PostCard
          post={{
            content: description || 'Description goes here...',
            imageUrl: previewUrl || null,
            user: {
              username: username || 'Fetching...',
            },
          }}
        />
      </div>
    </div>
  ) : null
}
