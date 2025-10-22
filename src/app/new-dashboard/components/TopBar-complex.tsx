'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

interface TopBarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function TopBar({ onMenuClick, sidebarOpen, sidebarCollapsed, onSidebarToggle }: TopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [userData, setUserData] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUserData(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Implement dark mode logic
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      window.location.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Get page title based on pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split('/')
    const currentPage = pathSegments[pathSegments.length - 1]
    
    if (pathname === '/new-dashboard') return 'Dashboard'
    if (pathname === '/new-dashboard/analytics') return 'Analytics'
    if (pathname === '/new-dashboard/users') return 'User Management'
    if (pathname === '/new-dashboard/clubs') return 'Club Management'
    if (pathname === '/new-dashboard/learning') return 'Learning System'
    if (pathname === '/new-dashboard/certificates') return 'Certificates'
    if (pathname === '/new-dashboard/events') return 'Events & Calendar'
    if (pathname === '/new-dashboard/media') return 'Media Library'
    if (pathname === '/new-dashboard/settings') return 'System Settings'
    
    // Handle nested routes
    if (pathname.includes('/users/')) {
      if (currentPage === 'master-guides') return 'Master Guides'
      if (currentPage === 'cmg') return 'CMG Candidates'
      if (currentPage === 'pathfinders') return 'Pathfinders'
      if (currentPage === 'adventurers') return 'Adventurers'
      if (currentPage === 'positions') return 'Position Assignment'
    }
    
    if (pathname.includes('/clubs/')) {
      if (currentPage === 'profile') return 'Club Profile'
      if (currentPage === 'members') return 'Members & Staff'
      if (currentPage === 'activities') return 'Activities & Events'
      if (currentPage === 'service-history') return 'Service History'
      if (currentPage === 'years') return 'Club Years'
    }
    
    if (pathname.includes('/learning/')) {
      if (currentPage === 'materials') return 'Learning Materials'
      if (currentPage === 'assignments') return 'Assignments'
      if (currentPage === 'progress') return 'Student Progress'
      if (currentPage === 'reflections') return 'Reflections'
    }
    
    if (pathname.includes('/certificates/')) {
      if (currentPage === 'generate') return 'Generate Certificate'
      if (currentPage === 'verify') return 'Verify Certificate'
    }
    
    if (pathname.includes('/events/')) {
      if (currentPage === 'calendar') return 'Event Calendar'
      if (currentPage === 'reminders') return 'Event Reminders'
    }
    
    if (pathname.includes('/media/')) {
      if (currentPage === 'mars') return 'Mars & Songs'
      if (currentPage === 'videos') return 'Video Library'
      if (currentPage === 'books') return 'Books & Materials'
      if (currentPage === 'honors') return 'Honors System'
    }
    
    if (pathname.includes('/settings/')) {
      if (currentPage === 'roles') return 'User Roles'
      if (currentPage === 'system') return 'System Configuration'
    }
    
    // Default fallback
    return currentPage.charAt(0).toUpperCase() + currentPage.slice(1) || 'Dashboard'
  }

  const pageTitle = getPageTitle()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 shadow-sm"
    >
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3.5">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden md:flex h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
          
          {/* Page Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{pageTitle}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kepanduan Advent Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hidden md:flex h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 min-w-4 sm:min-w-5 px-0 flex items-center justify-center text-[10px] sm:text-xs font-bold"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <DropdownMenuLabel className="font-semibold text-sm">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2 sm:p-3 cursor-pointer">
                <div className="flex items-start gap-2 sm:gap-3 w-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">New assignment available</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">2 minutes ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 sm:p-3 cursor-pointer">
                <div className="flex items-start gap-2 sm:gap-3 w-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Certificate ready for download</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 sm:p-3 cursor-pointer">
                <div className="flex items-start gap-2 sm:gap-3 w-full">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Club meeting reminder</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Tomorrow at 3:00 PM</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                    {userData?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-gray-900 truncate">
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-gray-500 mt-0.5 truncate">
                    {userData?.email || 'user@example.com'}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {userData?.role?.replace('_', ' ') || 'User'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer p-2 text-sm">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-2 text-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer p-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}