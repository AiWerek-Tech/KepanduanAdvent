'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building, MapPin, Users, Calendar, Award, Edit, Save, X, Upload, Camera, Mail, Phone, Globe, Target, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export default function ClubProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [clubData, setClubData] = useState({
    name: 'Kepanduan Advent Jakarta',
    description: 'A vibrant community dedicated to youth development, outdoor education, and spiritual growth through the Pathfinder and Adventurer programs.',
    foundedDate: '2020-01-15',
    location: 'Jakarta, Indonesia',
    email: 'info@kepanduan-jakarta.org',
    phone: '+62 21 5555 1234',
    website: 'www.kepanduan-jakarta.org',
    motto: 'Serve God, Serve Others',
    mission: 'To develop youth into responsible citizens and committed Christians through holistic education and outdoor activities.',
    vision: 'To be the leading youth organization in Indonesia, nurturing future leaders with strong character and faith.',
    colors: ['#9333EA', '#4F46E5', '#2563EB'],
    memberCount: 156,
    activeMembers: 142,
    staffCount: 12
  })

  const stats = [
    {
      title: 'Total Members',
      value: clubData.memberCount,
      change: '+12 this month',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Members',
      value: clubData.activeMembers,
      change: '91% active rate',
      icon: Target,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Staff Members',
      value: clubData.staffCount,
      change: '+2 this quarter',
      icon: Award,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Years Active',
      value: new Date().getFullYear() - new Date(clubData.foundedDate).getFullYear(),
      change: `Since ${clubData.foundedDate}`,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const recentActivities = [
    { id: 1, title: 'Summer Camp 2024', date: '2024-02-15', participants: 45, status: 'completed' },
    { id: 2, title: 'Community Service', date: '2024-02-10', participants: 28, status: 'completed' },
    { id: 3, title: 'Leadership Training', date: '2024-02-20', participants: 15, status: 'upcoming' },
    { id: 4, title: 'Honor Workshop', date: '2024-02-25', participants: 32, status: 'upcoming' }
  ]

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false)
  }

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Club Profile</h1>
            <p className="text-gray-600 mt-1">Manage your club information and settings</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General information about your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                  {isEditing ? (
                    <Input 
                      value={clubData.name}
                      onChange={(e) => setClubData({...clubData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{clubData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded Date</label>
                  {isEditing ? (
                    <Input 
                      type="date"
                      value={clubData.foundedDate}
                      onChange={(e) => setClubData({...clubData, foundedDate: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{clubData.foundedDate}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {isEditing ? (
                  <Textarea 
                    value={clubData.description}
                    onChange={(e) => setClubData({...clubData, description: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{clubData.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motto</label>
                {isEditing ? (
                  <Input 
                    value={clubData.motto}
                    onChange={(e) => setClubData({...clubData, motto: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900 italic">"{clubData.motto}"</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Mission & Vision</CardTitle>
              <CardDescription>Your club's purpose and aspirations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                {isEditing ? (
                  <Textarea 
                    value={clubData.mission}
                    onChange={(e) => setClubData({...clubData, mission: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{clubData.mission}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                {isEditing ? (
                  <Textarea 
                    value={clubData.vision}
                    onChange={(e) => setClubData({...clubData, vision: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{clubData.vision}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How people can reach your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      value={clubData.email}
                      onChange={(e) => setClubData({...clubData, email: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-900">{clubData.email}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <Input 
                      type="tel"
                      value={clubData.phone}
                      onChange={(e) => setClubData({...clubData, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-900">{clubData.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <Input 
                    value={clubData.location}
                    onChange={(e) => setClubData({...clubData, location: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{clubData.location}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                {isEditing ? (
                  <Input 
                    value={clubData.website}
                    onChange={(e) => setClubData({...clubData, website: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={`https://${clubData.website}`} className="text-purple-600 hover:text-purple-700">
                      {clubData.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Club Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Club Logo</CardTitle>
              <CardDescription>Your club's visual identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-300 mb-4">
                  <img
                    src="/logos/logo_kepanduan_square.png"
                    alt="Club Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest club events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.participants} participants</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common club management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Service Activities
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}