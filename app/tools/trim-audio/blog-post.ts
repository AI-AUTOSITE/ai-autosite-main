// app/tools/trim-audio/blog-post.ts
import { Scissors } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const trimAudioPost: BlogPost = {
  id: 'trim-audio-guide',
  title: 'Trim Audio Online - Cut and Edit Audio Files Easily',
  description:
    'Cut and trim audio files online. Remove unwanted parts and keep only what you need. Visual editor with preview.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Scissors,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Trim Audio',
    url: '/tools/trim-audio',
  },
  
  tags: ['audio', 'trim', 'cut', 'editor', 'audio-editing'],
  keywords: ['trim audio', 'cut audio', 'audio cutter', 'audio trimmer'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Trim Audio Online - Free Audio Cutting Tool',
  seoDescription:
    'Cut and trim audio files online for free. Visual editor with preview. 100% browser-based.',
  ogImage: '/og/trim-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/trim-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Trim Audio Online',
    description: 'Cut audio files instantly. Free online tool.',
    image: '/og/trim-audio-guide.png'
  }
}
