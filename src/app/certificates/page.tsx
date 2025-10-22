'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Award, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Plus,
  QrCode,
  FileText,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

interface Certificate {
  id: string
  type: string
  title: string
  description?: string
  qrCode: string
  pdfUrl: string
  issuedAt: string
  expiresAt?: string
  isActive: boolean
  user: {
    name: string
    email: string
    role: string
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [certificateType, setCertificateType] = useState<string>('')
  const [certificateTitle, setCertificateTitle] = useState<string>('')
  const [certificateDescription, setCertificateDescription] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [users, setUsers] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchCertificates()
    fetchUserData()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Gagal memuat sertifikat')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setIsAdmin(['ADMIN', 'MASTER_GUIDE'].includes(data.user.role))
        
        // Fetch users if admin
        if (['ADMIN', 'MASTER_GUIDE'].includes(data.user.role)) {
          const usersResponse = await fetch('/api/members')
          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            setUsers(usersData.members || [])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleCreateCertificate = async () => {
    if (!selectedUser || !certificateType || !certificateTitle.trim()) {
      toast.error('Silakan lengkapi semua field yang diperlukan')
      return
    }

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          type: certificateType,
          title: certificateTitle.trim(),
          description: certificateDescription.trim()
        })
      })

      if (response.ok) {
        const newCertificate = await response.json()
        setCertificates(prev => [newCertificate.certificate, ...prev])
        setCertificateTitle('')
        setCertificateDescription('')
        setSelectedUser('')
        setCertificateType('')
        setIsCreateDialogOpen(false)
        toast.success('Sertifikat berhasil dibuat')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal membuat sertifikat')
      }
    } catch (error) {
      console.error('Error creating certificate:', error)
      toast.error('Terjadi kesalahan saat membuat sertifikat')
    }
  }

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      const response = await fetch(certificate.pdfUrl)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certificate-${certificate.qrCode}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Sertifikat berhasil diunduh')
      } else {
        toast.error('Gagal mengunduh sertifikat')
      }
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Terjadi kesalahan saat mengunduh sertifikat')
    }
  }

  const handleVerifyCertificate = async (qrCode: string) => {
    try {
      const response = await fetch(`/api/certificates/verify/${qrCode}`)
      if (response.ok) {
        const data = await response.json()
        toast.success(`Sertifikat valid: ${data.certificate.title}`)
      } else {
        toast.error('Sertifikat tidak valid atau tidak ditemukan')
      }
    } catch (error) {
      console.error('Error verifying certificate:', error)
      toast.error('Gagal memverifikasi sertifikat')
    }
  }

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || certificate.type === filterType
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && certificate.isActive) ||
                         (filterStatus === 'expired' && certificate.expiresAt && new Date(certificate.expiresAt) < new Date()) ||
                         (filterStatus === 'inactive' && !certificate.isActive)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const certificateTypes = Array.from(new Set(certificates.map(c => c.type)))

  const getCertificateTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'COMPLETION': 'bg-green-100 text-green-800',
      'ACHIEVEMENT': 'bg-yellow-100 text-yellow-800',
      'LEADERSHIP': 'bg-blue-100 text-blue-800',
      'SERVICE': 'bg-purple-100 text-purple-800',
      'EXCELLENCE': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (certificate: Certificate) => {
    if (!certificate.isActive) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    if (certificate.expiresAt && new Date(certificate.expiresAt) < new Date()) {
      return <Clock className="h-4 w-4 text-orange-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusText = (certificate: Certificate) => {
    if (!certificate.isActive) return 'Tidak Aktif'
    if (certificate.expiresAt && new Date(certificate.expiresAt) < new Date()) return 'Kadaluarsa'
    return 'Aktif'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sertifikat</h1>
          <p className="text-gray-600 mt-1">Kelola dan verifikasi sertifikat kepanduan</p>
        </div>
        
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Buat Sertifikat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Buat Sertifikat Baru</DialogTitle>
                <DialogDescription>
                  Buat sertifikat untuk mengakui pencapaian anggota
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user">Pilih Anggota</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih anggota..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-gray-500">
                              {user.email} • {user.role}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Tipe Sertifikat</Label>
                  <Select value={certificateType} onValueChange={setCertificateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPLETION">Penyelesaian</SelectItem>
                      <SelectItem value="ACHIEVEMENT">Pencapaian</SelectItem>
                      <SelectItem value="LEADERSHIP">Kepemimpinan</SelectItem>
                      <SelectItem value="SERVICE">Pelayanan</SelectItem>
                      <SelectItem value="EXCELLENCE">Keunggulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Judul Sertifikat</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul sertifikat..."
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi pencapaian atau alasan pemberian sertifikat..."
                    value={certificateDescription}
                    onChange={(e) => setCertificateDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateCertificate}>
                    Buat Sertifikat
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari sertifikat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {certificateTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="expired">Kadaluarsa</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
                setFilterStatus('all')
              }}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="grid gap-4">
        {filteredCertificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {certificates.length === 0 ? 'Belum Ada Sertifikat' : 'Tidak Ada Sertifikat yang Cocok'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {certificates.length === 0 
                  ? 'Belum ada sertifikat yang diterbitkan'
                  : 'Coba ubah filter atau kata kunci pencarian'
                }
              </p>
              {certificates.length === 0 && isAdmin && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Sertifikat Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      {certificate.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCertificateTypeColor(certificate.type)}>
                        {certificate.type}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(certificate)}
                        {getStatusText(certificate)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(certificate.issuedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {certificate.description && (
                  <p className="text-gray-700 mb-4">{certificate.description}</p>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Penerima: {certificate.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Peran: {certificate.user.role}</span>
                  </div>
                  {certificate.expiresAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Berlaku hingga: {new Date(certificate.expiresAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <QrCode className="h-4 w-4" />
                    <span>Kode: {certificate.qrCode}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyCertificate(certificate.qrCode)}
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      Verifikasi
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(certificate.pdfUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadCertificate(certificate)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Unduh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistik Sertifikat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{certificates.length}</div>
                <div className="text-sm text-gray-600">Total Sertifikat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.isActive && (!c.expiresAt || new Date(c.expiresAt) >= new Date())).length}
                </div>
                <div className="text-sm text-gray-600">Sertifikat Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {certificateTypes.length}
                </div>
                <div className="text-sm text-gray-600">Tipe Sertifikat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(certificates.map(c => c.user.id)).size}
                </div>
                <div className="text-sm text-gray-600">Penerima Unik</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}