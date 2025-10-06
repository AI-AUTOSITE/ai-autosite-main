import { Metadata } from 'next'
import AgeCalculatorClient from './components/AgeCalculatorClient'

export const metadata: Metadata = {
  title: 'Free Age Calculator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Calculate your exact age instantly. 100% free, no ads, no tracking, no email required. Works offline in your browser.',
  keywords:
    'free age calculator, no ads, no sign up, birthday calculator, days old, privacy, no tracking',
  openGraph: {
    title: 'Age Calculator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Calculate age instantly in your browser.',
    type: 'website',
    images: [
      {
        url: '/og-age-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Free Age Calculator - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Age Calculator - No Ads, No Tracking',
    description: 'Calculate exact age without ads or sign-ups.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/age-calculator',
  },
}

export default function AgeCalculatorPage() {
  return <AgeCalculatorClient />
}
