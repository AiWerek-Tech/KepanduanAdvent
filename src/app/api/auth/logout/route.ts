import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: 'Logout successful'
  })

  // Clear the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: false, // Set to false for development
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}