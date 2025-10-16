import { Metadata } from 'next'
import PDFTestGeneratorClient from './components/PDFTestGeneratorClient'

export const metadata: Metadata = {
  title: 'Free PDF Test Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate test PDFs instantly for validation. 100% free, no ads, no tracking, no email required. Works offline in your browser.',
  keywords: 'free pdf test generator, test pdf, pdf validation, no ads, no sign up, privacy, developer tools',
  
  openGraph: {
    title: 'PDF Test Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Generate test PDFs for validation and testing.',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Test Generator - Free Forever, No Ads',
    description: 'Generate test PDFs without ads or tracking'
  },
  
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/pdf-test-generator'
  }
}

export default function PDFTestGeneratorPage() {
  return <PDFTestGeneratorClient />
}