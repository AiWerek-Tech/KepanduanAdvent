'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  BarChart3,
  Users,
  UserCheck,
  GraduationCap,
  Compass,
  Sparkles,
  Award,
  Building,
  Calendar,
  Bell,
  BookOpen,
  Video,
  Music,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  pathname: string
}

interface MenuItem {
  title: string
  href: string
  icon: any
  badge?: number
  children?: MenuItem[]
  roles?: string[]
}

export function Sidebar({ isOpen, onClose, pathname }: SidebarProps) {
  const [userRole, setUserRole] = useState<string>('ADVENTURER')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Fetch user data to get role
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUserData(data.user)
          setUserRole(data.user.role)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const menuItems: MenuItem[] = [
    {
      title: 'Overview',
      href: '/new-dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Analytics',
      href: '/new-dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: 'Users',
      href: '/new-dashboard/users',
      icon: Users,
      children: [
        {
          title: 'Master Guides',
          href: '/new-dashboard/users/master-guides',
          icon: UserCheck,
          roles: ['ADMIN', 'MASTER_GUIDE']
        },
        {
          title: 'CMG',
          href: '/new-dashboard/users/cmg',
          icon: GraduationCap,
          roles: ['ADMIN', 'MASTER_GUIDE']
        },
        {
          title: 'Pathfinders',
          href: '/new-dashboard/users/pathfinders',
          icon: Compass,
          roles: ['ADMIN', 'MASTER_GUIDE', 'CMG']
        },
        {
          title: 'Adventurers',
          href: '/new-dashboard/users/adventurers',
          icon: Sparkles,
          roles: ['ADMIN', 'MASTER_GUIDE', 'CMG', 'PATHFINDER']
        }
      ]
    },
    {
      title: 'Clubs',
      href: '/new-dashboard/clubs',
      icon: Building,
      children: [
        {
          title: 'Club Profile',
          href: '/new-dashboard/clubs/profile',
          icon: Building
        },
        {
          title: 'History',
          href: '/new-dashboard/clubs/history',
          icon: FileText
        },
        {
          title: 'Logo & Banner',
          href: '/new-dashboard/clubs/branding',
          icon: Award
        },
        {
          title: 'Staff & Roles',
          href: '/new-dashboard/clubs/staff',
          icon: Users
        }
      ],
      roles: ['ADMIN', 'MASTER_GUIDE']
    },
    {
      title: 'Learning',
      href: '/new-dashboard/learning',
      icon: BookOpen,
      children: [
        {
          title: 'Materials',
          href: '/new-dashboard/learning/materials',
          icon: BookOpen
        },
        {
          title: 'Assignments',
          href: '/new-dashboard/learning/assignments',
          icon: FileText
        },
        {
          title: 'Reflections',
          href: '/new-dashboard/learning/reflections',
          icon: FileText
        },
        {
          title: 'Progress',
          href: '/new-dashboard/learning/progress',
          icon: BarChart3
        }
      ]
    },
    {
      title: 'Media',
      href: '/new-dashboard/media',
      icon: Video,
      children: [
        {
          title: 'Mars & Songs',
          href: '/new-dashboard/media/mars',
          icon: Music
        },
        {
          title: 'Books',
          href: '/new-dashboard/media/books',
          icon: BookOpen
        },
        {
          title: 'Videos',
          href: '/new-dashboard/media/videos',
          icon: Video
        },
        {
          title: 'Honors',
          href: '/new-dashboard/media/honors',
          icon: Award
        }
      ]
    },
    {
      title: 'Events',
      href: '/new-dashboard/events',
      icon: Calendar,
      children: [
        {
          title: 'Calendar',
          href: '/new-dashboard/events/calendar',
          icon: Calendar
        },
        {
          title: 'Reminders',
          href: '/new-dashboard/events/reminders',
          icon: Bell,
          badge: 3
        },
        {
          title: 'Certificates',
          href: '/new-dashboard/events/certificates',
          icon: Award
        }
      ]
    },
    {
      title: 'Settings',
      href: '/new-dashboard/settings',
      icon: Settings,
    }
  ]

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'from-red-500 to-orange-500'
      case 'MASTER_GUIDE': return 'from-indigo-500 to-purple-500'
      case 'CMG': return 'from-orange-500 to-red-500'
      case 'PATHFINDER': return 'from-blue-500 to-purple-500'
      case 'ADVENTURER': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return Settings
      case 'MASTER_GUIDE': return Award
      case 'CMG': return GraduationCap
      case 'PATHFINDER': return Compass
      case 'ADVENTURER': return Sparkles
      default: return UserCheck
    }
  }

  const RoleIcon = getRoleIcon(userRole)

  return (
    <div className={cn(
      "w-72 h-screen bg-white border-r border-gray-200/60 flex flex-col shadow-sm",
      "transition-all duration-300 ease-in-out"
    )}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <img
              src="/logos/logo_kepanduan_square.png"
              alt="Kepanduan Advent"
              className="w-9 h-9 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg truncate">Kepanduan Advent</h2>
            {userData && (
              <Badge className={cn(
                "text-xs mt-1.5 font-medium",
                `bg-gradient-to-r ${getRoleColor(userRole)} text-white border-0 shadow-sm`
              )}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userRole.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden flex-shrink-0 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href
          const isExpanded = expandedItems.includes(item.title)
          const Icon = item.icon

          // Filter children based on role
          const filteredChildren = item.children?.filter(child => 
            !child.roles || child.roles.includes(userRole)
          )

          return (
            <div key={item.title}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-between h-11 px-4 font-medium",
                    "transition-all duration-200",
                    isActive && "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md",
                    !isActive && "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  )}
                  onClick={() => {
                    if (filteredChildren && filteredChildren.length > 0) {
                      toggleExpanded(item.title)
                    } else {
                      // Navigate to the item
                      window.location.replace(item.href)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive && "text-white",
                      !isActive && "text-gray-500"
                    )} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1 flex items-center justify-center text-xs font-bold">
                        {item.badge}
                      </Badge>
                    )}
                    {filteredChildren && filteredChildren.length > 0 && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-180",
                        isActive && "text-white",
                        !isActive && "text-gray-400"
                      )} />
                    )}
                  </div>
                </Button>
              </motion.div>

              {/* Submenu */}
              <AnimatePresence>
                {isExpanded && filteredChildren && filteredChildren.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 mt-1.5 space-y-0.5">
                      {filteredChildren.map((child) => {
                        const isChildActive = pathname === child.href
                        const ChildIcon = child.icon

                        return (
                          <motion.div
                            key={child.title}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={isChildActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-10 px-4 font-medium",
                                "transition-all duration-200",
                                isChildActive && "bg-purple-100 text-purple-700 hover:bg-purple-200",
                                !isChildActive && "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                              )}
                              onClick={() => {
                                window.location.replace(child.href)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <ChildIcon className={cn(
                                  "w-4 h-4",
                                  isChildActive && "text-purple-600",
                                  !isChildActive && "text-gray-400"
                                )} />
                                <span className="text-sm truncate">{child.title}</span>
                              </div>
                              {child.badge && (
                                <Badge variant="destructive" className="h-4 min-w-4 px-0.5 flex items-center justify-center text-xs font-bold ml-auto flex-shrink-0">
                                  {child.badge}
                                </Badge>
                              )}
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
            {userData?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userData?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData?.email || 'user@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { 
                  method: 'POST',
                  credentials: 'include',
                })
                window.location.replace('/login')
              } catch (error) {
                console.error('Logout error:', error)
              }
            }}
            className="flex-shrink-0 h-8 w-8 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}