import { Metadata } from 'next'
import CodeRoasterClient from './components/CodeRoasterClient'

export const metadata: Metadata = {
  title: 'Free Code Roaster - No Ads, No Sign Up | AI AutoSite',
  description: 'Get hilarious AI code reviews instantly. 100% free, no ads, no tracking. Debug and improve code with humor.',
  keywords: 'free code review, no ads, code roaster, ai debug, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Code Roaster - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Get hilarious AI code reviews that actually help.',
    type: 'website',
    images: [{
      url: '/og-code-roaster.png',
      width: 1200,
      height: 630,
      alt: 'Free Code Roaster - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Roaster - Free Forever, No Ads',
    description: 'Hilarious AI code reviews without ads or tracking.'
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
    }
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/code-roaster'
  }
}

export default function CodeRoasterPage() {
  return <CodeRoasterClient />
}