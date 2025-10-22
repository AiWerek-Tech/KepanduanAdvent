'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Lock, Database, UserCheck, ArrowLeft, Mail, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function PrivacyPolicy() {
  const lastUpdated = new Date('2024-01-15')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-gradient-purple text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kebijakan Privasi
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Kami berkomitmen untuk melindungi privasi dan data pribadi Anda 
              dalam menggunakan platform Kepanduan Advent.
            </p>
            <div className="mt-4">
              <p className="text-sm opacity-75">
                Terakhir diperbarui: {format(lastUpdated, 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-purple-600" />
                    Pendahuluan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Selamat datang di Kebijakan Privasi Kepanduan Advent. Dokumen ini menjelaskan 
                    bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan informasi 
                    pribadi Anda saat Anda menggunakan platform digital kami.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Dengan menggunakan layanan kami, Anda setuju dengan praktik privasi yang dijelaskan 
                    dalam kebijakan ini. Kami mendorong Anda untuk membaca kebijakan ini dengan cermat 
                    untuk memahami bagaimana kami menangani data Anda.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-6 h-6 text-purple-600" />
                    Informasi yang Kami Kumpulkan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Informasi Pribadi</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Nama dan email:</strong> Untuk pembuatan akun dan identifikasi pengguna</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Password:</strong> Dienkripsi secara aman untuk keamanan akun</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Role kepanduan:</strong> Adventurer, Pathfinder, Master Guide, dll</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Avatar dan profil:</strong> Opsional, untuk personalisasi</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Data Pembelajaran</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Progress pembelajaran:</strong> Materi yang telah diselesaikan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Refleksi pribadi:</strong> Catatan refleksi spiritual dan karakter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Pengumpulan tugas:</strong> File dan submission tugas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Sertifikat:</strong> QR code dan data sertifikat yang diterbitkan</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Data Teknis</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Log aktivitas:</strong> Waktu akses dan halaman yang dikunjungi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>Device information:</strong> Browser, OS, dan device type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span><strong>IP address:</strong> Untuk keamanan dan analisis</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* How We Use Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                    Cara Kami Menggunakan Informasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Tujuan Utama</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Menyediakan layanan pembelajaran kepanduan</li>
                        <li>• Melacak progress dan pencapaian pengguna</li>
                        <li>• Menerbitkan sertifikat dan penghargaan</li>
                        <li>• Mengelola kalender kegiatan dan reminder</li>
                        <li>• Memfasilitasi komunikasi antar pengguna</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Tujuan Tambahan</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Meningkatkan kualitas layanan</li>
                        <li>• Analisis penggunaan platform</li>
                        <li>• Keamanan dan perlindungan data</li>
                        <li>• Dukungan teknis dan customer service</li>
                        <li>• Pengembangan fitur baru</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Protection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-6 h-6 text-purple-600" />
                    Perlindungan Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Langkah Keamanan Kami:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span><strong>Enkripsi data:</strong> Semua data sensitif dienkripsi dengan SSL/TLS</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span><strong>Password hashing:</strong> Password di-hash menggunakan bcrypt</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span><strong>Access control:</strong> Akses data terbatas sesuai role</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span><strong>Regular backup:</strong> Backup data dilakukan secara berkala</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span><strong>Security audit:</strong> Audit keamanan dilakukan secara rutin</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                    Hak Anda sebagai Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Hak Akses</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Melihat data pribadi yang kami simpan</li>
                        <li>• Memperbarui informasi profil</li>
                        <li>• Mengunduh data pribadi Anda</li>
                        <li>• Menghapus akun dan data terkait</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Hak Kontrol</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Menolak pengumpulan data tertentu</li>
                        <li>• Meminta pembatasan pengolahan data</li>
                        <li>• Menarik persetujuan penggunaan data</li>
                        <li>• Mengelola preferensi notifikasi</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Catatan:</strong> Untuk menjalankan hak Anda, silakan hubungi kami melalui 
                      informasi kontak yang tersedia di bawah ini.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-purple-600" />
                    Hubungi Kami
                  </CardTitle>
                  <CardDescription>
                    Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, 
                    silakan hubungi kami melalui:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Email</p>
                          <p className="text-gray-600">privacy@kepanduan-advent.org</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Telepon</p>
                          <p className="text-gray-600">+62 21-1234-5678</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Alamat</p>
                        <p className="text-gray-600">
                          Jl. Kepanduan No. 123<br />
                          Jakarta Selatan, DKI Jakarta<br />
                          Indonesia 12345
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Perubahan Kebijakan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk mencerminkan 
                    perubahan dalam praktik kami atau karena alasan operasional, hukum, atau peraturan. 
                    Perubahan akan diberitahukan kepada pengguna melalui email atau pemberitahuan di platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Pengguna disarankan untuk secara berkala meninjau halaman ini untuk informasi 
                    terbaru tentang praktik privasi kami.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}