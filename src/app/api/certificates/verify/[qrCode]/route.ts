import { NextRequest, NextResponse } from 'next/server'
import { CertificateService } from '@/lib/certificate'

export async function GET(
  request: NextRequest,
  { params }: { params: { qrCode: string } }
) {
  try {
    const { qrCode } = params

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR Code is required' },
        { status: 400 }
      )
    }

    const certificate = await CertificateService.verifyCertificate(qrCode)

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      certificate
    })

  } catch (error) {
    console.error('Verify certificate error:', error)
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    )
  }
}