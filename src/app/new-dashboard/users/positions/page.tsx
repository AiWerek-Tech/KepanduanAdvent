'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PlaceholderPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coming Soon</h1>
          <p className="text-gray-600 mt-1">This feature is currently under development</p>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Feature in Development</CardTitle>
          <CardDescription>This page is being built with advanced features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Advanced features coming soon...</p>
            <Button className="mt-4" variant="outline">
              Notify When Ready
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
