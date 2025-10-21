// app/tools/gradient-generator/blog-post.ts
import { Palette } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const gradientGeneratorPost: BlogPost = {
    id: 'gradient-generator-guide',
    title: 'Gradient Generator CSS - Beautiful Colors',
    description:
      'Create stunning CSS gradients for web design. Free gradient generator with live preview.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Palette,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Gradient Generator',
      url: '/tools/gradient-generator',
    },
    
    tags: ['gradient', 'css', 'design', 'color', 'web-design'],
    keywords: ['css gradient', 'gradient generator', 'web design colors'],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'CSS Gradient Generator - Create Beautiful Gradients',
    seoDescription:
      'Generate beautiful CSS gradients for web design. Live preview, custom colors, and easy copy-paste code. Free gradient tool.',
    ogImage: '/og/gradient-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/gradient-generator-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',}
