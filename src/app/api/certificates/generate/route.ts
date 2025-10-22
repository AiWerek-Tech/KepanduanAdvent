import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CertificateService } from '@/lib/certificate';
import { PDFGenerator } from '@/lib/pdf-generator';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, description } = await request.json();

    if (!type || !title) {
      return NextResponse.json({ 
        error: 'Certificate type and title are required' 
      }, { status: 400 });
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate certificate
    const certificateData = {
      userId: user.id,
      type,
      title,
      description,
      recipientName: user.name || 'Unknown',
      issuedDate: new Date(),
    };

    const { pdfBuffer, qrCode } = await CertificateService.generateCertificate(certificateData);

    // Save PDF file
    const pdfUrl = await PDFGenerator.saveCertificatePDF(pdfBuffer, qrCode);

    // Save certificate to database
    const certificate = await CertificateService.saveCertificate(
      user.id,
      type,
      title,
      description,
      qrCode,
      pdfUrl
    );

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        type: certificate.type,
        title: certificate.title,
        description: certificate.description,
        qrCode: certificate.qrCode,
        pdfUrl: certificate.pdfUrl,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
      },
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate certificate' 
    }, { status: 500 });
  }
}