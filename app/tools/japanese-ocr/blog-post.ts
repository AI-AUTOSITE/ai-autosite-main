// app/tools/japanese-ocr/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const japaneseOcrPost: BlogPost = {
    id: 'japanese-ocr-guide',
    title: 'Extract Japanese Text from Images with AI OCR',
    description:
      'Learn how to use our free Japanese OCR tool to extract and translate text from images with 99% accuracy.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Japanese OCR',
      url: '/tools/japanese-ocr',
    },
    
    tags: ['ocr', 'japanese', 'text-extraction', 'ai', 'translation', 'image-to-text'],
    keywords: [
      'japanese ocr',
      'text extraction',
      'image to text',
      'japanese translation',
    ],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Japanese OCR Tool - Extract Text from Images with AI',
    seoDescription:
      'Extract Japanese text from images with 99% accuracy. Free AI-powered OCR tool with instant translation. Perfect for students and translators.',
    ogImage: '/og/japanese-ocr-guide.png',
    canonical: 'https://ai-autosite.com/blog/japanese-ocr-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Extract Japanese Text from Images',
      image: ['/og/japanese-ocr-guide.png'],
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
      title: 'Extract Japanese Text from Images with AI',
      description: '99% accuracy OCR with instant translation',
      image: '/og/japanese-ocr-guide.png'
    },
    
    openGraph: {
      title: 'Extract Japanese Text from Images with AI OCR',
      description: 'Free AI-powered OCR with instant translation',
      type: 'article',
      url: 'https://ai-autosite.com/blog/japanese-ocr-guide',
      images: [{
        url: 'https://ai-autosite.com/og/japanese-ocr-guide.png',
        width: 1200,
        height: 630,
        alt: 'Japanese OCR Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['ocr', 'japanese', 'ai', 'translation'],
        section: 'Study Tools'
      }
    }
  }