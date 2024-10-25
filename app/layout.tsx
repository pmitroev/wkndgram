'use client'

import { Navbar } from '@/components/Navbar'
import Head from 'next/head'
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
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="font-mono">
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
      </body>
    </html>
  )
}
