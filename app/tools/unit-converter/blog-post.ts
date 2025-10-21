// app/tools/unit-converter/blog-post.ts
import { Ruler } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const unitConverterPost: BlogPost = {
    id: 'unit-converter-guide',
    title: 'Unit Conversion Made Simple',
    description:
      'Complete guide to converting between metric and imperial units. Perfect for cooking, travel, and everyday life.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Ruler,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Unit Converter',
      url: '/tools/unit-converter',
    },
    
    tags: ['unit-converter', 'metric', 'imperial', 'measurements'],
    keywords: ['unit converter', 'metric to imperial', 'measurement conversion'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Unit Converter - Metric to Imperial & More',
    seoDescription:
      'Convert between metric and imperial units. Perfect for cooking, travel, and everyday life. Free unit converter.',
    ogImage: '/og/unit-converter-guide.png',
    canonical: 'https://ai-autosite.com/blog/unit-converter-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
