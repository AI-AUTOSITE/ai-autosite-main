// app/tools/speed-changer/blog-post.ts
import { Gauge } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const speedChangerPost: BlogPost = {
  id: 'speed-changer-guide',
  title: 'Audio Speed Changer - Speed Up or Slow Down Audio Files',
  description:
    'Change audio playback speed from 0.25x to 4x. Perfect for podcasts, language learning, and music practice.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Gauge,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Speed Changer',
    url: '/tools/speed-changer',
  },
  
  tags: ['audio', 'speed', 'tempo', 'playback', 'audio-editing'],
  keywords: ['speed changer', 'audio speed', 'tempo changer', 'playback speed'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Audio Speed Changer - Adjust Playback Speed Online',
  seoDescription:
    'Speed up or slow down audio files online. 0.25x to 4x speed range. 100% browser-based.',
  ogImage: '/og/speed-changer-guide.png',
  canonical: 'https://ai-autosite.com/blog/speed-changer-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Speed Changer',
    description: 'Change audio speed instantly. Free online tool.',
    image: '/og/speed-changer-guide.png'
  }
}
