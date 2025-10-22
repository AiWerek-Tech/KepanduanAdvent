'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Calendar, BookOpen, Award, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'user' | 'event' | 'material' | 'certificate' | 'assignment'
  title: string
  description: string
  url: string
  metadata?: {
    role?: string
    date?: string
    status?: string
  }
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    title: 'John Doe',
    description: 'Pathfinder - Advanced Leadership',
    url: '/new-dashboard/users/pathfinders/1',
    metadata: {
      role: 'PATHFINDER',
      status: 'Active'
    }
  },
  {
    id: '2',
    type: 'event',
    title: 'Camp Meeting 2024',
    description: 'Annual camping event for all members',
    url: '/new-dashboard/events/1',
    metadata: {
      date: '2024-03-15',
      status: 'Upcoming'
    }
  },
  {
    id: '3',
    type: 'material',
    title: 'Nature Study Guide',
    description: 'Complete guide to nature observation',
    url: '/new-dashboard/learning/materials/1',
    metadata: {
      status: 'Published'
    }
  },
  {
    id: '4',
    type: 'certificate',
    title: 'Leadership Excellence',
    description: 'Certificate for completing leadership course',
    url: '/new-dashboard/events/certificates/1',
    metadata: {
      date: '2024-02-20',
      status: 'Issued'
    }
  },
  {
    id: '5',
    type: 'assignment',
    title: 'Reflection Essay',
    description: 'Personal growth reflection assignment',
    url: '/new-dashboard/learning/assignments/1',
    metadata: {
      status: 'Pending'
    }
  }
]

const getSearchIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'user': return Users
    case 'event': return Calendar
    case 'material': return BookOpen
    case 'certificate': return Award
    case 'assignment': return FileText
    default: return Search
  }
}

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-800'
    case 'event': return 'bg-green-100 text-green-800'
    case 'material': return 'bg-purple-100 text-purple-800'
    case 'certificate': return 'bg-yellow-100 text-yellow-800'
    case 'assignment': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate API call
      const timer = setTimeout(() => {
        const filteredResults = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filteredResults)
        setIsLoading(false)
        setIsOpen(true)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle full search
    setIsOpen(false)
  }

  const handleResultClick = (result: SearchResult) => {
    window.location.replace(result.url)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari anggota, kelas, atau materi..."
            className="pl-10 pr-4 h-10 bg-gray-50/80 border-gray-200/60 focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white transition-all duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 2 && setIsOpen(true)}
          />
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-3 text-sm font-medium">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => {
                  const Icon = getSearchIcon(result.type)
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200/60">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {result.title}
                            </h4>
                            <Badge variant="secondary" className={cn("text-xs font-medium", getTypeColor(result.type))}>
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {result.description}
                          </p>
                          {result.metadata && (
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              {result.metadata.role && (
                                <span className="font-medium">Role: {result.metadata.role}</span>
                              )}
                              {result.metadata.date && (
                                <span className="font-medium">Date: {result.metadata.date}</span>
                              )}
                              {result.metadata.status && (
                                <Badge variant="outline" className="text-xs font-medium border-gray-200">
                                  {result.metadata.status}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : query.length > 2 ? (
              <div className="p-6 text-center text-gray-500">
                <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}