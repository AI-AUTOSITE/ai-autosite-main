import { Metadata } from 'next'
import CodeFormatterClient from './components/CodeFormatterClient'

export const metadata: Metadata = {
  title: 'Code Formatter - Beautify JSON, HTML, CSS, JS Online | AI AutoSite',
  description: 'Format and beautify code instantly. Supports JSON, HTML, CSS, JavaScript. Minify for production. 100% private, browser-based.',
  keywords: 'code formatter, json formatter, html beautifier, css formatter, javascript beautify, minify code',
  openGraph: { title: 'Code Formatter - Free Online Tool', description: 'Format and minify JSON, HTML, CSS, JavaScript code.' },
  twitter: { card: 'summary_large_image', title: 'Code Formatter' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/code-formatter' },
}

export default function CodeFormatterPage() {
  return <CodeFormatterClient />
}
