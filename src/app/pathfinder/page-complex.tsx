'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Compass, 
  BookOpen, 
  TrendingUp, 
  Info, 
  Music, 
  FileText, 
  User,
  ArrowRight,
  Star,
  Award,
  Clock,
  Target,
  Heart
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

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

const menuCards = [
  {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'Statistik belajar dan aktivitas terkini',
    icon: TrendingUp,
    color: 'from-blue-500 to-purple-600',
    href: '/pathfinder/dashboard-overview'
  },
  {
    id: 'my-progress',
    title: 'My Progress',
    description: 'Track progress per kelas dan per bab',
    icon: Target,
    color: 'from-green-500 to-teal-600',
    href: '/pathfinder/my-progress'
  },
  {
    id: 'my-books',
    title: 'My Books & Materials',
    description: 'Materi belajar interaktif dan eBook',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-600',
    href: '/pathfinder/my-books'
  },
  {
    id: 'about',
    title: 'About Pathfinder',
    description: 'Sejarah, filosofi, dan arti logo',
    icon: Info,
    color: 'from-orange-500 to-red-600',
    href: '/pathfinder/about'
  },
  {
    id: 'mars',
    title: 'Mars Pathfinder',
    description: 'Lagu mars 3 bahasa',
    icon: Music,
    color: 'from-indigo-500 to-blue-600',
    href: '/pathfinder/mars'
  },
  {
    id: 'perjanjian',
    title: 'Perjanjian & Peraturan',
    description: 'Aturan dan perjanjian Pathfinder',
    icon: FileText,
    color: 'from-yellow-500 to-orange-600',
    href: '/pathfinder/perjanjian'
  },
  {
    id: 'my-profile',
    title: 'My Profile',
    description: 'Kelola data diri dan profil',
    icon: User,
    color: 'from-pink-500 to-rose-600',
    href: '/pathfinder/my-profile'
  }
]

const pathfinderClasses = [
  { value: 'FRIEND', label: 'Sahabat', age: '10 Tahun' },
  { value: 'COMPANION', label: 'Teman', age: '11 Tahun' },
  { value: 'EXPLORER', label: 'Penyelidik', age: '12 Tahun' },
  { value: 'RANGER', label: 'Perintis', age: '13 Tahun' },
  { value: 'VOYAGER', label: 'Penjelajah', age: '14 Tahun' },
  { value: 'GUIDE', label: 'Pemimpin', age: '15 Tahun' }
]

const chapters = [
  { name: 'Personal Growth', icon: '🌱', progress: 75 },
  { name: 'Spiritual Discovery', icon: '🙏', progress: 60 },
  { name: 'Serving Others', icon: '🤝', progress: 80 },
  { name: 'Making Friends', icon: '👥', progress: 90 },
  { name: 'Health & Fitness', icon: '💪', progress: 70 },
  { name: 'Nature Study', icon: '🌿', progress: 65 },
  { name: 'Outdoor Living', icon: '⛺', progress: 55 },
  { name: 'Honor Enrichment', icon: '🏆', progress: 45 }
]

export default function PathfinderDashboard() {
  const [userData, setUserData] = useState({
    name: 'Alexandra Putri',
    class: 'COMPANION',
    club: 'Pathfinder Jakarta Pusat',
    avatar: '/pathfinder-avatar.jpg',
    overallProgress: 68
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Welcome message di console untuk sementara
      console.log(`Selamat Datang ${userData.name}! Siap untuk melanjutkan pembelajaran?`)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getCurrentClass = () => {
    return pathfinderClasses.find(c => c.value === userData.class) || pathfinderClasses[0]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const currentClass = getCurrentClass()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-8"
            >
              <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-3xl p-1 border border-white/30">
                <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Compass className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              </div>
            </motion.div>

            {/* User Profile */}
            <motion.div
              variants={floatVariants}
              initial="initial"
              animate="animate"
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold text-orange-500">
                      {userData.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Info */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {userData.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Kelas {currentClass.label} ({currentClass.age})
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Heart className="w-4 h-4 mr-2" />
                {userData.club}
              </Badge>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
                <div className="relative">
                  <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - userData.overallProgress / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-white">
                        {userData.overallProgress}%
                      </div>
                      <div className="text-xs md:text-sm text-white/80">
                        Progress
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/pathfinder/my-books">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Lanjutkan Belajar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Menu Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Menu Pathfinder
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Jelajahi semua fitur pembelajaran dan aktivitas Pathfinder
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {menuCards.map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="group"
                >
                  <Link href={card.href}>
                    <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer">
                      <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                      <CardContent className="p-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto"
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                          {card.description}
                        </p>
                        
                        <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                          <span>Buka</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Chapter Progress Preview */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Progress per Bab
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Track pembelajaran Anda di setiap bab Pathfinder
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{chapter.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                      {chapter.name}
                    </h4>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{chapter.progress}%</span>
                  </div>
                  <Progress value={chapter.progress} className="h-2" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}