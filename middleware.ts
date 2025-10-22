import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  console.log('Middleware: Processing pathname:', pathname, 'Token exists:', !!token)

  // API routes should not be redirected
  if (pathname.startsWith('/api')) {
    console.log('Middleware: API route, allowing')
    return NextResponse.next()
  }

  // Static files and public assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/public')) {
    console.log('Middleware: Static file, allowing')
    return NextResponse.next()
  }

  // Allow dashboard access - let the page component handle auth
  if (pathname === '/dashboard' || pathname === '/new-dashboard') {
    console.log('Middleware: Dashboard access detected, allowing (no redirect)')
    return NextResponse.next()
  }

  // Public routes - always allow access
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/home') {
    console.log('Middleware: Public route, checking auth state')
    // If user has valid token and accessing login/register, redirect to home
    if (token && (pathname === '/login' || pathname === '/register')) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        if (decoded && decoded.userId) {
          console.log('Middleware: Redirecting authenticated user from', pathname, 'to home')
          return NextResponse.redirect(new URL('/home', request.url))
        }
      } catch (error) {
        console.log('Middleware: Invalid token, allowing access to login')
        // Clear invalid token
        const response = NextResponse.next()
        response.cookies.delete('token')
        return response
      }
    }
    console.log('Middleware: Allowing access to public route:', pathname)
    return NextResponse.next()
  }

  // Protected routes - check if user has token
  if (!token) {
    console.log('Middleware: No token for protected route:', pathname, 'redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded && decoded.userId) {
      console.log('Middleware: Valid token, allowing access to:', pathname)
      return NextResponse.next()
    } else {
      throw new Error('Invalid token structure')
    }
  } catch (error) {
    console.log('Middleware: Invalid token, clearing and redirecting to login')
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}