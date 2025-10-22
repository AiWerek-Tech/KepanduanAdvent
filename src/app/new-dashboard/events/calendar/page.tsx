'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sidebar } from '../../../dashboard/components/Sidebar'
import { TopBar } from '../../../dashboard/components/TopBar'

export default function EventsCalendarPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/events/calendar" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Event Calendar" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Calendar</h1>
                <p className="text-gray-600">View and manage upcoming club events</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Interactive calendar with all club events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-gray-500">
                  <Calendar className="h-16 w-16 mb-2" />
                  <span className="ml-2">Calendar component coming soon</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}