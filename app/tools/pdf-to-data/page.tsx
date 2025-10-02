import { Metadata } from 'next'
import PdfToDataTool from './components/PdfToDataTool'

export const metadata: Metadata = {
  title: 'Free PDF to Data Converter - No Ads, No Sign Up | AI AutoSite',
  description: 'Extract tables from PDFs to CSV/Excel instantly. 100% free, no ads, no tracking. AI-powered extraction.',
  keywords: 'free pdf to csv, pdf to excel, no ads, table extraction, privacy, no sign up',
  openGraph: {
    title: 'PDF to Data - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Extract PDF tables without the BS.',
    type: 'website',
    images: [{
      url: '/og-pdf-to-data.png',
      width: 1200,
      height: 630,
      alt: 'Free PDF to Data Converter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Data - 100% Free, AI-Powered',
    description: 'Extract tables without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/pdf-to-data'
  }
}

export default function PdfToDataPage() {
  return <PdfToDataTool />
}