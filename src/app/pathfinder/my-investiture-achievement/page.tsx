'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { 
  BookOpen, 
  Users, 
  Heart, 
  Handshake, 
  Activity, 
  Trees, 
  Tent, 
  Award,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Loader2,
  Compass,
  ArrowLeft,
  Flame,
  Gem,
  RefreshCw,
  Star,
  Crown,
  Sparkles,
  Shield
} from 'lucide-react'
import ChapterDetailModal from '@/components/modals/ChapterDetailModal'
import PathfinderClassIcon from '@/components/icons/PathfinderClassIcon'

interface Chapter {
  id: string
  nameEN: string
  nameID: string
  description: string
  iconUrl: string
  color: string
  order: number
  requirements: Requirement[]
}

interface Requirement {
  id: string
  requirement: string
  isCompleted: boolean
  completedAt?: string
  mentorNotes?: string
  isValidated: boolean
}

export default function MyInvestitureAchievement() {
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Force refresh when needed

  // User data (mock for now)
  const userData = {
    name: 'Alexandra Putri',
    pathfinderClass: 'COMPANION', // This would come from user profile/database
    streak: 7,
    totalPoints: 2450,
    rank: 'Gold Pathfinder'
  }

  const pathfinderClassLabels = {
    'FRIEND': 'Sahabat',
    'COMPANION': 'Teman',
    'EXPLORER': 'Penyelidik',
    'RANGER': 'Perintis',
    'VOYAGER': 'Penjelajah',
    'GUIDE': 'Pemimpin'
  }

  const currentClassLabel = pathfinderClassLabels[userData.pathfinderClass as keyof typeof pathfinderClassLabels] || 'Teman'

  // Fetch chapters and user progress
  useEffect(() => {
    fetchData()
  }, [refreshKey]) // Refresh when refreshKey changes

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch chapters
      const chaptersResponse = await fetch('/api/investiture/chapters')
      if (!chaptersResponse.ok) {
        throw new Error('Failed to fetch chapters')
      }
      const chaptersData = await chaptersResponse.json()
      
      // Fetch user progress
      const progressResponse = await fetch('/api/investiture/progress')
      if (!progressResponse.ok) {
        // If progress fails, show warning but continue with chapters
        console.warn('Failed to fetch progress, using empty progress')
        toast.warning('⚠️ Gagal memuat progress', {
          description: 'Menampilkan data chapter tanpa progress',
          duration: 3000,
        })
      }
      const progressData = progressResponse.ok ? await progressResponse.json() : {}
      
      // Combine chapters with progress
      const chaptersWithProgress = chaptersData.map((chapter: Chapter) => ({
        ...chapter,
        requirements: chapter.requirements.map((req: any) => ({
          ...req,
          isCompleted: progressData[chapter.id]?.find((p: any) => p.id === req.id)?.isCompleted || false,
          completedAt: progressData[chapter.id]?.find((p: any) => p.id === req.id)?.completedAt,
          mentorNotes: progressData[chapter.id]?.find((p: any) => p.id === req.id)?.mentorNotes,
          isValidated: progressData[chapter.id]?.find((p: any) => p.id === req.id)?.isValidated || false
        }))
      }))
      
      setChapters(chaptersWithProgress)
      
      // Calculate progress for each chapter
      const progressMap: Record<string, number> = {}
      chaptersWithProgress.forEach((chapter: Chapter) => {
        const completedCount = chapter.requirements.filter(req => req.isCompleted).length
        const totalCount = chapter.requirements.length
        progressMap[chapter.id] = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      })
      
      setProgress(progressMap)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('❌ Gagal memuat data', {
        description: 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate overall progress
  const overallProgress = Object.keys(progress).length > 0 
    ? Math.round(Object.values(progress).reduce((sum, val) => sum + val, 0) / Object.keys(progress).length)
    : 0

  const completedChapters = Object.values(progress).filter(val => val === 100).length
  const inProgressChapters = Object.values(progress).filter(val => val > 0 && val < 100).length

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setIsModalOpen(true)
  }

  const handleRequirementToggle = async (requirementId: string, isCompleted: boolean) => {
    if (!selectedChapter) return
    
    try {
      setIsSaving(true)
      
      const response = await fetch('/api/investiture/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirementId,
          isCompleted
        })
      })
      
      if (response.ok) {
        // Update local state
        const updatedChapters = chapters.map(chapter => {
          if (chapter.id === selectedChapter.id) {
            const updatedRequirements = chapter.requirements.map(req =>
              req.id === requirementId ? { ...req, isCompleted } : req
            )
            
            // Recalculate chapter progress
            const completedCount = updatedRequirements.filter(req => req.isCompleted).length
            const totalCount = updatedRequirements.length
            const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
            
            setProgress(prev => ({
              ...prev,
              [chapter.id]: newProgress
            }))
            
            return { ...chapter, requirements: updatedRequirements }
          }
          return chapter
        })
        
        setChapters(updatedChapters)
        setSelectedChapter(updatedChapters.find(ch => ch.id === selectedChapter.id) || null)
        
        // Show success notification
        toast.success('✅ Progress tersimpan', {
          description: `Persyaratan ${isCompleted ? 'dicentang' : 'dibatalkan'} berhasil disimpan.`,
          duration: 2000,
        })
      } else {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('❌ Gagal menyimpan', {
        description: 'Terjadi kesalahan saat menyimpan progress.',
        duration: 3000,
      })
      // Revert the change on error
      const revertedChapters = chapters.map(chapter => {
        if (chapter.id === selectedChapter.id) {
          const revertedRequirements = chapter.requirements.map(req =>
            req.id === requirementId ? { ...req, isCompleted: !isCompleted } : req
          )
          return { ...chapter, requirements: revertedRequirements }
        }
        return chapter
      })
      setChapters(revertedChapters)
      setSelectedChapter(revertedChapters.find(ch => ch.id === selectedChapter.id) || null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProgress = () => {
    // Force refresh data when modal is closed to ensure latest data is shown
    setRefreshKey(prev => prev + 1)
    setIsModalOpen(false)
    setSelectedChapter(null)
  }

  const handleCloseModal = () => {
    // Just close modal without refreshing data
    // Data is already auto-saved and updated in real-time
    setIsModalOpen(false)
    setSelectedChapter(null)
  }

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
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
          <p className="text-white text-lg">Memuat data pencapaian...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src="https://clubministries.org/wp-content/uploads/Pathfinder_Logo-Flat_Small.png"
                  alt="Pathfinder Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Pencapaian Pelantikanku</h1>
                <p className="text-xs text-purple-200">Welcome back, {userData.name.split(' ')[0]}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-bold">{userData.streak}</span>
                  </div>
                  <p className="text-xs text-purple-200">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-bold">{userData.totalPoints}</span>
                  </div>
                  <p className="text-xs text-purple-200">Points</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    {userData.rank}
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={() => router.push('/pathfinder')}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-white border border-purple-500/30 backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
              
              <Button
                onClick={forceRefresh}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Memuat...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section - Ultra Modern */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Dual Icons with Animation */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* IA Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border-2 border-white/20">
                <img
                  src="https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png"
                  alt="Investiture Achievement"
                  width={80}
                  height={80}
                  className="relative z-10"
                />
              </div>
            </motion.div>

            {/* Class Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border-2 border-white/20">
                <PathfinderClassIcon 
                  pathfinderClass={userData.pathfinderClass}
                  size={80}
                  className=""
                />
              </div>
            </motion.div>
          </div>
          
          {/* Title with Gradient */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent"
          >
            🏕️ Pencapaian Pelantikanku
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-4"
          >
            My Investiture Achievement
          </motion.p>

          {/* Class Status Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <Card className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-md border-amber-400/30 text-white px-8 py-3 shadow-2xl">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-lg font-bold">KELAS {currentClassLabel.toUpperCase()}</span>
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Lihat dan lengkapi semua persyaratan pelantikan Pathfinder-mu! 💪✨
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Progress Keseluruhan</p>
                    <p className="text-2xl font-bold">{overallProgress}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <Progress value={overallProgress} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Bab Selesai</p>
                    <p className="text-2xl font-bold">{completedChapters}/{chapters.length}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Sedang Dikerjakan</p>
                    <p className="text-2xl font-bold">{inProgressChapters}</p>
                  </div>
                  <Circle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Target</p>
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                  <Target className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Progres Pencapaian Pelantikanku
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </motion.div>

        {/* Chapters Grid - Ultra Modern */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-white/20 text-white cursor-pointer hover:from-white/15 hover:via-white/10 hover:to-white/15 transition-all duration-500 group shadow-xl hover:shadow-2xl overflow-hidden relative"
                onClick={() => handleChapterClick(chapter)}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${chapter.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`}></div>
                
                <CardHeader className="pb-3 relative z-10">
                  <div className="relative mx-auto w-20 h-20 mb-3">
                    {/* Icon Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${chapter.color} rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500 scale-110`}></div>
                    
                    {/* Icon Container */}
                    <div className="relative z-10 w-full h-full rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={chapter.iconUrl}
                        alt={chapter.nameID}
                        width={60}
                        height={60}
                        className="object-contain filter drop-shadow-lg"
                      />
                    </div>
                    
                    {/* Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress[chapter.id] / 100)}`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  <CardTitle className="text-center text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {chapter.nameID}
                  </CardTitle>
                  <p className="text-center text-sm text-gray-300 font-medium">
                    {chapter.nameEN}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3 relative z-10">
                  <p className="text-xs text-gray-400 text-center line-clamp-2">
                    {chapter.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <Badge 
                        variant={progress[chapter.id] === 100 ? "default" : "secondary"}
                        className={`${progress[chapter.id] === 100 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"} px-2 py-1 text-xs font-bold`}
                      >
                        {progress[chapter.id]}%
                      </Badge>
                    </div>
                    
                    <div className="relative">
                      <Progress 
                        value={progress[chapter.id]} 
                        className="h-2 bg-white/10 overflow-hidden"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full transition-all duration-1000 ease-out" 
                           style={{ width: `${progress[chapter.id]}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center pt-2">
                    {progress[chapter.id] === 100 ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Selesai</span>
                      </div>
                    ) : progress[chapter.id] > 0 ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Circle className="w-4 h-4" />
                        <span className="text-xs font-medium">Dalam Proses</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Circle className="w-4 h-4" />
                        <span className="text-xs font-medium">Belum Dimulai</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Motivational Quote - Ultra Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20 backdrop-blur-xl border-white/20 text-white max-w-3xl mx-auto shadow-2xl overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 animate-pulse"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/30 to-transparent rounded-full blur-3xl"></div>
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-400 mr-2" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                  Inspirasi Pathfinder
                </h3>
                <Sparkles className="w-6 h-6 text-amber-400 ml-2" />
              </div>
              
              <p className="text-lg md:text-xl italic mb-4 leading-relaxed">
                "The Pathfinder Club is a church-centered spiritual-recreational-activity program 
                designed for young people 10-15 years of age."
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <p className="text-sm text-gray-300 font-medium">
                  - Pathfinder Pledge
                </p>
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chapter Detail Modal */}
      <ChapterDetailModal
        chapter={selectedChapter}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requirements={selectedChapter?.requirements || []}
        onRequirementToggle={handleRequirementToggle}
        onSaveProgress={handleSaveProgress}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  )
}