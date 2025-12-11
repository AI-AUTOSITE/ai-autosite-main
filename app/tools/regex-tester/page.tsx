import { Metadata } from 'next'
import RegexTesterClient from './components/RegexTesterClient'

export const metadata: Metadata = {
  title: 'Free Regex Tester - Test Regular Expressions Online | AI AutoSite',
  description:
    'Test and debug regular expressions in real-time. Features ReDoS detection, code generation for 6 languages, pattern explanation, and cheat sheet. 100% private, runs in browser.',
  keywords: 'regex tester, regular expression, regex online, regex validator, regex generator, regex debugger, pattern matching, ReDoS detection',
  openGraph: {
    title: 'Regex Tester - Free Online Regular Expression Tester',
    description: 'Test regex patterns with real-time matching, ReDoS detection, and code generation. Zero tracking, 100% browser-based.',
    type: 'website',
    images: [
      {
        url: '/og-regex-tester.png',
        width: 1200,
        height: 630,
        alt: 'Free Regex Tester - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regex Tester - Free & Private',
    description: 'Test regular expressions with ReDoS detection and code generation. Zero tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/regex-tester',
  },
}

export default function RegexTesterPage() {
  return <RegexTesterClient />
}
