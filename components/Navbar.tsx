'use client'

import { useAuth } from '@/app/context/AuthContext'
import logo from '@/public/assets/logo.png'
import Skeleton from '@mui/material/Skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="w-full fixed top-0 left-0 flex items-center justify-between px-5 bg-black z-50">
      {/* Left section: Link to feed */}
      <div className="flex-1">
        <Link
          className="text-red-800 hover:text-red-600 hover:scale-110 transition-transform duration-300 ease-in-out font-mono"
          href="/feed"
        >
          #feed
        </Link>
      </div>

      {/* Center: Logo */}
      <div className="flex-1 flex justify-center">
        <Link
          className="hover:scale-110 transition-transform duration-300 ease-in-out"
          href="/"
        >
          <Image width={80} height={30} src={logo} alt="feed" />
        </Link>
      </div>

      {/* Right section: user dropdown or sign in */}
      <div className="flex-1 flex justify-end">
        {loading ? (
          <Skeleton
            variant="text"
            sx={{ bgcolor: 'gray' }}
            width={80}
            height={30}
          />
        ) : user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-red-800 hover:text-red-600 font-mono"
            >
              #account
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
            className="text-red-800 hover:text-red-600 font-mono"
            href="/login"
          >
            #signin
          </Link>
        )}
      </div>
    </div>
  )
}
