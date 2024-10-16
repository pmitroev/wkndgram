import logo from '@/public/assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
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
        <Image width={80} height={30} src={logo} alt="feed"></Image>
      </Link>
      <Link
        className="text-red-800 text hover:text-red-600 hover:scale-110 transition-transform duration-300 ease-in-out font-mono"
        href="/login"
      >
        #sign in
      </Link>
    </div>
  )
}
