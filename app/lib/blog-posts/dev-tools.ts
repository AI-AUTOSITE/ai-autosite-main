import { Type, Braces, Code, Database, GitBranch, Terminal } from 'lucide-react'
import type { BlogPost } from './types'

export const devToolsPosts: BlogPost[] = [
  {
    id: 'text-case-converter',
    title: 'Master Text Case Conversion: 10 Essential Formats',
    description: 'Complete guide to text case conversion for developers.',
    readTime: '8 min',
    publishDate: 'January 2025',
    icon: Type,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'Text Case Converter',
      url: '/tools/text-case'
    }
  },
  {
    id: 'json-beautify-guide',
    title: 'JSON Beautify: Format & Debug Like a Pro',
    description: 'Learn how to format, validate, and debug JSON effectively.',
    readTime: '10 min',
    publishDate: 'January 2025',
    icon: Braces,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'JSON Beautify',
      url: '/tools/json-format'
    }
  },
  {
    id: 'code-dependency-analysis',
    title: 'Understanding Code Dependencies',
    description: 'Master project architecture by visualizing file relationships.',
    readTime: '12 min',
    publishDate: 'January 2025',
    icon: Database,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'Code Dependency Visualizer',
      url: '/tools/code-reader'
    }
  },
  {
    id: 'choosing-the-right-tech-stack',
    title: 'Choosing the Right Tech Stack in 2025',
    description: 'A complete guide to selecting frameworks and tools.',
    readTime: '12 min',
    publishDate: 'January 2025',
    icon: Code,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Tech Stack Analyzer',
      url: '/tools/tech-stack-analyzer'
    }
  }
]