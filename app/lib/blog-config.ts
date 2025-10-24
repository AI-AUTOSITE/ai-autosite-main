import { 
  RefreshCw, 
  Scissors, 
  Sparkles, 
  BarChart3, 
  Bot, 
  Code, 
  GraduationCap 
} from 'lucide-react'
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
    id: 'converters',
    name: 'Converter Tools',
    shortName: 'Converters',
    icon: RefreshCw,
    color: 'from-blue-500 to-cyan-500',
    description: 'Transform data between formats instantly',
  },
  {
    id: 'editors',
    name: 'Editor Tools',
    shortName: 'Editors',
    icon: Scissors,
    color: 'from-purple-500 to-pink-500',
    description: 'Edit images and PDFs with privacy',
  },
  {
    id: 'generators',
    name: 'Generator Tools',
    shortName: 'Generators',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    description: 'Generate passwords, QR codes, and templates',
  },
  {
    id: 'analyzers',
    name: 'Analyzer Tools',
    shortName: 'Analyzers',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    description: 'Analyze data and optimize performance',
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    shortName: 'AI',
    icon: Bot,
    color: 'from-indigo-500 to-purple-500',
    description: 'AI-powered productivity and creativity',
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    shortName: 'Dev',
    icon: Code,
    color: 'from-cyan-500 to-blue-600',
    description: 'Code analysis and optimization guides',
  },
  {
    id: 'learning',
    name: 'Learning Hub',
    shortName: 'Learn',
    icon: GraduationCap,
    color: 'from-pink-500 to-red-500',
    description: 'Study techniques and productivity tools',
  },
]