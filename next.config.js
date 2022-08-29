/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    }
  },
}

module.exports = nextConfig 
