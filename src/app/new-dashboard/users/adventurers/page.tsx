'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Users, Search, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '../../../dashboard/components/Sidebar'
import { TopBar } from '../../../dashboard/components/TopBar'

export default function AdventurersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const adventurers = [
    {
      id: 1,
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      role: 'ADVENTURER',
      status: 'Active',
      joinedDate: '2023-09-15',
      class: 'Little Lamb',
      age: 6,
      avatar: '/avatars/emma.jpg'
    },
    {
      id: 2,
      name: 'Noah Smith',
      email: 'noah.smith@example.com',
      role: 'ADVENTURER',
      status: 'Active',
      joinedDate: '2023-10-20',
      class: 'Busy Bee',
      age: 7,
      avatar: '/avatars/noah.jpg'
    },
    {
      id: 3,
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      role: 'ADVENTURER',
      status: 'Active',
      joinedDate: '2023-11-10',
      class: 'Sunbeam',
      age: 8,
      avatar: '/avatars/olivia.jpg'
    },
    {
      id: 4,
      name: 'Liam Davis',
      email: 'liam.davis@example.com',
      role: 'ADVENTURER',
      status: 'Active',
      joinedDate: '2023-12-05',
      class: 'Builder',
      age: 9,
      avatar: '/avatars/liam.jpg'
    }
  ]

  const filteredAdventurers = adventurers.filter(adventurer =>
    adventurer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adventurer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adventurer.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/users/adventurers" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Adventurers" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Adventurers</h1>
              <p className="text-gray-600">Manage Adventurer club members and their activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Adventurers</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+2 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Age</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7.5</div>
                  <p className="text-xs text-muted-foreground">Years old</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Different classes</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Adventurer Directory</CardTitle>
                <CardDescription>List of all Adventurer club members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search adventurers..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredAdventurers.map((adventurer) => (
                    <motion.div
                      key={adventurer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={adventurer.avatar} alt={adventurer.name} />
                          <AvatarFallback>{adventurer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{adventurer.name}</h3>
                          <p className="text-sm text-gray-600">{adventurer.email}</p>
                          <p className="text-xs text-gray-500">Age {adventurer.age} • Joined {adventurer.joinedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {adventurer.status}
                        </Badge>
                        <Badge variant="secondary">
                          {adventurer.class}
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