'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Award, Download, QrCode, CheckCircle, ExternalLink } from 'lucide-react';

export default function DemoCertificatesPage() {
  const [formData, setFormData] = useState({
    type: 'Adventurer',
    title: 'Kelulusan Adventurer',
    description: 'Telah menyelesaikan semua persyaratan Adventurer dengan baik',
    recipientName: 'John Doe',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
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
        setGeneratedCertificate(data.certificate);
        toast({
          title: "Success",
          description: "Sertifikat berhasil dibuat!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal membuat sertifikat',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat sertifikat",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demo Sertifikat Kepanduan
          </h1>
          <p className="text-lg text-gray-600">
            Test pembuatan dan verifikasi sertifikat digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Generate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Generate Sertifikat
              </CardTitle>
              <CardDescription>
                Buat sertifikat demo untuk testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">Tipe Sertifikat</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Nama Penerima</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Membuat...' : 'Generate Sertifikat'}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle>Hasil Generate</CardTitle>
              <CardDescription>
                Informasi sertifikat yang berhasil dibuat
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCertificate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Sertifikat Berhasil Dibuat</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {generatedCertificate.id}</div>
                    <div><strong>Tipe:</strong> {generatedCertificate.type}</div>
                    <div><strong>Judul:</strong> {generatedCertificate.title}</div>
                    <div><strong>QR Code:</strong> {generatedCertificate.qrCode}</div>
                    <div><strong>Dibuat:</strong> {new Date(generatedCertificate.issuedAt).toLocaleString('id-ID')}</div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generatedCertificate.pdfUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Unduh PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/verify-certificate/${generatedCertificate.qrCode}`, '_blank')}
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      Verifikasi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Belum ada sertifikat yang dibuat</p>
                  <p className="text-sm">Generate sertifikat untuk melihat hasilnya</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Petunjuk Penggunaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">1. Generate Sertifikat</h4>
                <p className="text-sm text-gray-600">
                  Isi form di sebelah kiri dengan data sertifikat yang diinginkan, 
                  lalu klik tombol "Generate Sertifikat".
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Unduh & Verifikasi</h4>
                <p className="text-sm text-gray-600">
                  Setelah sertifikat dibuat, Anda dapat mengunduh file PDF 
                  atau memverifikasi keasliannya melalui QR code.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Verifikasi Publik</h4>
                <p className="text-sm text-gray-600">
                  Siapa saja dapat memindai QR code atau membuka link verifikasi 
                  untuk memastikan keaslian sertifikat.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">4. Manajemen Sertifikat</h4>
                <p className="text-sm text-gray-600">
                  Admin dan Master Guide dapat mengelola semua sertifikat 
                  melalui halaman manajemen sertifikat.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}