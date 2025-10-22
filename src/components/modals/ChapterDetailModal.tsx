'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  CheckCircle2, 
  Circle, 
  Save, 
  X, 
  BookOpen,
  Award,
  Target,
  Clock,
  Check,
  Loader2
} from 'lucide-react'

interface Requirement {
  id: string
  requirement: string
  isCompleted: boolean
  completedAt?: string
  mentorNotes?: string
  isValidated: boolean
}

interface Chapter {
  id: string
  nameEN: string
  nameID: string
  description: string
  iconUrl: string
  color: string
  order: number
  requirements: Requirement[]
}

interface ChapterDetailModalProps {
  chapter: Chapter | null
  isOpen: boolean
  onClose: () => void
  requirements: Requirement[]
  onRequirementToggle: (requirementId: string, isCompleted: boolean) => void
  onSaveProgress: () => void
}

// Mock requirements data for each chapter
const mockRequirements: Record<number, Requirement[]> = {
  1: [ // Personal Growth
    { id: '1-1', text: 'Berada di Kelas 5 atau sederajat.', isCompleted: true },
    { id: '1-2a', text: 'Kembangkan kehidupan rohanimu setiap hari dengan mempelajari Panduan Renungan Sepekan (Pekan 1–13) dan kitab Matius, menggunakan sumber cetak maupun digital.', isCompleted: true },
    { id: '1-2b', text: 'Tuliskan refleksimu dengan menjawab pertanyaan berikut: Apa yang saya pelajari tentang Allah? Apa yang saya pelajari tentang diri saya sendiri? Bagaimana saya dapat menerapkannya dalam hidup saya hari ini? (Refleksi dapat dibuat dalam bentuk tulisan, gambar, atau digital.)', isCompleted: false },
    { id: '1-3', text: 'Hafalkan Perjanjian dan Peraturan Pathfinder.', isCompleted: true },
    { id: '1-4', text: 'Pelajari Mars Pathfinder.', isCompleted: false }
  ],
  2: [ // Spiritual Discovery
    { id: '2-1', text: 'Pelajari tentang hubungan pribadi dengan Tuhan.', isCompleted: true },
    { id: '2-2', text: 'Ikuti kegiatan devosi harian.', isCompleted: true },
    { id: '2-3', text: 'Tulis jurnal spiritual.', isCompleted: false },
    { id: '2-4', text: 'Berpartisipasi dalam kegiatan gereja.', isCompleted: true },
    { id: '2-5', text: 'Pelajari ayat-ayat Alkitab pilihan.', isCompleted: false }
  ],
  3: [ // Serving Others
    { id: '3-1', text: 'Ikuti kegiatan pelayanan di komunitas.', isCompleted: true },
    { id: '3-2', text: 'Bantu orang yang membutuhkan.', isCompleted: true },
    { id: '3-3', text: 'Ikuti program sosial Pathfinder.', isCompleted: true },
    { id: '3-4', text: 'Lakukan aksi kasih tanpa pamrih.', isCompleted: false }
  ],
  4: [ // Making Friends
    { id: '4-1', text: 'Kenali semua anggota klub.', isCompleted: true },
    { id: '4-2', text: 'Pelajari cara berteman yang baik.', isCompleted: false },
    { id: '4-3', text: 'Ikuti kegiatan tim building.', isCompleted: false },
    { id: '4-4', text: 'Bantu teman yang kesulitan.', isCompleted: false }
  ],
  5: [ // Health and Fitness
    { id: '5-1', text: 'Lakukan olahraga rutin 3x seminggu.', isCompleted: true },
    { id: '5-2', text: 'Pelajari tentang gizi seimbang.', isCompleted: false },
    { id: '5-3', text: 'Ikuti tes kesehatan dasar.', isCompleted: false },
    { id: '5-4', text: 'Jaga kebersihan diri.', isCompleted: true },
    { id: '5-5', text: 'Pelajari tentang pertolongan pertama.', isCompleted: false }
  ],
  6: [ // Nature Study
    { id: '6-1', text: 'Identifikasi 10 jenis tumbuhan lokal.', isCompleted: true },
    { id: '6-2', text: 'Pelajari tentang ekosistem.', isCompleted: true },
    { id: '6-3', text: 'Ikuti kegiatan pelestarian alam.', isCompleted: true },
    { id: '6-4', text: 'Buat jurnal pengamatan alam.', isCompleted: true },
    { id: '6-5', text: 'Pelajari tentang cuaca dan iklim.', isCompleted: false }
  ],
  7: [ // Outdoor Living
    { id: '7-1', text: 'Ikuti kemah minimal 2 malam.', isCompleted: true },
    { id: '7-2', text: 'Pelajari cara membuat api.', isCompleted: false },
    { id: '7-3', text: 'Praktik navigasi dengan kompas.', isCompleted: false },
    { id: '7-4', text: 'Pelajari teknik bertahan di alam.', isCompleted: false },
    { id: '7-5', text: 'Ikuti hiking minimal 5km.', isCompleted: false }
  ],
  8: [ // Honor Enrichment
    { id: '8-1', text: 'Selesaikan minimal 2 honor Pathfinder.', isCompleted: false },
    { id: '8-2', text: 'Pelajari keterampilan baru.', isCompleted: false },
    { id: '8-3', text: 'Presentasikan hasil belajar.', isCompleted: false },
    { id: '8-4', text: 'Bantu teman lain belajar.', isCompleted: false }
  ]
}

