'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Compass, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Animated Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-8"
            >
              <Compass className="w-12 h-12 text-purple-600" />
            </motion.div>

            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <h1 className="text-8xl font-bold text-gradient-purple">404</h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                Sepertinya Anda tersesat dalam perjalanan kepanduan. 
                Mari kita kembali ke jalur yang tepat!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/">
                <Button className="bg-gradient-purple hover:opacity-90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Home className="w-5 h-5 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali
              </Button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12"
            >
              <p className="text-sm text-gray-500 mb-4">Mungkin Anda mencari:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/new-dashboard">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/materials">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Materi Pembelajaran
                  </Button>
                </Link>
                <Link href="/kalender">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Kalender Kegiatan
                  </Button>
                </Link>
                <Link href="/buku-panduan">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Buku Panduan
                  </Button>
                </Link>
                <Link href="/honors">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    Honors
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Fun Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 flex items-center justify-center text-sm text-gray-500"
            >
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              <span>"Even the best explorers get lost sometimes. Keep exploring!"</span>
              <Sparkles className="w-4 h-4 ml-2 text-purple-400" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}