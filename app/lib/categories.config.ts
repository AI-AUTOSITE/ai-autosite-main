// app/lib/categories.config.ts
import { Zap, Code, BookOpen, GraduationCap, Briefcase, Palette, Brain, Shield, LucideIcon } from 'lucide-react'

// ===================================
// Type Definitions - Extended for better integration
// ===================================

export interface Tool {
  id: string
  name: string
  description: string
  category: string // Category ID
  icon: string
  emoji?: string
  color: string // Tailwind gradient classes
  status: 'live' | 'coming' | 'beta' | 'development' | 'maintenance'
  url: string
  tags: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Instant' | 'Quick' | 'Simple'
  timeToUse: string
  users: string
  featured?: boolean
  new?: boolean // New flag
  apiRequired?: boolean // Uses AI API
  pricing?: 'free' | 'freemium' | 'paid'
  lastUpdated?: string
  // New fields for integration
  projectSource?: string // Which original project this came from
  dependencies?: string[] // Required npm packages
  configRequired?: boolean // Needs special configuration
  dataProcessing?: 'local' | 'server' | 'hybrid' // Where processing happens
}

export interface Category {
  id: string
  title: string
  tagline: string
  icon: string
  iconComponent?: LucideIcon
  emoji: string
  color: string // gradient classes
  bgColor: string // background gradient
  borderColor: string
  description: string
  benefits: string[]
  enabled: boolean
  order: number
  badge?: 'NEW' | 'COMING SOON' | 'BETA' | 'HOT' | 'POPULAR'
  path?: string // Category page path
  toolCount?: number // Dynamic tool count
}

// ===================================
// Categories Definition - Extended
// ===================================

export const CATEGORIES: Category[] = [
  {
    id: 'quick-tools',
    title: 'Quick Tools',
    tagline: 'One-click solutions',
    icon: '⚡',
    iconComponent: Zap,
    emoji: '⚡',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/20',
    description: 'Instant tools for everyday tasks. No setup, no account needed.',
    benefits: ['10-second solutions', 'Zero learning curve', 'Works offline'],
    enabled: true,
    order: 1,
    path: '/tools?category=quick-tools'
  },
  {
    id: 'dev-tools',
    title: 'Developer Tools',
    tagline: 'Debug & analyze code',
    icon: '🔧',
    iconComponent: Code,
    emoji: '💻',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Professional tools for debugging, analyzing, and optimizing code.',
    benefits: ['Deep code analysis', 'Dependency mapping', 'Tech stack insights'],
    enabled: true,
    order: 2,
    path: '/tools?category=dev-tools'
  },
  {
    id: 'learning',
    title: 'Learning Hub',
    tagline: 'Understand concepts',
    icon: '📚',
    iconComponent: BookOpen,
    emoji: '📚',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20',
    description: 'Learn and understand technical concepts with interactive examples.',
    benefits: ['Visual explanations', 'Interactive demos', 'Beginner-friendly'],
    enabled: true,
    order: 3,
    path: '/tools?category=learning'
  },
  {
    id: 'study-tools',
    title: 'Study Tools',
    tagline: 'AI-powered learning',
    icon: '🎓',
    iconComponent: GraduationCap,
    emoji: '🎓',
    color: 'from-green-500 to-teal-500',
    bgColor: 'from-green-500/10 to-teal-500/10',
    borderColor: 'border-green-500/20',
    description: 'Smart study assistance with AI. Summarize, analyze, and learn faster.',
    benefits: ['PDF summarization', 'Study guides', 'Note-taking AI', 'Flash card generator'],
    enabled: true, // Changed to true for study tools integration
    order: 4,
    badge: 'NEW',
    path: '/tools?category=study-tools'
  },
  {
    id: 'business',
    title: 'Business Tools',
    tagline: 'Professional suite',
    icon: '💼',
    iconComponent: Briefcase,
    emoji: '💼',
    color: 'from-gray-600 to-gray-800',
    bgColor: 'from-gray-600/10 to-gray-800/10',
    borderColor: 'border-gray-600/20',
    description: 'Professional tools for business productivity and automation.',
    benefits: ['Invoice generation', 'Email templates', 'Report automation', 'Meeting summaries'],
    enabled: true,
    order: 5,
    badge: 'NEW',
    path: '/tools?category=business'
  },
  {
    id: 'creative',
    title: 'Creative Tools',
    tagline: 'Design & create',
    icon: '🎨',
    iconComponent: Palette,
    emoji: '🎨',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/20',
    description: 'Creative tools for designers and content creators.',
    benefits: ['Color palettes', 'Logo generation', 'Image editing', 'Design templates'],
    enabled: false,
    order: 6,
    badge: 'BETA',
    path: '/tools?category=creative'
  },
  {
    id: 'ai-powered',
    title: 'AI Tools',
    tagline: 'Smart automation',
    icon: '🤖',
    iconComponent: Brain,
    emoji: '🤖',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'from-indigo-500/10 to-blue-600/10',
    borderColor: 'border-indigo-500/20',
    description: 'AI-powered tools for automation and smart processing.',
    benefits: ['AI generation', 'Smart analysis', 'Automated workflows', 'Intelligent suggestions'],
    enabled: false,
    order: 7,
    badge: 'NEW',
    path: '/tools?category=ai-powered'
  },
  
  {
    id: 'security',
    title: 'Security Tools',
    tagline: 'Privacy & protection',
    icon: '🔒',
    iconComponent: Shield,
    emoji: '🔒',
    color: 'from-red-500 to-orange-500',
    bgColor: 'from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-500/20',
    description: 'Tools for privacy, security, and data protection.',
    benefits: ['Data encryption', 'Privacy checks', 'Security audits', 'Password tools'],
    enabled: false,
    order: 8,
    badge: 'COMING SOON',
    path: '/tools?category=security'
  }
]

