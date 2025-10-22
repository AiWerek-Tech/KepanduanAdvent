import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  // Tambahkan konfigurasi untuk base URL di lingkungan preview
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '',
    assetPrefix: '',
  }),
  // Tambahkan trailingSlash untuk menghindari redirect issues
  trailingSlash: false,
  // TANPA rewrites dan redirects yang menyebabkan loop
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'z-cdn-media.chatglm.cn',
        port: '',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'wiki.pathfindersonline.org',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.clubministries.org',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
