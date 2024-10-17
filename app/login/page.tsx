// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'

// export default async function LoginPage() {
//   const supabase = createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

// if (user) {
//   return redirect('/feed')
// }
//   return (
//     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-red-600 font-mono">
//           Sign in to your account
//         </h2>
//       </div>
//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form className="space-y-6">
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium leading-6 text-red-600 font-mono"
//           >
//             email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             required
//             className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
//             placeholder="m@example.com"
//           />
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium leading-6 text-red-600 font-mono"
//           >
//             password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             required
//             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 font-mono"
//           />
//           <button
//             className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
//             formAction={login}
//           >
//             Log in
//           </button>
//           <div className="mt-4 text-center text-sm font-mono">
//             Don&apos;t have an account?{' '}
//             <button formAction={signup} className="underline">
//               Sign up
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

'use client'

import logo from '@/public/assets/logo.png'
import { createClient } from '@/utils/supabase/client' // Use client version
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import Box from '@mui/joy/Box'
import CssBaseline from '@mui/joy/CssBaseline'
import GlobalStyles from '@mui/joy/GlobalStyles'
import IconButton, { IconButtonProps } from '@mui/joy/IconButton'
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles'
import Typography from '@mui/joy/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light')
        onClick?.(event)
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  )
}

const customTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: '#1976d2',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          500: '#90caf9',
        },
      },
    },
  },
  cssVarPrefix: 'my-theme',
})

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/feed') // Redirect after successful login
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/feed') // Redirect after successful signup
    }
  }

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
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
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(240 240 240 / 0.4)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
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
              <Typography level="title-lg">wkndgram</Typography>
            </Box>
            <ColorSchemeToggle />
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
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-red-600 font-mono">
                  Sign in to your account
                </h2>
              </div>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-red-600 font-mono"
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
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-red-600 font-mono"
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
                    Log in
                  </button>
                </form>
                <div className="mt-4 text-center text-sm font-mono">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={handleSignUp}
                    className="underline"
                    type="button"
                  >
                    Sign up
                  </button>
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
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1573247318220-36d3269fbff7?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1596633313465-1256feb1c6d9?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          },
        })}
      />
    </CssVarsProvider>
  )
}
