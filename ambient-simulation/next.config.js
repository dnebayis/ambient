/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to prevent double-rendering issues
  transpilePackages: ['three'],
  output: 'standalone', // Optimize for Vercel deployment
}

module.exports = nextConfig
