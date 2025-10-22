'use client'

import React from 'react'
import PathfinderDashboard, { 
  MenuCard, 
  Chapter, 
  Activity, 
  UserData 
} from '../PathfinderDashboard'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings,
  Award,
  Target,
  Heart,
  Star
} from 'lucide-react'

// Example 1: Basic Usage
export function BasicPathfinderExample() {
  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Basic Pathfinder Dashboard
      </h2>
      <PathfinderDashboard />
    </div>
  )
}

// Example 2: Custom User Data
export function CustomUserDataExample() {
  const customUserData: Partial<UserData> = {
    name: "Sarah Johnson",
    class: "RANGER",
    club: "Pathfinder Surabaya",
    overallProgress: 85,
    streak: 21,
    totalPoints: 4850,
    rank: "Platinum Pathfinder",
    joinDate: "February 2024"
  }

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Custom User Data Example
      </h2>
      <PathfinderDashboard userData={customUserData} />
    </div>
  )
}

// Example 3: Custom Menu Cards
export function CustomMenuCardsExample() {
  const customMenuCards: MenuCard[] = [
    {
      id: 'learning-modules',
      title: 'Learning Modules',
      description: 'Interactive learning materials and courses',
      icon: BookOpen,
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      href: '/learning/modules',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      stats: '12 Modules'
    },
    {
      id: 'team-management',
      title: 'Team Management',
      description: 'Manage your pathfinder team members',
      icon: Users,
      color: 'from-green-500 via-emerald-500 to-teal-600',
      href: '/team/manage',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      stats: '24 Members'
    },
    {
      id: 'event-calendar',
      title: 'Event Calendar',
      description: 'Schedule and track upcoming events',
      icon: Calendar,
      color: 'from-purple-500 via-pink-500 to-rose-600',
      href: '/events/calendar',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      stats: '8 Events'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your dashboard preferences',
      icon: Settings,
      color: 'from-gray-500 via-slate-500 to-zinc-600',
      href: '/settings',
      gradient: 'bg-gradient-to-br from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      stats: 'Config'
    }
  ]

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Custom Menu Cards Example
      </h2>
      <PathfinderDashboard menuCards={customMenuCards} />
    </div>
  )
}

// Example 4: Custom Chapters and Activities
export function CustomContentExample() {
  const customChapters: Chapter[] = [
    { name: 'Leadership Skills', icon: '👑', progress: 90, color: 'from-purple-400 to-pink-500' },
    { name: 'Community Service', icon: '🤝', progress: 85, color: 'from-blue-400 to-cyan-500' },
    { name: 'Outdoor Skills', icon: '🏕️', progress: 75, color: 'from-green-400 to-emerald-500' },
    { name: 'First Aid', icon: '⚕️', progress: 95, color: 'from-red-400 to-rose-500' }
  ]

  const customActivities: Activity[] = [
    { activity: 'Completed Leadership Workshop', time: '1 hour ago', icon: '🎯', color: 'text-purple-500' },
    { activity: 'Earned Community Service Badge', time: '3 hours ago', icon: '🏆', color: 'text-yellow-500' },
    { activity: 'Joined Camping Trip', time: '1 day ago', icon: '⛺', color: 'text-green-500' },
    { activity: 'Completed First Aid Training', time: '2 days ago', icon: '⚕️', color: 'text-red-500' }
  ]

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Custom Content Example
      </h2>
      <PathfinderDashboard 
        chapters={customChapters} 
        recentActivities={customActivities} 
      />
    </div>
  )
}

// Example 5: Theme Variations
export function ThemeVariationsExample() {
  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Pathfinder Theme (Default)
        </h2>
        <PathfinderDashboard theme="pathfinder" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Adventurer Theme
        </h2>
        <PathfinderDashboard theme="adventurer" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          MasterGuide Theme
        </h2>
        <PathfinderDashboard theme="masterguide" />
      </div>
    </div>
  )
}

// Example 6: Minimal Configuration
export function MinimalExample() {
  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Minimal Configuration Example
      </h2>
      <PathfinderDashboard 
        showQuickActions={false}
        showRecentActivity={false}
        showChapterProgress={false}
      />
    </div>
  )
}

// Example 7: Custom Logo and Actions
export function CustomBrandingExample() {
  const customLogo = (
    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
      <Star className="w-6 h-6 text-white" />
    </div>
  )

  const customActions = (
    <div className="flex space-x-4">
      <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        Start New Adventure
      </button>
      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
        View Profile
      </button>
    </div>
  )

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Custom Branding Example
      </h2>
      <PathfinderDashboard 
        customLogo={customLogo}
        customActions={customActions}
      />
    </div>
  )
}

// Example 8: Complete Customization
export function CompleteCustomizationExample() {
  const customUserData: Partial<UserData> = {
    name: "Michael Chen",
    class: "GUIDE",
    club: "Pathfinder International",
    overallProgress: 92,
    streak: 30,
    totalPoints: 8500,
    rank: "Diamond Master Guide",
    joinDate: "January 2023"
  }

  const customMenuCards: MenuCard[] = [
    {
      id: 'advanced-training',
      title: 'Advanced Training',
      description: 'Master-level training modules',
      icon: Award,
      color: 'from-yellow-500 via-amber-500 to-orange-600',
      href: '/training/advanced',
      gradient: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      stats: 'Expert'
    },
    {
      id: 'leadership',
      title: 'Leadership Program',
      description: 'Develop leadership skills',
      icon: Target,
      color: 'from-red-500 via-rose-500 to-pink-600',
      href: '/leadership/program',
      gradient: 'bg-gradient-to-br from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      stats: 'Advanced'
    }
  ]

  const customChapters: Chapter[] = [
    { name: 'Advanced Leadership', icon: '🎖️', progress: 95, color: 'from-yellow-400 to-amber-500' },
    { name: 'Strategic Planning', icon: '📋', progress: 88, color: 'from-blue-400 to-indigo-500' },
    { name: 'Team Building', icon: '👥', progress: 92, color: 'from-green-400 to-emerald-500' },
    { name: 'Crisis Management', icon: '🚨', progress: 85, color: 'from-red-400 to-rose-500' }
  ]

  const customActivities: Activity[] = [
    { activity: 'Led International Conference', time: '2 hours ago', icon: '🌍', color: 'text-blue-500' },
    { activity: 'Completed Advanced Certification', time: '1 day ago', icon: '🏆', color: 'text-yellow-500' },
    { activity: 'Mentored 15 New Guides', time: '3 days ago', icon: '👨‍🏫', color: 'text-purple-500' },
    { activity: 'Organized Community Event', time: '1 week ago', icon: '🎪', color: 'text-green-500' }
  ]

  const customLogo = (
    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
      <Award className="w-6 h-6 text-white" />
    </div>
  )

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8 text-white">
        Complete Customization Example
      </h2>
      <PathfinderDashboard 
        userData={customUserData}
        menuCards={customMenuCards}
        chapters={customChapters}
        recentActivities={customActivities}
        customLogo={customLogo}
        theme="masterguide"
        showQuickActions={true}
        showRecentActivity={true}
        showChapterProgress={true}
      />
    </div>
  )
}

// Export all examples
export const examples = {
  BasicPathfinderExample,
  CustomUserDataExample,
  CustomMenuCardsExample,
  CustomContentExample,
  ThemeVariationsExample,
  MinimalExample,
  CustomBrandingExample,
  CompleteCustomizationExample
}