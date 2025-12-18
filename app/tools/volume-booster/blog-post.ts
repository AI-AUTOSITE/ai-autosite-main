// app/tools/volume-booster/blog-post.ts
import { Volume2 } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const volumeBoosterPost: BlogPost = {
  id: 'volume-booster-guide',
  title: 'Volume Booster - Make Your Audio Louder Without Distortion',
  description:
    'Increase audio volume up to +20dB with auto-normalize feature. Perfect for quiet recordings and podcasts.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Volume2,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Volume Booster',
    url: '/tools/volume-booster',
  },
  
  tags: ['audio', 'volume', 'amplify', 'normalize', 'boost'],
  keywords: ['volume booster', 'increase volume', 'audio amplifier', 'normalize audio'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Volume Booster - Increase Audio Volume Online Free',
  seoDescription:
    'Make your audio louder with our free volume booster. Auto-normalize feature prevents clipping. 100% browser-based.',
  ogImage: '/og/volume-booster-guide.png',
  canonical: 'https://ai-autosite.com/blog/volume-booster-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Volume Booster',
    description: 'Make audio louder instantly. Free online tool.',
    image: '/og/volume-booster-guide.png'
  }
}
