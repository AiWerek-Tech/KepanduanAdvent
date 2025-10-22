'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, Star, ArrowRight, Sparkles, Heart, Compass, Zap, Shield, Target, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { config } from '@/lib/config'

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

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const classes = [
  {
    id: 'adventurer',
    title: 'Adventurer',
    age: '4-9 Tahun',
    description: 'Perjalanan iman dan petualangan pertama untuk anak-anak',
    icon: Sparkles,
    color: 'from-pink-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    features: ['Little Lamb', 'Early Bird', 'Busy Bee', 'Sunbeam', 'Builder', 'Helping Hands'],
    categories: ['My God', 'My Self', 'My Family', 'My World'],
  },
  {
    id: 'pathfinder',
    title: 'Pathfinder',
    age: '10-15 Tahun',
    description: 'Pengembangan karakter dan keterampilan remaja',
    icon: Compass,
    color: 'from-blue-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
    features: ['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide'],
    categories: ['Personal Growth', 'Spiritual Discovery', 'Serving Others', 'Making Friends', 'Health & Fitness', 'Nature Study', 'Outdoor Living'],
  },
  {
    id: 'master-guide',
    title: 'Master Guide',
    age: '16+ Tahun',
    description: 'Kepemimpinan dan pembinaan generasi muda',
    icon: Award,
    color: 'from-indigo-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    features: ['Leadership Identity', 'Lifestyle Development', 'Spiritual Growth', 'Community Development'],
    categories: ['Pillar Pembinaan', 'Mentorship', 'Advanced Skills'],
  },
]

const stats = [
  { label: 'Pandua Aktif', value: '10,000+', icon: Users },
  { label: 'Materi Pembelajaran', value: '500+', icon: BookOpen },
  { label: 'Sertifikat Diterbitkan', value: '5,000+', icon: Award },
  { label: 'Tingkat Kepuasan', value: '98%', icon: Star },
]

export default function Home() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setIsAuthenticated(true)
            // Redirect based on user role
            if (data.user.role === 'PATHFINDER') {
              window.location.href = '/pathfinder'
            } else {
              window.location.href = '/new-dashboard'
            }
            return
          }
        }
      } catch (error) {
        // Not authenticated, continue to home page
        console.log('Not authenticated:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  // Remove the additional redirect effect to prevent loop

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
        <div className="absolute inset-0 bg-gradient-purple opacity-5" />
        
        {/* Floating Elements */}
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full blur-xl opacity-30"
        />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-8"
            >
              <div className="w-full h-full bg-gradient-purple rounded-3xl p-1">
                <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
                  <img
                    src="/logos/logo_kepanduan.png"
                    alt="Kepanduan Advent Logo"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient-purple">Kepanduan Advent</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Platform digital interaktif untuk pembelajaran dan pelatihan Adventurer, Pathfinder, dan Master Guide. 
              <span className="text-gradient-purple font-semibold"> Bersama membangun generasi yang berkarakter, berintegritas, dan berpegang teguh pada iman.</span>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Link href="/register">
                <Button size="lg" className="bg-gradient-purple hover:opacity-90 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Mulai Perjalanan
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                  Login
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-purple rounded-full mb-2">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gradient-purple">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-purple">Tingkatan Kepanduan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Setiap tingkatan dirancang khusus untuk tahapan perkembangan yang berbeda dengan metode pembelajaran yang tepat dan menyenangkan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {classes.map((classItem, index) => {
              const Icon = classItem.icon
              return (
                <motion.div
                  key={classItem.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className={`h-full ${classItem.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden`}>
                    <div className={`h-3 bg-gradient-to-r ${classItem.color}`} />
                    <CardHeader className="text-center pb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto"
                      >
                        <div className="w-full h-full bg-white rounded-2xl p-2 shadow-lg">
                          <img
                            src={`/logos/logo_${classItem.id.toLowerCase()}.png`}
                            alt={`${classItem.title} Logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </motion.div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-3">
                        {classItem.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                        {classItem.age}
                      </Badge>
                      <CardDescription className="text-gray-600 text-base leading-relaxed">
                        {classItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-500" />
                            Tingkatan
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {classItem.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs bg-white/50">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                            Kategori Pembelajaran
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {classItem.categories.slice(0, 3).map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs bg-white/50">
                                {category}
                              </Badge>
                            ))}
                            {classItem.categories.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-white/50">
                                +{classItem.categories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-purple hover:opacity-90 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Pelajari {classItem.title}
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

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient-purple">Fitur Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pembelajaran interaktif dengan teknologi modern untuk pengalaman terbaik
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: 'Materi Interaktif',
                description: 'Konten pembelajaran menarik dengan multimedia yang engaging',
                color: 'from-blue-400 to-blue-600'
              },
              {
                icon: Users,
                title: 'Pembinaan Personal',
                description: 'Mentorship dan bimbingan intensif dari para expert',
                color: 'from-green-400 to-green-600'
              },
              {
                icon: Award,
                title: 'Sertifikat Digital',
                description: 'Pengakuan resmi dengan QR code untuk setiap pencapaian',
                color: 'from-purple-400 to-purple-600'
              },
              {
                icon: Heart,
                title: 'Nilai Kristiani',
                description: 'Pembentukan karakter berdasarkan iman dan nilai-nilai luhur',
                color: 'from-red-400 to-red-600'
              },
              {
                icon: Zap,
                title: 'Learning Analytics',
                description: 'Tracking progress dan performa pembelajaran real-time',
                color: 'from-yellow-400 to-yellow-600'
              },
              {
                icon: Shield,
                title: 'Environment Aman',
                description: 'Platform yang aman dan terpercaya untuk anak-anak',
                color: 'from-indigo-400 to-indigo-600'
              },
              {
                icon: Target,
                title: 'Goal Setting',
                description: 'Set dan capai target pembelajaran yang terstruktur',
                color: 'from-pink-400 to-pink-600'
              },
              {
                icon: Globe,
                title: 'Global Community',
                description: 'Terhubung dengan komunitas kepanduan worldwide',
                color: 'from-teal-400 to-teal-600'
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-center group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg mb-6 group-hover:shadow-xl"
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-purple relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              Bergabunglah dengan Komunitas Kepanduan Advent
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90"
            >
              Mulai perjalanan pembelajaran dan pengembangan diri Anda bersama ribuan panduan lainnya. 
              <br />
              <span className="font-semibold">Bersama kita bisa, bersama kita hebat!</span>
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Daftar Sekarang
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105">
                Login
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}