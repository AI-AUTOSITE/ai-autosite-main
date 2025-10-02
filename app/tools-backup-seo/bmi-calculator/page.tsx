import { Metadata } from 'next'
import BmiCalculatorClient from './components/BmiCalculatorClient'

export const metadata: Metadata = {
  title: 'Free BMI Calculator - No Ads, No Sign Up | AI AutoSite',
  description: 'Calculate BMI instantly with metric or imperial units. 100% free, no ads, no tracking, works offline.',
  keywords: 'free bmi calculator, no ads, body mass index, health calculator, privacy, no sign up',
  openGraph: {
    title: 'BMI Calculator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Calculate BMI instantly in your browser.',
    type: 'website',
    images: [{
      url: '/og-bmi-calculator.png',
      width: 1200,
      height: 630,
      alt: 'Free BMI Calculator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free BMI Calculator - No Tracking',
    description: 'Calculate BMI without ads or sign-ups.'
  }
}

export default function BmiCalculatorPage() {
  return <BmiCalculatorClient />
}