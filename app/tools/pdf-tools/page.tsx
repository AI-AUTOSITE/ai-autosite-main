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
  title: 'PDF Tools - Pick 3, Use Forever, Free | AI AutoSite',
  description: 'Free online PDF tools with no signup required. Rotate, merge, split, compress PDFs instantly in your browser. 100% private - no data uploaded.',
  keywords: 'pdf tools, free pdf editor, merge pdf, split pdf, rotate pdf, compress pdf, pdf converter, online pdf tools, privacy-focused pdf tools',
  manifest: '/manifest.json',
  themeColor: '#111827',
  openGraph: {
    title: 'PDF Tools - Pick 3, Use Forever, Free',
    description: 'Minimalist PDF tools that respect your privacy. Choose 3 essential tools and use them forever.',
    type: 'website',
    url: 'https://ai-autosite.com/tools/pdf-tools',
    images: [
      {
        url: 'https://ai-autosite.com/og-pdf-tools.png',
        width: 1200,
        height: 630,
        alt: 'PDF Tools - Free Online PDF Editor'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools - Pick 3, Use Forever, Free',
    description: 'Minimalist PDF tools that respect your privacy. No signup, no tracking, just tools.',
    images: ['https://ai-autosite.com/og-pdf-tools.png']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function PDFToolsPage() {
  return <PDFStudioClient />
}