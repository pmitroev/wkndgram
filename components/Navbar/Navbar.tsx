'use client'

import logo from '@/public/assets/logo.png'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Navbar() {
  const supabase = createClient()
  // State now can store either a User or null
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  // Fetch the user from Supabase auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null) // Set user if exists, otherwise null
    }
    fetchUser()
  })

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login') // Redirect to login after logging out
  }

  return (
    <div className="w-full flex items-center justify-between px-5">
      <Link
        className="text-red-800 text hover:text-red-600 hover:scale-110 transition-transform duration-300 ease-in-out font-mono"
        href="/feed"
      >
        #feed
      </Link>

      <Link
        className="hover:scale-110 transition-transform duration-300 ease-in-out"
        href="/"
      >
        <Image width={80} height={30} src={logo} alt="feed" />
      </Link>

      {/* If user is logged in, show dropdown; otherwise, show sign-in link */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-red-800 text hover:text-red-600 hover:scale-110 transition-transform duration-300 ease-in-out font-mono"
          >
            {user.email}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-red-800 shadow-md rounded-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-black hover:bg-red-700 rounded-lg font-mono text-center"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-black hover:bg-red-700 rounded-lg font-mono text-center"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          className="text-red-800 text hover:text-red-600 hover:scale-110 transition-transform duration-300 ease-in-out font-mono"
          href="/login"
        >
          #sign in
        </Link>
      )}
    </div>
  )
}
