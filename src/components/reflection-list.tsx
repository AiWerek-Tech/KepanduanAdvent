"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, Trash2, MessageCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Reflection {
  id: string
  content: string
  createdAt: string
  material: {
    id: string
    title: string
    category: string
    classLevel?: string
  }
}

interface ReflectionListProps {
  materialId?: string
  refreshTrigger?: number
}

export function ReflectionList({ materialId, refreshTrigger }: ReflectionListProps) {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchReflections = async () => {
    try {
      const url = materialId 
        ? `/api/reflections?materialId=${materialId}`
        : '/api/reflections'
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setReflections(data.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat refleksi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat refleksi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reflectionId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus refleksi ini?')) {
      return
    }

    setDeletingId(reflectionId)

    try {
      const response = await fetch(`/api/reflections/${reflectionId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setReflections(prev => prev.filter(r => r.id !== reflectionId))
        toast({
          title: "Berhasil",
          description: "Refleksi berhasil dihapus",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal menghapus refleksi",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus refleksi",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchReflections()
  }, [materialId, refreshTrigger])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (reflections.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Belum ada refleksi
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Mulai menulis refleksi untuk materi yang telah Anda pelajari
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-purple-600" />
        Refleksi Saya ({reflections.length})
      </h3>
      
      {reflections.map((reflection, index) => (
        <motion.div
          key={reflection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-sm font-medium">
                      {reflection.material.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {reflection.material.category}
                    </Badge>
                    {reflection.material.classLevel && (
                      <Badge variant="outline" className="text-xs">
                        {reflection.material.classLevel}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(reflection.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(reflection.id)}
                  disabled={deletingId === reflection.id}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {deletingId === reflection.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {reflection.content}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}