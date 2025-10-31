// app/lib/categories-config.ts
import {
  RefreshCw,
  Edit,
  Sparkles,
  SearchCheck,
  Bot,
  Code,
  GraduationCap,
  Zap,
  Boxes,
  type LucideIcon,
} from 'lucide-react'

// ========================================
// Type Definition
// ========================================
export interface Category {
  id: string
  name: string
  emoji: string
  icon: LucideIcon
  color: string
  bgColor: string
  bgGradient: string
  description: string
  enabled?: boolean
  order?: number
  badge?: string
  benefits?: string[]
  path?: string
  tagFilter?: boolean // Show tag filter on category page
}

// ========================================
// Category Configuration (Centralized)
// ========================================
export const CATEGORIES: Category[] = [
  {
    id: 'converters',
    name: 'Converters',
    emoji: '🔄',
    icon: RefreshCw,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: 'Convert formats and calculate instantly',
    enabled: true,
    order: 1,
    path: '/tools?category=converters',
    tagFilter: false,
  },
  {
    id: 'editors',
    name: 'Editors',
    emoji: '✏️',
    icon: Edit,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    description: 'Edit images, videos, and documents',
    enabled: true,
    order: 2,
    badge: 'NEW',
    path: '/tools?category=editors',
    tagFilter: true, // Display tag filter
  },
  {
    id: 'generators',
    name: 'Generators',
    emoji: '✨',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    description: 'Generate content, codes, and templates',
    enabled: true,
    order: 3,
    path: '/tools?category=generators',
    tagFilter: false,
  },
  {
    id: 'analyzers',
    name: 'Analyzers',
    emoji: '🔍',
    icon: SearchCheck,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    description: 'Analyze, diagnose, and optimize',
    enabled: true,
    order: 4,
    badge: 'NEW',
    path: '/tools?category=analyzers',
    tagFilter: false,
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    emoji: '🤖',
    icon: Bot,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500',
    bgGradient: 'from-indigo-500/20 to-purple-600/20',
    description: 'AI-powered solutions for complex tasks',
    enabled: true,
    order: 5,
    badge: 'HOT',
    path: '/tools?category=ai-tools',
    tagFilter: false,
  },
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    emoji: '⚙️',
    icon: Code,
    color: 'from-slate-600 to-gray-700',
    bgColor: 'bg-slate-600',
    bgGradient: 'from-slate-600/20 to-gray-700/20',
    description: 'Developer utilities and code tools',
    enabled: true,
    order: 6,
    path: '/tools?category=dev-tools',
    tagFilter: false,
  },
  {
    id: 'learning',
    name: 'Learning',
    emoji: '📚',
    icon: GraduationCap,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500',
    bgGradient: 'from-rose-500/20 to-pink-500/20',
    description: 'Study tools and educational resources',
    enabled: true,
    order: 7,
    path: '/tools?category=learning',
    tagFilter: false,
  },
  // Future categories (disabled)
  {
    id: 'automation',
    name: 'Automation',
    emoji: '⚡',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    description: 'Workflow automation and integration',
    enabled: false,
    order: 8,
    badge: 'COMING SOON',
    path: '/tools?category=automation',
    tagFilter: false,
  },
  {
    id: 'chatbots',
    name: 'Chatbots',
    emoji: '💬',
    icon: Boxes,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500',
    bgGradient: 'from-cyan-500/20 to-blue-600/20',
    description: 'AI chatbots and conversational tools',
    enabled: false,
    order: 9,
    badge: 'COMING SOON',
    path: '/tools?category=chatbots',
    tagFilter: false,
  },
]

// ========================================
// Helper Functions
// ========================================

/**
 * Get all enabled categories sorted by order
 */
export function getEnabledCategories(): Category[] {
  return CATEGORIES.filter((cat) => cat.enabled !== false).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id)
}

/**
 * Get category by name
 */
export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.name === name)
}

// ========================================
// Default Export
// ========================================
export default CATEGORIES