'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Download,
  Star,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  FileText,
  Award,
  Heart
} from 'lucide-react'

interface Activity {
  id: string
  title: string
  description: string
  type: 'meeting' | 'event' | 'training' | 'service' | 'recreation'
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  registeredParticipants: number
  budget: number
  actualCost: number
  organizer: string
  image: string
  tags: string[]
  rating: number
  feedback: number
  priority: 'low' | 'medium' | 'high'
  recurring: boolean
  createdAt: string
}

interface ActivityStats {
  totalActivities: number
  upcomingActivities: number
  ongoingActivities: number
  completedActivities: number
  cancelledActivities: number
  totalParticipants: number
  totalBudget: number
  averageRating: number
  completionRate: number
}

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

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('startDate')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockActivities: Activity[] = [
        {
          id: '1',
          title: 'Weekly Pathfinder Meeting',
          description: 'Regular weekly meeting for pathfinders to discuss upcoming activities and spiritual growth.',
          type: 'meeting',
          status: 'upcoming',
          startDate: '2024-01-25T18:00:00',
          endDate: '2024-01-25T20:00:00',
          location: 'Church Hall',
          maxParticipants: 50,
          registeredParticipants: 35,
          budget: 500000,
          actualCost: 450000,
          organizer: 'Budi Santoso',
          image: '/images/meeting.jpg',
          tags: ['weekly', 'pathfinder', 'spiritual'],
          rating: 4.5,
          feedback: 12,
          priority: 'medium',
          recurring: true,
          createdAt: '2024-01-15T10:00:00'
        },
        {
          id: '2',
          title: 'Community Service Day',
          description: 'Helping the local community with various service projects including cleaning and assistance.',
          type: 'service',
          status: 'planning',
          startDate: '2024-02-01T08:00:00',
          endDate: '2024-02-01T17:00:00',
          location: 'Community Center',
          maxParticipants: 100,
          registeredParticipants: 75,
          budget: 2000000,
          actualCost: 0,
          organizer: 'Siti Nurhaliza',
          image: '/images/service.jpg',
          tags: ['service', 'community', 'outreach'],
          rating: 0,
          feedback: 0,
          priority: 'high',
          recurring: false,
          createdAt: '2024-01-10T14:30:00'
        },
        {
          id: '3',
          title: 'Adventure Camp',
          description: 'Annual camping trip with outdoor activities, team building, and nature exploration.',
          type: 'recreation',
          status: 'completed',
          startDate: '2024-01-05T09:00:00',
          endDate: '2024-01-07T17:00:00',
          location: 'Mountain Camp Site',
          maxParticipants: 40,
          registeredParticipants: 38,
          budget: 5000000,
          actualCost: 4800000,
          organizer: 'Ahmad Rizki',
          image: '/images/camp.jpg',
          tags: ['camping', 'outdoor', 'adventure'],
          rating: 4.8,
          feedback: 25,
          priority: 'high',
          recurring: false,
          createdAt: '2023-12-15T09:00:00'
        },
        {
          id: '4',
          title: 'First Aid Training',
          description: 'Essential first aid training for all members conducted by certified instructors.',
          type: 'training',
          status: 'ongoing',
          startDate: '2024-01-20T13:00:00',
          endDate: '2024-01-20T17:00:00',
          location: 'Training Room',
          maxParticipants: 30,
          registeredParticipants: 28,
          budget: 1500000,
          actualCost: 1200000,
          organizer: 'Dr. Sarah Johnson',
          image: '/images/training.jpg',
          tags: ['training', 'first-aid', 'health'],
          rating: 0,
          feedback: 0,
          priority: 'medium',
          recurring: false,
          createdAt: '2024-01-05T11:00:00'
        },
        {
          id: '5',
          title: 'Family Fun Day',
          description: 'A fun-filled day for families with games, food, and entertainment.',
          type: 'event',
          status: 'cancelled',
          startDate: '2024-01-18T10:00:00',
          endDate: '2024-01-18T16:00:00',
          location: 'Church Grounds',
          maxParticipants: 200,
          registeredParticipants: 150,
          budget: 3000000,
          actualCost: 500000,
          organizer: 'Event Committee',
          image: '/images/family.jpg',
          tags: ['family', 'fun', 'entertainment'],
          rating: 0,
          feedback: 0,
          priority: 'low',
          recurring: false,
          createdAt: '2023-12-20T16:00:00'
        }
      ]

      setActivities(mockActivities)
      
      // Calculate stats
      const totalActivities = mockActivities.length
      const upcomingActivities = mockActivities.filter(a => a.status === 'upcoming').length
      const ongoingActivities = mockActivities.filter(a => a.status === 'ongoing').length
      const completedActivities = mockActivities.filter(a => a.status === 'completed').length
      const cancelledActivities = mockActivities.filter(a => a.status === 'cancelled').length
      const totalParticipants = mockActivities.reduce((sum, a) => sum + a.registeredParticipants, 0)
      const totalBudget = mockActivities.reduce((sum, a) => sum + a.budget, 0)
      const completedWithRating = mockActivities.filter(a => a.status === 'completed' && a.rating > 0)
      const averageRating = completedWithRating.length > 0 
        ? completedWithRating.reduce((sum, a) => sum + a.rating, 0) / completedWithRating.length 
        : 0
      const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

      setStats({
        totalActivities,
        upcomingActivities,
        ongoingActivities,
        completedActivities,
        cancelledActivities,
        totalParticipants,
        totalBudget,
        averageRating,
        completionRate
      })
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || activity.type === filterType
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'type':
        return a.type.localeCompare(b.type)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'startDate':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      case 'participants':
        return b.registeredParticipants - a.registeredParticipants
      case 'budget':
        return b.budget - a.budget
      default:
        return 0
    }
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'event': return 'bg-purple-100 text-purple-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'service': return 'bg-orange-100 text-orange-800'
      case 'recreation': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return Clock
      case 'upcoming': return Calendar
      case 'ongoing': return Activity
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Activities & Events</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage club activities and track participation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Activity
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalActivities}</p>
              <p className="text-xs text-gray-600">Total</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.upcomingActivities}</p>
              <p className="text-xs text-gray-600">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.ongoingActivities}</p>
              <p className="text-xs text-gray-600">Ongoing</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.completedActivities}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.cancelledActivities}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalParticipants}</p>
              <p className="text-xs text-gray-600">Participants</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                Rp{(stats?.totalBudget || 0).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-600">Budget</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="recreation">Recreation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="startDate">Start Date</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities List/Grid */}
      <motion.div variants={itemVariants}>
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {sortedActivities.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status)
              return (
                <Card key={activity.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Activity Image */}
                      <div className="w-full lg:w-48 h-32 lg:h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {activity.image ? (
                          <img 
                            src={activity.image} 
                            alt={activity.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
                            <Activity className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Activity Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{activity.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge className={getPriorityColor(activity.priority)}>
                              {activity.priority}
                            </Badge>
                            {activity.recurring && (
                              <Badge variant="outline">Recurring</Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-gray-400" />
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(activity.startDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">{activity.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {activity.registeredParticipants}/{activity.maxParticipants}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getTypeColor(activity.type)}>
                              {activity.type}
                            </Badge>
                            {activity.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Rp{activity.budget.toLocaleString('id-ID')}
                              </span>
                            </div>
                            {activity.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-900">{activity.rating}</span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Registration Progress</span>
                            <span>{Math.round((activity.registeredParticipants / activity.maxParticipants) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(activity.registeredParticipants / activity.maxParticipants) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedActivities.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status)
              return (
                <Card key={activity.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                      {activity.image ? (
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
                          <Activity className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{activity.title}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge className={`${getPriorityColor(activity.priority)} text-xs`}>
                            {activity.priority[0].toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-3 h-3 text-gray-400" />
                        <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                          {activity.status}
                        </Badge>
                        <Badge className={`${getTypeColor(activity.type)} text-xs`}>
                          {activity.type}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(activity.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{activity.registeredParticipants}/{activity.maxParticipants}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            Rp{(activity.budget / 1000).toFixed(0)}K
                          </span>
                        </div>
                        {activity.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-900">{activity.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="flex-1 h-6 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  )
}