import { Metadata } from 'next'
import GeneratorsClient from './components/GeneratorsClient'

export const metadata: Metadata = {
  title: 'Free Generator Tools - Create Content Instantly | AI AutoSite',
  description:
    'Generate passwords, QR codes, test data, templates, and more. Secure, fast, works offline. No ads, no tracking.',
  keywords:
    'generator tools, password generator, qr code, test data, lorem ipsum, uuid, free, no ads, secure',
  openGraph: {
    title: 'Generator Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Generate secure content and resources instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Generator Tools - No Ads, No Sign Up',
    description: 'Generate content and resources without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/generators',
  },
}

export default function GeneratorsPage() {
  return <GeneratorsClient />
}