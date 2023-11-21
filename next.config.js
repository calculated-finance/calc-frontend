/** @type {import('next').NextConfig} */

module.exports = {
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
};
