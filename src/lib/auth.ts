import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
  id: string
  email: string
  role: string
  clubId?: string
  iat?: number
  exp?: number
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value
  return token || null
}

export function getUserFromRequest(request: NextRequest): { user: JWTPayload } | null {
  const token = getTokenFromRequest(request)
  if (!token) return null
  
  try {
    const payload = verifyToken(token)
    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    }
  } catch (error) {
    return null
  }
}

export function createAuthCookie(token: string) {
  return {
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  }
}

export function clearAuthCookie() {
  return {
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }
}

// NextAuth compatibility exports
export const authOptions = {
  secret: JWT_SECRET,
  providers: [],
}

export const auth = async (request?: NextRequest) => {
  if (!request) {
    // For client-side usage, try to get token from cookies
    if (typeof window !== 'undefined') {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]
      if (!token) return null
      
      try {
        const payload = verifyToken(token)
        return {
          user: {
            id: payload.id,
            email: payload.email,
            role: payload.role
          }
        }
      } catch (error) {
        return null
      }
    }
    return null
  }
  
  // For server-side usage
  const token = getTokenFromRequest(request)
  if (!token) return null
  
  try {
    const payload = verifyToken(token)
    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    }
  } catch (error) {
    return null
  }
}