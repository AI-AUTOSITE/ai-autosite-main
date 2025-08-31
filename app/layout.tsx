// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// ① 本番/ローカル共通で絶対URLを安定供給
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-autosite.com'

export const metadata: Metadata = {
  title: 'Instant Tools - Free Online Tools No Sign-up Required',
  description:
    'Collection of free instant tools that work in your browser. No registration, no upload, no quality limits. Privacy-first tools for everyday tasks.',
  keywords:
    'free online tools, no signup tools, instant tools, privacy tools, browser tools, no registration, local processing',
  authors: [{ name: 'AI AutoSite' }],

  // ② これが未設定だと OGP/Twitter 画像URL解決で Warning
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
    description:
      'Free instant tools that work in your browser. No sign-up required.',
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

// ③ 構造化データ（元コードの jsonLd）を <head> に実際に出力
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Instant Tools',
  description:
    'Collection of free instant tools for privacy, productivity, and creativity',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // 注意: 直接オブジェクトを入れず JSON.stringify する
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* ④ Inter フォントを body に適用 */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
