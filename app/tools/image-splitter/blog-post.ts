// app/tools/image-splitter/blog-post.ts
import { Scissors } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const imageSplitterPost: BlogPost = {
    id: 'image-splitter-guide',
    title: 'Split Large Images for Perfect Printing',
    description: 'Transform any image into printable paper sizes for posters and banners.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Scissors,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Image Splitter',
      url: '/tools/image-splitter',
    },
    
    tags: ['image-splitter', 'printing', 'poster', 'banner'],
    keywords: ['image splitter', 'split images', 'poster printing'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Image Splitter for Printing - Create Posters & Banners',
    seoDescription:
      'Split large images into printable paper sizes. Create posters and banners from any image. Free online splitting tool.',
    ogImage: '/og/image-splitter-guide.png',
    canonical: 'https://ai-autosite.com/blog/image-splitter-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
