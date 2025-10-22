import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { CertificateService } from '@/lib/certificate';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT and get user
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    let certificates;
    
    if (all === 'true' && (user.role === 'ADMIN' || user.role === 'MASTER_GUIDE')) {
      // Admin and Master Guide can see all certificates
      certificates = await CertificateService.getAllCertificates();
    } else {
      // Users can only see their own certificates
      certificates = await CertificateService.getUserCertificates(user.userId);
    }

    return NextResponse.json({
      success: true,
      certificates,
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch certificates' 
    }, { status: 500 });
  }
}

// POST /api/certificates - Create new certificate (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user?.userId || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, title, description } = body;

    if (!userId || !type || !title) {
      return NextResponse.json(
        { error: 'User ID, type, and title are required' },
        { status: 400 }
      );
    }

    // Get user information for certificate
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate certificate
    const certificateData = {
      userId,
      type,
      title,
      description,
      recipientName: targetUser.name,
      issuedDate: new Date(),
      expiresAt: type === 'COMPLETION' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined // 1 year for completion certificates
    };

    const { pdfBuffer, qrCode } = await CertificateService.generateCertificate(certificateData);

    // Save PDF file
    const pdfUrl = await CertificateService.saveCertificatePDF(pdfBuffer, qrCode);

    // Save certificate to database
    const certificate = await CertificateService.saveCertificate(
      userId,
      type,
      title,
      description,
      qrCode,
      pdfUrl,
      certificateData.expiresAt
    );

    return NextResponse.json({
      success: true,
      certificate
    }, { status: 201 });

  } catch (error) {
    console.error('Create certificate error:', error);
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}