// app/tools/merge-audio/blog-post.ts
import { Link2 } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const mergeAudioPost: BlogPost = {
  id: 'merge-audio-guide',
  title: 'Merge Audio Online - Combine Multiple Audio Files',
  description:
    'Combine multiple audio files into one. Join MP3, WAV files with crossfade transitions. Easy reordering.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Link2,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Merge Audio',
    url: '/tools/merge-audio',
  },
  
  tags: ['audio', 'merge', 'combine', 'join', 'concatenate'],
  keywords: ['merge audio', 'combine audio', 'join audio', 'audio merger'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Merge Audio Online - Combine Audio Files Free',
  seoDescription:
    'Combine multiple audio files into one online. Crossfade transitions available. 100% browser-based.',
  ogImage: '/og/merge-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/merge-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Merge Audio Online',
    description: 'Combine audio files instantly. Free online tool.',
    image: '/og/merge-audio-guide.png'
  }
}
