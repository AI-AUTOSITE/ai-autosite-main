// app/tools/pc-optimizer/page.tsx

import { Metadata } from 'next'
import PCOptimizerClient from './components/PCOptimizerClient'

export const metadata: Metadata = {
  title: 'Free PC Optimizer Advisor - No Ads, No Sign Up | AI AutoSite',
  description:
    'Analyze PC storage and get optimization tips. 100% free, no ads, works offline. Privacy guaranteed.',
  keywords: 'free pc optimizer, no ads, storage analyzer, privacy, no sign up, no tracking',
  openGraph: {
    title: 'PC Optimizer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Optimize your PC without uploading data.',
    type: 'website',
    images: [
      {
        url: '/og-pc-optimizer.png',
        width: 1200,
        height: 630,
        alt: 'Free PC Optimizer - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PC Optimizer - Free Forever',
    description: 'Analyze storage privately. No uploads.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/pc-optimizer',
  },
}

export default function PCOptimizerPage() {
  return <PCOptimizerClient />
}
