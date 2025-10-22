'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Heart,
  TrendingUp,
  Target,
  Award,
  Users,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Building,
  HandHeart,
  Gift,
  Trophy,
  Medal,
  Crown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface ServiceRecord {
  id: string
  title: string
  description: string
  type: 'community' | 'environmental' | 'educational' | 'health' | 'spiritual' | 'disaster_relief'
  date: string
  duration: number // in hours
  location: string
  participants: number
  impact: {
    peopleHelped: number
    value: number // in Rupiah
    category: string
  }
  organizer: string
  status: 'completed' | 'ongoing' | 'planned'
  rating: number
  feedback: number
  images: string[]
  tags: string[]
  partners: string[]
  outcomes: string[]
  lessons: string[]
  createdAt: string
}

interface ServiceStats {
  totalHours: number
  totalValue: number
  totalProjects: number
  totalPeopleHelped: number
  averageRating: number
  completionRate: number
  topCategories: { name: string; hours: number; value: number }[]
  monthlyTrend: { month: string; hours: number; value: number }[]
  partnerCount: number
  roi: number // Return on Investment
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

export default function ServiceHistoryPage() {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [stats, setStats] = useState<ServiceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [viewMode, setViewMode] = useState<'list' | 'analytics' | 'impact'>('list')

  useEffect(() => {
    fetchServiceHistory()
  }, [])

  const fetchServiceHistory = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockServiceRecords: ServiceRecord[] = [
        {
          id: '1',
          title: 'Community Clean-up Day',
          description: 'Organized a community-wide clean-up initiative involving local residents and youth groups.',
          type: 'environmental',
          date: '2024-01-15T08:00:00',
          duration: 6,
          location: 'Jakarta Selatan',
          participants: 45,
          impact: {
            peopleHelped: 200,
            value: 15000000,
            category: 'Environmental Impact'
          },
          organizer: 'Siti Nurhaliza',
          status: 'completed',
          rating: 4.7,
          feedback: 18,
          images: ['/images/cleanup1.jpg', '/images/cleanup2.jpg'],
          tags: ['environment', 'community', 'cleanliness'],
          partners: ['Local Government', 'Waste Management Company'],
          outcomes: [
            'Collected 500kg of waste',
            'Educated 200 residents on waste management',
            'Established 3 recycling points'
          ],
          lessons: [
            'Community engagement is key to success',
            'Need more recycling facilities',
            'Youth involvement was exceptional'
          ],
          createdAt: '2024-01-10T10:00:00'
        },
        {
          id: '2',
          title: 'Free Health Check-up Camp',
          description: 'Provided free health screenings and basic medical consultations to underserved communities.',
          type: 'health',
          date: '2024-01-08T09:00:00',
          duration: 8,
          location: 'Jakarta Timur',
          participants: 12,
          impact: {
            peopleHelped: 150,
            value: 25000000,
            category: 'Health Services'
          },
          organizer: 'Dr. Sarah Johnson',
          status: 'completed',
          rating: 4.9,
          feedback: 25,
          images: ['/images/health1.jpg'],
          tags: ['health', 'medical', 'community'],
          partners: ['City Hospital', 'Medical Association'],
          outcomes: [
            '150 people received health screenings',
            '25 critical cases identified and referred',
            'Health awareness materials distributed'
          ],
          lessons: [
            'Early detection saves lives',
            'Need more specialist doctors',
            'Follow-up system is essential'
          ],
          createdAt: '2024-01-05T14:30:00'
        },
        {
          id: '3',
          title: 'Educational Support Program',
          description: 'Tutoring and mentorship program for underprivileged children in our community.',
          type: 'educational',
          date: '2024-01-20T14:00:00',
          duration: 4,
          location: 'Community Center',
          participants: 8,
          impact: {
            peopleHelped: 30,
            value: 8000000,
            category: 'Education'
          },
          organizer: 'Ahmad Rizki',
          status: 'ongoing',
          rating: 0,
          feedback: 0,
          images: ['/images/education1.jpg'],
          tags: ['education', 'tutoring', 'children'],
          partners: ['Local Schools', 'Education Foundation'],
          outcomes: [
            '30 children receiving weekly tutoring',
            '15 children showing improvement',
            '5 children received scholarships'
          ],
          lessons: [
            'Consistency is crucial for educational impact',
            'Parental involvement increases success',
            'Need more volunteer teachers'
          ],
          createdAt: '2024-01-18T09:00:00'
        },
        {
          id: '4',
          title: 'Food Distribution Drive',
          description: 'Distributed food packages to families affected by recent economic challenges.',
          type: 'community',
          date: '2023-12-25T10:00:00',
          duration: 5,
          location: 'Jakarta Barat',
          participants: 20,
          impact: {
            peopleHelped: 100,
            value: 20000000,
            category: 'Food Security'
          },
          organizer: 'Budi Santoso',
          status: 'completed',
          rating: 4.8,
          feedback: 15,
          images: ['/images/food1.jpg', '/images/food2.jpg'],
          tags: ['food', 'distribution', 'charity'],
          partners: ['Local Restaurants', 'Food Bank'],
          outcomes: [
            '100 families received food packages',
            'Established ongoing food assistance program',
            'Created partnership with 5 local restaurants'
          ],
          lessons: [
            'Food security is ongoing need',
            'Partnerships amplify impact',
            'Need better storage facilities'
          ],
          createdAt: '2023-12-20T11:00:00'
        },
        {
          id: '5',
          title: 'Spiritual Retreat for Youth',
          description: 'Organized spiritual development retreat for young people focusing on character building.',
          type: 'spiritual',
          date: '2024-02-01T16:00:00',
          duration: 24,
          location: 'Mountain Retreat Center',
          participants: 6,
          impact: {
            peopleHelped: 40,
            value: 12000000,
            category: 'Spiritual Development'
          },
          organizer: 'Pastor Michael',
          status: 'planned',
          rating: 0,
          feedback: 0,
          images: [],
          tags: ['spiritual', 'youth', 'retreat'],
          partners: ['Church', 'Youth Organization'],
          outcomes: [],
          lessons: [],
          createdAt: '2024-01-22T16:00:00'
        }
      ]

      setServiceRecords(mockServiceRecords)
      
      // Calculate stats
      const totalHours = mockServiceRecords.reduce((sum, record) => sum + record.duration, 0)
      const totalValue = mockServiceRecords.reduce((sum, record) => sum + record.impact.value, 0)
      const totalProjects = mockServiceRecords.length
      const totalPeopleHelped = mockServiceRecords.reduce((sum, record) => sum + record.impact.peopleHelped, 0)
      const completedRecords = mockServiceRecords.filter(r => r.status === 'completed' && r.rating > 0)
      const averageRating = completedRecords.length > 0 
        ? completedRecords.reduce((sum, r) => sum + r.rating, 0) / completedRecords.length 
        : 0
      const completionRate = totalProjects > 0 ? (mockServiceRecords.filter(r => r.status === 'completed').length / totalProjects) * 100 : 0
      
      // Calculate top categories
      const categoryStats = mockServiceRecords.reduce((acc, record) => {
        const category = record.impact.category
        if (!acc[category]) {
          acc[category] = { hours: 0, value: 0 }
        }
        acc[category].hours += record.duration
        acc[category].value += record.impact.value
        return acc
      }, {} as Record<string, { hours: number; value: number }>)
      
      const topCategories = Object.entries(categoryStats)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      // Calculate monthly trend
      const monthlyTrend = [
        { month: 'Oct', hours: 45, value: 15000000 },
        { month: 'Nov', hours: 62, value: 22000000 },
        { month: 'Dec', hours: 78, value: 28000000 },
        { month: 'Jan', hours: 85, value: 32000000 }
      ]

      const partnerCount = new Set(mockServiceRecords.flatMap(r => r.partners)).size
      const roi = totalValue > 0 ? ((totalValue - (totalValue * 0.3)) / (totalValue * 0.3)) * 100 : 0

      setStats({
        totalHours,
        totalValue,
        totalProjects,
        totalPeopleHelped,
        averageRating,
        completionRate,
        topCategories,
        monthlyTrend,
        partnerCount,
        roi
      })
    } catch (error) {
      console.error('Failed to fetch service history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRecords = serviceRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || record.type === filterType
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'type':
        return a.type.localeCompare(b.type)
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'duration':
        return b.duration - a.duration
      case 'impact':
        return b.impact.value - a.impact.value
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'community': return 'bg-blue-100 text-blue-800'
      case 'environmental': return 'bg-green-100 text-green-800'
      case 'educational': return 'bg-purple-100 text-purple-800'
      case 'health': return 'bg-red-100 text-red-800'
      case 'spiritual': return 'bg-indigo-100 text-indigo-800'
      case 'disaster_relief': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service History</h1>
            <p className="text-gray-600 text-sm sm:text-base">Track community service and social impact</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Impact Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalHours}</p>
              <p className="text-xs text-gray-600">Hours</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{formatCurrency(stats?.totalValue || 0).replace('Rp', '').replace(/\s/g, '').slice(0, 4)}K</p>
              <p className="text-xs text-gray-600">Value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalProjects}</p>
              <p className="text-xs text-gray-600">Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalPeopleHelped}</p>
              <p className="text-xs text-gray-600">People Helped</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.completionRate.toFixed(0)}%</p>
              <p className="text-xs text-gray-600">Completion</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.partnerCount}</p>
              <p className="text-xs text-gray-600">Partners</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.roi.toFixed(0)}%</p>
              <p className="text-xs text-gray-600">ROI</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-xs sm:text-sm"
          >
            <Heart className="w-4 h-4 mr-2" />
            Service Records
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('analytics')}
            className="text-xs sm:text-sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={viewMode === 'impact' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('impact')}
            className="text-xs sm:text-sm"
          >
            <Target className="w-4 h-4 mr-2" />
            Impact
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      {viewMode === 'list' && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search service records..."
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
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="disaster_relief">Disaster Relief</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="impact">Impact Value</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content Based on View Mode */}
      {viewMode === 'list' && (
        <motion.div variants={itemVariants}>
          <div className="space-y-4">
            {sortedRecords.map((record) => (
              <Card key={record.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{record.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge className={getTypeColor(record.type)}>
                            {record.type.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.duration}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">{record.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.participants} volunteers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.impact.peopleHelped} helped</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatCurrency(record.impact.value).replace('Rp', 'Rp').slice(0, 8)}...</span>
                        </div>
                      </div>

                      {/* Tags and Partners */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {record.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {record.partners.slice(0, 2).map((partner, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              🤝 {partner}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4">
                          {record.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-900">{record.rating}</span>
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

                      {/* Outcomes */}
                      {record.outcomes.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 mb-2">Key Outcomes:</h4>
                          <ul className="text-xs text-green-700 space-y-1">
                            {record.outcomes.slice(0, 2).map((outcome, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {viewMode === 'analytics' && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Service Trend</CardTitle>
                <CardDescription>Service hours and value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.monthlyTrend.map((month, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{month.month}</span>
                        <span>{month.hours}h / {formatCurrency(month.value).replace('Rp', 'Rp').slice(0, 6)}...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(month.hours / 100) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-8">{month.hours}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(month.value / 40000000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">
                            {(month.value / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Top Service Categories</CardTitle>
                <CardDescription>Impact by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <span>{category.hours}h / {formatCurrency(category.value).replace('Rp', 'Rp').slice(0, 6)}...</span>
                      </div>
                      <Progress 
                        value={(category.value / 30000000) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {viewMode === 'impact' && (
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Impact Overview */}
            <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Social Impact Overview</CardTitle>
                <CardDescription>Comprehensive impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalPeopleHelped}</p>
                    <p className="text-sm text-gray-600">Lives Impacted</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalHours}</p>
                    <p className="text-sm text-gray-600">Service Hours</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalValue || 0).replace('Rp', 'Rp').slice(0, 8)}...</p>
                    <p className="text-sm text-gray-600">Economic Value</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{stats?.roi.toFixed(0)}%</p>
                    <p className="text-sm text-gray-600">Return on Investment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Service milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">100+ Hours Club</p>
                      <p className="text-xs text-gray-600">Dedicated volunteers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Medal className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Community Hero</p>
                      <p className="text-xs text-gray-600">Outstanding impact</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium">Service Excellence</p>
                      <p className="text-xs text-gray-600">Quality service delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-medium">Impact Leader</p>
                      <p className="text-xs text-gray-600">Maximum community benefit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}