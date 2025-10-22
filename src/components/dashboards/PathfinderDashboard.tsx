'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Heart,
  LogOut,
  Activity,
  Zap,
  Shield,
  Trophy,
  Flame,
  Gem,
  Rocket,
  Brain,
  Sparkles
} from 'lucide-react'
import PathfinderLogoIcon from '@/components/icons/PathfinderLogoIcon'
import IAIcon from '@/components/icons/IAIcon'

// Types for better TypeScript support
export interface MenuCard {
  id: string
  title: string
  description: string
  icon: any
  color: string
  href: string
  gradient: string
  borderColor: string
  stats: string
}

export interface Chapter {
  name: string
  nameEN: string
  icon: string
  progress: number
  color: string
}

export interface Activity {
  activity: string
  time: string
  icon: string
  color: string
}

export interface UserData {
  name: string
  class: string
  club: string
  avatar: string
  overallProgress: number
  streak: number
  totalPoints: number
  rank: string
  joinDate: string
}

export interface PathfinderDashboardProps {
  userData?: Partial<UserData>
  menuCards?: MenuCard[]
  chapters?: Chapter[]
  recentActivities?: Activity[]
  pathfinderClasses?: Array<{ value: string; label: string; age: string }>
  customLogo?: React.ReactNode
  customActions?: React.ReactNode
  showQuickActions?: boolean
  showRecentActivity?: boolean
  showChapterProgress?: boolean
  theme?: 'pathfinder' | 'adventurer' | 'masterguide'
}

// Default configurations
const defaultMenuCards: MenuCard[] = [
  {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'Statistik belajar dan aktivitas terkini',
    icon: Activity,
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    href: '/pathfinder/dashboard-overview',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    borderColor: 'border-cyan-200',
    stats: '12 Aktif'
  },
  {
    id: 'my-investiture-achievement',
    title: 'Pencapaian Pelantikanku',
    description: 'Track progress per kelas dan per bab',
    icon: IAIcon,
    color: 'from-emerald-500 via-green-500 to-teal-600',
    href: '/pathfinder/my-investiture-achievement',
    gradient: 'bg-gradient-to-br from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    stats: '68% Complete'
  },
  {
    id: 'my-books',
    title: 'My Books & Materials',
    description: 'Materi belajar interaktif dan eBook',
    icon: BookOpen,
    color: 'from-violet-500 via-purple-500 to-pink-600',
    href: '/pathfinder/my-books',
    gradient: 'bg-gradient-to-br from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    stats: '24 Materi'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Lencana dan penghargaan Pathfinder',
    icon: Trophy,
    color: 'from-amber-500 via-orange-500 to-red-600',
    href: '/pathfinder/achievements',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    stats: '15 Lencana'
  },
  {
    id: 'about',
    title: 'About Pathfinder',
    description: 'Sejarah, filosofi, dan arti logo',
    icon: PathfinderLogoIcon,
    color: 'from-rose-500 via-pink-500 to-purple-600',
    href: '/pathfinder/about',
    gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    stats: 'Info'
  },
  {
    id: 'mars',
    title: 'Mars Pathfinder',
    description: 'Lagu mars 3 bahasa',
    icon: Music,
    color: 'from-indigo-500 via-blue-500 to-cyan-600',
    href: '/pathfinder/mars',
    gradient: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    stats: '3 Bahasa'
  },
  {
    id: 'perjanjian',
    title: 'Perjanjian & Peraturan',
    description: 'Aturan dan perjanjian Pathfinder',
    icon: Shield,
    color: 'from-yellow-500 via-amber-500 to-orange-600',
    href: '/pathfinder/perjanjian',
    gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    borderColor: 'border-yellow-200',
    stats: '6 Aturan'
  },
  {
    id: 'my-profile',
    title: 'My Profile',
    description: 'Kelola data diri dan profil',
    icon: User,
    color: 'from-teal-500 via-cyan-500 to-blue-600',
    href: '/pathfinder/my-profile',
    gradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    stats: 'Profile'
  }
]

const defaultChapters: Chapter[] = [
  { name: 'Pertumbuhan Pribadi', nameEN: 'Personal Growth', icon: '🌱', progress: 75, color: 'from-green-400 to-emerald-500' },
  { name: 'Penemuan Spiritual', nameEN: 'Spiritual Discovery', icon: '🙏', progress: 60, color: 'from-purple-400 to-pink-500' },
  { name: 'Melayani Orang Lain', nameEN: 'Serving Others', icon: '🤝', progress: 80, color: 'from-blue-400 to-cyan-500' },
  { name: 'Berteman', nameEN: 'Making Friends', icon: '👥', progress: 90, color: 'from-yellow-400 to-orange-500' },
  { name: 'Kesehatan & Kebugaran', nameEN: 'Health & Fitness', icon: '💪', progress: 70, color: 'from-red-400 to-rose-500' },
  { name: 'Studi Alam', nameEN: 'Nature Study', icon: '🌿', progress: 65, color: 'from-emerald-400 to-teal-500' },
  { name: 'Kehidupan Luar Ruang', nameEN: 'Outdoor Living', icon: '⛺', progress: 55, color: 'from-indigo-400 to-purple-500' },
  { name: 'Pengayaan Kehormatan', nameEN: 'Honor Enrichment', icon: '🏆', progress: 45, color: 'from-amber-400 to-orange-500' }
]

