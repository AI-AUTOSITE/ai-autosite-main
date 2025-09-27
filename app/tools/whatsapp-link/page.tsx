import { Metadata } from 'next'
import WhatsappLinkClient from './components/WhatsappLinkClient'

export const metadata: Metadata = {
  title: 'WhatsApp Link Generator - Click to Chat | AI AutoSite',
  description: 'Create WhatsApp chat links without saving contacts. Generate QR codes for easy sharing. Free WhatsApp link maker.',
  keywords: 'whatsapp link generator, click to chat whatsapp, wa.me link, whatsapp qr code, whatsapp chat link',
  openGraph: {
    title: 'WhatsApp Link Generator - Free Tool',
    description: 'Create click-to-chat WhatsApp links instantly',
    type: 'website',
  },
}

export default function WhatsappLinkPage() {
  return <WhatsappLinkClient />
}