'use client'

import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-mono bg-black">
        <AuthProvider>
          {showNavbar ? (
            <div className="mb-20">
              <Navbar />
            </div>
          ) : (
            ''
          )}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