// ===================================
// Tools Definition - Extended for Integration
// ===================================

export const TOOLS: Tool[] = [
  // Quick Tools
  {
    id: 'pc-optimizer',
    name: 'PC Optimizer Advisor',
    description: 'Free up storage space! Analyze Program Files to identify removal candidates. 100% local processing for privacy.',
    category: 'quick-tools',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    status: 'live',
    url: '/tools/pc-optimizer',
    tags: ['Windows', 'Performance', 'Cleanup'],
    difficulty: 'Quick',
    timeToUse: '3 minutes',
    users: '2.1k',
    featured: true,
    new: true,
    pricing: 'free',
    dataProcessing: 'local'
  },
  {
    id: 'blurtap',
    name: 'BlurTap',
    description: 'Mask sensitive information in images with one click. Perfect for screenshots and documents.',
    category: 'quick-tools',
    icon: '🔐',
    color: 'from-cyan-500 to-purple-500',
    status: 'live',
    url: '/tools/blurtap',
    tags: ['Privacy', 'Images', 'Security'],
    difficulty: 'Instant',
    timeToUse: '10 seconds',
    users: '5.2k',
    featured: true,
    pricing: 'free',
    dataProcessing: 'local'
  },
  // app/lib/categories.config.ts に追加
{
  id: 'image-grid-merger',
  name: 'Image Grid Merger',
  description: 'Create numbered image grids instantly. Merge multiple images into organized layouts with automatic numbering.',
  category: 'quick-tools',
  icon: '🖼️',
  emoji: '📐',
  color: 'from-indigo-500 to-purple-500',
  status: 'live',
  url: '/tools/image-grid-merger',
  tags: ['image', 'grid', 'merger', 'collage', 'layout', 'privacy'],
  difficulty: 'Simple',
  timeToUse: '30 seconds',
  users: '0',
  featured: true,
  new: true,
  pricing: 'free',
  dataProcessing: 'local',
  lastUpdated: '2025-01'
},
  {
    id: 'pdf-tools',
    name: 'PDF Tools - Pick 3',
    description: 'Choose 3 essential PDF tools and use them forever. Rotate, merge, split, compress - all in your browser. 100% privacy.',
    category: 'quick-tools',
    icon: '📄',
    color: 'from-red-500 to-orange-500',
    status: 'live',
    url: '/tools/pdf-tools',
    tags: ['PDF', 'Documents', 'Privacy'],
    difficulty: 'Simple',
    timeToUse: '30 seconds',
    users: '3.8k',
    featured: true,
    new: true,
    pricing: 'freemium',
    dataProcessing: 'local',
    dependencies: ['pdf-lib', 'pdfjs-dist']
  },
  {
    id: 'json-format',
    name: 'JSON Beautify',
    description: 'Format, validate, and minify JSON data instantly. Perfect for API testing.',
    category: 'quick-tools',
    icon: '{ }',
    emoji: '🔧',
    color: 'from-green-500 to-emerald-500',
    status: 'live',
    url: '/tools/json-format',
    tags: ['Data', 'Format', 'Quick'],
    difficulty: 'Instant',
    timeToUse: '5 seconds',
    users: '1.5k',
    featured: false,
    pricing: 'free',
    dataProcessing: 'local'
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and more formats instantly.',
    category: 'quick-tools',
    icon: '📝',
    color: 'from-pink-500 to-rose-500',
    status: 'live',
    url: '/tools/text-case',
    tags: ['Text', 'Format', 'Convert'],
    difficulty: 'Instant',
    timeToUse: '3 seconds',
    users: '890',
    featured: false,
    pricing: 'free',
    dataProcessing: 'local'
  },

  // Developer Tools
  {
    id: 'code-reader',
    name: 'Code Dependency Visualizer',
    description: 'Analyze project structure and visualize file dependencies. Understand any codebase.',
    category: 'dev-tools',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-600',
    status: 'live',
    url: '/tools/code-reader',
    tags: ['Code Analysis', 'Dependencies', 'Visualization'],
    difficulty: 'Intermediate',
    timeToUse: '2 minutes',
    users: '4.3k',
    featured: true,
    pricing: 'free',
    dataProcessing: 'local',
    dependencies: ['d3', '@babel/parser']
  },
  {
    id: 'tech-stack-analyzer',
    name: 'Tech Stack Analyzer',
    description: 'Compare frameworks and get AI-powered recommendations for your project.',
    category: 'dev-tools',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    status: 'live',
    url: '/tools/tech-stack-analyzer',
    tags: ['Frameworks', 'Planning', 'AI Analysis'],
    difficulty: 'Advanced',
    timeToUse: '5 minutes',
    users: '2.7k',
    featured: true,
    apiRequired: true,
    pricing: 'freemium',
    dataProcessing: 'hybrid'
  },
  {
    id: 'stack-recommender',
    name: 'Stack Recommender',
    description: 'Get AI-powered tech stack recommendations based on your project requirements.',
    category: 'dev-tools',
    icon: '🤖',
    color: 'from-violet-500 to-purple-600',
    status: 'live',
    url: '/tools/stack-recommender',
    tags: ['AI', 'Planning', 'Recommendations'],
    difficulty: 'Intermediate',
    timeToUse: '3 minutes',
    users: '1.9k',
    featured: false,
    new: true,
    apiRequired: true,
    pricing: 'freemium',
    dataProcessing: 'server'
  },

  // Learning Hub
  {
    id: 'ai-dev-dictionary',
    name: 'AI Dev Dictionary',
    description: 'Comprehensive glossary with interactive examples and visual demonstrations.',
    category: 'learning',
    icon: '📖',
    color: 'from-amber-500 to-orange-600',
    status: 'live',
    url: '/tools/ai-dev-dictionary',
    tags: ['Learning', 'AI Terms', 'Reference'],
    difficulty: 'Beginner',
    timeToUse: '1 minute',
    users: '3.1k',
    featured: true,
    pricing: 'free',
    dataProcessing: 'local'
  },

  // Study Tools
  {
    id: 'pdf-summarizer',
    name: 'PDF Summarizer',
    description: 'AI-powered PDF summary generator for quick study reviews',
    category: 'study-tools',
    icon: '📄',
    color: 'from-green-500 to-teal-500',
    status: 'live',
    url: '/tools/pdf-summarizer',
    tags: ['pdf', 'summary', 'study', 'ai'],
    difficulty: 'Simple',
    timeToUse: '2 minutes',
    users: '1.2k',
    featured: true,
    new: true,
    pricing: 'freemium',
    apiRequired: true,
    dataProcessing: 'hybrid',
    dependencies: ['pdfjs-dist']
  },
  {
    id: 'flashcard-maker',
    name: 'Flashcard Maker',
    description: 'Create smart flashcards from any text or PDF',
    category: 'study-tools',
    icon: '🎴',
    color: 'from-teal-500 to-green-500',
    status: 'development',
    url: '/tools/flashcard-maker',
    tags: ['flashcards', 'study', 'memory', 'learning'],
    difficulty: 'Simple',
    timeToUse: '1 minute',
    users: '800',
    featured: false,
    new: true,
    pricing: 'free',
    dataProcessing: 'local'
  },
  
  {
    id: 'study-planner',
    name: 'Study Planner',
    description: 'Generate personalized study schedules based on your goals',
    category: 'study-tools',
    icon: '📅',
    color: 'from-emerald-500 to-teal-500',
    status: 'coming',
    url: '/tools/study-planner',
    tags: ['planning', 'schedule', 'productivity', 'study'],
    difficulty: 'Intermediate',
    timeToUse: '5 minutes',
    users: '0',
    featured: false,
    new: false,
    pricing: 'free',
    dataProcessing: 'local'
  },
  
  // Coming Soon Tools
  {
    id: 'regex-builder',
    name: 'Regex Builder & Tester',
    description: 'Build and test regular expressions with real-time matching and explanation.',
    category: 'dev-tools',
    icon: '🔤',
    color: 'from-red-500 to-orange-500',
    status: 'coming',
    url: '/tools/regex-builder',
    tags: ['Regex', 'Testing', 'Pattern'],
    difficulty: 'Intermediate',
    timeToUse: '1 minute',
    users: 'Coming',
    featured: false,
    pricing: 'free',
    dataProcessing: 'local'
  },
  {
    id: 'api-tester',
    name: 'API Request Builder',
    description: 'Test REST APIs with custom headers, body, and authentication. See formatted responses.',
    category: 'dev-tools',
    icon: '🔌',
    color: 'from-teal-500 to-cyan-500',
    status: 'coming',
    url: '/tools/api-tester',
    tags: ['API', 'Testing', 'HTTP'],
    difficulty: 'Intermediate',
    timeToUse: '30 seconds',
    users: 'Coming',
    featured: false,
    pricing: 'free',
    dataProcessing: 'server'
  },
// categories.config.ts の TOOLS配列に追加
{
  id: 'ai-resume',
  name: 'AI Resume & Cover Letter',
  description: 'Generate professional resumes and cover letters with Claude AI assistance.',
  category: 'business',
  icon: '📝',
  emoji: '💼',
  color: 'from-indigo-500 to-blue-600',
  status: 'live',
  url: '/tools/ai-resume',
  tags: ['Resume', 'Cover Letter', 'AI', 'Career', 'Claude'],
  difficulty: 'Simple',
  timeToUse: '2 minutes',
  users: '0',
  featured: true,
  new: true,
  pricing: 'freemium',
  apiRequired: true,
  dataProcessing: 'server',
  lastUpdated: '2025-01'
},
{
  id: 'pdf-to-data',
  name: 'PDF to CSV/Excel',
  description: 'Extract tables and structured data from PDFs. AI-powered conversion to CSV or Excel format.',
  category: 'quick-tools',
  icon: '📊',
  emoji: '📊',
  color: 'from-emerald-500 to-teal-500',
  status: 'live',
  url: '/tools/pdf-to-data',
  tags: ['PDF', 'CSV', 'Excel', 'Data', 'AI', 'Extraction'],
  difficulty: 'Simple',
  timeToUse: '1 minute',
  users: '1.8k',
  featured: true,
  new: true,
  pricing: 'freemium',
  apiRequired: true,
  dataProcessing: 'server',
  dependencies: ['openai', 'xlsx'],
  lastUpdated: '2025-01'
},
{
  id: 'debate-trainer',
  name: 'Debate Trainer',
  description: 'Practice argumentation skills with AI opponents. Get scored feedback on logic, persuasiveness, and structure.',
  category: 'study-tools',
  icon: '⚔️',
  emoji: '💬',
  color: 'from-purple-500 to-pink-500',
  status: 'live',
  url: '/tools/debate-trainer',
  tags: ['debate', 'argumentation', 'critical thinking', 'AI', 'practice'],
  difficulty: 'Intermediate',
  timeToUse: '15 minutes',
  users: '500',
  featured: true,
  new: true,
  pricing: 'freemium',
  apiRequired: true,
  dataProcessing: 'server',
  dependencies: ['openai'],
  lastUpdated: '2025-01'
},
{
  id: 'token-compressor',
  name: 'AI Token Compressor',
  description: 'Optimize and compress files for efficient AI sharing with token visualization. Reduce API costs by up to 70%.',
  category: 'study-tools', // または 'quick-tools' または 'ai-powered'（有効なカテゴリを選択）
  icon: '🗜️',
  emoji: '💰',
  color: 'from-cyan-500 to-blue-600',
  status: 'live',
  url: '/tools/token-compressor',
  tags: ['token', 'compression', 'AI', 'optimization', 'file-processing', 'ChatGPT', 'Claude', 'cost-reduction'],
  difficulty: 'Simple',
  timeToUse: '2 minutes',
  users: '2.5k',
  featured: true,
  new: true,
  pricing: 'free',
  apiRequired: false,
  dataProcessing: 'local',
  lastUpdated: '2025-01',
  
  // Optional: Extended metadata
  projectSource: 'ai-autosite-main',
  dependencies: ['tiktoken', 'jszip', 'file-saver'], // Optional dependencies
  configRequired: false,
},
{
  id: 'ai-summarizer',
  name: 'AI Text Summarizer',
  description: 'Transform lengthy content into concise summaries with AI. Choose summary length and tone.',
  category: 'study-tools',
  icon: '✨',
  emoji: '📝',
  color: 'from-purple-500 to-pink-500',
  status: 'live',
  url: '/tools/ai-summarizer',
  tags: ['AI', 'Summary', 'Text', 'Study', 'Productivity'],
  difficulty: 'Simple',
  timeToUse: '30 seconds',
  users: '2.5k',
  featured: true,
  new: true,
  pricing: 'freemium',
  apiRequired: true,
  dataProcessing: 'server',
  lastUpdated: '2025-01'
}
]
// Category related functions
export const getEnabledCategories = () => 
  CATEGORIES.filter(cat => cat.enabled).sort((a, b) => a.order - b.order)

