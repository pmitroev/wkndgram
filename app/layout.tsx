'use client'

import { Navbar } from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import { AuthProvider } from './context/AuthContext'
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
        <AuthProvider>
          {showNavbar && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
