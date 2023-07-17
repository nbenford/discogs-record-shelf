/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: [
      'static.coinstats.app',
      'swiperjs.com',
      'i.discogs.com',
      'www.discogs.com',
      'secure.gravatar.com',
    ],
  },
});

module.exports = nextConfig;
