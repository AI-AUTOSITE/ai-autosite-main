import { MessageSquare, Brain, FileText, Sparkles } from 'lucide-react'
import type { BlogPost } from './types'

export const studyToolsPosts: BlogPost[] = [
  {
    id: 'debate-trainer-guide',
    title: 'Master Debate Skills with AI: 3 Coaching Styles',
    description: 'Learn to improve argumentation skills with our AI Debate Trainer.',
    readTime: '4 min',
    publishDate: 'January 2025',
    icon: MessageSquare,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Debate Trainer',
      url: '/tools/debate-trainer'
    }
  },
  {
    id: 'ai-summarizer',
    title: 'AI Text Summarizer: Transform Long Content Instantly',
    description: 'Learn how AI can help you extract key points from any text.',
    readTime: '5 min',
    publishDate: 'January 2025',
    icon: Sparkles,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'AI Summarizer',
      url: '/tools/ai-summarizer'
    }
  },
  {
    id: 'pdf-summarizer-guide',
    title: 'PDF Summarizer: Quick Study Reviews',
    description: 'Extract key information from PDFs for efficient studying.',
    readTime: '6 min',
    publishDate: 'January 2025',
    icon: FileText,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'PDF Summarizer',
      url: '/tools/pdf-summarizer'
    }
  },
    {
    id: 'japanese-ocr-guide',
    title: 'Extract Japanese Text from Images with AI OCR',
    description: 'Learn how to use our free Japanese OCR tool to extract and translate text from images with 99% accuracy using advanced AI technology.',
    readTime: '5 min',
    publishDate: 'January 2025',
    icon: FileText,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Japanese OCR',
      url: '/tools/japanese-ocr'
    }
  }
]