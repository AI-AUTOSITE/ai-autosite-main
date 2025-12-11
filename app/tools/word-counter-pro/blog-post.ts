// app/tools/word-counter-pro/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const wordCounterProPost: BlogPost = {
  id: 'word-counter-pro-guide',
  title: 'Word Counter Pro: Advanced Text Analysis',
  description: 'Count words, characters with social media limits, readability scores, and keyword density.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: FileText,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Word Counter Pro',
    url: '/tools/word-counter-pro',
  },
  
  tags: ['word-counter', 'character-counter', 'readability', 'social-media', 'seo'],
  keywords: ['word counter', 'character counter', 'twitter character limit', 'readability score'],
  category: 'converters',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Word Counter Pro - Social Media Limits & Readability',
  seoDescription: 'Count words and characters with platform limits for Twitter, Instagram, LinkedIn. Readability scores and keyword density.',
  ogImage: '/og/word-counter-pro-guide.png',
  canonical: 'https://ai-autosite.com/blog/word-counter-pro-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
}
