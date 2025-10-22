'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, ZoomIn, Filter, Shirt, Medal, Star, Crown } from 'lucide-react'
import Image from 'next/image'

interface UniformItem {
  id: string
  name: string
  category: string
  classLevel: string
  description: string
  meaning: string
  imageUrl: string
  requirements?: string[]
}

const uniformItems: UniformItem[] = [
  // Adventurer Uniforms
  {
    id: 'adv-scarf',
    name: 'Scarf Adventurer',
    category: 'Seragam',
    classLevel: 'Adventurer',
    description: 'Syal warna biru tua dengan logo Adventurer',
    meaning: 'Melambangkan kesetiaan dan kebersamaan dalam kelompok Adventurer',
    imageUrl: '/images/uniforms/adventurer-scarf.jpg',
    requirements: ['Peserta aktif Adventurer', 'Lulus pemahaman dasar']
  },
  {
    id: 'adv-sash',
    name: 'Sash Adventurer',
    category: 'Seragam',
    classLevel: 'Adventurer',
    description: 'Sabyan merah untuk tempat lencana achievement',
    meaning: 'Melambangkan pencapaian dan prestasi yang telah diraih',
    imageUrl: '/images/uniforms/adventurer-sash.jpg'
  },
  {
    id: 'adv-badge-little-lamb',
    name: 'Badge Little Lamb',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Little Lamb',
    meaning: 'Melambangkan kelembutan dan kepolosan seperti domba',
    imageUrl: '/images/uniforms/badge-little-lamb.jpg'
  },
  {
    id: 'adv-badge-early-bird',
    name: 'Badge Early Bird',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Early Bird',
    meaning: 'Melambangkan semangat pagi dan kedisiplinan',
    imageUrl: '/images/uniforms/badge-early-bird.jpg'
  },
  {
    id: 'adv-badge-busy-bee',
    name: 'Badge Busy Bee',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Busy Bee',
    meaning: 'Melambangkan kerajinan dan produktivitas',
    imageUrl: '/images/uniforms/badge-busy-bee.jpg'
  },
  {
    id: 'adv-badge-sunbeam',
    name: 'Badge Sunbeam',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Sunbeam',
    meaning: 'Melambangkan keceriaan dan penerangan',
    imageUrl: '/images/uniforms/badge-sunbeam.jpg'
  },
  {
    id: 'adv-badge-builder',
    name: 'Badge Builder',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Builder',
    meaning: 'Melambangkan kreativitas dan kemampuan membangun',
    imageUrl: '/images/uniforms/badge-builder.jpg'
  },
  {
    id: 'adv-badge-helping-hands',
    name: 'Badge Helping Hands',
    category: 'Lencana',
    classLevel: 'Adventurer',
    description: 'Lencana untuk kelas Helping Hands',
    meaning: 'Melambangkan semangat membantu dan kepedulian sosial',
    imageUrl: '/images/uniforms/badge-helping-hands.jpg'
  },

  // Pathfinder Uniforms
  {
    id: 'path-scarf',
    name: 'Scarf Pathfinder',
    category: 'Seragam',
    classLevel: 'Pathfinder',
    description: 'Syal warna kuning dengan logo Pathfinder',
    meaning: 'Melambangkan kehangatan persahabatan dan semangat petualangan',
    imageUrl: '/images/uniforms/pathfinder-scarf.jpg',
    requirements: ['Peserta aktif Pathfinder', 'Lulus ujian basic']
  },
  {
    id: 'path-sash',
    name: 'Sash Pathfinder',
    category: 'Seragam',
    classLevel: 'Pathfinder',
    description: 'Sabyan hitam untuk tempat lencana dan honors',
    meaning: 'Melambangkan keteguhan hati dan disiplin',
    imageUrl: '/images/uniforms/pathfinder-sash.jpg'
  },
  {
    id: 'path-badge-friend',
    name: 'Badge Friend',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Friend',
    meaning: 'Melambangkan persahabatan dan kemampuan bersosialisasi',
    imageUrl: '/images/uniforms/badge-friend.jpg'
  },
  {
    id: 'path-badge-companion',
    name: 'Badge Companion',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Companion',
    meaning: 'Melambangkan kebersamaan dan saling mendukung',
    imageUrl: '/images/uniforms/badge-companion.jpg'
  },
  {
    id: 'path-badge-explorer',
    name: 'Badge Explorer',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Explorer',
    meaning: 'Melambangkan semangat menjelajah dan rasa ingin tahu',
    imageUrl: '/images/uniforms/badge-explorer.jpg'
  },
  {
    id: 'path-badge-ranger',
    name: 'Badge Ranger',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Ranger',
    meaning: 'Melambangkan keberanian dan kemampuan survival',
    imageUrl: '/images/uniforms/badge-ranger.jpg'
  },
  {
    id: 'path-badge-voyager',
    name: 'Badge Voyager',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Voyager',
    meaning: 'Melambangkan petualangan dan jiwa eksplorasi',
    imageUrl: '/images/uniforms/badge-voyager.jpg'
  },
  {
    id: 'path-badge-guide',
    name: 'Badge Guide',
    category: 'Lencana',
    classLevel: 'Pathfinder',
    description: 'Lencana untuk tingkat Guide',
    meaning: 'Melambangkan kepemimpinan dan kemampuan membimbing',
    imageUrl: '/images/uniforms/badge-guide.jpg'
  },

  // Master Guide Uniforms
  {
    id: 'mg-scarf',
    name: 'Scarf Master Guide',
    category: 'Seragam',
    classLevel: 'Master Guide',
    description: 'Syal warna hijau tua dengan logo Master Guide',
    meaning: 'Melambangkan kedewasaan, kebijaksanaan, dan kepemimpinan',
    imageUrl: '/images/uniforms/master-guide-scarf.jpg',
    requirements: ['Lulus Pathfinder Guide', 'Selesaikan training Master Guide', 'Usia minimal 16 tahun']
  },
  {
    id: 'mg-pin',
    name: 'Pin Master Guide',
    category: 'Lencana',
    classLevel: 'Master Guide',
    description: 'Pin khusus Master Guide dengan logo resmi',
    meaning: 'Melambangkan pengakuan sebagai pembina resmi',
    imageUrl: '/images/uniforms/master-guide-pin.jpg'
  },
  {
    id: 'mg-sash',
    name: 'Sash Master Guide',
    category: 'Seragam',
    classLevel: 'Master Guide',
    description: 'Sabyan biru tua untuk tempat berbagai lencana prestasi',
    meaning: 'Melambangkan pencapaian tertinggi dalam kepanduan',
    imageUrl: '/images/uniforms/master-guide-sash.jpg'
  }
]

