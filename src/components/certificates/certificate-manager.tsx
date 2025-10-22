'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, QrCode, Shield, CheckCircle, XCircle, Clock, Award, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
  user?: {
    name: string;
    email: string;
    role: string;
  };
  status?: 'valid' | 'expired' | 'inactive';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function CertificateManager() {
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchUser();
    fetchCertificates();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.certificates);
      } else {
        toast.error('Gagal memuat sertifikat');
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Terjadi kesalahan saat memuat sertifikat');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title) {
      toast.error('Tipe dan judul sertifikat harus diisi');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Sertifikat berhasil dibuat');
        setShowGenerateDialog(false);
        setFormData({ type: '', title: '', description: '' });
        fetchCertificates();
      } else {
        toast.error(data.error || 'Gagal membuat sertifikat');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Terjadi kesalahan saat membuat sertifikat');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeCertificate = async (certificateId: string) => {
    if (!confirm('Apakah Anda yakin ingin mencabut sertifikat ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/certificates/${certificateId}/revoke`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Sertifikat berhasil dicabut');
        fetchCertificates();
      } else {
        toast.error(data.error || 'Gagal mencabut sertifikat');
      }
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Terjadi kesalahan saat mencabut sertifikat');
    }
  };

  const getStatusBadge = (certificate: Certificate) => {
    if (certificate.status === 'expired') {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Kadaluarsa</Badge>;
    }
    if (certificate.status === 'inactive' || !certificate.isActive) {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Tidak Aktif</Badge>;
    }
    return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" /> Valid</Badge>;
  };

  const isAdminOrMasterGuide = user?.role === 'ADMIN' || user?.role === 'MASTER_GUIDE';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Sertifikat</h1>
          <p className="text-gray-600">Kelola sertifikat kepanikan</p>
        </div>
        
        {isAdminOrMasterGuide && (
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Award className="w-4 h-4 mr-2" />
                Buat Sertifikat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Sertifikat Baru</DialogTitle>
                <DialogDescription>
                  Buat sertifikat untuk pengguna yang telah menyelesaikan persyaratan
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateCertificate} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipe Sertifikat</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe sertifikat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adventurer">Adventurer</SelectItem>
                      <SelectItem value="Pathfinder">Pathfinder</SelectItem>
                      <SelectItem value="Master Guide">Master Guide</SelectItem>
                      <SelectItem value="Calon Master Guide">Calon Master Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Judul Sertifikat</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Contoh: Kelulusan Adventurer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi pencapaian atau persyaratan yang telah dipenuhi"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowGenerateDialog(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={generating}>
                    {generating ? 'Membuat...' : 'Buat Sertifikat'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="my-certificates" className="w-full">
        <TabsList>
          <TabsTrigger value="my-certificates">Sertifikat Saya</TabsTrigger>
          {isAdminOrMasterGuide && (
            <TabsTrigger value="all-certificates">Semua Sertifikat</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="my-certificates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{certificate.title}</CardTitle>
                      <CardDescription>{certificate.type}</CardDescription>
                    </div>
                    {getStatusBadge(certificate)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {certificate.description && (
                    <p className="text-sm text-gray-600">{certificate.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Dikeluarkan: {new Date(certificate.issuedAt).toLocaleDateString('id-ID')}</p>
                    {certificate.expiresAt && (
                      <p>Kadaluarsa: {new Date(certificate.expiresAt).toLocaleDateString('id-ID')}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(certificate.pdfUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Unduh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/verify-certificate/${certificate.qrCode}`, '_blank')}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {isAdminOrMasterGuide && (
          <TabsContent value="all-certificates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{certificate.title}</CardTitle>
                        <CardDescription>{certificate.type}</CardDescription>
                      </div>
                      {getStatusBadge(certificate)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {certificate.user && (
                      <div className="text-sm">
                        <p className="font-medium">{certificate.user.name}</p>
                        <p className="text-gray-600">{certificate.user.email}</p>
                        <Badge variant="outline" className="mt-1">
                          {certificate.user.role}
                        </Badge>
                      </div>
                    )}
                    
                    {certificate.description && (
                      <p className="text-sm text-gray-600">{certificate.description}</p>
                    )}
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Dikeluarkan: {new Date(certificate.issuedAt).toLocaleDateString('id-ID')}</p>
                      {certificate.expiresAt && (
                        <p>Kadaluarsa: {new Date(certificate.expiresAt).toLocaleDateString('id-ID')}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(certificate.pdfUrl, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Unduh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/verify-certificate/${certificate.qrCode}`, '_blank')}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      {certificate.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeCertificate(certificate.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada sertifikat</h3>
          <p className="text-gray-600">
            {isAdminOrMasterGuide 
              ? 'Buat sertifikat untuk pengguna yang telah menyelesaikan persyaratan.'
              : 'Selesaikan persyaratan untuk mendapatkan sertifikat.'}
          </p>
        </div>
      )}
    </div>
  );
}