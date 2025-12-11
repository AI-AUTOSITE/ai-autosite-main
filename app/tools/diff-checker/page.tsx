import { Metadata } from 'next'
import DiffCheckerClient from './components/DiffCheckerClient'

export const metadata: Metadata = {
  title: 'Diff Checker - Compare Text Online Free | AI AutoSite',
  description:
    'Compare two texts and find differences instantly. Side-by-side and unified views, ignore whitespace/case options. 100% private, browser-based diff tool.',
  keywords: 'diff checker, text compare, compare files, text diff, code diff, online diff tool, find differences',
  openGraph: {
    title: 'Diff Checker - Free Online Text Comparison',
    description: 'Compare texts with side-by-side view and smart diff detection. No tracking.',
    type: 'website',
    images: [{ url: '/og-diff-checker.png', width: 1200, height: 630, alt: 'Diff Checker' }],
  },
  twitter: { card: 'summary_large_image', title: 'Diff Checker - Free & Private', description: 'Compare text with smart diff detection. Zero tracking.' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/diff-checker' },
}

export default function DiffCheckerPage() {
  return <DiffCheckerClient />
}
