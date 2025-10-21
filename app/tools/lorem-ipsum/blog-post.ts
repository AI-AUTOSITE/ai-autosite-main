// app/tools/lorem-ipsum/blog-post.ts
import { Type } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const loremIpsumPost: BlogPost = {
    id: 'lorem-ipsum-generator-guide',
    title: 'Lorem Ipsum Generator - Dummy Text Tool',
    description:
      'Generate Lorem Ipsum placeholder text. Essential tool for designers and developers.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Type,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Lorem Ipsum Generator',
      url: '/tools/lorem-ipsum',
    },
    
    tags: ['lorem', 'ipsum', 'text', 'placeholder'],
    keywords: ['lorem ipsum generator', 'dummy text', 'placeholder text'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Lorem Ipsum Generator - Free Placeholder Text',
    seoDescription:
      'Generate Lorem Ipsum placeholder text for design and development. Essential dummy text tool. Free online generator.',
    ogImage: '/og/lorem-ipsum-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/lorem-ipsum-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
