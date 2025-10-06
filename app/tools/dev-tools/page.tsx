import { Metadata } from 'next'
import DevToolsClient from './components/DevToolsClient'

export const metadata: Metadata = {
  title: 'Free Developer Tools - Debug & Optimize | AI AutoSite',
  description:
    'Professional developer tools for debugging, testing, and optimizing code. JSON formatter, regex tester, API testing tools. No ads.',
  keywords:
    'developer tools, debugging tools, json formatter, regex tester, api tools, free, no ads',
  openGraph: {
    title: 'Developer Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Professional tools for developers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Tools - No Ads, No Sign Up',
    description: 'Debug and optimize your code without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/dev-tools',
  },
}

export default function DevToolsPage() {
  return <DevToolsClient />
}
