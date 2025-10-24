// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// ✅ フォント最適化（既存設定を維持）
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // フォント読み込み中もテキスト表示（CLS改善）
  preload: true,
  variable: '--font-inter', // CSS変数として使用可能
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-autosite.com'

export const metadata: Metadata = {
  title: 'Instant Tools - Free Online Tools No Sign-up Required',
  description:
    'Collection of free instant tools that work in your browser. No registration, no upload, no quality limits. Privacy-first tools for everyday tasks.',
  keywords:
    'free online tools, no signup tools, instant tools, privacy tools, browser tools, no registration, local processing',
  authors: [{ name: 'AI AutoSite' }],

  metadataBase: new URL(siteUrl),

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Instant Tools',
    title: 'Instant Tools - Free Online Tools No Sign-up Required',
    description:
      'Collection of free instant tools that work in your browser. Privacy-first, no registration needed.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Instant Tools - Free Browser Tools',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Instant Tools - Free Online Tools',
    description: 'Free instant tools that work in your browser. No sign-up required.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Instant Tools',
  description: 'Collection of free instant tools for privacy, productivity, and creativity',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  author: {
    '@type': 'Organization',
    name: 'AI AutoSite',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1250',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* ✅ 1. DNS Prefetch - 最優先で解決 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* ✅ 2. Preconnect - 早期接続確立 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ 3. Viewport設定 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        
        {/* ✅ 4. JSON-LD構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  )
}