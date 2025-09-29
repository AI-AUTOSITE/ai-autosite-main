import { Metadata } from 'next'
import HashtagGeneratorClient from './components/HashtagGeneratorClient'

export const metadata: Metadata = {
  title: 'Hashtag Generator - Instagram, Twitter, TikTok | AI AutoSite',
  description: 'Generate perfect hashtags for social media. Get 30 relevant tags for Instagram, Twitter, or TikTok instantly.',
  keywords: 'hashtag generator, instagram hashtags, twitter tags, tiktok hashtags, social media tags',
  openGraph: {
    title: 'Hashtag Generator - Free Online Tool',
    description: 'Generate perfect hashtags for your social posts',
    type: 'website',
  },
}

export default function HashtagGeneratorPage() {
  return <HashtagGeneratorClient />
}