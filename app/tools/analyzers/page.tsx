import { Metadata } from 'next'
import AnalyzersClient from './components/AnalyzersClient'

export const metadata: Metadata = {
  title: 'Free Analyzer Tools - Data & Performance Analysis | AI AutoSite',
  description:
    'Analyze files, networks, tokens, and performance. PC optimization, network diagnostics, token compression. No ads, no tracking.',
  keywords:
    'analyzer tools, data analysis, network checker, token analyzer, pc optimizer, performance, free, no ads',
  openGraph: {
    title: 'Analyzer Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Analyze data and optimize performance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Analyzer Tools - No Ads, No Sign Up',
    description: 'Analyze and optimize without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/analyzers',
  },
}

export default function AnalyzersPage() {
  return <AnalyzersClient />
}