'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Shield, QrCode, Download, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Certificate {
  id: string;
  type: string;
  title: string;
  description?: string;
  qrCode: string;
  pdfUrl: string;
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  };
  status?: 'valid' | 'expired' | 'inactive';
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const qrCode = params.qrCode as string;
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      verifyCertificate();
    }
  }, [qrCode]);

  const verifyCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/verify/${qrCode}`);
      const data = await response.json();
      
      if (data.success) {
        setCertificate(data.certificate);
      } else {
        setError(data.error || 'Sertifikat tidak ditemukan');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setError('Terjadi kesalahan saat memverifikasi sertifikat');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (cert: Certificate) => {
    if (cert.status === 'expired') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Kadaluarsa
        </Badge>
      );
    }
    if (cert.status === 'inactive' || !cert.isActive) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Tidak Aktif
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Valid
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADVENTURER: 'bg-blue-100 text-blue-800',
      PATHFINDER: 'bg-green-100 text-green-800',
      CMG: 'bg-yellow-100 text-yellow-800',
      MASTER_GUIDE: 'bg-purple-100 text-purple-800',
      CONTRIBUTOR: 'bg-gray-100 text-gray-800',
      ADMIN: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[role] || 'bg-gray-100 text-gray-800'}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sertifikat Tidak Valid
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {error || 'Sertifikat tidak ditemukan atau tidak valid.'}
            </p>
            <Button asChild>
              <a href="/">Kembali ke Beranda</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verifikasi Sertifikat
          </h1>
          <p className="text-lg text-gray-600">
            Verifikasi keaslian sertifikat kepanikan
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{certificate.title}</CardTitle>
                <CardDescription className="text-lg">{certificate.type}</CardDescription>
              </div>
              {getStatusBadge(certificate)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pemegang Sertifikat */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pemegang Sertifikat</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                    <p className="font-medium">{certificate.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium">{certificate.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Peran</p>
                    {getRoleBadge(certificate.user.role)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ID Sertifikat</p>
                    <p className="font-mono text-sm">{certificate.qrCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Sertifikat */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informasi Sertifikat</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Dikeluarkan</p>
                    <p className="font-medium">
                      {new Date(certificate.issuedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {certificate.expiresAt && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tanggal Kadaluarsa</p>
                      <p className="font-medium">
                        {new Date(certificate.expiresAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
                
                {certificate.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">Deskripsi</p>
                    <p className="text-gray-800">{certificate.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Verifikasi */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Sertifikat Terverifikasi</p>
                  <p className="text-sm text-blue-700">
                    Sertifikat ini valid dan terdaftar dalam sistem Kepanduan Advent.
                  </p>
                </div>
              </div>
            </div>

            {/* Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Unduh PDF
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buka di Tab Baru
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>QR Code: {certificate.qrCode}</p>
          <p className="mt-2">
            Diverifikasi pada {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}