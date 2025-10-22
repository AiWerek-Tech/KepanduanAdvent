'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  Download, 
  Play, 
  FileText, 
  Headphones,
  CheckCircle,
  Circle,
  Clock,
  Star,
  Filter,
  Heart,
  ArrowLeft
} from 'lucide-react'

interface Material {
  id: string
  title: string
  description: string
  content: string
  pdfUrl: string
  audioUrl: string
  videoUrl: string
  category: string
  classLevel: string
  subClass: string
  track: string
  order: number
  isRequired: boolean
  assignments: any[]
  _count: {
    assignments: number
    progress: number
  }
}

interface UserProgress {
  id: string
  materialId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completedAt: string | null
  material: {
    id: string
    title: string
    category: string
    classLevel: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedClassLevel, setSelectedClassLevel] = useState('all')
  const router = useRouter()

  useEffect(() => {
    fetchMaterials()
    fetchProgress()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress')
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const updateProgress = async (materialId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ materialId, status }),
      })
      
      if (response.ok) {
        fetchProgress() // Refresh progress
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getProgressStatus = (materialId: string) => {
    const progress = userProgress.find(p => p.materialId === materialId)
    return progress?.status || 'NOT_STARTED'
  }

  const getFilteredMaterials = () => {
    return materials.filter(material => {
      const categoryMatch = selectedCategory === 'all' || material.category === selectedCategory
      const classLevelMatch = selectedClassLevel === 'all' || material.classLevel === selectedClassLevel
      return categoryMatch && classLevelMatch
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const categories = Array.from(new Set(materials.map(m => m.category)))
  const classLevels = Array.from(new Set(materials.map(m => m.classLevel)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const filteredMaterials = getFilteredMaterials()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/new-dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Materi Pembelajaran</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <Select value={selectedClassLevel} onValueChange={setSelectedClassLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tingkatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tingkatan</SelectItem>
                    {classLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">Total Materi</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{filteredMaterials.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-800">Selesai</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.filter(p => p.status === 'COMPLETED').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-gray-800">Dalam Proses</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.filter(p => p.status === 'IN_PROGRESS').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProgress.length > 0 
                      ? Math.round((userProgress.filter(p => p.status === 'COMPLETED').length / userProgress.length) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Materials Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const status = getProgressStatus(material.id)
                return (
                  <motion.div
                    key={material.id}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                              {material.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {material.description}
                            </CardDescription>
                          </div>
                          <div className="ml-2">
                            {getStatusIcon(status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className={`text-xs ${getStatusColor(status)}`}>
                            {status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {material.classLevel.replace('_', ' ')}
                          </Badge>
                          {material.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Wajib
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4" />
                            <span>{material.category}</span>
                          </div>
                          
                          {material.subClass && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Heart className="w-4 h-4" />
                              <span>{material.subClass}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="w-4 h-4" />
                            <span>{material._count.assignments} tugas</span>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            {material.content && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => updateProgress(material.id, 'IN_PROGRESS')}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Baca
                              </Button>
                            )}
                            
                            {material.pdfUrl && (
                              <Button size="sm" variant="outline" className="flex-1">
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            )}
                            
                            {material.audioUrl && (
                              <Button size="sm" variant="outline" className="flex-1">
                                <Headphones className="w-4 h-4 mr-1" />
                                Audio
                              </Button>
                            )}
                            
                            {material.videoUrl && (
                              <Button size="sm" variant="outline" className="flex-1">
                                <Play className="w-4 h-4 mr-1" />
                                Video
                              </Button>
                            )}
                          </div>
                          
                          {status !== 'COMPLETED' && (
                            <Button
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full"
                              onClick={() => updateProgress(material.id, 'COMPLETED')}
                            >
                              Tandai Selesai
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}