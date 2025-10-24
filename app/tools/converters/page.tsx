import { Metadata } from 'next'
import ConvertersClient from './components/ConvertersClient'

export const metadata: Metadata = {
  title: 'Free Converter Tools - Transform Data Instantly | AI AutoSite',
  description:
    'Convert between formats instantly. JSON, CSV, Markdown, Base64, text case, units, and more. No ads, no tracking, works offline.',
  keywords:
    'converter tools, data conversion, json to csv, markdown to html, base64, text converter, unit converter, free, no ads',
  openGraph: {
    title: 'Converter Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Transform data between formats instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Converter Tools - No Ads, No Sign Up',
    description: 'Convert data between formats without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/converters',
  },
}

export default function ConvertersPage() {
  return <ConvertersClient />
}