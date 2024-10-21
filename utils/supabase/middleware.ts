import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          // Update the response with the new cookies
          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid adding logic here that could affect session handling
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if user is not logged in and accessing a protected route
  const protectedRoutes = ['/feed', '/profile', '/create-post']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Add user session information to the response cookies
  if (user) {
    supabaseResponse.cookies.set('sb-access-token', user.access_token)
    supabaseResponse.cookies.set('sb-refresh-token', user.refresh_token)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/feed', '/profile', '/create-post', '/'], // Apply middleware on these routes
}
