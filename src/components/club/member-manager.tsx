'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserPlus,
  Download,
  Upload,
  Eye,
  MoreHorizontal,
  Shield,
  GraduationCap,
  Compass,
  Sparkles,
  Award
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  church?: string
  district?: string
  conference?: string
  isActive: boolean
  clubId?: string
  positionId?: string
  createdAt: string
  position?: {
    id: string
    title: string
    level: string
  }
  serviceYears?: {
    id: string
    classLevel: string
    year: {
      year: number
      theme: string
    }
  }[]
}

interface MemberManagerProps {
  clubId: string
}

const ROLE_ICONS = {
  ADMIN: Shield,
  MASTER_GUIDE: Award,
  CMG: GraduationCap,
  PATHFINDER: Compass,
  ADVENTURER: Sparkles,
  CONTRIBUTOR: Users
}

const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-800',
  MASTER_GUIDE: 'bg-indigo-100 text-indigo-800',
  CMG: 'bg-orange-100 text-orange-800',
  PATHFINDER: 'bg-blue-100 text-blue-800',
  ADVENTURER: 'bg-purple-100 text-purple-800',
  CONTRIBUTOR: 'bg-green-100 text-green-800'
}

export default function MemberManager({ clubId }: MemberManagerProps) {
  const [members, setMembers] = useState<User[]>([])
  const [filteredMembers, setFilteredMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [clubId])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, roleFilter, statusFilter])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/members?clubId=${clubId}`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => 
        statusFilter === 'active' ? member.isActive : !member.isActive
      )
    }

    setFilteredMembers(filtered)
  }

  const handleAddMember = () => {
    setIsAddDialogOpen(true)
  }

  const handleEditMember = (member: User) => {
    setSelectedMember(member)
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  const handleToggleStatus = async (memberId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error toggling member status:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    const Icon = ROLE_ICONS[role as keyof typeof ROLE_ICONS] || Users
    return <Icon className="w-4 h-4" />
  }

  const getRoleColor = (role: string) => {
    return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'
  }

  const exportMembers = () => {
    // Create CSV content
    const headers = ['Nama', 'Email', 'Role', 'Telepon', 'Gereja', 'Status', 'Tanggal Bergabung']
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(member => [
        member.name,
        member.email,
        member.role,
        member.phone || '',
        member.church || '',
        member.isActive ? 'Aktif' : 'Tidak Aktif',
        new Date(member.createdAt).toLocaleDateString('id-ID')
      ].join(','))
    ].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Anggota</h2>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {filteredMembers.length} anggota
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportMembers}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleAddMember}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari anggota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MASTER_GUIDE">Master Guide</SelectItem>
                  <SelectItem value="CMG">CMG</SelectItem>
                  <SelectItem value="PATHFINDER">Pathfinder</SelectItem>
                  <SelectItem value="ADVENTURER">Adventurer</SelectItem>
                  <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(member.role)}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          <span>{member.role.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.position ? (
                        <div>
                          <div className="font-medium text-gray-800">{member.position.title}</div>
                          <div className="text-sm text-gray-500">{member.position.level}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.serviceYears && member.serviceYears.length > 0 ? (
                        <div>
                          <div className="font-medium text-gray-800">{member.serviceYears[0].classLevel}</div>
                          <div className="text-sm text-gray-500">{member.serviceYears[0].year.year}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {member.phone && <div>{member.phone}</div>}
                        {member.church && <div className="text-gray-500">{member.church}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {member.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(member.id, member.isActive)}
                        >
                          {member.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Tidak ada anggota yang cocok dengan filter' 
                  : 'Belum ada anggota'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Baru</DialogTitle>
            <DialogDescription>
              Tambahkan anggota baru ke klub Anda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-500">
              Form tambah anggota akan segera tersedia
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Tambah Anggota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}