export const getAllCategories = () => 
  CATEGORIES.sort((a, b) => a.order - b.order)

export const getCategoryById = (id: string) => 
  CATEGORIES.find(cat => cat.id === id)

export const getCategoryByPath = (path: string) => 
  CATEGORIES.find(cat => cat.path === path)

// Tool related functions
export const getToolsByCategory = (categoryId: string) => 
  TOOLS.filter(tool => tool.category === categoryId)

export const getLiveTools = () => 
  TOOLS.filter(tool => tool.status === 'live')

export const getLiveToolsByCategory = (categoryId: string) => 
  TOOLS.filter(tool => tool.category === categoryId && tool.status === 'live')

export const getFeaturedTools = () => 
  TOOLS.filter(tool => tool.featured && tool.status === 'live')

export const getNewTools = () => 
  TOOLS.filter(tool => tool.new && tool.status === 'live')

export const getComingSoonTools = () => 
  TOOLS.filter(tool => tool.status === 'coming')

export const getToolById = (id: string) => 
  TOOLS.find(tool => tool.id === id)

export const getToolByUrl = (url: string) => 
  TOOLS.find(tool => tool.url === url)

// Statistics related
export const getToolCountByCategory = (categoryId: string) => 
  TOOLS.filter(tool => tool.category === categoryId && tool.status === 'live').length

