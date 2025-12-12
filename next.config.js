/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core configuration
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🔥 メモリ最適化: スタンドアロン出力
  output: 'standalone',

  // Compiler configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 🔥 Transformers.js対応
  transpilePackages: ['@huggingface/transformers'],

  // 🔥 メモリ最適化: Webpack設定を簡略化
  webpack: (config, { isServer }) => {
    // Server-side configuration
    if (isServer) {
      config.externals = config.externals || []
      // 配列形式で追加（オブジェクト形式と混在させない）
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas', 'onnxruntime-web', 'sharp', 'onnxruntime-node')
      } else {
        config.externals = [config.externals, 'canvas', 'onnxruntime-web', 'sharp', 'onnxruntime-node']
      }
    }

    // Client-side: Alias node-only modules to false (they will use web alternatives)
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
      // Transformers.js: exclude Node.js-only modules for browser
      "sharp$": false,
      "onnxruntime-node$": false,
    }

    // WASM support for ONNX Runtime
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    // Fallback for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    // 🔥 .onnx ファイルのサポート
    config.module.rules.push({
      test: /\.onnx$/,
      type: 'asset/resource',
    })

    return config
  },

  // Redirects configuration
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

  // Image optimization configuration
  images: {
    domains: ['ai-autosite.com', 'tool7.ai-autosite.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security and performance headers
  async headers() {
    return [
      // 🔥 WASM files - Content-Type header for ONNX Runtime
      {
        source: '/:path*.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 🔥 ONNX files - Content-Type header
      {
        source: '/:path*.onnx',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API CORS headers
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      // Static assets caching - Images
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.gif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets caching - Fonts
      {
        source: '/:path*.woff',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.ttf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.otf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets caching - CSS
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets caching - JavaScript
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Security headers for all pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },

  // Disable powered by header for security
  poweredByHeader: false,
  
  // Enable compression
  compress: true,

  // 🔥 メモリ最適化: 実験的機能
  experimental: {
    // メモリ使用量を抑制
    optimizeCss: false,
    swcTraceProfiling: false,
    // Transformers.js: exclude from server bundling
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node', 'onnxruntime-web'],
    // 🔥 ESM互換性向上
    esmExternals: 'loose',
  },
}

module.exports = nextConfig