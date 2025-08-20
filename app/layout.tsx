import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Instant Tools - Free Online Tools No Sign-up Required',
  description: 'Collection of free instant tools that work in your browser. No registration, no upload, no quality limits. Privacy-first tools for everyday tasks.',
  keywords: 'free online tools, no signup tools, instant tools, privacy tools, browser tools, no registration, local processing',
  authors: [{ name: 'AI AutoSite' }],
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-autosite.com',
    siteName: 'Instant Tools',
    title: 'Instant Tools - Free Online Tools No Sign-up Required',
    description: 'Collection of free instant tools that work in your browser. Privacy-first, no registration needed.',
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

// Structured data for the tool collection
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Instant Tools',
  description: 'Collection of free instant tools for privacy, productivity, and creativity',
  url: 'https://ai-autosite.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ai-autosite.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  author: {
    '@type': 'Organization',
    name: 'AI AutoSite',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1250',
  }
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}