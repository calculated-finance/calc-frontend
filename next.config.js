/** @type {import('next').NextConfig} */

const withImages = require('next-images');

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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

const withTM = require('next-transpile-modules')(['d3-format', '@wizard-ui/core', '@wizard-ui/react']);

module.exports = withImages(withTM(nextConfig));
