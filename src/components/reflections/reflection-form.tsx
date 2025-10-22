'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Heart, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReflectionFormProps {
  materialId: string
  materialTitle: string
  materialCategory: string
  classLevel: string
  onReflectionAdded?: () => void
}

export function ReflectionForm({
  materialId,
  materialTitle,
  materialCategory,
  classLevel,
  onReflectionAdded
}: ReflectionFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Silakan tulis refleksi Anda terlebih dahulu')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId,
          content: content.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gagal menyimpan refleksi')
      }

      const reflection = await response.json()
      toast.success('Refleksi berhasil disimpan!')
      setContent('')
      onReflectionAdded?.()
    } catch (error) {
      console.error('Error saving reflection:', error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Heart className="w-5 h-5" />
            Refleksi Saya
          </CardTitle>
          <CardDescription>
            Bagikan pemikiran dan pengalaman Anda setelah mempelajari materi ini
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {materialTitle}
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              {materialCategory}
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-700">
              {classLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan refleksi Anda di sini... Apa yang Anda pelajari? Bagaimana perasaan Anda? Apa yang akan Anda lakukan berbeda?"
                className="min-h-[120px] resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white/80 backdrop-blur-sm"
                disabled={isSubmitting}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {content.length} karakter
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Refleksi Anda akan membantu perkembangan spiritual dan karakter Anda
              </p>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-gradient-purple hover:opacity-90 text-white px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Refleksi
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}