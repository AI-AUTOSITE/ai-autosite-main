/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode（本番環境では true 推奨）
  reactStrictMode: process.env.NODE_ENV === 'production',
  
  // TypeScriptエラーを一時的に無視
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLintエラーも一時的に無視
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack設定のカスタマイズ
  webpack: (config, { dev, isServer }) => {
    // サーバーサイドでpdf-parseのcanvas依存を外部化
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        canvas: 'canvas',
      })
    }

    // 開発環境でのロギングレベルを制御
    if (dev && !isServer) {
      config.infrastructureLogging = {
        level: 'error', // 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'
      };
      
      // ソースマップの最適化（開発時の速度向上）
      config.devtool = 'eval-source-map';
      
      // WebAssembly対応（Tesseract.js用）
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };
    }
    
    // 本番環境の最適化
    if (!dev) {
      // Terser設定（圧縮最適化）
      config.optimization.minimizer = config.optimization.minimizer.map(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              drop_console: true, // console.logを削除
            },
          };
        }
        return minimizer;
      });
    }
    
    // pdf.jsとTesseract.js用の設定
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
    };
    
    return config;
  },

  // リダイレクト設定
  async redirects() {
    return [
      // tool7.ai-autosite.com → /tools/blurtap
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
      // www → non-www
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
    ];
  },

  // 画像最適化設定
  images: {
    domains: ['ai-autosite.com', 'tool7.ai-autosite.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30日間のキャッシュ
  },

  // 実験的機能の設定
  experimental: {
    // App Directory最適化
    optimizeCss: true,
    
    // サーバーコンポーネントの最適化
    serverComponentsExternalPackages: ['pdf-lib', 'pdfjs-dist', 'tesseract.js', 'canvas', 'pdf-parse'],
  },

  // パフォーマンス設定
  poweredByHeader: false, // X-Powered-Byヘッダーを削除
  compress: true, // gzip圧縮を有効化
  
  // CORS設定（PDF処理用）
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // 環境変数の設定
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
};

module.exports = nextConfig;