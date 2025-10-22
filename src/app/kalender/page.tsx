'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Users, Edit, Trash2, X, Bell } from 'lucide-react'
import { format, addDays, isSameDay, isWithinInterval } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'

interface Event {
  id: string
  title: string
  description?: string
  date: Date
  location?: string
  eventType: string
  targetRole?: string
  createdBy: string
  userName: string
  userRole: string
}

const eventTypes = [
  'Meeting',
  'Camp',
  'Ceremony',
  'Workshop',
  'Service',
  'Competition',
  'Social',
  'Training'
]

const roleOptions = [
  { value: '', label: 'Semua Role' },
  { value: 'ADVENTURER', label: 'Adventurer' },
  { value: 'PATHFINDER', label: 'Pathfinder' },
  { value: 'MASTER_GUIDE', label: 'Master Guide' },
  { value: 'CMG', label: 'CMG' },
  { value: 'CONTRIBUTOR', label: 'Contributor' },
  { value: 'ADMIN', label: 'Admin' }
]

const eventTypeColors: Record<string, string> = {
  'Meeting': 'bg-blue-100 text-blue-700 border-blue-200',
  'Camp': 'bg-green-100 text-green-700 border-green-200',
  'Ceremony': 'bg-purple-100 text-purple-700 border-purple-200',
  'Workshop': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Service': 'bg-red-100 text-red-700 border-red-200',
  'Competition': 'bg-orange-100 text-orange-700 border-orange-200',
  'Social': 'bg-pink-100 text-pink-700 border-pink-200',
  'Training': 'bg-indigo-100 text-indigo-700 border-indigo-200'
}

