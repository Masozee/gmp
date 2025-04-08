/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure the build ignores all linting errors
  experimental: {
    forceSwcTransforms: true
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    isVercel: process.env.VERCEL === '1',
    dbPath: process.env.VERCEL === '1' ? ':memory:' : './src/db.sqlite'
  }
}

module.exports = nextConfig; 