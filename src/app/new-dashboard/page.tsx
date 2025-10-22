'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Award, 
  TrendingUp,
  Clock,
  Target,
  Activity,
  Heart,
  Star,
  ChevronRight,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data
const statsData = [
  {
    title: 'Total Anggota',
    value: '156',
    change: '+12%',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up'
  },
  {
    title: 'Aktivitas Bulan Ini',
    value: '24',
    change: '+8%',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: 'up'
  },
  {
    title: 'Sertifikat Diterbitkan',
    value: '89',
    change: '+15%',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: 'up'
  },
  {
    title: 'Jam Layanan',
    value: '1,234',
    change: '+5%',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    trend: 'up'
  }
]

const recentActivities = [
  {
    id: 1,
    title: 'Kemah Persahabatan',
    type: 'activity',
    date: '2024-01-15',
    participants: 45,
    status: 'completed',
    description: 'Kemah akhir pekan dengan fokus pada pembangunan karakter'
  },
  {
    id: 2,
    title: 'Layanan Masyarakat',
    type: 'service',
    date: '2024-01-10',
    participants: 32,
    status: 'completed',
    description: 'Membersihkan taman kota dan menanam pohon'
  },
  {
    id: 3,
    title: 'Pelatihan Kepemimpinan',
    type: 'training',
    date: '2024-01-08',
    participants: 28,
    status: 'ongoing',
    description: 'Workshop kepemimpinan untuk pemuda'
  }
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Rapat Bulanan',
    date: '2024-01-20',
    time: '19:00',
    type: 'meeting',
    location: 'Gereja'
  },
  {
    id: 2,
    title: 'Aktivitas Outdoor',
    date: '2024-01-25',
    time: '08:00',
    type: 'activity',
    location: 'Taman Nasional'
  },
  {
    id: 3,
    title: 'Ibadah Bersama',
    date: '2024-01-28',
    time: '10:00',
    type: 'worship',
    location: 'Gereja'
  }
]

const membersProgress = [
  {
    id: 1,
    name: 'John Doe',
    avatar: '/avatars/01.png',
    class: 'Adventurer',
    progress: 75,
    completed: 15,
    total: 20,
    rank: 'Bintang'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: '/avatars/02.png',
    class: 'Pathfinder',
    progress: 60,
    completed: 12,
    total: 20,
    rank: 'Pandu'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: '/avatars/03.png',
    class: 'Master Guide',
    progress: 90,
    completed: 18,
    total: 20,
    rank: 'Pembina'
  }
]

export default function NewDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Loading skeleton for stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        {/* Loading skeleton for content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Kepanduan Advent Club</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aktivitas Terkini</CardTitle>
                <CardDescription>Aktivitas club terbaru</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'activity' ? 'bg-blue-100' :
                      activity.type === 'service' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'activity' ? <Activity className="h-5 w-5 text-blue-600" /> :
                       activity.type === 'service' ? <Heart className="h-5 w-5 text-green-600" /> :
                       <Target className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{activity.date}</span>
                        <span className="text-xs text-gray-500">{activity.participants} peserta</span>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status === 'completed' ? 'Selesai' : 'Berlangsung'}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Acara Mendatang</CardTitle>
              <CardDescription>Jadwal club</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{event.date}</span>
                          <Clock className="h-3 w-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-600">{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{event.location}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type === 'meeting' ? 'Rapat' :
                         event.type === 'activity' ? 'Aktivitas' : 'Ibadah'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Members Progress */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Progress Anggota</CardTitle>
              <CardDescription>Pencapaian anggota bulan ini</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Lihat Detail
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {membersProgress.map((member) => (
                <div key={member.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.class}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{member.rank}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{member.completed}/{member.total}</span>
                    </div>
                    <Progress value={member.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}