// app/tools/reverse-audio/blog-post.ts
import { RotateCcw } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const reverseAudioPost: BlogPost = {
  id: 'reverse-audio-guide',
  title: 'Reverse Audio Online - Play Audio Backwards for Sound Effects',
  description:
    'Reverse audio files online for creative sound effects. Perfect for music production and sound design.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: RotateCcw,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Reverse Audio',
    url: '/tools/reverse-audio',
  },
  
  tags: ['audio', 'reverse', 'sound-effects', 'music-production'],
  keywords: ['reverse audio', 'play backwards', 'audio reverser', 'sound effects'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Reverse Audio Online - Play Audio Backwards Free',
  seoDescription:
    'Reverse audio files online for free. Create unique sound effects. 100% browser-based.',
  ogImage: '/og/reverse-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/reverse-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Reverse Audio Online',
    description: 'Play audio backwards instantly. Free online tool.',
    image: '/og/reverse-audio-guide.png'
  }
}
