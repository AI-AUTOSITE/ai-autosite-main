// app/tools/test-file-generator/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const testFileGeneratorPost: BlogPost = {
    id: 'test-file-generator-guide',
    title: 'How to Use Test File Generator',
    description:
      'Complete guide to generating custom test files for development and testing. Learn how to create PDFs with exact size and content specifications.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Test File Generator',
      url: '/tools/test-file-generator',
    },
    
    tags: ['testing', 'development', 'pdf', 'files', 'upload'],
    keywords: ['test file generator', 'pdf testing', 'file upload test'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Test File Generator - Create Custom Test Files',
    seoDescription:
      'Generate test files with exact specifications. Perfect for development and testing. Create PDFs, images, and more.',
    ogImage: '/og/test-file-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/test-file-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
