'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  MapPin, 
  Clock, 
  Users,
  Filter,
  Bell,
  BellOff,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface Activity {
  id: string
  clubId: string
  title: string
  description?: string
  category: string
  startDate: string
  endDate?: string
  location?: string
  status: string
  isReminder: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  creator?: {
    name: string
    email: string
  }
}

interface ActivityCalendarProps {
  clubId: string
}

const CATEGORIES = [
  'Pelatihan',
  'Ibadah',
  'Penamatan',
  'Kemah',
  'Pertemuan Rutin',
  'Kegiatan Sosial',
  'Lainnya'
]

const STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const CATEGORY_COLORS = {
  'Pelatihan': 'bg-purple-100 text-purple-800',
  'Ibadah': 'bg-indigo-100 text-indigo-800',
  'Penamatan': 'bg-yellow-100 text-yellow-800',
  'Kemah': 'bg-green-100 text-green-800',
  'Pertemuan Rutin': 'bg-blue-100 text-blue-800',
  'Kegiatan Sosial': 'bg-pink-100 text-pink-800',
  'Lainnya': 'bg-gray-100 text-gray-800'
}

export default function ActivityCalendar({ clubId }: ActivityCalendarProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    isReminder: false
  })

  useEffect(() => {
    fetchActivities()
  }, [clubId])

  useEffect(() => {
    filterActivities()
  }, [activities, categoryFilter, statusFilter])

  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/activities?clubId=${clubId}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter)
    }

    setFilteredActivities(filtered)
  }

  const handleAddActivity = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      startDate: '',
      endDate: '',
      location: '',
      isReminder: false
    })
    setIsAddDialogOpen(true)
  }

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setFormData({
      title: activity.title,
      description: activity.description || '',
      category: activity.category,
      startDate: activity.startDate,
      endDate: activity.endDate || '',
      location: activity.location || '',
      isReminder: activity.isReminder
    })
    setIsAddDialogOpen(true)
  }

  const handleSaveActivity = async () => {
    try {
      setIsLoading(true)
      const url = selectedActivity ? `/api/activities/${selectedActivity.id}` : '/api/activities'
      const method = selectedActivity ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clubId,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
        }),
      })

      if (response.ok) {
        fetchActivities()
        setIsAddDialogOpen(false)
        setSelectedActivity(null)
      }
    } catch (error) {
      console.error('Error saving activity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const handleToggleReminder = async (activityId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isReminder: !currentStatus })
      })
      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error('Error toggling reminder:', error)
    }
  }

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800'
  }

  const getActivitiesForDate = (date: Date) => {
    return filteredActivities.filter(activity => {
      const activityDate = new Date(activity.startDate)
      return activityDate.toDateString() === date.toDateString()
    })
  }

  const upcomingActivities = filteredActivities
    .filter(activity => new Date(activity.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Kalender Kegiatan</h2>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {filteredActivities.length} kegiatan
          </Badge>
        </div>
        <Button 
          onClick={handleAddActivity}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kegiatan
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
              <CardDescription>
                Lihat kegiatan klub per tanggal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasActivity: (date) => getActivitiesForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasActivity: {
                    backgroundColor: 'rgb(147, 51, 234)',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              {/* Activities for selected date */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Kegiatan pada {selectedDate.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <div className="space-y-2">
                  {getActivitiesForDate(selectedDate).map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-white/50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">{activity.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(activity.category)}>
                              {activity.category}
                            </Badge>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          {activity.location && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.startDate).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleReminder(activity.id, activity.isReminder)}
                          >
                            {activity.isReminder ? (
                              <Bell className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <BellOff className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {getActivitiesForDate(selectedDate).length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Tidak ada kegiatan pada tanggal ini
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="upcoming">Akan Datang</SelectItem>
                    <SelectItem value="ongoing">Sedang Berlangsung</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Activities */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Kegiatan Akan Datang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-white/50 rounded-lg border border-gray-200"
                  >
                    <h5 className="font-medium text-gray-800 text-sm">{activity.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(activity.category)} variant="secondary">
                        {activity.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(activity.startDate).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </motion.div>
                ))}
                {upcomingActivities.length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    Tidak ada kegiatan akan datang
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </DialogTitle>
            <DialogDescription>
              {selectedActivity ? 'Edit detail kegiatan' : 'Tambahkan kegiatan baru ke kalender klub'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Judul Kegiatan</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Masukkan judul kegiatan"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsikan kegiatan ini"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Tanggal & Waktu Mulai</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Tanggal & Waktu Selesai</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Masukkan lokasi kegiatan"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isReminder"
                checked={formData.isReminder}
                onChange={(e) => setFormData(prev => ({ ...prev, isReminder: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isReminder">Aktifkan pengingat otomatis</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleSaveActivity}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}