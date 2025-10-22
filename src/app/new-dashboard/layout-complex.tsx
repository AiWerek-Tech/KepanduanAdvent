'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024
      
      setIsMobile(mobile)
      setIsTablet(tablet)
      
      // Auto-adjust sidebar based on device
      if (mobile) {
        setSidebarOpen(false)
        setSidebarCollapsed(false)
      } else if (tablet) {
        setSidebarOpen(true)
        setSidebarCollapsed(true) // Auto-collapse on tablet
      } else {
        setSidebarOpen(true)
        setSidebarCollapsed(false)
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Auto-expand sidebar when opening on desktop
  useEffect(() => {
    if (sidebarOpen && !isMobile && !isTablet) {
      setSidebarCollapsed(false)
    }
  }, [sidebarOpen, isMobile, isTablet])

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  // Calculate sidebar width for content margin
  const getSidebarWidth = () => {
    if (!sidebarOpen || isMobile) return 0
    if (sidebarCollapsed) return 80 // w-20 = 5rem = 80px
    return 288 // w-72 = 18rem = 288px
  }

  const sidebarWidth = getSidebarWidth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex relative">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -288,
          width: sidebarCollapsed ? 80 : 288,
          transition: { 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }
        }}
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-200/60 shadow-xl`}
      >
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          pathname={pathname}
        />
      </motion.div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col min-h-screen"
        animate={{
          marginLeft: sidebarWidth,
          transition: { 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }
        }}
        initial={{ marginLeft: sidebarWidth }}
      >
        {/* Top Bar */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  )
}