import { Metadata } from 'next'
import BusinessToolsClient from './components/BusinessToolsClient'

export const metadata: Metadata = {
  title: 'Free Business Tools - Professional Suite | AI AutoSite',
  description: 'Professional productivity tools for business. Invoice generation, email templates, report automation, meeting summaries. No ads.',
  keywords: 'business tools, professional tools, productivity, free, no ads, invoice, automation',
  openGraph: {
    title: 'Business Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Professional business productivity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Business Tools - No Ads, No Sign Up',
    description: 'Professional productivity without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/business-tools'
  }
}

export default function BusinessToolsPage() {
  return <BusinessToolsClient />
}