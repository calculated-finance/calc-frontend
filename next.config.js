/** @type {import('next').NextConfig} */

const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  swcMinify: true,
  pageExtensions: ['page.tsx'],
  reactStrictMode: false,
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  redirects: [
    {
      source: '/create-strategy/dca-in/',
      destination: '/create-strategy/dca-in/assets',
      permanent: true,
    },
    {
      source: '/create-strategy/dca-out/',
      destination: '/create-strategy/dca-out/assets',
      permanent: true,
    },
  ],
  // exportPathMap: async function () {
  //   return {
  //     '/': { page: '/' },
  //   };
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(withImages(nextConfig));
