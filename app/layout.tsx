// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Font optimization (maintain existing settings)
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Display text during font loading (improves CLS)
  preload: true,
  variable: '--font-inter', // Available as CSS variable
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-autosite.com'

export const metadata: Metadata = {
  title: {
    default: 'Signal - Transparent & Privacy-First Tools',
    template: '%s | Signal'
  },
  description:
    'Signal provides transparent, privacy-first tools that work entirely in your browser. No data collection, no tracking, no compromises.',
  keywords:
    'privacy tools, transparent tools, browser tools, no tracking, secure tools, local processing, privacy-first, Signal',
  authors: [{ name: 'Signal' }],
  creator: 'Signal',
  publisher: 'Signal',

  metadataBase: new URL(siteUrl),

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Signal',
    title: 'Signal - Transparent & Privacy-First Tools',
    description:
      'Privacy-first tools that work entirely in your browser. No data collection, no tracking, just pure functionality.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Signal - Transparent & Privacy-First Tools',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Signal - Transparent & Privacy-First Tools',
    description: 'Privacy-first tools that work entirely in your browser. No tracking, no compromises.',
    images: ['/opengraph-image'],
  },

  icons: {
    icon: [
      { url: '/icon?<generated>' },
    ],
    apple: [
      { url: '/apple-icon?<generated>' },
    ],
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
  name: 'Signal',
  description: 'Transparent, privacy-first tools for everyday tasks',
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
    name: 'Signal',
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
        {/* 1. DNS Prefetch - resolve first */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* 2. Preconnect - establish early connection */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 3. Viewport settings */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        
        {/* 4. JSON-LD structured data */}
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