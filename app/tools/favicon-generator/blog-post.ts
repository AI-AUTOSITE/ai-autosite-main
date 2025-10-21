// app/tools/favicon-generator/blog-post.ts
import { Globe } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const faviconGeneratorPost: BlogPost = {
    id: 'favicon-generator-guide',
    title: 'Favicon Generator - Create Website Icons',
    description:
      'Generate favicon.ico and app icons. Create all icon sizes from one image with our free tool.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Globe,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Favicon Generator',
      url: '/tools/favicon-generator',
    },
    
    tags: ['favicon', 'icon', 'website', 'web-design'],
    keywords: ['favicon generator', 'website icon', 'app icon'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Favicon Generator - Create Website & App Icons',
    seoDescription:
      'Generate favicon.ico and app icons from one image. Create all icon sizes for your website. Free online tool.',
    ogImage: '/og/favicon-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/favicon-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
