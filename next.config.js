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

  // 🔥 スタンドアロン出力を削除（サイズ削減）
  // output: 'standalone', // コメントアウト

  // Compiler configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 🔥 transpilePackages から transformers を削除
  // （クライアントで動的importするため不要）
  // transpilePackages: ['@huggingface/transformers'],

  // 🔥 Webpack設定
  webpack: (config, { isServer }) => {
    // 🔥 サーバーサイドから完全に除外（正規表現でより確実に）
    if (isServer) {
      const originalExternals = config.externals || []
      
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        // 文字列で除外
        'canvas',
        'sharp',
        // 🔥 正規表現で関連パッケージを全て除外
        /^@huggingface\/.*/,
        /^onnxruntime-.*/,
        /^@xenova\/.*/,
        // 関数で追加の除外
        ({ request }, callback) => {
          if (
            request.includes('@huggingface') ||
            request.includes('onnxruntime') ||
            request.includes('transformers')
          ) {
            return callback(null, 'commonjs ' + request)
          }
          callback()
        },
      ]
    }

    // Client-side: Alias node-only modules to false
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
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

      // 🔥 .mjs ファイルをESMとして処理
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      })
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
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security and performance headers
  async headers() {
    return [
      // WASM files
      {
        source: '/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ONNX files
      {
        source: '/:path*.onnx',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // API CORS headers
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      // Static assets caching
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.(woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security headers
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },

  // Disable powered by header
  poweredByHeader: false,
  
  // Enable compression
  compress: true,

  // 🔥 実験的機能
  experimental: {
    optimizeCss: false,
    swcTraceProfiling: false,
    // 🔥 サーバーコンポーネントから除外
    serverComponentsExternalPackages: [
      'sharp',
      'onnxruntime-node',
      'onnxruntime-web',
      '@huggingface/transformers',  // 🔥 追加
    ],
    esmExternals: 'loose',
  },
}

module.exports = nextConfig