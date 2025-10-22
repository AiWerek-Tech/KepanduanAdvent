import { PDFGenerator } from '@/lib/pdf-generator';
import { db } from '@/lib/db';

export interface CertificateData {
  userId: string;
  type: string;
  title: string;
  description?: string;
  recipientName: string;
  issuedDate: Date;
  expiresAt?: Date;
}

export class CertificateService {
  static async generateCertificate(data: CertificateData): Promise<{ pdfBuffer: Buffer; qrCode: string }> {
    return await PDFGenerator.generateCertificate(data);
  }

  static async saveCertificate(
    userId: string,
    type: string,
    title: string,
    description: string | undefined,
    qrCode: string,
    pdfUrl: string,
    expiresAt?: Date
  ) {
    return await db.certificate.create({
      data: {
        userId,
        type,
        title,
        description,
        qrCode,
        pdfUrl,
        expiresAt,
      },
    });
  }

  static async verifyCertificate(qrCode: string) {
    const certificate = await db.certificate.findUnique({
      where: { qrCode },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!certificate) {
      return null;
    }

    // Check if certificate is expired
    if (certificate.expiresAt && certificate.expiresAt < new Date()) {
      return {
        ...certificate,
        status: 'expired',
      };
    }

    // Check if certificate is active
    if (!certificate.isActive) {
      return {
        ...certificate,
        status: 'inactive',
      };
    }

    return {
      ...certificate,
      status: 'valid',
    };
  }

  static async getUserCertificates(userId: string) {
    return await db.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  static async getAllCertificates() {
    return await db.certificate.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  static async revokeCertificate(certificateId: string) {
    return await db.certificate.update({
      where: { id: certificateId },
      data: { isActive: false },
    });
  }
}