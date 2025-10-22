'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Calendar, User, Plus, Search, Filter, Heart, Star, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Material {
  id: string
  title: string
  category: string
  classLevel: string
}

interface Reflection {
  id: string
  content: string
  createdAt: string
  material: Material
}

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [reflectionContent, setReflectionContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterClassLevel, setFilterClassLevel] = useState<string>('all')

  useEffect(() => {
    fetchReflections()
    fetchMaterials()
  }, [])

  const fetchReflections = async () => {
    try {
      const response = await fetch('/api/reflections')
      if (response.ok) {
        const data = await response.json()
        setReflections(data)
      }
    } catch (error) {
      console.error('Error fetching reflections:', error)
      toast.error('Gagal memuat refleksi')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials || [])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    }
  }

  const handleCreateReflection = async () => {
    if (!selectedMaterial || !reflectionContent.trim()) {
      toast.error('Silakan pilih materi dan isi konten refleksi')
      return
    }

    try {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId: selectedMaterial,
          content: reflectionContent.trim()
        })
      })

      if (response.ok) {
        const newReflection = await response.json()
        setReflections(prev => [newReflection, ...prev])
        setReflectionContent('')
        setSelectedMaterial('')
        setIsCreateDialogOpen(false)
        toast.success('Refleksi berhasil dibuat')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal membuat refleksi')
      }
    } catch (error) {
      console.error('Error creating reflection:', error)
      toast.error('Terjadi kesalahan saat membuat refleksi')
    }
  }

  const filteredReflections = reflections.filter(reflection => {
    const matchesSearch = reflection.material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reflection.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || reflection.material.category === filterCategory
    const matchesClassLevel = filterClassLevel === 'all' || reflection.material.classLevel === filterClassLevel
    
    return matchesSearch && matchesCategory && matchesClassLevel
  })

  const categories = Array.from(new Set(materials.map(m => m.category)))
  const classLevels = Array.from(new Set(materials.map(m => m.classLevel)))

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'IBADAH': 'bg-purple-100 text-purple-800',
      'KEPEMIMPINAN': 'bg-blue-100 text-blue-800',
      'Pelayanan': 'bg-green-100 text-green-800',
      'Karakter': 'bg-orange-100 text-orange-800',
      'Keterampilan': 'bg-red-100 text-red-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getClassLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'MINI': 'bg-pink-100 text-pink-800',
      'BASIC': 'bg-yellow-100 text-yellow-800',
      'ADVANCED': 'bg-indigo-100 text-indigo-800',
      'MASTER': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Refleksi Pribadi</h1>
          <p className="text-gray-600 mt-1">Catat pemikiran dan pembelajaran spiritual Anda</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Refleksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Buat Refleksi Baru</DialogTitle>
              <DialogDescription>
                Bagikan pemikiran dan pembelajaran Anda dari materi yang telah dipelajari
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="material">Pilih Materi</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih materi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{material.title}</span>
                          <span className="text-sm text-gray-500">
                            {material.category} • {material.classLevel}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Refleksi Anda</Label>
                <Textarea
                  id="content"
                  placeholder="Tuliskan pemikiran, pembelajaran, atau inspirasi Anda dari materi ini..."
                  value={reflectionContent}
                  onChange={(e) => setReflectionContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateReflection}>
                  Simpan Refleksi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                placeholder="Cari refleksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterClassLevel} onValueChange={setFilterClassLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                {classLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setFilterClassLevel('all')
              }}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reflections List */}
      <div className="grid gap-4">
        {filteredReflections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {reflections.length === 0 ? 'Belum Ada Refleksi' : 'Tidak Ada Refleksi yang Cocok'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {reflections.length === 0 
                  ? 'Mulai membuat refleksi pertama Anda dari materi yang telah dipelajari'
                  : 'Coba ubah filter atau kata kunci pencarian'
                }
              </p>
              {reflections.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Refleksi Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredReflections.map((reflection) => (
            <Card key={reflection.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{reflection.material.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(reflection.material.category)}>
                        {reflection.material.category}
                      </Badge>
                      <Badge className={getClassLevelColor(reflection.material.classLevel)}>
                        {reflection.material.classLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(reflection.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {reflection.content}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Materi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Refleksi Pribadi</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {reflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistik Refleksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{reflections.length}</div>
                <div className="text-sm text-gray-600">Total Refleksi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600">Kategori Dipelajari</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {classLevels.length}
                </div>
                <div className="text-sm text-gray-600">Tingkat Dipelajari</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(reflections.reduce((acc, r) => acc + r.content.length, 0) / reflections.length)}
                </div>
                <div className="text-sm text-gray-600">Rata-rata Karakter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}