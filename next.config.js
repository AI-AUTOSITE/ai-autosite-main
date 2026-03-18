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

  // Compiler configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 🔥 Webpack設定
  webpack: (config, { isServer }) => {
    // 🔥 サーバーサイドのみで除外（クライアントには影響させない）
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
        'sharp': false,
        'canvas': false,
        '@xenova/transformers': false,  // 🔥 追加: iOS Safari対応
      }
    }

    // クライアント・サーバー共通
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
    }

    // 🔥 canvasをクライアントでも除外（pdfjs-distが使おうとする）
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': false,
      }
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
        canvas: false,
      }

      // .mjs ファイルをESMとして処理
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      })
    }

    // 🔥 .node ファイル（ネイティブモジュール）を無視
    config.module.rules.push({
      test: /\.node$/,
      use: 'null-loader',
    })

    // .onnx ファイルのサポート
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
    domains: ['ai-autosite.com', 'tool7.ai-autosite.com', 'image.tmdb.org'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.onnx',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), display-capture=(self), geolocation=()' },
        ],
      },
    ]
  },

  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },

  poweredByHeader: false,
  compress: true,

  // 🔥 experimental設定
  experimental: {
    serverComponentsExternalPackages: [
      'onnxruntime-node',
      'sharp',
      'canvas',
      '@xenova/transformers',  // 🔥 追加: iOS Safari対応
    ],
    // 🔥 ファイルトレーシング除外
    outputFileTracingExcludes: {
      '*': [
        './node_modules/onnxruntime-node',
        './node_modules/onnxruntime-node/**/*',
        './node_modules/@img/sharp-libvips-*',
        './node_modules/@img/sharp-libvips-*/**/*',
        './node_modules/sharp',
        './node_modules/sharp/**/*',
        './node_modules/canvas',
        './node_modules/canvas/**/*',
        './node_modules/@xenova/transformers',       // 🔥 追加
        './node_modules/@xenova/transformers/**/*',  // 🔥 追加
      ],
    },
    esmExternals: 'loose',
  },
}

module.exports = nextConfig