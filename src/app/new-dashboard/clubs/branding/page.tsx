'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Image, Upload, Palette, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sidebar } from '../../dashboard/components/Sidebar'
import { TopBar } from '../../dashboard/components/TopBar'

export default function ClubsBrandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
    }
  }

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBannerFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname="/new-dashboard/clubs/branding" />
      
      <div className="lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title="Logo & Banner" />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Logo & Banner</h1>
              <p className="text-gray-600">Manage club branding materials and visual identity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo Management */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Club Logo
                    </CardTitle>
                    <CardDescription>
                      Upload and manage the official club logo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Logo */}
                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-300">
                        <img
                          src="/logos/logo_kepanduan_square.png"
                          alt="Current Club Logo"
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                    </div>

                    {/* Upload New Logo */}
                    <div className="space-y-2">
                      <Label htmlFor="logo-upload">Upload New Logo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {logoFile && (
                        <p className="text-sm text-green-600">
                          Selected: {logoFile.name}
                        </p>
                      )}
                    </div>

                    {/* Logo Guidelines */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Logo Guidelines</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Recommended size: 512x512px</li>
                        <li>• Format: PNG with transparent background</li>
                        <li>• Maximum file size: 2MB</li>
                        <li>• High resolution for quality display</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Banner Management */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" alt="Club Banner" />
                      Club Banner
                    </CardTitle>
                    <CardDescription>
                      Upload and manage the club banner image
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Banner */}
                    <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-300">
                      <div className="text-center">
                        <Image className="h-12 w-12 text-purple-400 mx-auto mb-2" alt="Banner Placeholder" />
                        <p className="text-purple-600">Current Banner</p>
                      </div>
                    </div>

                    {/* Upload New Banner */}
                    <div className="space-y-2">
                      <Label htmlFor="banner-upload">Upload New Banner</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="banner-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="flex-1"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {bannerFile && (
                        <p className="text-sm text-green-600">
                          Selected: {bannerFile.name}
                        </p>
                      )}
                    </div>

                    {/* Banner Guidelines */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Banner Guidelines</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Recommended size: 1920x1080px</li>
                        <li>• Format: JPG or PNG</li>
                        <li>• Maximum file size: 5MB</li>
                        <li>• Include club name and motto</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Color Scheme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Scheme
                  </CardTitle>
                  <CardDescription>
                    Official club colors and branding guidelines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-full h-20 bg-purple-600 rounded-lg mb-2"></div>
                      <p className="font-semibold">Primary</p>
                      <p className="text-sm text-gray-600">#9333EA</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-indigo-600 rounded-lg mb-2"></div>
                      <p className="font-semibold">Secondary</p>
                      <p className="text-sm text-gray-600">#4F46E5</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-blue-600 rounded-lg mb-2"></div>
                      <p className="font-semibold">Accent</p>
                      <p className="text-sm text-gray-600">#2563EB</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 border"></div>
                      <p className="font-semibold">Background</p>
                      <p className="text-sm text-gray-600">#F3F4F6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Download Assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Brand Assets
                  </CardTitle>
                  <CardDescription>
                    Download official club branding materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Award className="h-8 w-8" />
                      <span>Logo Pack</span>
                      <span className="text-xs text-gray-500">PNG, SVG formats</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Image className="h-8 w-8" alt="Banner Templates" />
                      <span>Banner Templates</span>
                      <span className="text-xs text-gray-500">PSD, AI files</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Palette className="h-8 w-8" />
                      <span>Color Palette</span>
                      <span className="text-xs text-gray-500">ASE, SWATCH files</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}