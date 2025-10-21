// app/tools/ai-summarizer/blog-post.ts
import { Sparkles } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aiSummarizerPost: BlogPost = {
    id: 'ai-summarizer-guide',
    title: 'Master Text Summarization with AI - Complete Guide',
    description:
      'Learn how to instantly transform long documents into concise summaries using AI technology.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Sparkles,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'AI Text Summarizer',
      url: '/tools/ai-summarizer',
    },
    
    tags: ['ai', 'productivity', 'study-tools', 'text-processing', 'summarization'],
    keywords: [
      'ai text summarizer',
      'document summary',
      'text compression',
      'study tools',
    ],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Text Summarizer Guide 2025 - Instant Document Summary',
    seoDescription:
      'Transform long texts into concise summaries with AI. Perfect for students, researchers, and professionals. Free online tool.',
    ogImage: '/og/ai-summarizer-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-summarizer-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Summarize Text with AI',
      image: ['/og/ai-summarizer-guide.png'],
      datePublished: '2025-10-19',
      dateModified: '2025-10-19',
      author: {
        type: 'Organization',
        name: 'AI AutoSite Team',
        url: 'https://ai-autosite.com'
      },
      publisher: {
        type: 'Organization',
        name: 'AI AutoSite',
        logo: {
          type: 'ImageObject',
          url: 'https://ai-autosite.com/logo.png'
        }
      },
      wordCount: 2500,
      inLanguage: 'en'
    },
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Master Text Summarization with AI',
      description: 'Transform long documents into concise summaries',
      image: '/og/ai-summarizer-guide.png'
    },
    
    openGraph: {
      title: 'Master Text Summarization with AI - Complete Guide',
      description: 'Instantly transform documents into summaries',
      type: 'article',
      url: 'https://ai-autosite.com/blog/ai-summarizer-guide',
      images: [{
        url: 'https://ai-autosite.com/og/ai-summarizer-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Text Summarizer Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['ai', 'summarization', 'productivity'],
        section: 'Study Tools'
      }
    }
  }
