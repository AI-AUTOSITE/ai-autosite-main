// lib/categories-config.ts
import {
  Zap,
  Code,
  BookOpen,
  Briefcase,
  Palette,
  GraduationCap,
  type LucideIcon
} from 'lucide-react'

// カテゴリーの型定義
export interface Category {
  id: string
  name: string
  emoji: string
  icon: LucideIcon
  color: string           // グラデーション用
  bgColor: string         // 単色背景用（後方互換性）
  bgGradient: string      // 背景グラデーション
  description: string
  enabled?: boolean
  order?: number
  badge?: string
  benefits?: string[]
}

// カテゴリー定義（一元管理）
export const CATEGORIES: Category[] = [
  {
    id: 'quick-tools',
    name: 'Quick Tools',
    emoji: '⚡',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-yellow-500',  // 後方互換性のため
    bgGradient: 'from-cyan-500/20 to-blue-500/20',
    description: 'Instant tools for everyday tasks',
    enabled: true,
    order: 1
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    emoji: '🔧',
    icon: Code,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-blue-500',  // 後方互換性のため
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    description: 'Tools for developers and coders',
    enabled: true,
    order: 2
  },
  {
    id: 'study-tools',
    name: 'Study Tools',
    emoji: '📚',
    icon: BookOpen,
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-purple-500',  // 後方互換性のため
    bgGradient: 'from-green-500/20 to-teal-500/20',
    description: 'AI-powered learning assistance',
    enabled: true,
    order: 3,
    badge: 'NEW'
  },
  {
    id: 'business-tools',
    name: 'Business Tools',
    emoji: '💼',
    icon: Briefcase,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-amber-500',  // 後方互換性のため
    bgGradient: 'from-blue-500/20 to-purple-600/20',
    description: 'Professional productivity tools',
    enabled: true,
    order: 4
  },
  {
    id: 'creative-tools',
    name: 'Creative Tools',
    emoji: '🎨',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500',  // 後方互換性のため
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: 'Design and creative tools',
    enabled: true,
    order: 5
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    emoji: '🎓',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-green-500',  // 後方互換性のため
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    description: 'Educational and learning resources',
    enabled: true,
    order: 6
  }
]

// 有効なカテゴリーのみを取得
export function getEnabledCategories(): Category[] {
  return CATEGORIES
    .filter(cat => cat.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

// カテゴリーIDから情報を取得
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id)
}

// カテゴリー名から情報を取得
export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find(cat => cat.name === name)
}

// デフォルトエクスポート
export default CATEGORIES