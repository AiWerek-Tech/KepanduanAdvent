'use client'

import { useEffect, useState } from 'react'
import { SimpleSidebar } from './components/Sidebar'
import { SimpleTopBar } from './components/TopBar'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function SimpleDashboardLayout({ children }: DashboardLayoutProps) {
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
      <div
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-200/60 shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-20' : 'w-72'}`}
        style={{
          width: sidebarCollapsed ? '80px' : '288px',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-288px)',
        }}
      >
        <SimpleSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          pathname={pathname}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Bar */}
        <SimpleTopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-full">
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}