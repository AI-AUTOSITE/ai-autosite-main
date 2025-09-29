import { Metadata } from 'next'
import WhatsappLinkClient from './components/WhatsappLinkClient'


export const metadata: Metadata = {
  title: 'Free WhatsApp Link Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Create click-to-chat links instantly. 100% free, no ads, works offline. Generate QR codes too.',
  keywords: 'free whatsapp link, click to chat, no ads, wa.me link, privacy, no sign up',
  openGraph: {
    title: 'WhatsApp Link Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Create WhatsApp links without the BS.',
    type: 'website',
    images: [{
      url: '/og-whatsapp-link.png',
      width: 1200,
      height: 630,
      alt: 'Free WhatsApp Link Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsApp Link - 100% Private',
    description: 'Generate links offline. No tracking.'
  }
}

export default function WhatsappLinkPage() {
  return <WhatsappLinkClient />
}