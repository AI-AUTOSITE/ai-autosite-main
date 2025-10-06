import { Metadata } from 'next'
import QuickToolsClient from './components/QuickToolsClient'

export const metadata: Metadata = {
  title: 'Free Quick Tools - One-Click Solutions | AI AutoSite',
  description:
    'Instant tools for everyday tasks. No setup needed. 100% free, no ads, no tracking. Works offline in your browser.',
  keywords: 'quick tools, instant tools, free tools, no ads, productivity, one-click, no sign up',
  openGraph: {
    title: 'Quick Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. One-click solutions for everyday tasks.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Quick Tools - No Ads, No Sign Up',
    description: 'Instant tools for everyday tasks without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/quick-tools',
  },
}

export default function QuickToolsPage() {
  return <QuickToolsClient />
}