const defaultActivities: Activity[] = [
  { activity: 'Completed Chapter 3', time: '2 hours ago', icon: '✅', color: 'text-green-500' },
  { activity: 'Earned Nature Badge', time: '1 day ago', icon: '🏆', color: 'text-yellow-500' },
  { activity: 'Joined Group Discussion', time: '2 days ago', icon: '💬', color: 'text-blue-500' },
  { activity: 'Submitted Assignment', time: '3 days ago', icon: '📝', color: 'text-purple-500' }
]

const defaultPathfinderClasses = [
  { value: 'FRIEND', label: 'Sahabat', age: '10 Tahun' },
  { value: 'COMPANION', label: 'Teman', age: '11 Tahun' },
  { value: 'EXPLORER', label: 'Penyelidik', age: '12 Tahun' },
  { value: 'RANGER', label: 'Perintis', age: '13 Tahun' },
  { value: 'VOYAGER', label: 'Penjelajah', age: '14 Tahun' },
  { value: 'GUIDE', label: 'Pemimpin', age: '15 Tahun' }
]

// Theme configurations
const themes = {
  pathfinder: {
    bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    primary: 'purple',
    accent: 'pink'
  },
  adventurer: {
    bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900',
    primary: 'blue',
    accent: 'indigo'
  },
  masterguide: {
    bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
    primary: 'gray',
    accent: 'slate'
  }
}

