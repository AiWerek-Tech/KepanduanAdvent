'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, FileText, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '../../dashboard/components/Sidebar'
import { TopBar } from '../../dashboard/components/TopBar'

export default function ClubsHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const historyEvents = [
    {
      id: 1,
      title: 'Club Establishment',
      date: '2020-01-15',
      description: 'Kepanduan Advent club was officially established with 12 founding members.',
      type: 'milestone',
      impact: 'high'
    },
    {
      id: 2,
      title: 'First Camp Meeting',
      date: '2020-06-20',
      description: 'Successfully organized the first annual camp meeting with 25 participants.',
      type: 'event',
      impact: 'medium'
    },
    {
      id: 3,
      title: 'Master Guide Program Launch',
      date: '2021-03-10',
      description: 'Launched the Master Guide training program with 5 initial candidates.',
      type: 'program',
      impact: 'high'
    },
    {
      id: 4,
      title: 'Pathfinder Club Expansion',
      date: '2021-09-15',
      description: 'Expanded Pathfinder club to include 15 new members and new honors program.',
      type: 'expansion',
      impact: 'medium'
    },
    {
      id: 5,
      title: 'Adventurer Club Formation',
      date: '2022-01-20',
      description: 'Established Adventurer club for younger members with age-appropriate activities.',
      type: 'milestone',
      impact: 'high'
    },
    {
      id: 6,
      title: 'Regional Conference Host',
      date: '2022-08-10',
      description: 'Successfully hosted the regional Pathfinder conference with 200+ attendees.',
      type: 'event',
      impact: 'high'
    }
  ]

  const filteredEvents = historyEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'event': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'program': return 'bg-green-50 text-green-700 border-green-200'
      case 'expansion': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/clubs/history" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Club History" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Club History</h1>
              <p className="text-gray-600">Timeline of important events and milestones in our club's journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Years Active</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4+</div>
                  <p className="text-xs text-muted-foreground">Since 2020</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">Major events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Milestones</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Key achievements</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historical Timeline</CardTitle>
                <CardDescription>Important events and milestones in chronological order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search history..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline line */}
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 last:hidden"></div>
                      
                      <div className="flex items-start space-x-4">
                        {/* Timeline dot */}
                        <div className="relative z-10 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        
                        {/* Event content */}
                        <div className="flex-1 pb-8">
                          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <span className="text-sm text-gray-500">{event.date}</span>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{event.description}</p>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                              <Badge variant="outline" className={getImpactColor(event.impact)}>
                                {event.impact} impact
                              </Badge>
                            </div>
                          </div>
                        </div>
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