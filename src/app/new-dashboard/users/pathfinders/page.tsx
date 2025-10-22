'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Compass, Users, Search, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '../../../dashboard/components/Sidebar'
import { TopBar } from '../../../dashboard/components/TopBar'

export default function PathfindersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const pathfinders = [
    {
      id: 1,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'PATHFINDER',
      status: 'Active',
      joinedDate: '2023-01-15',
      class: 'Friend',
      avatar: '/avatars/james.jpg'
    },
    {
      id: 2,
      name: 'Sophie Anderson',
      email: 'sophie.anderson@example.com',
      role: 'PATHFINDER',
      status: 'Active',
      joinedDate: '2023-03-20',
      class: 'Companion',
      avatar: '/avatars/sophie.jpg'
    },
    {
      id: 3,
      name: 'Ryan Martinez',
      email: 'ryan.martinez@example.com',
      role: 'PATHFINDER',
      status: 'Active',
      joinedDate: '2023-05-10',
      class: 'Explorer',
      avatar: '/avatars/ryan.jpg'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      role: 'PATHFINDER',
      status: 'Active',
      joinedDate: '2023-06-15',
      class: 'Ranger',
      avatar: '/avatars/lisa.jpg'
    }
  ]

  const filteredPathfinders = pathfinders.filter(pathfinder =>
    pathfinder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pathfinder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pathfinder.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/users/pathfinders" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Pathfinders" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pathfinders</h1>
              <p className="text-gray-600">Manage Pathfinder club members and their progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pathfinders</CardTitle>
                  <Compass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">Working on honors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Compass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Completed requirements</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pathfinder Directory</CardTitle>
                <CardDescription>List of all Pathfinder club members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search pathfinders..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPathfinders.map((pathfinder) => (
                    <motion.div
                      key={pathfinder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={pathfinder.avatar} alt={pathfinder.name} />
                          <AvatarFallback>{pathfinder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{pathfinder.name}</h3>
                          <p className="text-sm text-gray-600">{pathfinder.email}</p>
                          <p className="text-xs text-gray-500">Joined {pathfinder.joinedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {pathfinder.status}
                        </Badge>
                        <Badge variant="secondary">
                          Class: {pathfinder.class}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}