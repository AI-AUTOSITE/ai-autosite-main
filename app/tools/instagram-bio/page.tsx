import { Metadata } from 'next'
import InstagramBioClient from './components/InstagramBioClient'

export const metadata: Metadata = {
  title: 'Free Instagram Bio Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Create perfect Instagram bios instantly. 100% free, no ads, no tracking. Professional or fun styles.',
  keywords: 'free bio generator, instagram bio, no ads, social media, privacy, no sign up',
  openGraph: {
    title: 'Instagram Bio Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Create perfect bios without the BS.',
    type: 'website',
    images: [{
      url: '/og-instagram-bio.png',
      width: 1200,
      height: 630,
      alt: 'Free Instagram Bio Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Bio - Free Forever, No Tracking',
    description: 'Perfect bios without ads or sign-ups.'
  }
}

export default function InstagramBioPage() {
  return <InstagramBioClient />
}