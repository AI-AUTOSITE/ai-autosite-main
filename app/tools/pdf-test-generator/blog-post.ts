// app/tools/pdf-test-generator/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const pdfTestGeneratorPost: BlogPost = {
    id: 'pdf-test-generator-guide',
    title: 'PDF Test Generator: Create Test Files Instantly',
    description: 'Generate test PDFs for validation and testing. Perfect for developers building PDF processing tools.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'PDF Test Generator',
      url: '/tools/pdf-test-generator'
    },
    
    tags: ['testing', 'pdf', 'validation', 'development'],
    keywords: ['pdf test generator', 'test pdf files', 'pdf validation'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'PDF Test Generator - Create Test PDFs Instantly',
    seoDescription:
      'Generate test PDF files for development. Perfect for testing PDF processing tools. Free online generator.',
    ogImage: '/og/pdf-test-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/pdf-test-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
