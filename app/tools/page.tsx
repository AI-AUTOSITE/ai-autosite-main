import { Metadata } from 'next'
import ToolsPageClient from '../components/ToolsPageClient'

export const metadata: Metadata = {
  title: 'Tools - AI AutoSite | Free Online Tools',
  description: 'Browse our collection of 50+ free online tools. No ads, no tracking, instant access. Tools for developers, students, professionals, and creators.',
  keywords: 'free tools, online tools, developer tools, creative tools, business tools, study tools, no ads, privacy-first',
  openGraph: {
    title: 'Tools - AI AutoSite',
    description: '50+ free online tools with zero ads and tracking',
    type: 'website',
    url: 'https://ai-autosite.com/tools',
    images: [{
      url: '/og-tools.png',
      width: 1200,
      height: 630,
      alt: 'AI AutoSite Tools'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools - AI AutoSite',
    description: '50+ tools. No ads. No tracking. 100% free.'
  }
}

export default function ToolsPage() {
  return <ToolsPageClient />
}