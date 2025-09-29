// app/tools/text-case/page.tsx
import { Metadata } from 'next'
import TextCaseConverter from './components/TextCaseConverter'


export const metadata: Metadata = {
  title: 'Free Text Case Converter - No Ads, No Sign Up | AI AutoSite',
  description: 'Convert text cases instantly. 100% free, no ads, works offline. UPPERCASE, lowercase, camelCase, snake_case.',
  keywords: 'free text case converter, no ads, camelCase, snake_case, privacy, no tracking',
  openGraph: {
    title: 'Text Case Converter - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Convert text cases without the BS.',
    type: 'website',
    images: [{
      url: '/og-text-case.png',
      width: 1200,
      height: 630,
      alt: 'Free Text Case Converter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Case Converter - 100% Private',
    description: '10+ formats. Zero tracking.'
  }
}

export default function Page() {
  return <TextCaseConverter />
}