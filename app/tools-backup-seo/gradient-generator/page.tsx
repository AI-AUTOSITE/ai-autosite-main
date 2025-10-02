import { Metadata } from 'next'
import GradientGeneratorClient from './components/GradientGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Gradient Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Create CSS gradients instantly. 100% free, no ads, works offline in your browser.',
  keywords: 'free gradient generator, no ads, css gradient, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Gradient Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Beautiful CSS gradients without the BS.',
    type: 'website',
    images: [{
      url: '/og-gradient-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free Gradient Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradient Generator - Free Forever',
    description: 'CSS gradients without ads or sign-ups.'
  }
}

export default function GradientGeneratorPage() {
  return <GradientGeneratorClient />
}