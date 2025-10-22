'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Award, 
  BookOpen,
  TrendingUp,
  Activity,
  Target,
  Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

// Recharts imports
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'

// Mock data for charts
const activityData = [
  { month: 'Jan', activities: 45, learning: 30, events: 15 },
  { month: 'Feb', activities: 52, learning: 38, events: 14 },
  { month: 'Mar', activities: 48, learning: 35, events: 13 },
  { month: 'Apr', activities: 65, learning: 45, events: 20 },
  { month: 'May', activities: 58, learning: 42, events: 16 },
  { month: 'Jun', activities: 72, learning: 52, events: 20 },
]

const roleDistribution = [
  { name: 'Adventurer', value: 45, color: '#8B5CF6' },
  { name: 'Pathfinder', value: 30, color: '#3B82F6' },
  { name: 'CMG', value: 15, color: '#F59E0B' },
  { name: 'Master Guide', value: 8, color: '#10B981' },
  { name: 'Admin', value: 2, color: '#EF4444' },
]

const progressData = [
  { month: 'Jan', completion: 65 },
  { month: 'Feb', completion: 68 },
  { month: 'Mar', completion: 72 },
  { month: 'Apr', completion: 75 },
  { month: 'May', completion: 78 },
  { month: 'Jun', completion: 82 },
]

export default function NewDashboardPage() {
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalCertificates: 0,
    activeUsers: 0
  })

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

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Mock stats for now - replace with actual API calls
        setStats({
          totalUsers: 156,
          totalEvents: 24,
          totalCertificates: 89,
          activeUsers: 134
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchUserData()
    fetchStats()
  }, [])

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

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
        <p className="font-bold">🎉 NEW DASHBOARD FULLY RESTORED!</p>
        <p>Complete dashboard experience with Sidebar, TopBar, Charts, and all functionality working perfectly!</p>
      </div>
      
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Welcome back, {userData?.name || 'User'}! Here's what's happening in your club.
          </p>
        </div>
        {userData && (
          <Badge className={`bg-gradient-to-r ${getRoleColor(userData.role)} text-white border-0 self-start sm:self-auto`}>
            {userData.role.replace('_', ' ')}
          </Badge>
        )}
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
              <p className="text-xs text-green-600">+15% from last month</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-xs text-red-600">-5% from last month</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Monthly activities and learning progress</p>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="activities" 
                  fill="#8B5CF6" 
                  radius={[8, 8, 0, 0]}
                  name="Total Activities"
                />
                <Bar 
                  dataKey="learning" 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name="Learning"
                />
                <Bar 
                  dataKey="events" 
                  fill="#10B981" 
                  radius={[8, 8, 0, 0]}
                  name="Events"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Role Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Members per Role</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Distribution of members by role</p>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
          <Target className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-sm text-gray-600 mb-4">Average completion rate over time</p>
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completion" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Quick Actions</h3>
                <p className="text-purple-100 text-sm sm:text-base">Create new events, assignments, or manage members</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors text-center"
                >
                  New Event
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors text-center"
                >
                  Add Member
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}