export default function PathfinderDashboard({
  userData = {},
  menuCards = defaultMenuCards,
  chapters = defaultChapters,
  recentActivities = defaultActivities,
  pathfinderClasses = defaultPathfinderClasses,
  customLogo,
  customActions,
  showQuickActions = true,
  showRecentActivity = true,
  showChapterProgress = true,
  theme = 'pathfinder'
}: PathfinderDashboardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [logoutAnimation, setLogoutAnimation] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0) // Start with 0
  const [chaptersWithProgress, setChaptersWithProgress] = useState(defaultChapters)

  // Merge with default user data
  const finalUserData: UserData = {
    name: 'Alexandra Putri',
    class: 'COMPANION',
    club: 'Pathfinder Jakarta Pusat',
    avatar: '/pathfinder-avatar.jpg',
    overallProgress: overallProgress,
    streak: 7,
    totalPoints: 2450,
    rank: 'Gold Pathfinder',
    joinDate: 'January 2024',
    ...userData
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      console.log(`Selamat Datang ${finalUserData.name}! Siap untuk melanjutkan pembelajaran?`)
    }, 1000)
    return () => clearTimeout(timer)
  }, [finalUserData.name])

  // Fetch real progress data from investiture API
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/investiture/dashboard-progress')
        if (response.ok) {
          const data = await response.json()
          
          // Update overall progress
          setOverallProgress(data.overallProgress)
          
          // Update chapters with real progress
          setChaptersWithProgress(data.chapters)
          
          console.log('✅ Dashboard progress loaded:', {
            overallProgress: data.overallProgress,
            chaptersCount: data.chapters.length
          })
        } else {
          console.warn('⚠️ Failed to fetch progress, using defaults')
          // Keep default values if API fails
        }
      } catch (error) {
        console.error('❌ Error fetching progress:', error)
        // Keep default values if API fails
      }
    }
    
    fetchProgress()
  }, [])

  const handleLogout = () => {
    setLogoutAnimation(true)
    setTimeout(() => {
      router.push('/login')
    }, 800)
  }

  const getCurrentClass = () => {
    return pathfinderClasses.find(c => c.value === finalUserData.class) || pathfinderClasses[0]
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themes[theme].bg} flex items-center justify-center`}>
        <div className="relative">
          <div className="w-32 h-32 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="https://clubministries.org/wp-content/uploads/Pathfinder_Logo-Flat_Small.png"
                alt="Pathfinder Logo"
                className="w-full h-full object-contain p-1 animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Create dynamic menu cards with real progress
  const dynamicMenuCards = menuCards.map(card => {
    if (card.id === 'my-investiture-achievement') {
      return {
        ...card,
        stats: `${overallProgress}% Complete`
      }
    }
    return card
  })

  const currentClass = getCurrentClass()
  const currentTheme = themes[theme]

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${logoutAnimation ? 'animate-pulse opacity-50' : ''}`}>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {customLogo || (
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="https://clubministries.org/wp-content/uploads/Pathfinder_Logo-Flat_Small.png"
                    alt="Pathfinder Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">Pathfinder Dashboard</h1>
                <p className="text-xs text-purple-200">Welcome back, {finalUserData.name.split(' ')[0]}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-bold">{finalUserData.streak}</span>
                  </div>
                  <p className="text-xs text-purple-200">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-bold">{finalUserData.totalPoints}</span>
                  </div>
                  <p className="text-xs text-purple-200">Points</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    {finalUserData.rank}
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 backdrop-blur-sm transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Modern */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400/30 rounded-full animate-bounce delay-100" />
          <div className="absolute top-40 right-20 w-6 h-6 bg-pink-400/30 rounded-full animate-bounce delay-300" />
          <div className="absolute bottom-32 left-1/4 w-10 h-10 bg-blue-400/30 rounded-full animate-bounce delay-500" />
          <div className="absolute bottom-20 right-1/3 w-7 h-7 bg-green-400/30 rounded-full animate-bounce delay-700" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* User Profile Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full p-1 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold bg-gradient-to-br from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {finalUserData.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {finalUserData.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 px-4 py-2 text-sm backdrop-blur-sm">
                      <Star className="w-4 h-4 mr-2" />
                      {currentClass.label} ({currentClass.age})
                    </Badge>
                    <Badge className="bg-pink-500/20 text-pink-200 border-pink-400/30 px-4 py-2 text-sm backdrop-blur-sm">
                      <Heart className="w-4 h-4 mr-2" />
                      {finalUserData.club}
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-200 border-amber-400/30 px-4 py-2 text-sm backdrop-blur-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Since {finalUserData.joinDate}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-xs text-green-400">+2</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{finalUserData.streak}</div>
                  <div className="text-xs text-purple-200">Day Streak</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <Gem className="w-5 h-5 text-amber-400" />
                    <span className="text-xs text-green-400">+150</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{finalUserData.totalPoints}</div>
                  <div className="text-xs text-purple-200">Total Points</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs text-purple-400">15</span>
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-purple-200">Achievements</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="text-2xl font-bold text-white">Lv.8</div>
                  <div className="text-xs text-purple-200">Level</div>
                </div>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-48 h-48 relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - finalUserData.overallProgress / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-white">{finalUserData.overallProgress}%</div>
                    <div className="text-sm text-purple-200">Overall Progress</div>
                  </div>
                </div>
              </div>
              
              {customActions || (
                <Link href="/pathfinder/my-investiture-achievement">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Rocket className="w-5 h-5 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Menu Grid - Ultra Modern */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Explorer Dashboard
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Unlock your potential with interactive learning adventures
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {dynamicMenuCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  className="group transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={card.href}>
                    <div className={`h-full ${card.gradient} rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-500 border ${card.borderColor} backdrop-blur-sm`}>
                      <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <Badge className="bg-white/80 text-gray-700 border-0 text-xs font-semibold">
                            {card.stats}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {card.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {card.description}
                        </p>
                        
                        <div className="flex items-center text-purple-600 font-semibold text-sm">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Stats Section */}
      {(showChapterProgress || showRecentActivity) && (
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Chapter Progress */}
              {showChapterProgress && (
                <div className="lg:col-span-2">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Progres Pencapaian Pelantikanku</h3>
                        <p className="text-purple-200">Track your learning journey</p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {chaptersWithProgress.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                              <img 
                                src={chapter.icon} 
                                alt={chapter.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  // Fallback to emoji if image fails
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = '🏆'
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">
                                {chapter.name}
                              </h4>
                              <p className="text-xs text-gray-300">
                                {chapter.nameEN}
                              </p>
                            </div>
                            <div className="text-white font-bold text-sm">
                              {chapter.progress}%
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className={`h-2 bg-white/20 rounded-full overflow-hidden`}>
                              <div 
                                className={`h-full bg-gradient-to-r ${chapter.color} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${chapter.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400">
                              {chapter.completedRequirements || 0} dari {chapter.totalRequirements || 0} persyaratan
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Recent Activities */}
              {showRecentActivity && (
                <div className="space-y-8">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Recent Activity</h3>
                        <p className="text-purple-200">Your latest achievements</p>
                      </div>
                      <Activity className="w-8 h-8 text-purple-400" />
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`text-2xl ${activity.color}`}>{activity.icon}</div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{activity.activity}</p>
                            <p className="text-purple-200 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  {showQuickActions && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                      <div className="space-y-3">
                        <Link href="/pathfinder/my-books">
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </Link>
                        <Link href="/pathfinder/my-progress">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Progress
                          </Button>
                        </Link>
                        <Link href="/pathfinder/achievements">
                          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                            <Trophy className="w-4 h-4 mr-2" />
                            My Achievements
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}