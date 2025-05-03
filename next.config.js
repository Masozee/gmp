/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Default value, good practice to keep
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Assuming images are served over HTTPS
        hostname: 'www.generasimelekpolitik.org',
        port: '', // Usually empty for standard ports 443/80
        pathname: '/**', // Allow any path under this hostname
      },
      // Add other hostnames here if needed in the future
    ],
  },
};

module.exports = nextConfig; 