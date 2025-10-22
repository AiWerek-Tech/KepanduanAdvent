'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Download, Eye, Sparkles, Compass, Award } from 'lucide-react'
import Link from 'next/link'

const guidebooks = [
  {
    id: 'adventurer-manual',
    title: 'Buku Panduan Adventurer',
    description: 'Panduan lengkap untuk kegiatan Adventurer meliputi semua kelas: Little Lamb, Early Bird, Busy Bee, Sunbeam, Builder, dan Helping Hands.',
    category: 'Adventurer',
    age: '4-9 Tahun',
    coverImage: '/images/guidebooks/adventurer-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/ADVENTURER_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=ADVENTURER_MANUAL_ID',
    color: 'from-pink-400 to-purple-400',
    features: [
      '6 Kelas lengkap',
      'Kegiatan spiritual',
      'Pengembangan karakter',
      'Kegiatan outdoor',
      'Lagu dan mars'
    ]
  },
  {
    id: 'pathfinder-manual',
    title: 'Buku Panduan Pathfinder',
    description: 'Manual komprehensif untuk Pathfinder dengan 7 track: Personal Growth, Spiritual Discovery, Serving Others, Making Friends, Health & Fitness, Nature Study, dan Outdoor Living.',
    category: 'Pathfinder',
    age: '10-15 Tahun',
    coverImage: '/images/guidebooks/pathfinder-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/PATHFINDER_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=PATHFINDER_MANUAL_ID',
    color: 'from-blue-400 to-purple-400',
    features: [
      '7 Track lengkap',
      'Honors & skills',
      'Camporee guide',
      'Leadership training',
      'International standards'
    ]
  },
  {
    id: 'master-guide-manual',
    title: 'Buku Panduan Master Guide',
    description: 'Panduan advanced untuk pembina dan leader meliputi leadership development, spiritual growth, dan community service.',
    category: 'Master Guide',
    age: '16+ Tahun',
    coverImage: '/images/guidebooks/master-guide-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/MASTER_GUIDE_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=MASTER_GUIDE_MANUAL_ID',
    color: 'from-indigo-400 to-purple-400',
    features: [
      'Leadership principles',
      'Mentorship guide',
      'Program planning',
      'Spiritual development',
      'Community outreach'
    ]
  },
  {
    id: 'ayl-manual',
    title: 'Adventurer Youth Leadership (AYL)',
    description: 'Panduan khusus untuk pengembangan leadership remaja dalam konteks Advent.',
    category: 'Leadership',
    age: '13-17 Tahun',
    coverImage: '/images/guidebooks/ayl-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/AYL_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=AYL_MANUAL_ID',
    color: 'from-green-400 to-blue-400',
    features: [
      'Youth leadership',
      'Team building',
      'Project management',
      'Communication skills',
      'Service learning'
    ]
  },
  {
    id: 'honors-manual',
    title: 'Buku Panduan Honors',
    description: 'Koleksi lengkap honors yang dapat dicapai dalam berbagai kategori: Spiritual, Service, Nature, Craft, Health.',
    category: 'Honors',
    age: 'Semua Usia',
    coverImage: '/images/guidebooks/honors-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/HONORS_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=HONORS_MANUAL_ID',
    color: 'from-yellow-400 to-orange-400',
    features: [
      '300+ honors',
      'Multi kategori',
      'Skill requirements',
      'Assessment guides',
      'Progress tracking'
    ]
  },
  {
    id: 'camping-manual',
    title: 'Panduan Camping & Outdoor',
    description: 'Manual lengkap untuk kegiatan camping, hiking, dan outdoor activities dengan standar keamanan.',
    category: 'Outdoor',
    age: '10+ Tahun',
    coverImage: '/images/guidebooks/camping-cover.jpg',
    pdfUrl: 'https://drive.google.com/file/d/CAMPING_MANUAL_ID/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=CAMPING_MANUAL_ID',
    color: 'from-green-400 to-teal-400',
    features: [
      'Camping basics',
      'Safety guidelines',
      'Equipment guide',
      'Outdoor cooking',
      'Environmental care'
    ]
  }
]

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

export default function BukuPanduanPage() {
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
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Buku Panduan Kepanduan Advent
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Akses lengkap semua buku panduan resmi untuk setiap tingkatan kepanduan. 
              Download gratis dan pelajari kapan saja, di mana saja.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guidebooks Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {guidebooks.map((guidebook, index) => {
              const IconComponent = guidebook.category === 'Adventurer' ? Sparkles :
                                 guidebook.category === 'Pathfinder' ? Compass :
                                 guidebook.category === 'Master Guide' ? Award :
                                 BookOpen

              return (
                <motion.div
                  key={guidebook.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                    {/* Cover Image */}
                    <div className={`h-48 bg-gradient-to-br ${guidebook.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <IconComponent className="w-16 h-16 mx-auto mb-2" />
                          <h3 className="text-xl font-bold">{guidebook.title}</h3>
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-white/20 text-white border-white/30">
                        {guidebook.age}
                      </Badge>
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          {guidebook.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-gray-800">
                        {guidebook.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {guidebook.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Fitur:</h4>
                        <div className="flex flex-wrap gap-1">
                          {guidebook.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          asChild
                          className="flex-1 bg-gradient-purple hover:opacity-90 text-white"
                          size="sm"
                        >
                          <a
                            href={guidebook.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Baca Online
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                          size="sm"
                        >
                          <a
                            href={guidebook.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-gradient-to-br from-purple-100/50 to-blue-100/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Panduan Lengkap untuk Perjalanan Anda
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Setiap buku panduan dirancang oleh para profesional dan pengalaman bertahun-tahun dalam kepanduan Advent. 
              Materi disusun secara sistematis untuk mendukung perkembangan spiritual, karakter, dan keterampilan sesuai tingkatan usia.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Materi Terstruktur</h3>
                <p className="text-gray-600 text-sm">
                  Pembelajaran sistematis dari dasar hingga advanced
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Standar Internasional</h3>
                <p className="text-gray-600 text-sm">
                  Mengikuti kurikulum kepanduan Advent worldwide
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Akses Gratis</h3>
                <p className="text-gray-600 text-sm">
                  Download dan akses kapan saja tanpa biaya
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}