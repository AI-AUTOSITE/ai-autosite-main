import { Metadata } from 'next'
import DevToolsClient from './components/DevToolsClient'

export const metadata: Metadata = {
  title: 'Free Developer Tools - Code Analysis & Debug | AI AutoSite',
  description:
    'Professional developer tools for code analysis, dependency visualization, debugging. No ads, no tracking, works offline.',
  keywords:
    'developer tools, code analysis, dependency visualizer, debugging tools, programming, free, no ads',
  openGraph: {
    title: 'Developer Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Professional tools for developers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Tools - No Ads, No Sign Up',
    description: 'Code analysis and debugging without ads or tracking.',
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