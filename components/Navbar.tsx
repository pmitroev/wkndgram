'use client'

import { useAuth } from '@/app/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import logo from '@/public/logo.png'
import { Skeleton } from '@mui/material'
import { LogIn, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="w-full fixed top-0 left-0 flex items-center justify-between px-5 bg-black z-50">
      <div className="flex-1">
        <Link
          className="text-red-800 hover:text-red-600 font-mono"
          href="/feed"
        >
          #feed
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <Link href="/">
          <Image width={80} height={30} src={logo} alt="feed" />
        </Link>
      </div>

      <div className="flex-1 flex justify-end">
        {loading ? (
          <Skeleton
            variant="circular"
            sx={{ bgcolor: 'gray' }}
            width={30}
            height={30}
          />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-red-800 hover:text-red-600 font-mono">
                <User />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-red-800 text-black rounded-lg z-50 border border-black">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            className="text-red-800 hover:text-red-600 font-mono"
            href="/login"
          >
            <LogIn />
          </Link>
        )}
      </div>
    </div>
  )
}
