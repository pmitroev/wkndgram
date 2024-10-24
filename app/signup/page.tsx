'use client'

import logo from '@/public/assets/logo.png'
import { createClient } from '@/utils/supabase/client' // Use client version
import Box from '@mui/joy/Box'
import CssBaseline from '@mui/joy/CssBaseline'
import GlobalStyles from '@mui/joy/GlobalStyles'
import Typography from '@mui/joy/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure password has minimum length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    // Attempt to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    )

    // Handle any sign-up errors
    if (signUpError) {
      console.error('Sign-up error:', signUpError)
      setError(signUpError.message)
      return
    }

    // If sign-up succeeds, insert user into `users` table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: signUpData.user?.id,
        email,
        username,
      },
    ])

    // Handle errors during user insertion
    if (insertError) {
      console.error('Insert error:', insertError)
      setError(insertError.message)
      return
    }

    // Redirect after successful signup and insertion
    router.push('/feed')
  }

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={{
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0 0 0 / .85)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <Link
                className="hover:scale-110 transition-transform duration-300 ease-in-out"
                href="/"
              >
                <Image width={50} src={logo} alt="feed" />
              </Link>
              <Typography sx={{ color: 'white' }} level="title-lg">
                wkndgram
              </Typography>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
            }}
          >
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-red-600 font-mono">
                  Create your new account
                </h2>
              </div>
              <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignUp} className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm text-left font-medium leading-6 text-red-600 font-mono"
                  >
                    email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
                    placeholder="m@example.com"
                  />
                  <label
                    htmlFor="username"
                    className="block text-sm text-left font-medium leading-6 text-red-600 font-mono"
                  >
                    username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
                  />
                  <label
                    htmlFor="password"
                    className="block text-sm text-left font-medium leading-6 text-red-600 font-mono"
                  >
                    password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Sign Up
                  </button>
                </form>
                <div className="mt-4 text-center text-white text-sm font-mono">
                  Already have an account?{' '}
                  <Link className="hover:text-red-600" href="/login">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © wkndgram {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1596633313465-1256feb1c6d9?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        }}
      />
    </>
  )
}
