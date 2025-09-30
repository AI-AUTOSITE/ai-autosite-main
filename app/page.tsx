// app/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryHomeView from '@/components/CategoryHomeView'

// SEO Metadata
export const metadata: Metadata = {
  title: 'AI AutoSite - Free Online Tools | No Ads, No Tracking, 100% Private',
  description: 'Access 50+ free online tools that work instantly in your browser. No sign-up required, no ads, no tracking. Tools for developers, students, professionals, and creators.',
  keywords: 'free online tools, no ads tools, privacy tools, developer tools, pdf tools, json formatter, password generator, ai tools, browser tools, instant tools',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-autosite.com',
    siteName: 'AI AutoSite',
    title: 'AI AutoSite - Free Online Tools | 100% Private',
    description: '50+ free online tools with zero ads, zero tracking. Work instantly in your browser.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI AutoSite - Free Online Tools',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AI AutoSite - Free Online Tools',
    description: '50+ free online tools. No ads, no tracking, 100% private.',
    images: ['/twitter-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  alternates: {
    canonical: 'https://ai-autosite.com',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryHomeView />
      </main>
      <Footer />
    </div>
  )
}