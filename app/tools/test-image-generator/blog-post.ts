// app/tools/test-image-generator/blog-post.ts
import { ImageIcon } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const testImageGeneratorPost: BlogPost = {
    id: 'test-image-generator-guide',
    title: 'Test Image Generator Guide',
    description:
      'Complete guide to generating test images with custom specifications for development and testing.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: ImageIcon,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Test Image Generator',
      url: '/tools/test-image-generator',
    },
    
    tags: ['testing', 'images', 'compression', 'development'],
    keywords: ['test image generator', 'image testing', 'development tools'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Test Image Generator - Custom Test Images for Development',
    seoDescription:
      'Generate test images with custom specifications. Perfect for development testing. Create images with exact dimensions.',
    ogImage: '/og/test-image-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/test-image-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
