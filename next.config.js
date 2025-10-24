/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        canvas: 'canvas',
      })
    }

    if (dev && !isServer) {
      config.infrastructureLogging = {
        level: 'error',
      }
      config.devtool = 'eval-source-map'
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      }
    }

    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer.map((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              drop_console: true,
            },
          }
        }
        return minimizer
      })
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
    }

    return config
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/tools/blurtap',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'tool7.ai-autosite.com',
          },
        ],
      },
      {
        source: '/:path*',
        destination: 'https://ai-autosite.com/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'www.ai-autosite.com',
          },
        ],
      },
    ]
  },

  images: {
    domains: ['ai-autosite.com', 'tool7.ai-autosite.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: [
      'pdf-lib',
      'pdfjs-dist',
      'tesseract.js',
      'canvas',
      'pdf-parse',
    ],
  },

  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      // ✅ 画像ファイルのキャッシュ強化
      {
        source: '/:path(.*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ フォントファイルのキャッシュ強化
      {
        source: '/:path(.*\\.(?:woff|woff2|eot|ttf|otf)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ CSSファイルのキャッシュ設定追加
      {
        source: '/:path(.*\\.css$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ✅ JSファイルのキャッシュ設定追加
      {
        source: '/:path(.*\\.(?:js|mjs)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
}

module.exports = nextConfig