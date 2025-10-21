// app/tools/ai-resume/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aiResumePost: BlogPost = {
    id: 'ai-resume-guide',
    title: 'AI Resume & Cover Letter Generator - Professional Documents in Minutes',
    description:
      'Create tailored resumes and cover letters with AI. Stand out in job applications with professionally crafted documents.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'AI Resume & Cover Letter',
      url: '/tools/ai-resume',
    },
    
    tags: ['resume', 'cover-letter', 'ai', 'career', 'job-search', 'claude'],
    keywords: ['ai resume generator', 'cover letter maker', 'job application'],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Resume Generator - Create Professional Resumes & Cover Letters',
    seoDescription:
      'Generate professional resumes and cover letters with AI. Tailored for your job applications. Free AI-powered career tool.',
    ogImage: '/og/ai-resume-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-resume-guide',
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      title: 'AI Resume & Cover Letter Generator',
      description: 'Create professional documents in minutes',
      image: '/og/ai-resume-guide.png'
    }
  }
