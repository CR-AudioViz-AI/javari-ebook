/** @type {import('next').NextConfig} */
// next.config.js — javari-ebook — CR AudioViz AI — Created: 2026-03-15
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
    ],
  },
};
module.exports = nextConfig;