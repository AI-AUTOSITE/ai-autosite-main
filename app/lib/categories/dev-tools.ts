// app/lib/categories/dev-tools.ts
import type { Tool } from './types'

export const devTools: Tool[] = [
  {
    id: 'code-dependency-visualizer',
    name: 'Code Dependency Visualizer',
    description: 'Analyze project structure and visualize file dependencies.',
    category: 'dev-tools',
    icon: '📊',
    color: 'from-blue-500 to-indigo-600',
    status: 'live',
    url: '/tools/code-dependency-visualizer',
    tags: ['Code Analysis', 'Dependencies', 'Visualization', 'developer'],
    difficulty: 'Intermediate',
    timeToUse: '2 minutes',
    featured: true,
    pricing: 'free',
    dataProcessing: 'local',
    dependencies: ['d3', '@babel/parser'],
  },
  
  // 将来追加予定（コメントアウト）
  /*
  {
    id: 'regex-builder',
    name: 'Regex Builder & Tester',
    description: 'Build and test regular expressions with real-time matching.',
    category: 'dev-tools',
    icon: '🔤',
    color: 'from-red-500 to-orange-500',
    status: 'coming',
    badge: 'COMING SOON',
    url: '/tools/regex-builder',
    tags: ['Regex', 'Testing', 'Pattern'],
    difficulty: 'Intermediate',
    timeToUse: '1 minute',
    featured: false,
    pricing: 'free',
    dataProcessing: 'local',
  },
  {
    id: 'api-tester',
    name: 'API Request Builder',
    description: 'Test REST APIs with custom headers, body, and auth.',
    category: 'dev-tools',
    icon: '🔌',
    color: 'from-teal-500 to-cyan-500',
    status: 'coming',
    badge: 'COMING SOON',
    url: '/tools/api-tester',
    tags: ['API', 'Testing', 'HTTP'],
    difficulty: 'Intermediate',
    timeToUse: '30 seconds',
    featured: false,
    pricing: 'free',
    dataProcessing: 'server',
  },
  */
]