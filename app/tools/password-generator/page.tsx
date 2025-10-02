
import { Metadata } from 'next'
import PasswordGeneratorClient from './components/PasswordGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Password Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate secure passwords instantly. 100% free, no ads, works offline. Never stored anywhere.',
  keywords: 'free password generator, no ads, strong password, privacy, no tracking, secure',
  openGraph: {
    title: 'Password Generator - Truly Free & Secure',
    description: 'Zero ads, zero tracking, zero BS. Generate passwords that stay private.',
    type: 'website',
    images: [{
      url: '/og-password-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free Password Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator - 100% Private',
    description: 'Secure passwords. Zero storage.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/password-generator'
  }
}

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />
}