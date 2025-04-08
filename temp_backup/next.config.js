/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['better-sqlite3'],
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
  reactStrictMode: false,
}

module.exports = nextConfig 