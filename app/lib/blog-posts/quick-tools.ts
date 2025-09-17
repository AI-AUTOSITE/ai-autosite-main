import { Grid3x3, HardDrive, FileText, Image, Sparkles } from 'lucide-react'
import type { BlogPost } from './types'

export const quickToolsPosts: BlogPost[] = [
  {
    id: 'pdf-tools-guide',
    title: 'The Minimalist Approach to PDF Tools',
    description: 'Why "Pick 3, Use Forever" is revolutionizing online PDF editing.',
    readTime: '5 min',
    publishDate: 'December 2024',
    icon: FileText,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'PDF Tools - Pick 3',
      url: '/tools/pdf-tools'
    }
  },
  {
    id: 'image-grid-merger-guide',
    title: 'How to Create Numbered Image Grids in Seconds',
    description: 'Learn to merge multiple images into professional grids.',
    readTime: '5 min',
    publishDate: 'January 2025',
    icon: Grid3x3,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Image Grid Merger',
      url: '/tools/image-grid-merger'
    }
  },
  {
    id: 'pc-optimizer-guide',
    title: 'Complete Guide to PC Optimization',
    description: 'Learn how to free up disk space and improve performance.',
    readTime: '15 min',
    publishDate: 'January 2025',
    icon: HardDrive,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'PC Optimizer Advisor',
      url: '/tools/pc-optimizer'
    }
  },
  {
    id: 'token-compressor-guide',
    title: 'AI Token Compressor: Save 70% on API Costs',
    description: 'Learn how to reduce AI token usage with intelligent compression.',
    readTime: '8 min',
    publishDate: 'January 2025',
    icon: Sparkles,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Token Compressor',
      url: '/tools/token-compressor'
    }
  }
]