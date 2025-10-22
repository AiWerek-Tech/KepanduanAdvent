'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Filter, Star, Heart, BookOpen, Users, TreePine, Hammer, Activity, Award, Download, Eye, X } from 'lucide-react'

interface Honor {
  id: string
  name: string
  category: string
  description: string
  requirements: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  classLevel: string[]
  icon: string
  color: string
  pdfUrl?: string
}

const honors: Honor[] = [
  // Spiritual Honors
  {
    id: 'bible-reading',
    name: 'Bible Reading',
    category: 'Spiritual',
    description: 'Membaca dan memahami bagian-bagian penting dari Alkitab',
    requirements: [
      'Baca 10 pasal Alkitab pilihan',
      'Buat ringkasan dari setiap pasal',
      'Hafalkan 5 ayat penting',
      'Presentasikan pemahaman Anda'
    ],
    difficulty: 'Beginner',
    estimatedTime: '2-3 minggu',
    classLevel: ['Adventurer', 'Pathfinder', 'Master Guide'],
    icon: '📖',
    color: 'from-purple-400 to-purple-600',
    pdfUrl: 'https://drive.google.com/file/d/BIBLE_READING_ID/preview'
  },
  {
    id: 'prayer-ministry',
    name: 'Prayer Ministry',
    category: 'Spiritual',
    description: 'Memahami dan praktik doa dalam kehidupan sehari-hari',
    requirements: [
      'Pelajari jenis-jenis doa',
      'Buat jurnal doa pribadi',
      'Ikuti sesi doa kelompok',
      'Bagikan pengalaman doa'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🙏',
    color: 'from-purple-400 to-purple-600',
    pdfUrl: 'https://drive.google.com/file/d/PRAYER_MINISTRY_ID/preview'
  },
  {
    id: 'christian-leadership',
    name: 'Christian Leadership',
    category: 'Spiritual',
    description: 'Mengembangkan kepemimpinan berdasarkan prinsip Kristen',
    requirements: [
      'Studi karakter pemimpin Alkitab',
      'Praktik kepemimpinan dalam kelompok',
      'Buat proyek kepemimpinan',
      'Evaluasi dan refleksi'
    ],
    difficulty: 'Advanced',
    estimatedTime: '8-12 minggu',
    classLevel: ['Master Guide'],
    icon: '👑',
    color: 'from-purple-400 to-purple-600',
    pdfUrl: 'https://drive.google.com/file/d/CHRISTIAN_LEADERSHIP_ID/preview'
  },

  // Service Honors
  {
    id: 'community-service',
    name: 'Community Service',
    category: 'Service',
    description: 'Melayani komunitas dengan berbagai kegiatan sosial',
    requirements: [
      'Identifikasi kebutuhan komunitas',
      'Rencanakan proyek sosial',
      'Eksekusi proyek minimal 20 jam',
      'Laporkan hasil dan dampak'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '6-8 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    pdfUrl: 'https://drive.google.com/file/d/COMMUNITY_SERVICE_ID/preview'
  },
  {
    id: 'first-aid',
    name: 'First Aid',
    category: 'Service',
    description: 'Dasar-dasar pertolongan pertama dalam keadaan darurat',
    requirements: [
      'Pelajari teknik dasar pertolongan pertama',
      'Praktik CPR dan Heimlich',
      'Buat kit pertolongan pertama',
      'Simulasi situasi darurat'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🏥',
    color: 'from-green-400 to-green-600',
    pdfUrl: 'https://drive.google.com/file/d/FIRST_AID_ID/preview'
  },
  {
    id: 'evangelism',
    name: 'Evangelism',
    category: 'Service',
    description: 'Belajar dan praktik evangelisasi personal',
    requirements: [
      'Studi metode evangelisasi',
      'Persiapkan materi kesaksian',
      'Praktik evangelisasi minimal 5 kali',
      'Evaluasi hasil dan pengalaman'
    ],
    difficulty: 'Advanced',
    estimatedTime: '8-10 minggu',
    classLevel: ['Master Guide'],
    icon: '📢',
    color: 'from-green-400 to-green-600',
    pdfUrl: 'https://drive.google.com/file/d/EVANGELISM_ID/preview'
  },

  // Nature Honors
  {
    id: 'bird-study',
    name: 'Bird Study',
    category: 'Nature',
    description: 'Mengenal berbagai jenis burung dan habitatnya',
    requirements: [
      'Identifikasi 20 jenis burung lokal',
      'Pelajari habitat dan makanan',
      'Buat jurnal observasi burung',
      'Presentasikan temuan'
    ],
    difficulty: 'Beginner',
    estimatedTime: '3-4 minggu',
    classLevel: ['Adventurer', 'Pathfinder'],
    icon: '🦅',
    color: 'from-blue-400 to-blue-600',
    pdfUrl: 'https://drive.google.com/file/d/BIRD_STUDY_ID/preview'
  },
  {
    id: 'plant-study',
    name: 'Plant Study',
    category: 'Nature',
    description: 'Mempelajari berbagai jenis tanaman dan manfaatnya',
    requirements: [
      'Koleksi 15 jenis tanaman',
      'Pelajari klasifikasi tanaman',
      'Buat herbarium mini',
      'Presentasikan manfaat tanaman'
    ],
    difficulty: 'Beginner',
    estimatedTime: '4-5 minggu',
    classLevel: ['Adventurer', 'Pathfinder'],
    icon: '🌿',
    color: 'from-blue-400 to-blue-600',
    pdfUrl: 'https://drive.google.com/file/d/PLANT_STUDY_ID/preview'
  },
  {
    id: 'weather-study',
    name: 'Weather Study',
    category: 'Nature',
    description: 'Memahami fenomena cuaca dan prediksi',
    requirements: [
      'Pelajari jenis-jenis awan',
      'Buat alat pengukur cuaca sederhana',
      'Catat cuaca selama 2 minggu',
      'Prediksi cuaca berdasarkan observasi'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '3-4 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🌤️',
    color: 'from-blue-400 to-blue-600',
    pdfUrl: 'https://drive.google.com/file/d/WEATHER_STUDY_ID/preview'
  },

  // Craft Honors
  {
    id: 'woodworking',
    name: 'Woodworking',
    category: 'Craft',
    description: 'Dasar-dasar kerja kayu dan pembuatan proyek',
    requirements: [
      'Pelajari jenis kayu dan penggunaannya',
      'Gunakan alat-alat kayu dengan aman',
      'Buat proyek kayu sederhana',
      'Finishing dan dekorasi'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '6-8 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🔨',
    color: 'from-orange-400 to-orange-600',
    pdfUrl: 'https://drive.google.com/file/d/WOODWORKING_ID/preview'
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'Craft',
    description: 'Teknik dasar fotografi dan komposisi',
    requirements: [
      'Pelajari teknik kamera',
      'Praktik komposisi foto',
      'Buat portfolio 20 foto',
      'Edit foto dasar'
    ],
    difficulty: 'Beginner',
    estimatedTime: '4-6 minggu',
    classLevel: ['Adventurer', 'Pathfinder'],
    icon: '📷',
    color: 'from-orange-400 to-orange-600',
    pdfUrl: 'https://drive.google.com/file/d/PHOTOGRAPHY_ID/preview'
  },
  {
    id: 'cooking',
    name: 'Cooking',
    category: 'Craft',
    description: 'Dasar-dasar memasak dan nutrisi',
    requirements: [
      'Pelajari gizi seimbang',
      'Masak 10 menu berbeda',
      'Buat menu sehat seminggu',
      'Presentasikan hasil masakan'
    ],
    difficulty: 'Beginner',
    estimatedTime: '4-5 minggu',
    classLevel: ['Adventurer', 'Pathfinder'],
    icon: '👨‍🍳',
    color: 'from-orange-400 to-orange-600',
    pdfUrl: 'https://drive.google.com/file/d/COOKING_ID/preview'
  },

  // Health Honors
  {
    id: 'physical-fitness',
    name: 'Physical Fitness',
    category: 'Health',
    description: 'Membangun kebugaran fisik dan gaya hidup sehat',
    requirements: [
      'Tes kebugaran awal',
      'Buat program olahraga 4 minggu',
      'Catat progress harian',
      'Tes kebugaran akhir'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '💪',
    color: 'from-red-400 to-red-600',
    pdfUrl: 'https://drive.google.com/file/d/PHYSICAL_FITNESS_ID/preview'
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    category: 'Health',
    description: 'Memahami nutrisi dan pola makan sehat',
    requirements: [
      'Pelajari kelompok makanan',
      'Analisis pola makan pribadi',
      'Buat menu sehat',
      'Presentasikan pengetahuan nutrisi'
    ],
    difficulty: 'Beginner',
    estimatedTime: '3-4 minggu',
    classLevel: ['Adventurer', 'Pathfinder'],
    icon: '🥗',
    color: 'from-red-400 to-red-600',
    pdfUrl: 'https://drive.google.com/file/d/NUTRITION_ID/preview'
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    category: 'Health',
    description: 'Kesehatan mental dan emotional wellbeing',
    requirements: [
      'Pelajari teknik manajemen stress',
      'Praktik mindfulness',
      'Buat jurnal kesehatan mental',
      'Bagikan tips kesehatan mental'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 minggu',
    classLevel: ['Pathfinder', 'Master Guide'],
    icon: '🧠',
    color: 'from-red-400 to-red-600',
    pdfUrl: 'https://drive.google.com/file/d/MENTAL_HEALTH_ID/preview'
  }
]

const categories = ['Semua', 'Spiritual', 'Service', 'Nature', 'Craft', 'Health']
const difficulties = ['Semua', 'Beginner', 'Intermediate', 'Advanced']
const classLevels = ['Semua', 'Adventurer', 'Pathfinder', 'Master Guide']

const categoryIcons: Record<string, React.ReactNode> = {
  'Spiritual': <Star className="w-5 h-5" />,
  'Service': <Heart className="w-5 h-5" />,
  'Nature': <TreePine className="w-5 h-5" />,
  'Craft': <Hammer className="w-5 h-5" />,
  'Health': <Activity className="w-5 h-5" />
}

const difficultyColors: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-red-100 text-red-700'
}

export default function HonorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Semua')
  const [selectedClassLevel, setSelectedClassLevel] = useState('Semua')
  const [selectedHonor, setSelectedHonor] = useState<Honor | null>(null)

  const filteredHonors = useMemo(() => {
    return honors.filter(honor => {
      const matchesSearch = honor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           honor.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'Semua' || honor.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'Semua' || honor.difficulty === selectedDifficulty
      const matchesClassLevel = selectedClassLevel === 'Semua' || honor.classLevel.includes(selectedClassLevel)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesClassLevel
    })
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedClassLevel])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="bg-gradient-purple text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Honors Kepanduan Advent
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Jelajahi berbagai honors yang dapat dicapai dalam setiap kategori. 
              Kembangkan skills, karakter, dan spiritual Anda melalui challenges yang menarik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari honors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Kategori:</span>
                <div className="flex gap-1">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}
                    >
                      {categoryIcons[category]}
                      <span className="ml-1">{category}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Level:</span>
                <div className="flex gap-1">
                  {difficulties.map(difficulty => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={selectedDifficulty === difficulty ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Tingkatan:</span>
                <div className="flex gap-1">
                  {classLevels.map(level => (
                    <Button
                      key={level}
                      variant={selectedClassLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedClassLevel(level)}
                      className={selectedClassLevel === level ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredHonors.map((honor, index) => (
              <motion.div
                key={honor.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedHonor(honor)}
              >
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className={`h-32 bg-gradient-to-br ${honor.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">{honor.icon}</div>
                        <h3 className="text-lg font-bold">{honor.name}</h3>
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-white/20 text-white border-white/30">
                      {honor.category}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={difficultyColors[honor.difficulty]}>
                        {honor.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">{honor.estimatedTime}</span>
                    </div>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3">
                      {honor.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Class Levels */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Tingkatan:</p>
                        <div className="flex flex-wrap gap-1">
                          {honor.classLevel.map(level => (
                            <Badge key={level} variant="outline" className="text-xs border-purple-200 text-purple-700">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Requirements Preview */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          {honor.requirements.length} persyaratan
                        </p>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {honor.requirements[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredHonors.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ada honors yang ditemukan untuk filter yang dipilih.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedHonor && (
        <Dialog open={!!selectedHonor} onOpenChange={() => setSelectedHonor(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-3xl">{selectedHonor.icon}</span>
                    {selectedHonor.name}
                  </DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    {selectedHonor.description}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHonor(null)}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Category and Difficulty */}
                <div className="flex gap-2">
                  <Badge className="bg-purple-600 text-white">
                    {categoryIcons[selectedHonor.category]}
                    <span className="ml-1">{selectedHonor.category}</span>
                  </Badge>
                  <Badge className={difficultyColors[selectedHonor.difficulty]}>
                    {selectedHonor.difficulty}
                  </Badge>
                </div>

                {/* Time Estimate */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Estimasi Waktu</h3>
                  <p className="text-gray-700">{selectedHonor.estimatedTime}</p>
                </div>

                {/* Class Levels */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tingkatan yang Berlaku</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHonor.classLevel.map(level => (
                      <Badge key={level} variant="outline" className="border-purple-200 text-purple-700">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedHonor.pdfUrl && (
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-gradient-purple hover:opacity-90 text-white"
                    >
                      <a
                        href={selectedHonor.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat PDF
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <a
                        href={selectedHonor.pdfUrl.replace('/preview', '/uc?export=download')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column - Requirements */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Persyaratan
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {selectedHonor.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 leading-relaxed">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}