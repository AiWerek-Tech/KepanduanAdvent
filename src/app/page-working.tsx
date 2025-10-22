'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, Star, ArrowRight, Sparkles, Compass } from 'lucide-react'

const classes = [
  {
    id: 'adventurer',
    title: 'Adventurer',
    age: '4-9 Tahun',
    description: 'Perjalanan iman dan petualangan pertama untuk anak-anak',
    icon: Sparkles,
    color: 'from-pink-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    features: ['Little Lamb', 'Early Bird', 'Busy Bee', 'Sunbeam'],
  },
  {
    id: 'pathfinder',
    title: 'Pathfinder',
    age: '10-15 Tahun',
    description: 'Pengembangan karakter dan keterampilan remaja',
    icon: Compass,
    color: 'from-blue-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
    features: ['Friend', 'Companion', 'Explorer', 'Ranger'],
  },
  {
    id: 'master-guide',
    title: 'Master Guide',
    age: '16+ Tahun',
    description: 'Kepemimpinan dan pembinaan generasi muda',
    icon: Award,
    color: 'from-indigo-400 to-purple-400',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    features: ['Leadership', 'Mentorship', 'Spiritual Growth'],
  },
]

const stats = [
  { label: 'Pandua Aktif', value: '10,000+', icon: Users },
  { label: 'Materi Pembelajaran', value: '500+', icon: BookOpen },
  { label: 'Sertifikat Diterbitkan', value: '5,000+', icon: Award },
  { label: 'Tingkat Kepuasan', value: '98%', icon: Star },
]

export default function TestHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-8">
              <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-1">
                <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
                  <img
                    src="/logos/logo_kepanduan.png"
                    alt="Kepanduan Advent Logo"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Kepanduan Advent
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Platform digital interaktif untuk pembelajaran dan pelatihan Adventurer, Pathfinder, dan Master Guide. 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                {" "}Bersama membangun generasi yang berkarakter, berintegritas, dan berpegang teguh pada iman.
              </span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Mulai Perjalanan
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                  Login
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="text-center transform hover:scale-105 transition-transform duration-200"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-2">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tingkatan Kepanduan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Setiap tingkatan dirancang khusus untuk tahapan perkembangan yang berbeda dengan metode pembelajaran yang tepat dan menyenangkan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {classes.map((classItem) => {
              const Icon = classItem.icon
              return (
                <div
                  key={classItem.id}
                  className="group transform hover:-translate-y-2 transition-all duration-300"
                >
                  <Card className={`h-full ${classItem.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden`}>
                    <div className={`h-3 bg-gradient-to-r ${classItem.color}`} />
                    <CardHeader className="text-center pb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto transform hover:scale-110 hover:rotate-3 transition-transform duration-200">
                        <div className="w-full h-full bg-white rounded-2xl p-2 shadow-lg">
                          <img
                            src={`/logos/logo_${classItem.id.toLowerCase()}.png`}
                            alt={`${classItem.title} Logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-3">
                        {classItem.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                        {classItem.age}
                      </Badge>
                      <CardDescription className="text-gray-600 text-base leading-relaxed">
                        {classItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-500" />
                            Tingkatan
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {classItem.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs bg-white/50">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Pelajari {classItem.title}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Siap Memulai Perjalanan?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Bergabunglah dengan ribuan panduan lainnya dalam membangun generasi yang berkarakter dan berintegritas.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                  Login Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}