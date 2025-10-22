import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import QRCode from 'qrcode';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { config } from './config';

export interface CertificateData {
  userId: string;
  type: string;
  title: string;
  description?: string;
  recipientName: string;
  issuedDate: Date;
  expiresAt?: Date;
}

export class PDFGenerator {
  static async generateCertificate(data: CertificateData): Promise<{ pdfBuffer: Buffer; qrCode: string }> {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(PageSizes.A4);
      const { width, height } = page.getSize();

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Generate unique QR code
      const qrId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const verificationUrl = config.getFullUrl(`/verify-certificate/${qrId}`);
      
      // Generate QR code as base64
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      // Extract base64 data
      const qrCodeBase64 = qrCodeDataUrl.split(',')[1];
      const qrCodeImage = await pdfDoc.embedPng(qrCodeBase64);

      // Background
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.98, 0.98, 0.98),
      });

      // Decorative border
      page.drawRectangle({
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        borderColor: rgb(0.2, 0.2, 0.8),
        borderWidth: 2,
      });

      // Inner border
      page.drawRectangle({
        x: 50,
        y: 50,
        width: width - 100,
        height: height - 100,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });

      // Title
      const title = 'SERTIFIKAT KEPANDUAN';
      const titleWidth = boldFont.widthOfTextAtSize(title, 36);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 140,
        size: 36,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.8),
      });

      // Certificate type
      const typeWidth = boldFont.widthOfTextAtSize(data.type, 24);
      page.drawText(data.type, {
        x: (width - typeWidth) / 2,
        y: height - 190,
        size: 24,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Certification text
      const certText = 'Ini untuk mensertifikatkan bahwa';
      const certWidth = font.widthOfTextAtSize(certText, 16);
      page.drawText(certText, {
        x: (width - certWidth) / 2,
        y: height - 260,
        size: 16,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Recipient name
      const recipientName = data.recipientName.toUpperCase();
      const nameWidth = boldFont.widthOfTextAtSize(recipientName, 28);
      page.drawText(recipientName, {
        x: (width - nameWidth) / 2,
        y: height - 300,
        size: 28,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Description (wrapped text)
      if (data.description) {
        const lines = this.wrapText(data.description, 60, font, 14);
        lines.forEach((line, index) => {
          const lineWidth = font.widthOfTextAtSize(line, 14);
          page.drawText(line, {
            x: (width - lineWidth) / 2,
            y: height - 350 - (index * 25),
            size: 14,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
        });
      }

      // Issued date
      const issuedText = `Dikeluarkan pada: ${data.issuedDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`;
      const issuedWidth = font.widthOfTextAtSize(issuedText, 12);
      page.drawText(issuedText, {
        x: (width - issuedWidth) / 2,
        y: height - 450,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      // QR Code
      const qrSize = 80;
      page.drawImage(qrCodeImage, {
        x: width - 140,
        y: 100,
        width: qrSize,
        height: qrSize,
      });

      // QR Code text
      const qrText = 'Scan untuk verifikasi';
      const qrTextWidth = font.widthOfTextAtSize(qrText, 10);
      page.drawText(qrText, {
        x: width - 140 + (qrSize - qrTextWidth) / 2,
        y: 85,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Signature lines
      const signatureY = 150;
      
      // Left signature
      page.drawLine({
        start: { x: 150, y: signatureY },
        end: { x: 300, y: signatureY },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      const ketuaText = 'Ketua';
      const ketuaWidth = font.widthOfTextAtSize(ketuaText, 12);
      page.drawText(ketuaText, {
        x: 225 - (ketuaWidth / 2),
        y: signatureY - 20,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Right signature
      page.drawLine({
        start: { x: width - 300, y: signatureY },
        end: { x: width - 150, y: signatureY },
        thickness: 1,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      const sekretarisText = 'Sekretaris';
      const sekretarisWidth = font.widthOfTextAtSize(sekretarisText, 12);
      page.drawText(sekretarisText, {
        x: width - 225 - (sekretarisWidth / 2),
        y: signatureY - 20,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);

      return { pdfBuffer, qrCode: qrId };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate certificate PDF');
    }
  }

  static async saveCertificatePDF(pdfBuffer: Buffer, qrCode: string): Promise<string> {
    try {
      // Create certificates directory if it doesn't exist
      const certificatesDir = join(process.cwd(), 'public', 'certificates');
      await mkdir(certificatesDir, { recursive: true });

      // Save PDF file
      const fileName = `certificate-${qrCode}.pdf`;
      const filePath = join(certificatesDir, fileName);
      await writeFile(filePath, pdfBuffer);

      return `/certificates/${fileName}`;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save certificate PDF');
    }
  }

  private static wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }
}