export const getTotalLiveToolsCount = () => 
  TOOLS.filter(tool => tool.status === 'live').length

export const getTotalComingSoonCount = () => 
  TOOLS.filter(tool => tool.status === 'coming').length

// Search functions
export const searchTools = (query: string, categoryId?: string) => {
  const lowerQuery = query.toLowerCase()
  return TOOLS.filter(tool => {
    const matchesCategory = !categoryId || categoryId === 'all' || tool.category === categoryId
    const matchesSearch = 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    return matchesCategory && matchesSearch && tool.status === 'live'
  })
}

// Get categories with tool count
export const getCategoriesWithToolCount = () => {
  return CATEGORIES.map(category => ({
    ...category,
    toolCount: getToolCountByCategory(category.id)
  }))
}

// Get top tools by user count
export const getTopToolsByUsers = (limit: number = 5) => {
  return TOOLS
    .filter(tool => tool.status === 'live' && tool.users !== 'Coming' && tool.users !== 'Soon')
    .sort((a, b) => {
      const aUsers = parseInt(a.users.replace(/[^0-9]/g, '')) || 0
      const bUsers = parseInt(b.users.replace(/[^0-9]/g, '')) || 0
      return bUsers - aUsers
    })
    .slice(0, limit)
}

// Get top tools by category
export const getTopToolsByCategory = (categoryId: string, limit: number = 3) => {
  return TOOLS
    .filter(tool => tool.category === categoryId && tool.status === 'live')
    .sort((a, b) => {
      const aUsers = parseInt(a.users.replace(/[^0-9]/g, '')) || 0
      const bUsers = parseInt(b.users.replace(/[^0-9]/g, '')) || 0
      return bUsers - aUsers
    })
    .slice(0, limit)
}

