// app/tools/loop-audio/blog-post.ts
import { Repeat } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const loopAudioPost: BlogPost = {
  id: 'loop-audio-guide',
  title: 'Loop Audio Online - Create Seamless Audio Loops',
  description:
    'Create seamless audio loops with crossfade transitions. Perfect for music production, background audio, and sound effects.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Repeat,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Loop Audio',
    url: '/tools/loop-audio',
  },
  
  tags: ['audio', 'loop', 'repeat', 'music-production', 'crossfade'],
  keywords: ['loop audio', 'audio loop', 'repeat audio', 'seamless loop'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Loop Audio Online - Create Seamless Loops Free',
  seoDescription:
    'Create seamless audio loops with crossfade online. Repeat audio 2-20 times. 100% browser-based.',
  ogImage: '/og/loop-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/loop-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Loop Audio Online',
    description: 'Create seamless audio loops. Free online tool.',
    image: '/og/loop-audio-guide.png'
  }
}
