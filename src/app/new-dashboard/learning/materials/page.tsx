'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Filter, Download, Eye, Star, Clock, FileText, Video, Headphones, Image } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function LearningMaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const materials = [
    {
      id: 1,
      title: 'Introduction to Pathfinder Class',
      description: 'Complete guide for new Pathfinder members covering basic requirements, activities, and advancement path.',
      category: 'pathfinder',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 145,
      rating: 4.8,
      author: 'Dr. Sarah Johnson',
      uploadDate: '2024-01-15',
      duration: '15 min read',
      level: 'Beginner',
      thumbnail: '/thumbnails/pathfinder-intro.jpg'
    },
    {
      id: 2,
      title: 'Adventurer Curriculum Guide',
      description: 'Age-appropriate activities and learning materials for Adventurer club members (ages 4-9).',
      category: 'adventurer',
      type: 'PDF',
      size: '3.1 MB',
      downloads: 98,
      rating: 4.9,
      author: 'Emily Rodriguez',
      uploadDate: '2024-01-20',
      duration: '20 min read',
      level: 'Beginner',
      thumbnail: '/thumbnails/adventurer-curriculum.jpg'
    },
    {
      id: 3,
      title: 'Nature Study Handbook',
      description: 'Comprehensive guide to nature observation, outdoor skills, and environmental stewardship.',
      category: 'honors',
      type: 'PDF',
      size: '5.2 MB',
      downloads: 234,
      rating: 4.7,
      author: 'Michael Chen',
      uploadDate: '2024-02-01',
      duration: '45 min read',
      level: 'Intermediate',
      thumbnail: '/thumbnails/nature-study.jpg'
    },
    {
      id: 4,
      title: 'Leadership Training Manual',
      description: 'Advanced leadership skills for club officers and potential leaders including communication and management.',
      category: 'leadership',
      type: 'PDF',
      size: '4.8 MB',
      downloads: 67,
      rating: 4.6,
      author: 'Dr. Robert Johnson',
      uploadDate: '2024-02-10',
      duration: '30 min read',
      level: 'Advanced',
      thumbnail: '/thumbnails/leadership-training.jpg'
    },
    {
      id: 5,
      title: 'First Aid and Safety Video Course',
      description: 'Essential first aid skills and safety protocols for outdoor activities and emergency situations.',
      category: 'safety',
      type: 'Video',
      size: '125 MB',
      downloads: 189,
      rating: 4.9,
      author: 'Sarah Williams',
      uploadDate: '2024-02-15',
      duration: '1h 30min',
      level: 'Intermediate',
      thumbnail: '/thumbnails/first-aid-video.jpg'
    },
    {
      id: 6,
      title: 'Camp Craft Skills Workshop',
      description: 'Practical camping skills including knot tying, shelter building, fire safety, and outdoor cooking.',
      category: 'skills',
      type: 'Video',
      size: '89 MB',
      downloads: 156,
      rating: 4.8,
      author: 'David Kim',
      uploadDate: '2024-02-20',
      duration: '2h 15min',
      level: 'Beginner',
      thumbnail: '/thumbnails/camp-craft.jpg'
    },
    {
      id: 7,
      title: 'Pathfinder Honor System',
      description: 'Complete guide to the Pathfinder honor system with requirements and skill categories.',
      category: 'honors',
      type: 'PDF',
      size: '6.7 MB',
      downloads: 178,
      rating: 4.7,
      author: 'Lisa Anderson',
      uploadDate: '2024-02-25',
      duration: '25 min read',
      level: 'Intermediate',
      thumbnail: '/thumbnails/honor-system.jpg'
    },
    {
      id: 8,
      title: 'Mars and Songs Collection',
      description: 'Audio collection of traditional Pathfinder mars and camp songs with lyrics and music sheets.',
      category: 'music',
      type: 'Audio',
      size: '45 MB',
      downloads: 89,
      rating: 4.5,
      author: 'Music Department',
      uploadDate: '2024-03-01',
      duration: '2h total',
      level: 'All Levels',
      thumbnail: '/thumbnails/mars-songs.jpg'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Materials', icon: BookOpen },
    { value: 'pathfinder', label: 'Pathfinder', icon: Star },
    { value: 'adventurer', label: 'Adventurer', icon: Star },
    { value: 'honors', label: 'Honors', icon: Award },
    { value: 'leadership', label: 'Leadership', icon: Shield },
    { value: 'safety', label: 'Safety', icon: Shield },
    { value: 'skills', label: 'Skills', icon: Tool },
    { value: 'music', label: 'Music', icon: Headphones }
  ]

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'PDF', label: 'PDF Documents' },
    { value: 'Video', label: 'Videos' },
    { value: 'Audio', label: 'Audio' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'rated', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetical' }
  ]

  const filteredAndSortedMaterials = materials
    .filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory
      const matchesType = selectedType === 'all' || material.type === selectedType
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case 'oldest': return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        case 'popular': return b.downloads - a.downloads
        case 'rated': return b.rating - a.rating
        case 'name': return a.title.localeCompare(b.title)
        default: return 0
      }
    })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pathfinder': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'adventurer': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'honors': return 'bg-green-50 text-green-700 border-green-200'
      case 'leadership': return 'bg-red-50 text-red-700 border-red-200'
      case 'safety': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'skills': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'music': return 'bg-pink-50 text-pink-700 border-pink-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText
      case 'Video': return Video
      case 'Audio': return Headphones
      default: return FileText
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-50 text-green-700 border-green-200'
      case 'Intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Advanced': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Materials</h1>
            <p className="text-gray-600 mt-1">Access educational resources and training materials</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            Upload Material
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            title: 'Total Materials',
            value: materials.length,
            change: '+6 this month',
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Total Downloads',
            value: '1.2K',
            change: '+234 this month',
            icon: Download,
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Categories',
            value: categories.length - 1,
            change: '7 topics',
            icon: Filter,
            color: 'from-purple-500 to-purple-600'
          },
          {
            title: 'Avg Rating',
            value: '4.8',
            change: 'From 89 reviews',
            icon: Star,
            color: 'from-orange-500 to-orange-600'
          }
        ].map((stat, index) => (
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

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search materials by title, description, or author..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Materials Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Materials ({filteredAndSortedMaterials.length} found)
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Grid View</Button>
            <Button variant="outline" size="sm">List View</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMaterials.map((material, index) => {
            const TypeIcon = getTypeIcon(material.type)
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className={getCategoryColor(material.category)}>
                        {material.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {material.type}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {material.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {material.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Metadata */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">By {material.author}</span>
                        <span>{material.size}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{material.duration}</span>
                        </div>
                        <Badge variant="outline" className={getLevelColor(material.level)}>
                          {material.level}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{material.uploadDate}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{material.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{material.downloads}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredAndSortedMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}