'use client'

import { useState, useEffect } from 'react'
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
  ChevronRight,
  X,
  Heart,
  Target,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
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

export function SimpleSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, pathname }: SidebarProps) {
  const [userRole, setUserRole] = useState<string>('ADVENTURER')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [userData, setUserData] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      title: 'Dashboard',
      href: '/new-dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Analytics',
      href: '/new-dashboard/analytics',
      icon: BarChart3,
      roles: ['ADMIN', 'MASTER_GUIDE']
    },
    {
      title: 'User Management',
      href: '/new-dashboard/users',
      icon: Users,
      children: [
        {
          title: 'All Users',
          href: '/new-dashboard/users',
          icon: Users,
          roles: ['ADMIN', 'MASTER_GUIDE']
        },
        {
          title: 'Master Guides',
          href: '/new-dashboard/users/master-guides',
          icon: UserCheck,
          roles: ['ADMIN', 'MASTER_GUIDE']
        },
        {
          title: 'CMG Candidates',
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
        },
        {
          title: 'Position Assignment',
          href: '/new-dashboard/users/positions',
          icon: Award,
          roles: ['ADMIN', 'MASTER_GUIDE']
        }
      ],
      roles: ['ADMIN', 'MASTER_GUIDE']
    },
    {
      title: 'Learning System',
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
          title: 'Student Progress',
          href: '/new-dashboard/learning/progress',
          icon: BarChart3,
          roles: ['ADMIN', 'MASTER_GUIDE', 'CMG', 'PATHFINDER']
        },
        {
          title: 'Reflections',
          href: '/new-dashboard/learning/reflections',
          icon: MessageCircle
        }
      ]
    },
    {
      title: 'Certificates',
      href: '/new-dashboard/certificates',
      icon: Award,
    },
    {
      title: 'Events & Calendar',
      href: '/new-dashboard/events',
      icon: Calendar,
      children: [
        {
          title: 'Event Calendar',
          href: '/new-dashboard/events/calendar',
          icon: Calendar
        },
        {
          title: 'Manage Events',
          href: '/new-dashboard/events',
          icon: Calendar,
          roles: ['ADMIN', 'MASTER_GUIDE']
        },
        {
          title: 'Reminders',
          href: '/new-dashboard/events/reminders',
          icon: Bell,
          badge: 3
        }
      ]
    },
    {
      title: 'Media Library',
      href: '/new-dashboard/media',
      icon: Video,
      children: [
        {
          title: 'Mars & Songs',
          href: '/new-dashboard/media/mars',
          icon: Music
        },
        {
          title: 'Video Library',
          href: '/new-dashboard/media/videos',
          icon: Video
        },
        {
          title: 'Books & Materials',
          href: '/new-dashboard/media/books',
          icon: BookOpen
        }
      ]
    }
  ]

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

  const toggleExpanded = (title: string) => {
    if (isCollapsed) return // Don't expand when collapsed
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

  const handleNavigation = (href: string) => {
    if (isMobile) {
      onClose() // Close sidebar on mobile after navigation
    }
    window.location.replace(href)
  }

  return (
    <div className={cn(
      "h-screen bg-white flex flex-col shadow-sm",
      "transition-all duration-300 ease-in-out",
      "overflow-hidden"
    )}>
      {/* Header Section */}
      <div className="p-3 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo/Collapse Button */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "flex items-center justify-center shadow-lg transition-all duration-300",
                isCollapsed ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"
              )}>
                <img
                  src="/logos/logo_kepanduan_square.png"
                  alt="Kepanduan Advent"
                  className={cn(
                    "object-contain transition-all duration-300",
                    isCollapsed ? "w-5 h-5" : "w-7 h-7"
                  )}
                />
              </div>
              
              {/* Collapse Toggle Button - Hidden on mobile */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className={cn(
                    "absolute -bottom-1 -right-1 h-4 w-4 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50",
                    "hidden sm:flex items-center justify-center"
                  )}
                >
                  <ChevronRight className={cn(
                    "w-2.5 h-2.5 text-gray-600 transition-transform duration-200",
                    !isCollapsed && "rotate-180"
                  )} />
                </Button>
              )}
            </div>

            {/* Title and Role - Hidden when collapsed */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-sm sm:text-base truncate">Kepanduan Advent</h2>
                {userData && (
                  <Badge className={cn(
                    "text-xs mt-1 font-medium",
                    `bg-gradient-to-r ${getRoleColor(userRole)} text-white border-0 shadow-sm`
                  )}>
                    <RoleIcon className="w-2.5 h-2.5 mr-1" />
                    <span className="hidden xs:inline">
                      {userRole.replace('_', ' ')}
                    </span>
                    <span className="xs:hidden">
                      {userRole.split('_')[0]}
                    </span>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 h-6 w-6"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
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
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-between font-medium",
                  "transition-all duration-200",
                  isCollapsed ? "h-9 px-2" : "h-10 px-3",
                  isActive && "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md",
                  !isActive && "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                )}
                onClick={() => {
                  if (filteredChildren && filteredChildren.length > 0 && !isCollapsed) {
                    toggleExpanded(item.title)
                  } else {
                    handleNavigation(item.href)
                  }
                }}
                title={isCollapsed ? item.title : undefined}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className={cn(
                    "flex-shrink-0",
                    isCollapsed ? "w-4 h-4" : "w-4 h-4",
                    isActive && "text-white",
                    !isActive && "text-gray-500"
                  )} />
                  {!isCollapsed && (
                    <span className="truncate text-xs sm:text-sm">
                      {item.title}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.badge && (
                      <Badge variant="destructive" className="h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold">
                        {item.badge}
                      </Badge>
                    )}
                    {filteredChildren && filteredChildren.length > 0 && (
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    )}
                  </div>
                )}
              </Button>

              {/* Submenu */}
              {!isCollapsed && filteredChildren && filteredChildren.length > 0 && (
                <div className={cn(
                  "mt-1 space-y-1 overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-96" : "max-h-0"
                )}>
                  {filteredChildren.map((child) => {
                    const isChildActive = pathname === child.href
                    const ChildIcon = child.icon
                    
                    return (
                      <Button
                        key={child.href}
                        variant={isChildActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start font-normal",
                          "transition-all duration-200",
                          "h-8 pl-8 pr-3",
                          isChildActive && "bg-purple-100 text-purple-700 hover:bg-purple-200",
                          !isChildActive && "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                        )}
                        onClick={() => handleNavigation(child.href)}
                      >
                        <ChildIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                        <span className="truncate text-xs">
                          {child.title}
                        </span>
                        {child.badge && (
                          <Badge variant="secondary" className="ml-auto h-3 min-w-3 px-1 text-[9px]">
                            {child.badge}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-gray-200/60 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
              })
              window.location.href = '/login'
            } catch (error) {
              console.error('Logout failed:', error)
            }
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && (
            <span className="text-xs">Logout</span>
          )}
        </Button>
      </div>
    </div>
  )
}