const categories = ['Semua', 'Seragam', 'Lencana']
const classLevels = ['Semua', 'Adventurer', 'Pathfinder', 'Master Guide']

export default function SeragamPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedClassLevel, setSelectedClassLevel] = useState('Semua')
  const [selectedItem, setSelectedItem] = useState<UniformItem | null>(null)

  const filteredItems = uniformItems.filter(item => {
    const categoryMatch = selectedCategory === 'Semua' || item.category === selectedCategory
    const classMatch = selectedClassLevel === 'Semua' || item.classLevel === selectedClassLevel
    return categoryMatch && classMatch
  })

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
              <Shirt className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Seragam & Insignia Kepanduan
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Jelajahi koleksi lengkap seragam dan lencana resmi untuk setiap tingkatan. 
              Pahami makna di balik setiap elemen dan persyaratan untuk mendapatkannya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-700">Filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
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
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        {item.category === 'Seragam' ? (
                          <Shirt className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                        ) : (
                          <Medal className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                        )}
                        <p className="text-sm font-medium text-gray-700">{item.name}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-2">
                        <ZoomIn className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                      {item.classLevel}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base text-gray-800">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-semibold">Makna:</span> {item.meaning}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ada item yang ditemukan untuk filter yang dipilih.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                      {selectedItem.name}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                      {selectedItem.description}
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItem(null)}
                    className="rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {selectedItem.category === 'Seragam' ? (
                        <Shirt className="w-24 h-24 text-purple-600" />
                      ) : (
                        <Medal className="w-24 h-24 text-purple-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className="bg-purple-600 text-white">
                      {selectedItem.classLevel}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Makna & Simbolisme
                    </h3>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedItem.meaning}
                      </p>
                    </div>
                  </div>

                  {selectedItem.requirements && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-600" />
                        Persyaratan
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {selectedItem.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Informasi Tambahan</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Kategori:</strong> {selectedItem.category}</p>
                      <p><strong>Tingkatan:</strong> {selectedItem.classLevel}</p>
                      <p><strong>ID Item:</strong> {selectedItem.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}