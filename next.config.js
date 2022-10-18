/** @type {import('next').NextConfig} */

const withImages = require('next-images');

const nextConfig = {
  swcMinify: true,
  pageExtensions: ['page.tsx'],
  reactStrictMode: false,
  trailingSlash: true,
  experimental: {
    esmExternals: 'loose',
  },
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

const withTM = require('next-transpile-modules')(['d3-format', '@wizard-ui/core', '@wizard-ui/react']);

module.exports = withImages(withTM(nextConfig));
