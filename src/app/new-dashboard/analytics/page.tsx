'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Activity, Eye, DollarSign, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalViews: 45231,
    activeUsers: 2350,
    engagementRate: 68.4,
    totalActivities: 1423,
    revenue: 128450,
    conversionRate: 12.5,
    avgSessionDuration: 245,
    bounceRate: 32.1
  })

  const [trends, setTrends] = useState({
    views: 20.1,
    users: 180,
    engagement: 5.2,
    activities: 89,
    revenue: 15.3,
    conversion: 2.1,
    session: 8.7,
    bounce: -3.2
  })

  const recentActivity = [
    { id: 1, type: 'user_login', user: 'John Doe', time: '2 min ago', status: 'success' },
    { id: 2, type: 'certificate_generated', user: 'Sarah Smith', time: '5 min ago', status: 'success' },
    { id: 3, type: 'new_registration', user: 'Mike Johnson', time: '12 min ago', status: 'success' },
    { id: 4, type: 'failed_login', user: 'Unknown', time: '15 min ago', status: 'error' },
    { id: 5, type: 'material_download', user: 'Emily Davis', time: '20 min ago', status: 'success' }
  ]

  const topPages = [
    { page: '/new-dashboard', views: 5432, change: 12.5 },
    { page: '/new-dashboard/users', views: 3214, change: 8.3 },
    { page: '/new-dashboard/learning/materials', views: 2876, change: -2.1 },
    { page: '/new-dashboard/certificates', views: 2143, change: 15.7 },
    { page: '/new-dashboard/events', views: 1876, change: 5.2 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Live Data
            </Badge>
            <Badge variant="outline">
              Last updated: 2 min ago
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: trends.views,
            icon: Eye,
            color: 'from-blue-500 to-blue-600',
            textColor: 'text-blue-100'
          },
          {
            title: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            change: trends.users,
            icon: Users,
            color: 'from-green-500 to-green-600',
            textColor: 'text-green-100'
          },
          {
            title: 'Engagement Rate',
            value: `${stats.engagementRate}%`,
            change: trends.engagement,
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600',
            textColor: 'text-purple-100'
          },
          {
            title: 'Total Activities',
            value: stats.totalActivities.toLocaleString(),
            change: trends.activities,
            icon: Activity,
            color: 'from-orange-500 to-orange-600',
            textColor: 'text-orange-100'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`font-medium ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}
                    {stat.title.includes('Rate') || stat.title.includes('Duration') || stat.title.includes('Bounce') ? '%' : 
                     stat.title.includes('Users') ? ' this week' : 
                     stat.title.includes('Views') ? '% from last month' : ' this month'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            change: trends.revenue,
            icon: DollarSign,
            color: 'from-emerald-500 to-emerald-600'
          },
          {
            title: 'Conversion Rate',
            value: `${stats.conversionRate}%`,
            change: trends.conversion,
            icon: Target,
            color: 'from-indigo-500 to-indigo-600'
          },
          {
            title: 'Avg Session',
            value: `${Math.floor(stats.avgSessionDuration / 60)}m ${stats.avgSessionDuration % 60}s`,
            change: trends.session,
            icon: Zap,
            color: 'from-pink-500 to-pink-600'
          },
          {
            title: 'Bounce Rate',
            value: `${stats.bounceRate}%`,
            change: trends.bounce,
            icon: Activity,
            color: 'from-red-500 to-red-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="border-gray-200 hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-1.5 rounded bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-3.5 w-3.5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`font-medium ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Monthly performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Interactive chart coming soon</p>
                  <p className="text-xs text-gray-400 mt-1">Integration with Chart.js planned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.page}</p>
                        <p className="text-xs text-gray-500">{page.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        page.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {page.change > 0 ? '+' : ''}{page.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}