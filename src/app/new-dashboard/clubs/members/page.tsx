'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Compass,
  Sparkles
} from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  phone: string
  role: 'ADVENTURER' | 'PATHFINDER' | 'CMG' | 'MASTER_GUIDE' | 'ADMIN'
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  lastActive: string
  avatar: string
  address: string
  skills: string[]
  interests: string[]
  completedActivities: number
  totalActivities: number
  certificates: number
  rating: number
  position: string
  group: string
}

interface MemberStats {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  pendingMembers: number
  newMembersThisMonth: number
  averageRating: number
  totalActivities: number
  totalCertificates: number
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState<MemberStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const itemsPerPage = 10

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMembers: Member[] = [
        {
          id: '1',
          name: 'Ahmad Rizki',
          email: 'ahmad.rizki@email.com',
          phone: '+62 812 3456 7890',
          role: 'MASTER_GUIDE',
          status: 'active',
          joinDate: '2020-01-15',
          lastActive: '2024-01-20',
          avatar: '/images/ahmad.jpg',
          address: 'Jakarta Selatan',
          skills: ['Leadership', 'Communication', 'First Aid'],
          interests: ['Outdoor Activities', 'Teaching', 'Community Service'],
          completedActivities: 45,
          totalActivities: 50,
          certificates: 12,
          rating: 4.8,
          position: 'Club Director',
          group: 'Senior Guides'
        },
        {
          id: '2',
          name: 'Siti Nurhaliza',
          email: 'siti.nurhaliza@email.com',
          phone: '+62 813 4567 8901',
          role: 'PATHFINDER',
          status: 'active',
          joinDate: '2021-03-20',
          lastActive: '2024-01-19',
          avatar: '/images/siti.jpg',
          address: 'Jakarta Pusat',
          skills: ['Navigation', 'Cooking', 'Art'],
          interests: ['Music', 'Art', 'Nature'],
          completedActivities: 28,
          totalActivities: 35,
          certificates: 8,
          rating: 4.6,
          position: 'Group Leader',
          group: 'Pathfinder Group A'
        },
        {
          id: '3',
          name: 'Budi Santoso',
          email: 'budi.santoso@email.com',
          phone: '+62 814 5678 9012',
          role: 'ADVENTURER',
          status: 'active',
          joinDate: '2022-06-10',
          lastActive: '2024-01-18',
          avatar: '/images/budi.jpg',
          address: 'Jakarta Barat',
          skills: ['Crafts', 'Singing', 'Storytelling'],
          interests: ['Games', 'Stories', 'Art'],
          completedActivities: 15,
          totalActivities: 20,
          certificates: 5,
          rating: 4.9,
          position: 'Member',
          group: 'Adventurer Group B'
        },
        {
          id: '4',
          name: 'Maya Putri',
          email: 'maya.putri@email.com',
          phone: '+62 815 6789 0123',
          role: 'CMG',
          status: 'pending',
          joinDate: '2023-08-15',
          lastActive: '2024-01-17',
          avatar: '/images/maya.jpg',
          address: 'Jakarta Utara',
          skills: ['Teaching', 'Organization', 'Mentoring'],
          interests: ['Education', 'Youth Development', 'Leadership'],
          completedActivities: 8,
          totalActivities: 15,
          certificates: 3,
          rating: 4.5,
          position: 'Trainee',
          group: 'CMG Training'
        },
        {
          id: '5',
          name: 'Rizky Pratama',
          email: 'rizky.pratama@email.com',
          phone: '+62 816 7890 1234',
          role: 'PATHFINDER',
          status: 'inactive',
          joinDate: '2021-11-25',
          lastActive: '2023-12-20',
          avatar: '/images/rizky.jpg',
          address: 'Jakarta Timur',
          skills: ['Sports', 'Technology', 'Photography'],
          interests: ['Technology', 'Sports', 'Media'],
          completedActivities: 22,
          totalActivities: 30,
          certificates: 6,
          rating: 4.3,
          position: 'Member',
          group: 'Pathfinder Group B'
        }
      ]

      setMembers(mockMembers)
      
      // Calculate stats
      const totalMembers = mockMembers.length
      const activeMembers = mockMembers.filter(m => m.status === 'active').length
      const inactiveMembers = mockMembers.filter(m => m.status === 'inactive').length
      const pendingMembers = mockMembers.filter(m => m.status === 'pending').length
      const newMembersThisMonth = mockMembers.filter(m => {
        const joinDate = new Date(m.joinDate)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear
      }).length
      const averageRating = mockMembers.reduce((sum, m) => sum + m.rating, 0) / totalMembers
      const totalActivities = mockMembers.reduce((sum, m) => sum + m.completedActivities, 0)
      const totalCertificates = mockMembers.reduce((sum, m) => sum + m.certificates, 0)

      setStats({
        totalMembers,
        activeMembers,
        inactiveMembers,
        pendingMembers,
        newMembersThisMonth,
        averageRating,
        totalActivities,
        totalCertificates
      })
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'role':
        return a.role.localeCompare(b.role)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'MASTER_GUIDE': return 'bg-purple-100 text-purple-800'
      case 'CMG': return 'bg-orange-100 text-orange-800'
      case 'PATHFINDER': return 'bg-blue-100 text-blue-800'
      case 'ADVENTURER': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return Award
      case 'MASTER_GUIDE': return Star
      case 'CMG': return UserCheck
      case 'PATHFINDER': return Compass
      case 'ADVENTURER': return Sparkles
      default: return Users
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Members & Staff</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage club members and track their progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalMembers}</p>
              <p className="text-xs text-gray-600">Total</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.activeMembers}</p>
              <p className="text-xs text-gray-600">Active</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.inactiveMembers}</p>
              <p className="text-xs text-gray-600">Inactive</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.pendingMembers}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">+{stats?.newMembersThisMonth}</p>
              <p className="text-xs text-gray-600">New</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalActivities}</p>
              <p className="text-xs text-gray-600">Activities</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalCertificates}</p>
              <p className="text-xs text-gray-600">Certificates</p>
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
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MASTER_GUIDE">Master Guide</SelectItem>
                    <SelectItem value="CMG">CMG</SelectItem>
                    <SelectItem value="PATHFINDER">Pathfinder</SelectItem>
                    <SelectItem value="ADVENTURER">Adventurer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="joinDate">Join Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
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
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Members List/Grid */}
      <motion.div variants={itemVariants}>
        {viewMode === 'list' ? (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm">Member</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm">Role</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm hidden md:table-cell">Group</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Progress</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm hidden xl:table-cell">Rating</th>
                      <th className="text-left p-4 font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role)
                      return (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                {member.avatar ? (
                                  <img 
                                    src={member.avatar} 
                                    alt={member.name} 
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <Users className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getRoleColor(member.role)}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">
                                {member.role.replace('_', ' ')}
                              </span>
                              <span className="sm:hidden">
                                {member.role.split('_')[0]}
                              </span>
                            </Badge>
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <p className="text-sm text-gray-900">{member.group}</p>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${(member.completedActivities / member.totalActivities) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {member.completedActivities}/{member.totalActivities}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 hidden xl:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-900">{member.rating}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
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
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role)
              return (
                <Card key={member.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getRoleColor(member.role)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {member.role.split('_')[0]}
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p>Group: {member.group}</p>
                        <p>Position: {member.position}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{member.completedActivities}/{member.totalActivities}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(member.completedActivities / member.totalActivities) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-900">{member.rating}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedMembers.length)} of {sortedMembers.length} members
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}