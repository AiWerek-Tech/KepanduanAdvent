'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Plus, 
  History, 
  Award, 
  Users, 
  TrendingUp,
  Clock,
  Star,
  UserCheck,
  BarChart3
} from 'lucide-react'

interface ServiceYear {
  id: string
  year: number
  theme?: string
  startDate: string
  endDate: string
  isActive: boolean
  _count: {
    serviceYears: number
  }
}

interface ServiceRecord {
  id: string
  startDate: string
  endDate?: string
  isActive: boolean
  notes?: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  position?: {
    id: string
    title: string
    level: string
  }
  year: {
    id: string
    year: number
    theme?: string
    startDate: string
    endDate: string
  }
}

interface ServiceHistoryProps {
  clubId: string
  currentUserRole: string
}

export default function ServiceHistory({ clubId, currentUserRole }: ServiceHistoryProps) {
  const [clubYears, setClubYears] = useState<ServiceYear[]>([])
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateYearDialogOpen, setIsCreateYearDialogOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    theme: '',
    startDate: '',
    endDate: ''
  })

  const canManageYears = ['ADMIN', 'MASTER_GUIDE', 'DIRECTOR'].includes(currentUserRole)

  useEffect(() => {
    fetchClubYears()
    fetchServiceHistory()
    fetchStatistics()
  }, [clubId])

  const fetchClubYears = async () => {
    try {
      const response = await fetch(`/api/club-years?clubId=${clubId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setClubYears(data.clubYears)
        if (data.clubYears.length > 0) {
          const activeYear = data.clubYears.find((y: ServiceYear) => y.isActive)
          setSelectedYear(activeYear?.id || data.clubYears[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch club years:', error)
    }
  }

  const fetchServiceHistory = async () => {
    try {
      const params = new URLSearchParams({ clubId })
      if (selectedYear) params.append('yearId', selectedYear)
      
      const response = await fetch(`/api/service-history?${params}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setServiceHistory(data.serviceHistory)
      }
    } catch (error) {
      console.error('Failed to fetch service history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/service-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ clubId })
      })
      if (response.ok) {
        const data = await response.json()
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }

  const handleCreateYear = async () => {
    try {
      const response = await fetch('/api/club-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clubId,
          ...formData
        })
      })

      if (response.ok) {
        await fetchClubYears()
        setIsCreateYearDialogOpen(false)
        setFormData({
          year: new Date().getFullYear(),
          theme: '',
          startDate: '',
          endDate: ''
        })
      }
    } catch (error) {
      console.error('Failed to create club year:', error)
    }
  }

  useEffect(() => {
    if (selectedYear) {
      fetchServiceHistory()
    }
  }, [selectedYear])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Histori Pelayanan</h2>
          <p className="text-gray-600">Kelola tahun pelayanan dan histori anggota</p>
        </div>
        
        {canManageYears && (
          <Dialog open={isCreateYearDialogOpen} onOpenChange={setIsCreateYearDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Tahun Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Tahun Pelayanan Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan tahun pelayanan baru untuk klub
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="year">Tahun</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    placeholder="2024"
                  />
                </div>
                
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Input
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="Contoh: Servants of the King"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreateYear} className="flex-1">
                    Buat Tahun
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateYearDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800">Total Pelayanan</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{statistics.totalServiceYears}</div>
              <p className="text-sm text-gray-600">Semua waktu</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Aktif</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{statistics.activeServiceYears}</div>
              <p className="text-sm text-gray-600">Saat ini</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800">Jabatan</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{statistics.positionStats?.length || 0}</div>
              <p className="text-sm text-gray-600">Jenis jabatan</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-semibold text-gray-800">Tahun</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{statistics.yearStats?.length || 0}</div>
              <p className="text-sm text-gray-600">Tahun pelayanan</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Histori Pelayanan</TabsTrigger>
          <TabsTrigger value="years">Tahun Pelayanan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-6">
          {/* Year Filter */}
          {clubYears.length > 0 && (
            <div className="flex items-center gap-4">
              <Label htmlFor="year-filter">Filter Tahun:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clubYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {year.year} {year.theme && `- ${year.theme}`}
                        {year.isActive && <Badge variant="default" className="text-xs">Aktif</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Service History List */}
          <div className="space-y-4">
            {serviceHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={record.user.avatar} />
                          <AvatarFallback>
                            {record.user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800">{record.user.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {record.user.role}
                            </Badge>
                            {record.position && (
                              <Badge variant="outline" className="text-xs">
                                {record.position.title}
                              </Badge>
                            )}
                            {record.isActive && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                Aktif
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{record.year.year}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(record.startDate).toLocaleDateString('id-ID')}
                                {record.endDate && ` - ${new Date(record.endDate).toLocaleDateString('id-ID')}`}
                              </span>
                            </div>
                            
                            {record.year.theme && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{record.year.theme}</span>
                              </div>
                            )}
                          </div>
                          
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {serviceHistory.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Histori</h3>
                <p className="text-gray-600">
                  Belum ada data histori pelayanan untuk tahun yang dipilih
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="years" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubYears.map((year, index) => (
              <motion.div
                key={year.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{year.year}</CardTitle>
                          {year.isActive && (
                            <Badge variant="default" className="text-xs">Aktif</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {year.theme && (
                      <p className="text-sm text-gray-600 mb-4">{year.theme}</p>
                    )}
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(year.startDate).toLocaleDateString('id-ID')} - {new Date(year.endDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{year._count.serviceYears} anggota</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedYear(year.id)}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {clubYears.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Tahun Pelayanan</h3>
                <p className="text-gray-600 mb-4">
                  Mulai dengan membuat tahun pelayanan untuk klub
                </p>
                {canManageYears && (
                  <Button onClick={() => setIsCreateYearDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Tahun Pertama
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}