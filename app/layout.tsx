'use client'

import { Navbar } from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const showNavbar = pathname !== '/login' && pathname !== '/signup'

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  )
}
