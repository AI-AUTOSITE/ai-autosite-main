// app/lib/categories/learning-tools.ts
import type { Tool } from './types'

export const learningTools: Tool[] = [
  {
    id: 'ai-dev-dictionary',
    name: 'AI Dev Dictionary',
    description: 'Comprehensive glossary with interactive examples and demos.',
    category: 'learning',
    icon: '📖',
    color: 'from-amber-500 to-orange-600',
    status: 'live',
    url: '/tools/ai-dev-dictionary',
    tags: ['Learning', 'AI Terms', 'Reference'],
    difficulty: 'Simple',
    timeToUse: '1 minute',
    featured: true,
    pricing: 'free',
    dataProcessing: 'local',
  },
]
