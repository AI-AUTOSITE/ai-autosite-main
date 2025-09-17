import { Brain, Code, Zap, BookOpen, MessageSquare, Briefcase, Palette, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface BlogCategory {
  id: string
  name: string
  shortName: string
  icon: LucideIcon
  color: string
  description: string
}

export const blogCategories: BlogCategory[] = [
  {
    id: 'study-tools',
    name: 'Study Tools',
    shortName: 'Study',
    icon: Brain,
    color: 'from-green-500 to-teal-500',
    description: 'AI-powered learning and debate tools'
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    shortName: 'Dev',
    icon: Code,
    color: 'from-purple-500 to-indigo-500',
    description: 'Code analysis and optimization guides'
  },
  {
    id: 'quick-tools',
    name: 'Quick Tools',
    shortName: 'Quick',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    description: 'Instant productivity boosters'
  },
  {
    id: 'learning',
    name: 'Learning Hub',
    shortName: 'Learn',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    description: 'Interactive tutorials and guides'
  }
]