import { Metadata } from 'next'
import PercentageCalculatorClient from './components/PercentageCalculatorClient'

export const metadata: Metadata = {
  title: 'Free Percentage Calculator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Calculate percentages instantly. 100% free, no ads, works offline. Discounts, tips, percentage change.',
  keywords: 'free percentage calculator, no ads, discount calculator, privacy, no sign up',
  openGraph: {
    title: 'Percentage Calculator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Quick percentage math without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-percentage-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Free Percentage Calculator - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator - Free Forever',
    description: 'Calculate percentages without ads.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/percentage-calculator',
  },
}

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />
}
