/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: 'loose',
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
};

const withTM = require('next-transpile-modules')(['d3-format', '@wizard-ui/core', '@wizard-ui/react']);

module.exports = withTM(nextConfig);
