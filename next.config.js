/** @type {import('next').NextConfig} */
const path = require('path')

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

const apiURL = new URL(process.env.NEXT_PUBLIC_API_URI)
const allowedImageDomains = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS.split(",")
  : []
const imageConversionFormats = process.env.NEXT_PUBLIC_IMAGE_CONVERSION_FORMATS
  ? process.env.NEXT_PUBLIC_IMAGE_CONVERSION_FORMATS.split(",")
  : []

/** @type {import('next').NextConfig} */
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

// module.exports = nextConfig

const sentryConfig = {

}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  org: "zoo-activist",
  project: "asg-personal-account-nextjs",

  // An auth token is required for uploading source maps.
  authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  // module.exports,
  {
    ...nextConfig,
    sentry: {
      // widenClientFileUpload: true,
      // hideSourceMaps: true,
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
    }
  },
  sentryWebpackPluginOptions,
  {},
)
