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
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Crown, 
  Star,
  UserCheck,
  Calendar,
  Settings
} from 'lucide-react'

interface Position {
  id: string
  title: string
  description?: string
  level: string
  permissions: any
  isActive: boolean
  _count: {
    members: number
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  position?: {
    id: string
    title: string
    level: string
  }
}

interface PositionManagerProps {
  clubId: string
  currentUserRole: string
}

const positionLevels = {
  'MEMBER': { label: 'Anggota', icon: Users, color: 'bg-gray-100 text-gray-800' },
  'LEADER': { label: 'Pemimpin', icon: Star, color: 'bg-blue-100 text-blue-800' },
  'INSTRUCTOR': { label: 'Instruktur', icon: UserCheck, color: 'bg-green-100 text-green-800' },
  'DIRECTOR': { label: 'Direktur', icon: Crown, color: 'bg-purple-100 text-purple-800' },
  'SECRETARY': { label: 'Sekretaris', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  'TREASURER': { label: 'Bendahara', icon: Shield, color: 'bg-yellow-100 text-yellow-800' },
  'CHAPLAIN': { label: 'Pendeta', icon: Star, color: 'bg-indigo-100 text-indigo-800' }
}

export default function PositionManager({ clubId, currentUserRole }: PositionManagerProps) {
  const [positions, setPositions] = useState<Position[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'MEMBER',
    permissions: {}
  })

  const canManagePositions = ['ADMIN', 'MASTER_GUIDE', 'DIRECTOR'].includes(currentUserRole)

  useEffect(() => {
    fetchPositions()
    fetchMembers()
  }, [clubId])

  const fetchPositions = async () => {
    try {
      const response = await fetch(`/api/positions?clubId=${clubId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setPositions(data.positions)
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const handleCreatePosition = async () => {
    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          clubId,
          ...formData
        })
      })

      if (response.ok) {
        await fetchPositions()
        setIsCreateDialogOpen(false)
        setFormData({ title: '', description: '', level: 'MEMBER', permissions: {} })
      }
    } catch (error) {
      console.error('Failed to create position:', error)
    }
  }

  const handleAssignPosition = async () => {
    if (!selectedMember || !selectedPosition) return

    try {
      const response = await fetch('/api/members/assign-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedMember.id,
          positionId: selectedPosition.id,
          yearId: 'current-year-id', // This should be dynamic
          startDate: new Date().toISOString(),
          notes: `Assigned as ${selectedPosition.title}`
        })
      })

      if (response.ok) {
        await fetchMembers()
        await fetchPositions()
        setIsAssignDialogOpen(false)
        setSelectedMember(null)
        setSelectedPosition(null)
      }
    } catch (error) {
      console.error('Failed to assign position:', error)
    }
  }

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
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Jabatan</h2>
          <p className="text-gray-600">Kelola jabatan dan penugasan anggota klub</p>
        </div>
        
        {canManagePositions && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Jabatan Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Jabatan Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan jabatan baru untuk klub Anda
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Nama Jabatan</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Ketua Adventurer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="level">Level Jabatan</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(positionLevels).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <value.icon className="w-4 h-4" />
                            {value.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi tanggung jawab jabatan..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreatePosition} className="flex-1">
                    Buat Jabatan
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.map((position, index) => {
          const levelConfig = positionLevels[position.level as keyof typeof positionLevels]
          const Icon = levelConfig.icon
          
          return (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${levelConfig.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{position.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {levelConfig.label}
                        </Badge>
                      </div>
                    </div>
                    
                    {canManagePositions && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {position.description && (
                    <p className="text-sm text-gray-600 mb-4">{position.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{position._count.members} anggota</span>
                    </div>
                    
                    {canManagePositions && (
                      <Dialog open={isAssignDialogOpen && selectedPosition?.id === position.id} onOpenChange={(open) => {
                        setIsAssignDialogOpen(open)
                        if (open) setSelectedPosition(position)
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Jabatan</DialogTitle>
                            <DialogDescription>
                              Pilih anggota untuk jabatan {position.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Pilih Anggota</Label>
                              <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                                {members.map((member) => (
                                  <div
                                    key={member.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                      selectedMember?.id === member.id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedMember(member)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>
                                          {member.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{member.name}</div>
                                        <div className="text-xs text-gray-600">{member.email}</div>
                                      </div>
                                      {member.position && (
                                        <Badge variant="secondary" className="text-xs">
                                          {member.position.title}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleAssignPosition} 
                                className="flex-1"
                                disabled={!selectedMember}
                              >
                                Assign Jabatan
                              </Button>
                              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                                Batal
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {positions.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Jabatan</h3>
            <p className="text-gray-600 mb-4">
              Mulai dengan membuat jabatan untuk klub Anda
            </p>
            {canManagePositions && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Jabatan Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}