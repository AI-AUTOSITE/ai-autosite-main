
import { Metadata } from 'next'
import MarkdownHtmlClient from './components/MarkdownHtmlClient'

export const metadata: Metadata = {
  title: 'Free Markdown to HTML - No Ads, No Sign Up | AI AutoSite',
  description: 'Convert Markdown to HTML instantly. 100% free, no ads, live preview. Works offline.',
  keywords: 'free markdown converter, no ads, md to html, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Markdown to HTML - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Convert Markdown without uploading.',
    type: 'website',
    images: [{
      url: '/og-markdown-html.png',
      width: 1200,
      height: 630,
      alt: 'Free Markdown Converter - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown to HTML - 100% Private',
    description: 'Convert offline with live preview.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/markdown-html'
  }
}

export default function MarkdownHtmlPage() {
  return <MarkdownHtmlClient />
}