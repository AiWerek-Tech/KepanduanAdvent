'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Upload, 
  Save, 
  Edit, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Flag,
  Calendar,
  Users,
  Settings
} from 'lucide-react'

interface Club {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  flag?: string
  email?: string
  phone?: string
  address?: string
  church?: string
  district?: string
  conference?: string
  history?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    members: number
    positions: number
    activities: number
  }
}

interface ClubProfileManagerProps {
  clubId?: string
  onSave?: (club: Club) => void
}

export default function ClubProfileManager({ clubId, onSave }: ClubProfileManagerProps) {
  const [club, setClub] = useState<Club | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Club>>({})
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [flagPreview, setFlagPreview] = useState<string>('')

  useEffect(() => {
    if (clubId) {
      fetchClub()
    }
  }, [clubId])

  const fetchClub = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/clubs?id=${clubId}`)
      if (response.ok) {
        const data = await response.json()
        setClub(data.club)
        setFormData(data.club)
        if (data.club.logo) setLogoPreview(data.club.logo)
        if (data.club.flag) setFlagPreview(data.club.flag)
      }
    } catch (error) {
      console.error('Error fetching club:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFlagUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFlagPreview(result)
        setFormData(prev => ({ ...prev, flag: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const url = clubId ? `/api/clubs/${clubId}` : '/api/clubs'
      const method = clubId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setClub(data.club)
        setIsEditing(false)
        onSave?.(data.club)
      }
    } catch (error) {
      console.error('Error saving club:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(club || {})
    setIsEditing(false)
    if (club?.logo) setLogoPreview(club.logo)
    if (club?.flag) setFlagPreview(club.flag)
  }

  if (isLoading && !club) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Profil Klub</h2>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Batal
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Informasi Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak & Lokasi</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Informasi umum tentang klub Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Klub</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Masukkan nama klub"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    disabled={!isEditing}
                    placeholder="nama-klub"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Deskripsikan klub Anda"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="history">Sejarah Klub</Label>
                <Textarea
                  id="history"
                  value={formData.history || ''}
                  onChange={(e) => handleInputChange('history', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Ceritakan sejarah perjalanan klub Anda"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="church">Gereja</Label>
                  <Input
                    id="church"
                    value={formData.church || ''}
                    onChange={(e) => handleInputChange('church', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nama gereja"
                  />
                </div>
                <div>
                  <Label htmlFor="district">Distrik</Label>
                  <Input
                    id="district"
                    value={formData.district || ''}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nama distrik"
                  />
                </div>
                <div>
                  <Label htmlFor="conference">Konferens</Label>
                  <Input
                    id="conference"
                    value={formData.conference || ''}
                    onChange={(e) => handleInputChange('conference', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nama konferens"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>
                Detail kontak dan lokasi klub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="email@klub.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Branding Klub</CardTitle>
              <CardDescription>
                Logo dan bendera klub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <Label>Logo Klub</Label>
                  <div className="mt-2">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Logo</p>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="mt-2 text-sm"
                      />
                    )}
                  </div>
                </div>

                {/* Flag Upload */}
                <div>
                  <Label>Bendera Klub</Label>
                  <div className="mt-2">
                    <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {flagPreview ? (
                        <img 
                          src={flagPreview} 
                          alt="Flag preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Flag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Bendera</p>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFlagUpload}
                        className="mt-2 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Anggota</p>
                    <p className="text-3xl font-bold">{club?._count?.members || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Jabatan</p>
                    <p className="text-3xl font-bold">{club?._count?.positions || 0}</p>
                  </div>
                  <Settings className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Kegiatan</p>
                    <p className="text-3xl font-bold">{club?._count?.activities || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge className={club?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {club?.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Dibuat:</span>
                  <span className="ml-2">
                    {club?.createdAt ? new Date(club.createdAt).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Terakhir Update:</span>
                  <span className="ml-2">
                    {club?.updatedAt ? new Date(club.updatedAt).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}