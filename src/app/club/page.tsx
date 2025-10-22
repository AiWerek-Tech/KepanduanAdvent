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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Church,
  Award,
  Activity,
  Settings,
  Edit,
  UserPlus,
  LogOut,
  Star,
  TrendingUp,
  Target,
  Clock,
  Shield
} from 'lucide-react'
import PositionManager from '@/components/positions/position-manager'
import ServiceHistory from '@/components/service/service-history'

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

interface ClubData {
  id: string
  name: string
  email?: string
  phone?: string
  church?: string
  description?: string
  address?: string
  city?: string
  province?: string
  establishedYear?: number
  members: any[]
  activities: any[]
  statistics: {
    totalMembers: number
    activeMembers: number
    totalActivities: number
    upcomingActivities: number
  }
}

interface UserData {
  id: string
  name: string
  email: string
  role: string
  clubId?: string
}

export default function ClubPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [clubData, setClubData] = useState<ClubData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (userResponse.ok) {
          const userResult = await userResponse.json()
          setUserData(userResult.user)
          
          // Only fetch club data if user has a club
          if (userResult.user.clubId) {
            await fetchClubData(userResult.user.clubId)
          }
        } else if (userResponse.status === 401) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchClubData = async (clubId: string) => {
      try {
        const response = await fetch('/api/clubs', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.clubs && data.clubs.length > 0) {
            const club = data.clubs.find((c: any) => c.id === clubId) || data.clubs[0]
            setClubData(club)
          }
        }
      } catch (error) {
        console.error('Failed to fetch club data:', error)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
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
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (!clubData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Church className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Klub</h1>
          <p className="text-gray-600 mb-4">Anda belum tergabung dalam klub mana pun</p>
          <Button onClick={() => router.push('/new-dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const canEdit = userData.role === 'ADMIN' || userData.role === 'MASTER_GUIDE'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/new-dashboard" className="flex items-center gap-2">
                <img
                  src="/logos/logo_kepanduan_square.png"
                  alt="Kepanduan Advent Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold text-gray-800">Kepanduan Advent</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <Church className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-semibold text-gray-800">{clubData.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userData.name}</span>
              </div>
              
              {canEdit && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              
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
          {/* Club Header */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Church className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{clubData.name}</h1>
                        <p className="text-gray-600 mb-4">{clubData.description || 'Tidak ada deskripsi'}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {clubData.church && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Church className="w-4 h-4" />
                              <span>{clubData.church}</span>
                            </div>
                          )}
                          
                          {clubData.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{clubData.email}</span>
                            </div>
                          )}
                          
                          {clubData.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{clubData.phone}</span>
                            </div>
                          )}
                          
                          {clubData.address && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{clubData.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {clubData.establishedYear && (
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Berdiri Sejak</div>
                          <div className="text-2xl font-bold text-purple-600">{clubData.establishedYear}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Total Anggota</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{clubData.statistics.totalMembers}</div>
                  <p className="text-sm text-gray-600">Terdaftar</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Anggota Aktif</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{clubData.statistics.activeMembers}</div>
                  <p className="text-sm text-gray-600">Bulan ini</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Total Kegiatan</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{clubData.statistics.totalActivities}</div>
                  <p className="text-sm text-gray-600">Tahun ini</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Akan Datang</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{clubData.statistics.upcomingActivities}</div>
                  <p className="text-sm text-gray-600">Kegiatan</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="members">Anggota</TabsTrigger>
                <TabsTrigger value="activities">Kegiatan</TabsTrigger>
                {canEdit && (
                  <TabsTrigger value="positions">Jabatan</TabsTrigger>
                )}
                <TabsTrigger value="history">Histori</TabsTrigger>
                <TabsTrigger value="settings">Pengaturan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Daftar Anggota</h2>
                  {canEdit && (
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Tambah Anggota
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubData.members.map((member: any) => (
                    <Card key={member.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800">{member.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">{member.progress || 0}%</span>
                          </div>
                          <Progress value={member.progress || 0} className="h-2 mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Kegiatan Klub</h2>
                  {canEdit && (
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Tambah Kegiatan
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {clubData.activities.map((activity: any) => (
                    <Card key={activity.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                              <Badge 
                                variant={activity.status === 'completed' ? 'default' : 
                                        activity.status === 'ongoing' ? 'secondary' : 'outline'}
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{activity.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(activity.startDate).toLocaleDateString('id-ID')}</span>
                              </div>
                              
                              {activity.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{activity.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Detail
                            </Button>
                            {canEdit && (
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {canEdit && (
                <TabsContent value="positions" className="space-y-6">
                  <PositionManager clubId={clubData.id} currentUserRole={userData.role} />
                </TabsContent>
              )}
              
              <TabsContent value="history" className="space-y-6">
                <ServiceHistory clubId={clubData.id} currentUserRole={userData.role} />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                {canEdit ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Pengaturan Klub</CardTitle>
                      <CardDescription>
                        Kelola informasi dan pengaturan klub Anda
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Klub
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue={clubData.name}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue={clubData.email || ''}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telepon
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue={clubData.phone || ''}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gereja
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue={clubData.church || ''}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deskripsi
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={4}
                          defaultValue={clubData.description || ''}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          defaultValue={clubData.address || ''}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {isEditing ? (
                          <>
                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                              Simpan Perubahan
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Batal
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setIsEditing(true)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Informasi
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Akses Terbatas</h3>
                      <p className="text-gray-600">
                        Hanya Administrator dan Master Guide yang dapat mengatur pengaturan klub.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}