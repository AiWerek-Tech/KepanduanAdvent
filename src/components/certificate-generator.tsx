'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Award, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CertificateGeneratorProps {
  onCertificateCreated: () => void
}

export default function CertificateGenerator({ onCertificateCreated }: CertificateGeneratorProps) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type || !formData.title) {
      toast({
        title: "Error",
        description: "Tipe dan judul sertifikat harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Sertifikat berhasil dibuat!",
        })
        onCertificateCreated()
        setFormData({ type: '', title: '', description: '' })
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal membuat sertifikat',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat sertifikat",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-2xl"
    >
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Generate New Certificate
              </CardTitle>
              <CardDescription>
                Create a new certificate for completed achievements
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCertificateCreated}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Certificate Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adventurer">Adventurer</SelectItem>
                  <SelectItem value="Pathfinder">Pathfinder</SelectItem>
                  <SelectItem value="Master Guide">Master Guide</SelectItem>
                  <SelectItem value="Calon Master Guide">Calon Master Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Certificate Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Kelulusan Adventurer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the achievement or requirements fulfilled"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCertificateCreated}
                className="flex-1"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Generate Certificate
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