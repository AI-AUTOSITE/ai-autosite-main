import { BookOpen } from 'lucide-react'
import type { BlogPost } from './types'

export const learningPosts: BlogPost[] = [
  {
    id: 'ai-dev-dictionary',
    title: 'Introducing AI Dev Dictionary',
    description: 'Master AI and development terminology with our interactive dictionary.',
    readTime: '5 min',
    publishDate: 'December 2024',
    icon: BookOpen,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Dev Dictionary',
      url: '/tools/ai-dev-dictionary'
    }
  }
]