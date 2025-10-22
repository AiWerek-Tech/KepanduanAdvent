'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, UserPlus, Edit, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '../../dashboard/components/Sidebar'
import { TopBar } from '../../dashboard/components/TopBar'

export default function ClubsStaffPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const staffMembers = [
    {
      id: 1,
      name: 'Dr. Robert Johnson',
      email: 'robert.johnson@example.com',
      position: 'DIRECTOR',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2020-01-15',
      phone: '+62 812-3456-7890',
      avatar: '/avatars/robert.jpg'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      position: 'VICE_DIRECTOR',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2020-03-20',
      phone: '+62 813-4567-8901',
      avatar: '/avatars/sarah.jpg'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      position: 'SECRETARY',
      role: 'CMG',
      status: 'Active',
      joinedDate: '2020-06-10',
      phone: '+62 814-5678-9012',
      avatar: '/avatars/michael.jpg'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      position: 'TREASURER',
      role: 'CMG',
      status: 'Active',
      joinedDate: '2021-01-15',
      phone: '+62 815-6789-0123',
      avatar: '/avatars/emily.jpg'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.com',
      position: 'CHAPLAIN',
      role: 'MASTER_GUIDE',
      status: 'Active',
      joinedDate: '2021-03-20',
      phone: '+62 816-7890-1234',
      avatar: '/avatars/david.jpg'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      position: 'INSTRUCTOR',
      role: 'CMG',
      status: 'Active',
      joinedDate: '2021-06-10',
      phone: '+62 817-8901-2345',
      avatar: '/avatars/lisa.jpg'
    }
  ]

  const filteredStaff = staffMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'DIRECTOR': return 'bg-red-50 text-red-700 border-red-200'
      case 'VICE_DIRECTOR': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'SECRETARY': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'TREASURER': return 'bg-green-50 text-green-700 border-green-200'
      case 'CHAPLAIN': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'INSTRUCTOR': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'DIRECTOR': return Shield
      case 'VICE_DIRECTOR': return Shield
      case 'SECRETARY': return Users
      case 'TREASURER': return Users
      case 'CHAPLAIN': return Users
      case 'INSTRUCTOR': return Users
      default: return Users
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/clubs/staff" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Staff & Roles" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff & Roles</h1>
                <p className="text-gray-600">Manage club staff members and their responsibilities</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Active members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leadership</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Director & Vice</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Instructors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Active instructors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Different roles</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>List of all club staff members and their positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search staff members..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredStaff.map((member) => {
                    const PositionIcon = getPositionIcon(member.position)
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">{member.phone} • Joined {member.joinedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPositionColor(member.position)}>
                            <PositionIcon className="h-3 w-3 mr-1" />
                            {member.position.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary">
                            {member.role.replace('_', ' ')}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}