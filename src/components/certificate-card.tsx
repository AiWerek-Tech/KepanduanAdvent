'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Calendar,
  Award
} from 'lucide-react'

interface CertificateCardProps {
  certificate: {
    id: string
    type: string
    title: string
    description?: string
    qrCode: string
    pdfUrl: string
    issuedAt: string
    expiresAt?: string
    isActive: boolean
  }
  onRevoke?: (id: string) => void
  onRefresh?: () => void
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

export default function CertificateCard({ certificate, onRevoke, onRefresh }: CertificateCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getStatusBadge = () => {
    const isExpired = certificate.expiresAt && new Date(certificate.expiresAt) < new Date()
    
    if (isExpired) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Kadaluarsa
        </Badge>
      )
    }
    
    if (!certificate.isActive) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Tidak Aktif
        </Badge>
      )
    }
    
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Valid
      </Badge>
    )
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Adventurer': 'from-purple-400 to-pink-400',
      'Pathfinder': 'from-blue-400 to-purple-400',
      'Master Guide': 'from-indigo-400 to-purple-400',
      'Calon Master Guide': 'from-orange-400 to-red-400',
    }
    return colors[type] || 'from-gray-400 to-gray-600'
  }

  const handleDownload = () => {
    window.open(certificate.pdfUrl, '_blank')
  }

  const handleVerify = () => {
    window.open(`/verify-certificate/${certificate.qrCode}`, '_blank')
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor(certificate.type)} rounded-lg flex items-center justify-center`}>
                  <Award className="w-4 h-4 text-white" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {certificate.type}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{certificate.title}</CardTitle>
              {certificate.description && (
                <CardDescription className="mt-2 text-sm">
                  {certificate.description}
                </CardDescription>
              )}
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Date Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Dikeluarkan: {new Date(certificate.issuedAt).toLocaleDateString('id-ID')}</span>
            </div>
            {certificate.expiresAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Kadaluarsa: {new Date(certificate.expiresAt).toLocaleDateString('id-ID')}</span>
              </div>
            )}
          </div>

          {/* Certificate ID */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">ID Sertifikat</p>
            <p className="font-mono text-xs text-gray-700 break-all">{certificate.qrCode}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-1" />
              Unduh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              disabled={isLoading}
            >
              <QrCode className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}