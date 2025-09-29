
import { Metadata } from 'next'
import MarkdownHtmlClient from './components/MarkdownHtmlClient'

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter - Live Preview | AI AutoSite',
  description: 'Convert Markdown to HTML instantly. Live preview, GitHub flavored markdown support. Free online converter.',
  keywords: 'markdown to html, markdown converter, md to html, markdown parser, github markdown',
  openGraph: {
    title: 'Markdown to HTML - Free Converter',
    description: 'Convert Markdown to HTML with live preview',
    type: 'website',
  },
}

export default function MarkdownHtmlPage() {
  return <MarkdownHtmlClient />
}