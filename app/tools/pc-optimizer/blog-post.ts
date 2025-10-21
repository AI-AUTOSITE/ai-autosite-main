// app/tools/pc-optimizer/blog-post.ts
import { HardDrive } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const pcOptimizerPost: BlogPost = {
    id: 'pc-optimizer-guide',
    title: 'Complete Guide to PC Optimization',
    description: 'Learn how to free up disk space and improve performance.',
    readTime: '15 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: HardDrive,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'PC Optimizer Advisor',
      url: '/tools/pc-optimizer',
    },
    
    tags: ['pc-optimization', 'performance', 'disk-cleanup', 'maintenance'],
    keywords: ['pc optimizer', 'disk cleanup', 'computer performance'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'PC Optimizer Guide - Free Up Space & Boost Performance',
    seoDescription:
      'Complete guide to PC optimization. Learn to free up disk space, improve performance, and maintain your computer. Expert tips included.',
    ogImage: '/og/pc-optimizer-guide.png',
    canonical: 'https://ai-autosite.com/blog/pc-optimizer-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
