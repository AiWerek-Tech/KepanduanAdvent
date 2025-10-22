'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CertificateCard from './certificate-card'
import CertificateGenerator from './certificate-generator'
import { 
  Award, 
  Download, 
  Plus, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'

interface Certificate {
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
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

export default function CertificateList() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGenerator, setShowGenerator] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCertificates(data.certificates)
        }
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCertificateCreated = () => {
    fetchCertificates()
    setShowGenerator(false)
  }

  const handleRevoke = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id))
  }

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || cert.type === filterType
    return matchesSearch && matchesType
  })

  const certificateTypes = ['all', ...Array.from(new Set(certificates.map(c => c.type)))]

  const stats = {
    total: certificates.length,
    valid: certificates.filter(c => c.isActive && (!c.expiresAt || new Date(c.expiresAt) >= new Date())).length,
    expired: certificates.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date()).length,
    byType: certificates.reduce((acc, cert) => {
      acc[cert.type] = (acc[cert.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            My Certificates
          </h2>
          <p className="text-gray-600">
            Manage your digital certificates and achievements
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowGenerator(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Certificate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Certificates</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
            <p className="text-sm text-gray-600">Valid</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.expired}</div>
            <p className="text-sm text-gray-600">Expired</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(stats.byType).length}
            </div>
            <p className="text-sm text-gray-600">Types</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm appearance-none"
            >
              <option value="all">All Types</option>
              {certificateTypes.map((type) => (
                <option key={type} value={type}>
                  {type} ({stats.byType[type] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Certificate Generator Modal */}
      {showGenerator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowGenerator(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <CertificateGenerator onCertificateCreated={handleCertificateCreated} />
          </motion.div>
        </motion.div>
      )}

      {/* Certificates Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCertificates.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="col-span-full text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Generate your first certificate to get started'}
            </p>
          </motion.div>
        ) : (
          filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onRevoke={handleRevoke}
              onRefresh={fetchCertificates}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}