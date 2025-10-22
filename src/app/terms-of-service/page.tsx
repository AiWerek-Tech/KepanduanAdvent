'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, AlertCircle, Users, Shield, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function TermsOfService() {
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
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Syarat & Ketentuan Layanan
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Syarat dan ketentuan penggunaan platform Kepanduan Advent 
              untuk menciptakan lingkungan pembelajaran yang aman dan produktif.
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
            {/* Acceptance of Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    Penerimaan Syarat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Dengan mendaftar dan menggunakan platform Kepanduan Advent, Anda menyetujui 
                    untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan 
                    bagian mana pun dari syarat ini, Anda tidak boleh menggunakan layanan kami.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Platform ini disediakan oleh Kepanduan Advent dan dioperasikan untuk 
                    kepentingan pembinaan karakter dan pengembangan spiritual generasi muda.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-600" />
                    Tanggung Jawab Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Akun Pengguna</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Anda harus memberikan informasi yang akurat dan lengkap</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Satu orang hanya boleh memiliki satu akun</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Perilaku Pengguna</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Menggunakan platform untuk tujuan pembelajaran kepanduan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Menghormati pengguna lain dan administrator</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Tidak mengunggah konten yang tidak pantas atau melanggar hukum</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span>Tidak mencoba merusak atau mengganggu operasional platform</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content and Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                    Konten & Hak Kekayaan Intelektual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Hak Kekayaan Intelektual Kami</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Semua materi pembelajaran, kurikulum, desain, logo, dan konten lainnya 
                      di platform ini dilindungi oleh hak cipta dan milik Kepanduan Advent atau 
                      pihak ketiga yang berwenang.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Anda tidak boleh menyalin, mendistribusikan, atau memodifikasi konten tanpa izin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Penggunaan konten terbatas untuk pembelajaran pribadi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Logo dan branding Kepanduan Advent adalah merek terdaftar</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Konten Pengguna</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Dengan mengunggah konten ke platform, Anda memberikan kami lisensi non-eksklusif 
                      untuk menggunakan, menampilkan, dan mendistribusikan konten tersebut dalam rangka 
                      menyediakan layanan kami.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Anda mempertahankan kepemilikan konten yang Anda unggah</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Anda bertanggung jawab atas konten yang Anda unggah</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>Kami berhak menghapus konten yang melanggar syarat</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy and Data Protection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                    Privasi & Perlindungan Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Privasi Anda adalah prioritas kami. Pengumpulan, penggunaan, dan perlindungan 
                    data pribadi Anda diatur oleh Kebijakan Privasi kami yang merupakan bagian 
                    tidak terpisahkan dari syarat dan ketentuan ini.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Penting:</strong> Dengan menggunakan platform ini, Anda menyetujui 
                      pengumpulan dan pengolahan data Anda sebagaimana dijelaskan dalam 
                      Kebijakan Privasi kami.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prohibited Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    Aktivitas yang Dilarang
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Anda dilarang keras untuk melakukan aktivitas berikut:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Menggunakan platform untuk kegiatan ilegal atau tidak etis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Mencoba mendapatkan akses tidak sah ke sistem atau akun lain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Mengirim spam, virus, atau kode berbahaya</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Memalsukan identitas atau menyamar sebagai orang lain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Mengganggu atau mengganggu penggunaan platform oleh orang lain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Mengunggah konten yang melanggar hak cipta atau privasi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Pembatasan Tanggung Jawab</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Platform Kepanduan Advent disediakan "sebagaimana adanya" tanpa jaminan 
                    dalam bentuk apa pun. Sejauh diizinkan oleh hukum yang berlaku:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Kami tidak bertanggung jawab atas kerugian langsung atau tidak langsung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Kami tidak menjamin kelangsungan operasional platform 100% waktu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Kami tidak bertanggung jawab atas konten dari pihak ketiga</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Termination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Terminasi Layanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Kami berhak menghentikan atau menangguhkan akun Anda secara segera jika:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Anda melanggar syarat dan ketentuan ini</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Anda terlibat dalam aktivitas yang merugikan platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Diperlukan oleh hukum atau peraturan yang berlaku</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    Anda juga dapat menutup akun Anda kapan saja melalui pengaturan akun.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Perubahan Syarat & Ketentuan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
                    diberitahukan kepada pengguna melalui email atau pemberitahuan di platform. 
                    Penggunaan platform yang berkelanjutan setelah perubahan berarti Anda 
                    menerima syarat yang diperbarui.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Hubungi Kami</CardTitle>
                  <CardDescription>
                    Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
                    silakan hubungi kami:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> legal@kepanduan-advent.org</p>
                    <p><strong>Telepon:</strong> +62 21-1234-5678</p>
                    <p><strong>Alamat:</strong> Jl. Kepanduan No. 123, Jakarta Selatan</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
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