export default function ChapterDetailModal({
  chapter,
  isOpen,
  onClose,
  requirements,
  onRequirementToggle,
  onSaveProgress
}: ChapterDetailModalProps) {
  const [localRequirements, setLocalRequirements] = useState<Requirement[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (chapter) {
      setLocalRequirements(chapter.requirements)
    }
  }, [chapter])

  const handleRequirementToggle = async (requirementId: string, checked: boolean) => {
    // Update local state immediately for better UX
    setLocalRequirements(prev => 
      prev.map(req => 
        req.id === requirementId ? { ...req, isCompleted: checked } : req
      )
    )
    
    // Add to pending changes
    setPendingChanges(prev => new Set(prev).add(requirementId))
    
    try {
      setIsSaving(true)
      
      // Call parent handler to save to API
      await onRequirementToggle(requirementId, checked)
      
      // Remove from pending changes on success
      setPendingChanges(prev => {
        const newSet = new Set(prev)
        newSet.delete(requirementId)
        return newSet
      })
      
      // Update last saved time
      setLastSavedTime(new Date())
      
      // Show success toast
      toast.success('✅ Tersimpan!', {
        description: `Persyaratan berhasil ${checked ? 'dicentang' : 'dibatalkan'}`,
        duration: 2000,
      })
    } catch (error) {
      // Revert local state on error
      setLocalRequirements(prev => 
        prev.map(req => 
          req.id === requirementId ? { ...req, isCompleted: !checked } : req
        )
      )
      
      // Remove from pending changes
      setPendingChanges(prev => {
        const newSet = new Set(prev)
        newSet.delete(requirementId)
        return newSet
      })
      
      toast.error('❌ Gagal menyimpan', {
        description: 'Terjadi kesalahan, silakan coba lagi',
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    // Just close modal without triggering refresh
    // Data is already auto-saved on each checkbox change
    onClose()
  }

  const completedCount = localRequirements.filter(req => req.isCompleted).length
  const totalCount = localRequirements.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (!chapter) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <div className={`absolute inset-0 bg-gradient-to-r ${chapter.color} rounded-full blur-lg opacity-50`}></div>
                    <img
                      src={chapter.iconUrl}
                      alt={chapter.nameID}
                      width={64}
                      height={64}
                      className="relative z-10 rounded-full bg-white/10 p-1"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {chapter.nameID}
                    </DialogTitle>
                    <p className="text-gray-300">
                      {chapter.nameEN}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Auto-save Indicator */}
              {lastSavedTime && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Tersimpan otomatis</span>
                    <span className="text-xs text-green-300">
                      {lastSavedTime.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Progress Overview */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Target className="h-6 w-6 text-purple-400" />
                      <h3 className="text-lg font-semibold">Progress Bab</h3>
                    </div>
                    <Badge 
                      variant={progressPercentage === 100 ? "default" : "secondary"}
                      className={progressPercentage === 100 ? "bg-green-500" : "bg-yellow-500"}
                    >
                      {progressPercentage}% Complete
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-2" />
                  <p className="text-sm text-gray-300">
                    {completedCount} dari {totalCount} persyaratan selesai
                  </p>
                </CardContent>
              </Card>

              {/* Requirements List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold">Daftar Persyaratan</h3>
                </div>

                <div className="space-y-3">
                  {localRequirements.map((requirement, index) => {
                    const isPending = pendingChanges.has(requirement.id)
                    
                    return (
                      <motion.div
                        key={requirement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`bg-white/5 backdrop-blur-md border-white/10 transition-all duration-300 ${
                          requirement.isCompleted ? 'bg-green-500/10 border-green-500/20' : 'hover:bg-white/10'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="relative">
                                <Checkbox
                                  id={requirement.id}
                                  checked={requirement.isCompleted}
                                  onCheckedChange={(checked) => 
                                    handleRequirementToggle(requirement.id, checked as boolean)
                                  }
                                  disabled={isPending}
                                  className="mt-1 border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                />
                                {isPending && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <label 
                                  htmlFor={requirement.id}
                                  className={`text-sm leading-relaxed cursor-pointer ${
                                    requirement.isCompleted ? 'text-green-300 line-through' : 'text-gray-200'
                                  } ${isPending ? 'opacity-50' : ''}`}
                                >
                                  {requirement.requirement}
                                </label>
                              </div>
                              {requirement.isCompleted && !isPending && (
                                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Achievement Section */}
              {progressPercentage === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-green-500/30">
                    <CardContent className="p-6">
                      <Award className="h-12 w-12 text-green-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-green-300 mb-2">
                        🎉 Selamat! Bab Selesai!
                      </h3>
                      <p className="text-gray-300">
                        Kamu telah menyelesaikan semua persyaratan untuk bab ini.
                        Lanjutkan ke bab berikutnya!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Selesai
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}