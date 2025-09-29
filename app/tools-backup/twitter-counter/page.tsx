import { Metadata } from 'next'
import TwitterCounterClient from './components/TwitterCounterClient'

export const metadata: Metadata = {
  title: 'Twitter Character Counter - Tweet Length Checker | AI AutoSite',
  description: 'Count characters for Twitter tweets. Check tweet length, auto-split threads, and optimize your Twitter posts.',
  keywords: 'twitter counter, tweet character counter, twitter character limit, tweet length, twitter thread',
  openGraph: {
    title: 'Twitter Character Counter - Free Tool',
    description: 'Count characters and optimize your tweets',
    type: 'website',
  },
}

export default function TwitterCounterPage() {
  return <TwitterCounterClient />
}