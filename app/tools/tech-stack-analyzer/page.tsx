import { Metadata } from 'next'
import TechStackComparison from './components/TechStackComparison'

export const metadata: Metadata = {
  title: 'Free Tech Stack Analyzer - No Ads, No Sign Up | AI AutoSite',
  description:
    'Compare frameworks instantly. 100% free, no ads, no tracking. Next.js, React, Vue comparisons.',
  keywords: 'free tech stack analyzer, framework comparison, no ads, privacy, no sign up',
  openGraph: {
    title: 'Tech Stack Analyzer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Compare frameworks without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-tech-stack-analyzer.png',
        width: 1200,
        height: 630,
        alt: 'Free Tech Stack Analyzer - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Stack Analyzer - Free Forever',
    description: 'Framework comparisons without ads.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/tech-stack-analyzer',
  },
}

export default function TechStackAnalyzerPage() {
  return <TechStackComparison />
}