export default function KalenderPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const [canCreateEvents, setCanCreateEvents] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    location: '',
    eventType: 'Meeting',
    targetRole: ''
  })

  useEffect(() => {
    fetchUserRole()
    fetchEvents()
  }, [])

  useEffect(() => {
    // Check for upcoming events and show reminders
    checkUpcomingEvents()
    const interval = setInterval(checkUpcomingEvents, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [events])

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const user = await response.json()
        setUserRole(user.role)
        setCanCreateEvents(user.role === 'ADMIN' || user.role === 'MASTER_GUIDE')
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        const formattedEvents = data.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          userName: event.user?.name || 'Unknown',
          userRole: event.user?.role || 'Unknown'
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Gagal memuat kegiatan')
    } finally {
      setLoading(false)
    }
  }

  const checkUpcomingEvents = () => {
    const now = new Date()
    const tomorrow = addDays(now, 1)
    
    events.forEach(event => {
      const eventDate = new Date(event.date)
      const isTomorrow = isSameDay(eventDate, tomorrow)
      const isToday = isSameDay(eventDate, now)
      
      if (isTomorrow || isToday) {
        const timeDiff = eventDate.getTime() - now.getTime()
        const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60))
        
        // Show reminder 1 day before or 1 hour before
        if ((isTomorrow && hoursUntil <= 24) || (isToday && hoursUntil <= 1 && hoursUntil > 0)) {
          toast.info(`📅 Reminder: ${event.title} - ${format(eventDate, 'dd MMM yyyy, HH:mm', { locale: id })}`, {
            duration: 5000
          })
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: eventDateTime.toISOString(),
        location: formData.location.trim(),
        eventType: formData.eventType,
        targetRole: formData.targetRole || null
      }

      let response
      if (isEditing && selectedEvent) {
        response = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gagal menyimpan kegiatan')
      }

      toast.success(isEditing ? 'Kegiatan berhasil diperbarui!' : 'Kegiatan berhasil ditambahkan!')
      setShowEventDialog(false)
      setIsEditing(false)
      resetForm()
      fetchEvents()
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus kegiatan')
      }

      toast.success('Kegiatan berhasil dihapus!')
      setShowDetailDialog(false)
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Gagal menghapus kegiatan')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      location: '',
      eventType: 'Meeting',
      targetRole: ''
    })
    setSelectedEvent(null)
  }

  const openEventDialog = (event?: Event) => {
    if (event) {
      setIsEditing(true)
      setSelectedEvent(event)
      setFormData({
        title: event.title,
        description: event.description || '',
        date: format(event.date, 'yyyy-MM-dd'),
        time: format(event.date, 'HH:mm'),
        location: event.location || '',
        eventType: event.eventType,
        targetRole: event.targetRole || ''
      })
    } else {
      setIsEditing(false)
      resetForm()
    }
    setShowEventDialog(true)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null
    
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length === 0) return null
    
    return (
      <div className="flex flex-wrap gap-1 justify-center mt-1">
        {dayEvents.slice(0, 3).map((_, index) => (
          <div
            key={index}
            className="w-1 h-1 bg-purple-600 rounded-full"
          />
        ))}
      </div>
    )
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return ''
    
    const dayEvents = getEventsForDate(date)
    const hasEvents = dayEvents.length > 0
    
    if (hasEvents) {
      return 'bg-purple-50 text-purple-900 font-semibold'
    }
    
    return ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat kalender kegiatan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-gradient-purple text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kalender Kegiatan
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Jadwal lengkap kegiatan Kepanduan Advent. 
              Tetap update dengan acara terbaru dan dapatkan reminder otomatis.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {format(selectedDate, 'MMMM yyyy', { locale: id })}
                  </CardTitle>
                  {canCreateEvents && (
                    <Button
                      onClick={() => openEventDialog()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kegiatan
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="react-calendar-wrapper">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="w-full border-0"
                    locale="id-ID"
                  />
                </div>
                
                {/* Events for Selected Date */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                    Kegiatan pada {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                  </h3>
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map(event => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedEvent(event)
                            setShowDetailDialog(true)
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={eventTypeColors[event.eventType]}>
                                  {event.eventType}
                                </Badge>
                                {event.targetRole && (
                                  <Badge variant="outline" className="text-xs">
                                    {roleOptions.find(r => r.value === event.targetRole)?.label}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-800">{event.title}</h4>
                              {event.location && (
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {format(event.date, 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
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
            {/* Upcoming Events */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Kegiatan Mendatang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingEvents().length > 0 ? (
                    getUpcomingEvents().map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedEvent(event)
                          setShowDetailDialog(true)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={eventTypeColors[event.eventType]} variant="outline">
                            {event.eventType}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-800 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-600">
                          {format(event.date, 'dd MMM yyyy, HH:mm', { locale: id })}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Tidak ada kegiatan mendatang
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Statistik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Kegiatan</span>
                    <span className="font-semibold text-purple-600">{events.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bulan Ini</span>
                    <span className="font-semibold text-purple-600">
                      {events.filter(e => {
                        const eventMonth = e.date.getMonth()
                        const currentMonth = new Date().getMonth()
                        return eventMonth === currentMonth
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Role Anda</span>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">
                      {roleOptions.find(r => r.value === userRole)?.label || userRole}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Perbarui informasi kegiatan' : 'Tambahkan kegiatan baru ke kalender'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Judul Kegiatan *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul kegiatan"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Deskripsi
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kegiatan (opsional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tanggal *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Waktu *
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Lokasi
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Lokasi kegiatan (opsional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jenis Kegiatan *
              </label>
              <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Target Role
              </label>
              <Select value={formData.targetRole} onValueChange={(value) => setFormData({ ...formData, targetRole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih target role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {isEditing ? 'Update' : 'Simpan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEventDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      Oleh: {selectedEvent.userName} ({selectedEvent.userRole})
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailDialog(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={eventTypeColors[selectedEvent.eventType]}>
                    {selectedEvent.eventType}
                  </Badge>
                  {selectedEvent.targetRole && (
                    <Badge variant="outline">
                      {roleOptions.find(r => r.value === selectedEvent.targetRole)?.label}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{format(selectedEvent.date, 'dd MMMM yyyy', { locale: id })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{format(selectedEvent.date, 'HH:mm')}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Deskripsi</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {canCreateEvents && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        openEventDialog(selectedEvent)
                        setShowDetailDialog(false)
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedEvent.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .react-calendar-wrapper {
          background: white;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .react-calendar {
          border: none;
          font-family: inherit;
          width: 100%;
        }
        
        .react-calendar__tile {
          border-radius: 0.375rem;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgb(147 51 234 / 0.1);
        }
        
        .react-calendar__tile--active {
          background-color: rgb(147 51 234);
          color: white;
        }
        
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background-color: rgb(126 34 206);
        }
        
        .react-calendar__navigation button {
          color: rgb(147 51 234);
          font-weight: 600;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgb(147 51 234 / 0.1);
        }
        
        .react-calendar__month-view__weekdays__weekday {
          color: rgb(107 114 128);
          font-weight: 600;
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: rgb(239 68 68);
        }
      `}</style>
    </div>
  )
}