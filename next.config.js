/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to prevent double-rendering issues
  transpilePackages: ['three'],
}

module.exports = nextConfig
