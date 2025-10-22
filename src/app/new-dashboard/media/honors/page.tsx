'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '../../../dashboard/components/Sidebar'
import { TopBar } from '../../../dashboard/components/TopBar'

export default function PlaceholderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  
  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'Unknown'
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={getPageTitle()} />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
              <p className="text-gray-600">This page is under development</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This feature is currently being developed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p>Feature coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