// ===================================
// New Helper Functions for Integration
// ===================================

// Get tools that require API
export const getApiRequiredTools = () => 
  TOOLS.filter(tool => tool.apiRequired && tool.status === 'live')

// Get tools by pricing model
export const getToolsByPricing = (pricing: 'free' | 'freemium' | 'paid') => 
  TOOLS.filter(tool => tool.pricing === pricing && tool.status === 'live')

// Get tools by data processing type
export const getToolsByProcessingType = (type: 'local' | 'server' | 'hybrid') => 
  TOOLS.filter(tool => tool.dataProcessing === type)

// Get tools with dependencies
export const getToolsWithDependencies = () => 
  TOOLS.filter(tool => tool.dependencies && tool.dependencies.length > 0)

// Add new tool dynamically
export const addTool = (tool: Tool) => {
  const existingIndex = TOOLS.findIndex(t => t.id === tool.id)
  if (existingIndex >= 0) {
    TOOLS[existingIndex] = tool
  } else {
    TOOLS.push(tool)
  }
}

// Batch add tools from external projects
export const importToolsFromProject = (tools: Tool[], projectName: string) => {
  tools.forEach(tool => {
    tool.projectSource = projectName
    addTool(tool)
  })
}

// Get tools by project source
export const getToolsByProject = (projectName: string) => 
  TOOLS.filter(tool => tool.projectSource === projectName)

// Validate tool configuration
export const validateTool = (tool: Partial<Tool>): string[] => {
  const errors: string[] = []
  
  if (!tool.id) errors.push('Tool ID is required')
  if (!tool.name) errors.push('Tool name is required')
  if (!tool.category) errors.push('Tool category is required')
  if (!tool.url) errors.push('Tool URL is required')
  if (!tool.status) errors.push('Tool status is required')
  
  if (tool.category && !CATEGORIES.find(c => c.id === tool.category)) {
    errors.push(`Invalid category: ${tool.category}`)
  }
  
  return errors
}