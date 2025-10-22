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
import { Label } from '@/components/ui/label'
import { ReflectionForm } from '@/components/reflection-form'
import { ReflectionList } from '@/components/reflection-list'
import CertificateList from '@/components/certificate-list'
import { 
  BookOpen, 
  Users, 
  Award, 
  Heart, 
  Compass, 
  Sparkles, 
  Star,
  Target,
  TrendingUp,
  Calendar,
  LogOut,
  Settings,
  User,
  GraduationCap,
  MessageCircle
} from 'lucide-react'
import { config } from '@/lib/config'

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

interface UserData {
  id: string
  name: string
  email: string
  role: string
  clubId?: string
  club?: {
    id: string
    name: string
    slug: string
  }
}

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [clubData, setClubData] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReflectionForm, setShowReflectionForm] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<{id: string, title: string} | null>(null)
  const [reflectionRefreshTrigger, setReflectionRefreshTrigger] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Important for cookies
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserData(data.user)
          
          // Fetch additional data based on role
          if (data.user.role !== 'ADVENTURER' && data.user.role !== 'PATHFINDER') {
            await fetchClubData(data.user)
            await fetchActivities(data.user)
            await fetchMembers(data.user)
          }
        } else {
          // If not authenticated, redirect to login
          console.error('Failed to fetch user data:', response.statusText)
          router.push(config.routes.login)
          return
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        router.push(config.routes.login)
        return
      } finally {
        setIsLoading(false)
      }
    }

    const fetchClubData = async (user: any) => {
      try {
        const response = await fetch('/api/clubs', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.clubs && data.clubs.length > 0) {
            setClubData(data.clubs[0]) // Get first club for now
          }
        }
      } catch (error) {
        console.error('Failed to fetch club data:', error)
      }
    }

    const fetchActivities = async (user: any) => {
      try {
        const response = await fetch('/api/activities', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      }
    }

    const fetchMembers = async (user: any) => {
      try {
        const response = await fetch('/api/members', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setMembers(data.members || [])
        }
      } catch (error) {
        console.error('Failed to fetch members:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      // Use window.location for clean redirect
      window.location.href = config.routes.login
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      window.location.href = config.routes.login
    }
  }

  const handleNewReflection = (materialId: string, materialTitle: string) => {
    setSelectedMaterial({ id: materialId, title: materialTitle })
    setShowReflectionForm(true)
  }

  const handleReflectionSaved = () => {
    setShowReflectionForm(false)
    setSelectedMaterial(null)
    setReflectionRefreshTrigger(prev => prev + 1)
  }

  const handleCancelReflection = () => {
    setShowReflectionForm(false)
    setSelectedMaterial(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Unauthorized</h1>
          <Button onClick={() => router.push(config.routes.login)}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const getRoleData = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Administrator',
          icon: Settings,
          color: 'from-red-400 to-orange-400',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          subClasses: ['System Administration', 'User Management', 'Club Management', 'Event Organization'],
          categories: ['Dashboard', 'User Management', 'Club Management', 'Reports', 'Settings'],
          progress: 100,
        }
      case 'ADVENTURER':
        return {
          title: 'Adventurer',
          icon: Sparkles,
          color: 'from-purple-400 to-pink-400',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          subClasses: ['Little Lamb', 'Early Bird', 'Busy Bee', 'Sunbeam', 'Builder', 'Helping Hands'],
          categories: ['My God', 'My Self', 'My Family', 'My World'],
          progress: 65,
        }
      case 'PATHFINDER':
        return {
          title: 'Pathfinder',
          icon: Compass,
          color: 'from-blue-400 to-purple-400',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          subClasses: ['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide'],
          categories: ['Personal Growth', 'Spiritual Discovery', 'Serving Others', 'Making Friends', 'Health & Fitness', 'Nature Study', 'Outdoor Living'],
          progress: 45,
        }
      case 'CMG':
        return {
          title: 'Calon Master Guide',
          icon: GraduationCap,
          color: 'from-orange-400 to-red-400',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          subClasses: ['Leadership Identity', 'Lifestyle Development', 'Spiritual Growth', 'Community Development'],
          categories: ['Pillar Pembinaan', 'Mentorship', 'Advanced Skills'],
          progress: 60,
          isCMG: true,
        }
      case 'MASTER_GUIDE':
        return {
          title: 'Master Guide',
          icon: Award,
          color: 'from-indigo-400 to-purple-400',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          subClasses: ['Leadership Identity', 'Lifestyle Development', 'Spiritual Growth', 'Community Development'],
          categories: ['Pillar Pembinaan', 'Mentorship', 'Advanced Skills', 'CMG Progress', 'Full Master Guide'],
          progress: 80,
          isCMG: false,
        }
      default:
        return {
          title: 'Adventurer',
          icon: Sparkles,
          color: 'from-purple-400 to-pink-400',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          subClasses: [],
          categories: [],
          progress: 0,
        }
    }
  }

  const roleData = getRoleData(userData.role)
  const Icon = roleData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logos/logo_kepanduan_square.png"
                  alt="Kepanduan Advent Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-gray-800">Kepanduan Advent</span>
              </Link>
              
              <Badge className={`bg-gradient-to-r ${roleData.color} text-white border-0`}>
                <Icon className="w-3 h-3 mr-1" />
                {roleData.title}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userData.name}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
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
          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <div className={`${roleData.bgColor} rounded-3xl p-8 border ${roleData.borderColor}`}>
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 flex items-center justify-center shadow-lg"
                >
                  <img
                    src={`/logos/logo_${userData.role.toLowerCase().replace('_', '')}.png`}
                    alt={`${roleData.title} Logo`}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Selamat datang, {userData.name}!
                  </h1>
                  <p className="text-gray-600">
                    Lanjutkan perjalanan Anda sebagai {roleData.title}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-800">Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">{roleData.progress}%</div>
                    <Progress value={roleData.progress} className="h-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Materi</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">12/20</div>
                    <p className="text-sm text-gray-600">Materi selesai</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-gray-800">Pencapaian</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">8</div>
                    <p className="text-sm text-gray-600">Lencana earned</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Main Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue={userData?.role === 'ADMIN' ? 'admin-dashboard' : 'materials'} className="w-full">
              <TabsList className={`grid w-full ${userData?.role === 'ADMIN' ? 'grid-cols-9' : userData?.role === 'MASTER_GUIDE' ? 'grid-cols-8' : 'grid-cols-6'}`}>
                <TabsTrigger value="materials">Materi</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="assignments">Tugas</TabsTrigger>
                <TabsTrigger value="reflections">Refleksi</TabsTrigger>
                <TabsTrigger value="certificates">Sertifikat</TabsTrigger>
                {userData?.role === 'ADMIN' && (
                  <>
                    <TabsTrigger value="admin-dashboard">Admin Dashboard</TabsTrigger>
                    <TabsTrigger value="users">Manajemen User</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </>
                )}
                {(userData?.role === 'MASTER_GUIDE' && userData?.role !== 'ADMIN') && (
                  <>
                    <TabsTrigger value="club">Klub</TabsTrigger>
                    <TabsTrigger value="members">Anggota</TabsTrigger>
                  </>
                )}
                <TabsTrigger value="profile">Profil</TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roleData.categories.map((category, index) => (
                    <motion.div
                      key={category}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            {category}
                          </CardTitle>
                          <CardDescription>
                            Materi pembelajaran untuk kategori {category}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.floor(Math.random() * 100)}%</span>
                            </div>
                            <Progress value={Math.random() * 100} className="h-2" />
                            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full">
                              Mulai Belajar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Progress Pembelajaran
                    </CardTitle>
                    <CardDescription>
                      Pantau perkembangan pembelajaran anggota
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Kunjungi halaman progress untuk melihat dan mengelola perkembangan pembelajaran materi.
                      </p>
                      <Link href="/progress">
                        <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Buka Halaman Progress
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assignments" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Tugas Aktif
                    </CardTitle>
                    <CardDescription>
                      Tugas yang perlu Anda kerjakan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold">Tugas {i}: {roleData.categories[i-1] || 'General'}</h4>
                          <p className="text-sm text-gray-600 mt-1">Deadline: {new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('id-ID')}</p>
                          <Button size="sm" className="mt-2">Kerjakan</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reflections" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      Refleksi Pribadi
                    </CardTitle>
                    <CardDescription>
                      Catat pemikiran dan pembelajaran spiritual Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Kunjungi halaman refleksi untuk mengelola semua refleksi Anda, membuat refleksi baru, dan melihat statistik pembelajaran.
                      </p>
                      <Link href="/reflections">
                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Buka Halaman Refleksi
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Sertifikat
                    </CardTitle>
                    <CardDescription>
                      Kelola dan verifikasi sertifikat kepanduan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Kunjungi halaman sertifikat untuk melihat, mengunduh, dan membuat sertifikat pencapaian.
                      </p>
                      <Link href="/certificates">
                        <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white">
                          <Award className="w-4 h-4 mr-2" />
                          Buka Halaman Sertifikat
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {(userData?.role === 'ADMIN' || userData?.role === 'MASTER_GUIDE') && (
                <>
                  <TabsContent value="club" className="space-y-6">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          Informasi Klub
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {clubData ? (
                          <div className="space-y-4">
                            <div>
                              <Label>Nama Klub</Label>
                              <p className="font-semibold">{clubData.name}</p>
                            </div>
                            <div>
                              <Label>Deskripsi</Label>
                              <p>{clubData.description}</p>
                            </div>
                          </div>
                        ) : (
                          <p>Belum ada data klub</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="members" className="space-y-6">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          Daftar Anggota
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {members.length > 0 ? (
                          <div className="space-y-2">
                            {members.map((member) => (
                              <div key={member.id} className="p-2 bg-gray-50 rounded">
                                {member.name} - {member.email}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>Belum ada anggota</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
              
              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Profil Pengguna
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Nama</Label>
                        <p className="font-semibold">{userData.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p>{userData.email}</p>
                      </div>
                      <div>
                        <Label>Peran</Label>
                        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                          {roleData.title}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}