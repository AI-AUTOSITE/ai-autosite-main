import { MessageSquare, Brain, FileText, Sparkles } from 'lucide-react'
import type { BlogPost } from './types'

export const studyToolsPosts: BlogPost[] = [
  {
    id: 'debate-trainer-guide',
    title: 'Master Debate Skills with AI: 3 Coaching Styles',
    description: 'Learn to improve argumentation skills with our AI Debate Trainer.',
    readTime: '4 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-26',
    icon: MessageSquare,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Debate Trainer',
      url: '/tools/debate-trainer'
    },
    // Additional metadata
    tags: ['debate', 'ai-training', 'argumentation', 'public-speaking', 'education'],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    // SEO
    seoTitle: 'AI Debate Trainer Guide - Master Argumentation Skills',
    seoDescription: 'Improve debate skills with AI coaching. Learn argumentation, critical thinking, and public speaking with 3 personalized coaching styles.',
    ogImage: '/og/debate-trainer-guide.png'
  },
  {
    id: 'ai-summarizer-guide',
    title: 'Master Text Summarization with AI - Complete Guide',
    description: 'Learn how to instantly transform long documents into concise summaries using AI technology.',
    readTime: '5 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-24',
    icon: Sparkles,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Text Summarizer',
      url: '/tools/ai-summarizer'
    },
    // Additional metadata
    tags: ['ai', 'productivity', 'study-tools', 'text-processing', 'summarization'],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    // SEO
    seoTitle: 'AI Text Summarizer Guide 2025 - Instant Document Summary',
    seoDescription: 'Transform long texts into concise summaries with AI. Perfect for students, researchers, and professionals. Free online tool.',
    ogImage: '/og/ai-summarizer-guide.png'
  },
  {
    id: 'pdf-summarizer-guide',
    title: 'PDF Summarizer: Quick Study Reviews',
    description: 'Extract key information from PDFs for efficient studying.',
    readTime: '6 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-26',
    icon: FileText,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'PDF Summarizer',
      url: '/tools/pdf-summarizer'
    },
    // Additional metadata
    tags: ['pdf', 'summarizer', 'study-tools', 'ai', 'document-processing'],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    // SEO
    seoTitle: 'PDF Summarizer - AI-Powered Document Summary Tool',
    seoDescription: 'Instantly summarize PDF documents for study and research. Extract key points from long PDFs with AI technology. Free online tool.',
    ogImage: '/og/pdf-summarizer-guide.png'
  },
  {
    id: 'japanese-ocr-guide',
    title: 'Extract Japanese Text from Images with AI OCR',
    description: 'Learn how to use our free Japanese OCR tool to extract and translate text from images with 99% accuracy.',
    readTime: '5 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-26',
    icon: FileText,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Japanese OCR',
      url: '/tools/japanese-ocr'
    },
    // Additional metadata
    tags: ['ocr', 'japanese', 'text-extraction', 'ai', 'translation', 'image-to-text'],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    // SEO
    seoTitle: 'Japanese OCR Tool - Extract Text from Images with AI',
    seoDescription: 'Extract Japanese text from images with 99% accuracy. Free AI-powered OCR tool with instant translation. Perfect for students and translators.',
    ogImage: '/og/japanese-ocr-guide.png'
  }
]