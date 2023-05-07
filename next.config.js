/** @type {import('next').NextConfig} */

const withImages = require('next-images');

const nextConfig = {
  swcMinify: true,
  pageExtensions: ['page.tsx'],
  reactStrictMode: false,
  trailingSlash: true,
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

module.exports = withImages(nextConfig);

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'calc-09',
    project: 'javascript-nextjs',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
