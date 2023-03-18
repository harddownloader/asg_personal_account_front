/** @type {import('next').NextConfig} */
const path = require('path')

const apiURL = new URL(process.env.NEXT_PUBLIC_API_URI)
const allowedImageDomains = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS.split(",")
  : []
const imageConversionFormats = process.env.NEXT_PUBLIC_IMAGE_CONVERSION_FORMATS
  ? process.env.NEXT_PUBLIC_IMAGE_CONVERSION_FORMATS.split(",")
  : []

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [apiURL.hostname, ...allowedImageDomains],
    formats: imageConversionFormats,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false
      }
    }

    return config
  },
}

module.exports = nextConfig
