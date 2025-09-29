import { Metadata } from 'next'
import CodeRoasterClient from './components/CodeRoasterClient'

export const metadata: Metadata = {
  title: 'Code Roaster - AI Code Review Tool | AI AutoSite',
  description: 'Get instant, hilarious, and helpful AI-powered code reviews. Roast your code, fix bugs, and level up your programming skills with our free online tool.',
  keywords: 'code review, AI code analysis, programming feedback, code roaster, debug code, code improvement, free code review, online code checker',
  openGraph: {
    title: 'Code Roaster - AI-Powered Code Review Tool',
    description: 'Get instant, hilarious, and helpful AI-powered code reviews. Level up your coding skills!',
    type: 'website',
    images: [
      {
        url: '/og-code-roaster.png',
        width: 1200,
        height: 630,
        alt: 'Code Roaster - AI Code Review Tool',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Roaster - AI-Powered Code Review',
    description: 'Get instant, hilarious, and helpful AI-powered code reviews. Free online tool!',
    images: ['/og-code-roaster.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/code-roaster',
  },
}

export default function CodeRoasterPage() {
  return <CodeRoasterClient />
}