
import { Metadata } from 'next'
import QRCodeClient from './components/QRCodeClient'

export const metadata: Metadata = {
  title: 'QR Code Maker - Free Online QR Generator | AI AutoSite',
  description: 'Create QR codes instantly. Free QR code generator for URLs, text, WiFi. Download as PNG. No signup required.',
  keywords: 'qr code, qr generator, qr maker, free qr code, qr code online',
  openGraph: {
    title: 'QR Code Maker - Free Online Tool',
    description: 'Turn any text or URL into a QR code instantly',
    type: 'website',
  },
}

export default function QRCodePage() {
  return <QRCodeClient />
}
