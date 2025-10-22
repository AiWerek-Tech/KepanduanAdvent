import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

// Role-based access control configuration
const ROLE_PERMISSIONS = {
  ADMIN: {
    paths: ['/new-dashboard', '/new-dashboard/admin', '/api/admin', '/api/clubs', '/api/users'],
    redirect: '/new-dashboard'
  },
  MASTER_GUIDE: {
    paths: ['/new-dashboard', '/new-dashboard/club', '/api/club', '/api/members'],
    redirect: '/new-dashboard'
  },
  CMG: {
    paths: ['/new-dashboard', '/api/materials', '/api/progress'],
    redirect: '/new-dashboard'
  },
  PATHFINDER: {
    paths: ['/pathfinder', '/api/materials', '/api/progress', '/api/reflections'],
    redirect: '/pathfinder'
  },
  ADVENTURER: {
    paths: ['/new-dashboard', '/api/materials', '/api/progress', '/api/reflections'],
    redirect: '/new-dashboard'
  },
  CONTRIBUTOR: {
    paths: ['/new-dashboard', '/api/materials', '/api/progress'],
    redirect: '/new-dashboard'
  }
}

// Position-based permissions for club management
const POSITION_PERMISSIONS = {
  DIRECTOR: ['club:manage', 'members:manage', 'activities:manage', 'certificates:issue'],
  VICE_DIRECTOR: ['members:view', 'activities:manage', 'certificates:view'],
  SECRETARY: ['members:view', 'activities:view', 'reports:view'],
  TREASURER: ['members:view', 'dues:manage'],
  CHAPLAIN: ['members:view', 'spiritual:manage'],
  INSTRUCTOR: ['materials:manage', 'progress:validate'],
  MENTOR: ['progress:view', 'reflections:view', 'members:guide'],
  STAFF: ['members:view', 'activities:view'],
  MEMBER: ['dashboard:view', 'materials:view', 'progress:track']
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    return NextResponse.next()
  }

  // Allow access to static files and API routes
  if (pathname.startsWith('_next') || pathname.startsWith('/api') || pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userRole = payload.role as string

    // Check if user has permission for this path
    const roleConfig = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]
    
    if (!roleConfig) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based routing logic
    if (userRole === 'PATHFINDER') {
      // Pathfinder users should only access /pathfinder routes
      if (pathname.startsWith('/new-dashboard') || pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/pathfinder', request.url))
      }
      // Allow access to /pathfinder routes
      if (pathname.startsWith('/pathfinder')) {
        return NextResponse.next()
      }
    } else {
      // Other roles (ADMIN, MASTER_GUIDE, etc.) should use /new-dashboard
      if (pathname.startsWith('/pathfinder')) {
        return NextResponse.redirect(new URL('/new-dashboard', request.url))
      }
      // Allow access to /new-dashboard routes
      if (pathname.startsWith('/new-dashboard') || pathname.startsWith('/dashboard')) {
        return NextResponse.next()
      }
    }

    // Allow access to other authorized paths
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}