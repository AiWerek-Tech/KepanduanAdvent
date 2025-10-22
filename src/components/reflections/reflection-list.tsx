'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, Heart, Loader2, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Reflection {
  id: string
  content: string
  createdAt: string
  material: {
    id: string
    title: string
    category: string
    classLevel: string
  }
}

interface ReflectionListProps {
  materialId?: string
  limit?: number
}

export function ReflectionList({ materialId, limit }: ReflectionListProps) {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchReflections()
  }, [materialId])

  const fetchReflections = async () => {
    try {
      setLoading(true)
      const url = materialId 
        ? `/api/reflections?materialId=${materialId}`
        : '/api/reflections'
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch reflections')
      
      const data = await response.json()
      setReflections(data)
    } catch (error) {
      console.error('Error fetching reflections:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayedReflections = limit && !showAll 
    ? reflections.slice(0, limit) 
    : reflections

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Memuat refleksi...</span>
      </div>
    )
  }

  if (reflections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          {materialId 
            ? 'Belum ada refleksi untuk materi ini. Jadilah yang pertama!'
            : 'Belum ada refleksi. Mulai tulis refleksi Anda dari halaman materi.'
          }
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600" />
          Refleksi Saya
        </h3>
        {limit && reflections.length > limit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-purple-600 hover:text-purple-700"
          >
            {showAll ? 'Tampilkan Sedikit' : `Tampilkan Semua (${reflections.length})`}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {displayedReflections.map((reflection, index) => (
          <motion.div
            key={reflection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-gray-800 mb-2">
                      {reflection.material.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {reflection.material.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                        {reflection.material.classLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 ml-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(reflection.createdAt), 'dd MMM yyyy', { locale: id })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {reflection.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}