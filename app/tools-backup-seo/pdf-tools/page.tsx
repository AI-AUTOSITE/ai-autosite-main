import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// PDFStudioClientに変更
const PDFStudioClient = dynamic(() => import('./PDFStudioClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading PDF Tools...</div>
    </div>
  )
})

export const metadata: Metadata = {
  title: 'Free PDF Tools - No Ads, No Sign Up | AI AutoSite',
  description: 'Pick 3 PDF tools, use forever. 100% free, no ads, works offline. Rotate, merge, split, compress PDFs privately.',
  keywords: 'free pdf tools, pdf editor, no ads, merge pdf, split pdf, privacy, no tracking',
  openGraph: {
    title: 'PDF Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Pick 3 tools, use forever.',
    type: 'website',
    images: [{
      url: '/og-pdf-tools.png',
      width: 1200,
      height: 630,
      alt: 'Free PDF Tools - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools - Pick 3, Free Forever',
    description: 'Minimalist PDF tools. No ads, no uploads.'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function PDFToolsPage() {
  return <PDFStudioClient />
}