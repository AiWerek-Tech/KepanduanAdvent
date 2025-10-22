import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CertificateService } from '@/lib/certificate';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Admin and Master Guide can revoke certificates
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_GUIDE') {
      return NextResponse.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        error: 'Certificate ID is required' 
      }, { status: 400 });
    }

    const certificate = await CertificateService.revokeCertificate(id);

    return NextResponse.json({
      success: true,
      certificate,
    });

  } catch (error) {
    console.error('Certificate revocation error:', error);
    return NextResponse.json({ 
      error: 'Failed to revoke certificate' 
    }, { status: 500 });
  }
}