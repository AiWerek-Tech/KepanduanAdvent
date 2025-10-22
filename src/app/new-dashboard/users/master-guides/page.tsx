'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MasterGuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const masterGuides = [
    {
      id: 1,
      name: 'Dr. Robert Johnson',
      email: 'robert.johnson@kepanduan.org',
      phone: '+62 812-3456-7890',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2020-01-15',
      location: 'Jakarta, Indonesia',
      certifications: 12,
      students: 45,
      avatar: '/avatars/robert.jpg',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@kepanduan.org',
      phone: '+62 813-4567-8901',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2020-03-20',
      location: 'Surabaya, Indonesia',
      certifications: 15,
      students: 38,
      avatar: '/avatars/sarah.jpg',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@kepanduan.org',
      phone: '+62 814-5678-9012',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2021-01-15',
      location: 'Bandung, Indonesia',
      certifications: 8,
      students: 28,
      avatar: '/avatars/michael.jpg',
      lastActive: '3 hours ago'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@kepanduan.org',
      phone: '+62 815-6789-0123',
      role: 'MASTER_GUIDE',
      status: 'On Leave',
      joinedDate: '2021-06-10',
      location: 'Medan, Indonesia',
      certifications: 10,
      students: 32,
      avatar: '/avatars/emily.jpg',
      lastActive: '1 week ago'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@kepanduan.org',
      phone: '+62 816-7890-1234',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2022-03-20',
      location: 'Yogyakarta, Indonesia',
      certifications: 6,
      students: 22,
      avatar: '/avatars/david.jpg',
      lastActive: '5 hours ago'
    }
  ]

  const filteredGuides = masterGuides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || guide.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || guide.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200'
      case 'On Leave': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Inactive': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MASTER_GUIDE': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'SENIOR_MASTER_GUIDE': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Master Guides</h1>
            <p className="text-gray-600 mt-1">Manage and oversee Master Guide members</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            Add Master Guide
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Total Master Guides',
            value: masterGuides.length,
            change: '+2 this month',
            icon: Users,
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Active Now',
            value: masterGuides.filter(g => g.status === 'Active').length,
            change: '4 online',
            icon: Shield,
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Total Students',
            value: masterGuides.reduce((sum, g) => sum + g.students, 0),
            change: '+23 this month',
            icon: Users,
            color: 'from-purple-500 to-purple-600'
          },
          {
            title: 'Certifications',
            value: masterGuides.reduce((sum, g) => sum + g.certifications, 0),
            change: '+8 this month',
            icon: Shield,
            color: 'from-orange-500 to-orange-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search master guides..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="MASTER_GUIDE">Master Guide</option>
                  <option value="SENIOR_MASTER_GUIDE">Senior Master Guide</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Master Guides List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Master Guide Directory</CardTitle>
            <CardDescription>List of all Master Guide members ({filteredGuides.length} found)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={guide.avatar} alt={guide.name} />
                        <AvatarFallback>{guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{guide.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                          <p className="text-sm text-gray-600 truncate">{guide.email}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{guide.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {guide.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(guide.status)}>
                          {guide.status}
                        </Badge>
                        <Badge variant="outline" className={getRoleColor(guide.role)}>
                          {guide.role.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{guide.certifications}</p>
                          <p className="text-xs">Certs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{guide.students}</p>
                          <p className="text-xs">Students</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Last active: {guide.lastActive}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredGuides.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No master guides found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}