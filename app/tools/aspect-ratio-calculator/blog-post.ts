// app/tools/aspect-ratio-calculator/blog-post.ts
import { Maximize } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aspectRatioCalculatorPost: BlogPost = {
  id: 'aspect-ratio-calculator-guide',
  title: 'Aspect Ratio Calculator: Perfect Dimensions',
  description: 'Calculate aspect ratios with SNS presets, visual preview, and dimension lock.',
  readTime: '4 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Maximize,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Aspect Ratio Calculator',
    url: '/tools/aspect-ratio-calculator',
  },
  
  tags: ['aspect-ratio', 'image', 'video', 'social-media', 'design'],
  keywords: ['aspect ratio calculator', 'image dimensions', 'video aspect ratio', 'instagram size'],
  category: 'converters',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Aspect Ratio Calculator - Social Media Dimensions',
  seoDescription: 'Calculate aspect ratios instantly. 18 SNS presets for YouTube, Instagram, TikTok. Visual preview, ratio lock feature.',
  ogImage: '/og/aspect-ratio-calculator-guide.png',
  canonical: 'https://ai-autosite.com/blog/aspect-ratio-calculator-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
}
