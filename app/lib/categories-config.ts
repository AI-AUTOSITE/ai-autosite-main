// lib/categories-config.ts
import {
  Zap,
  Code,
  BookOpen,
  Briefcase,
  Palette,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

// カテゴリーの型定義
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
  path?: string // ⭐ この行を追加
}

// カテゴリー定義（一元管理）
export const CATEGORIES: Category[] = [
  {
    id: 'quick-tools',
    name: 'Quick Tools',
    emoji: '⚡',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-yellow-500',
    bgGradient: 'from-cyan-500/20 to-blue-500/20',
    description: 'Instant tools for everyday tasks',
    enabled: true,
    order: 1,
    path: '/tools?category=quick-tools', // ⭐ 各カテゴリーにpathを追加（オプション）
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    emoji: '🔧',
    icon: Code,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-blue-500',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    description: 'Tools for developers and coders',
    enabled: true,
    order: 2,
    path: '/tools?category=dev-tools', // ⭐ 追加（オプション）
  },
  {
    id: 'study-tools',
    name: 'Study Tools',
    emoji: '📚',
    icon: BookOpen,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-purple-500',
    bgGradient: 'from-green-500/20 to-teal-500/20',
    description: 'AI-powered learning assistance',
    enabled: true,
    order: 3,
    badge: 'NEW',
    path: '/tools?category=study-tools',
  },
  {
    id: 'business-tools',
    name: 'Business Tools',
    emoji: '💼',
    icon: Briefcase,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-amber-500',
    bgGradient: 'from-blue-500/20 to-purple-600/20',
    description: 'Professional productivity tools',
    enabled: true,
    order: 4,
    path: '/tools?category=business-tools',
  },
  {
    id: 'creative-tools',
    name: 'Creative Tools',
    emoji: '🎨',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: 'Design and creative tools',
    enabled: true,
    order: 5,
    path: '/tools?category=creative-tools',
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    emoji: '🎓',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-green-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    description: 'Educational and learning resources',
    enabled: true,
    order: 6,
    path: '/tools?category=learning-hub',
  },
]

// 以下は変更なし
export function getEnabledCategories(): Category[] {
  return CATEGORIES.filter((cat) => cat.enabled !== false).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id)
}

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.name === name)
}

export default CATEGORIES
