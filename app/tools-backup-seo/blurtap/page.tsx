import { Metadata } from 'next'
import BlurTapClient from './components/BlurTapClient'

export const metadata: Metadata = {
  title: 'Free BlurTap Privacy Tool - No Ads, No Sign Up | AI AutoSite',
  description: 'Mask sensitive info in images instantly. 100% browser-based, no uploads, no ads, no tracking. True privacy.',
  keywords: 'free privacy mask, blur tool, no ads, image censoring, offline, no sign up',
  openGraph: {
    title: 'BlurTap - True Privacy, Zero Ads',
    description: 'Protect privacy without uploading anywhere. 100% offline, no BS.',
    type: 'website',
    images: [{
      url: '/og-blurtap.png',
      width: 1200,
      height: 630,
      alt: 'BlurTap Privacy Tool - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlurTap - Privacy Without Ads',
    description: 'Mask images offline. Zero uploads.'
  }
}

export default function BlurTapPage() {
  return <BlurTapClient />
}