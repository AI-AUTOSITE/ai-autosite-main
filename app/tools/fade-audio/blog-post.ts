// app/tools/fade-audio/blog-post.ts
import { TrendingUp } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const fadeAudioPost: BlogPost = {
  id: 'fade-audio-guide',
  title: 'Fade Audio Online - Add Fade In and Fade Out Effects',
  description:
    'Add professional fade in and fade out effects to your audio. Create smooth transitions for music and podcasts.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: TrendingUp,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Fade Audio',
    url: '/tools/fade-audio',
  },
  
  tags: ['audio', 'fade', 'effects', 'transition', 'audio-editing'],
  keywords: ['fade audio', 'fade in', 'fade out', 'audio effects'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Fade Audio Online - Add Fade Effects Free',
  seoDescription:
    'Add fade in and fade out effects to audio files online. Professional transitions. 100% browser-based.',
  ogImage: '/og/fade-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/fade-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Fade Audio Online',
    description: 'Add fade effects instantly. Free online tool.',
    image: '/og/fade-audio-guide.png'
  }
}
