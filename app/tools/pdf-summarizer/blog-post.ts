// app/tools/pdf-summarizer/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const pdfSummarizerPost: BlogPost = {
    id: 'pdf-summarizer-guide',
    title: 'PDF Summarizer: Quick Study Reviews',
    description: 'Extract key information from PDFs for efficient studying.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'PDF Summarizer',
      url: '/tools/pdf-summarizer',
    },
    
    tags: ['pdf', 'summarizer', 'study-tools', 'ai', 'document-processing'],
    keywords: ['pdf summarizer', 'study tool', 'document summary'],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'PDF Summarizer - AI-Powered Document Summary Tool',
    seoDescription:
      'Instantly summarize PDF documents for study and research. Extract key points from long PDFs with AI technology. Free online tool.',
    ogImage: '/og/pdf-summarizer-guide.png',
    canonical: 'https://ai-autosite.com/blog/pdf-summarizer-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
