// app/lib/categories/types.ts
import { LucideIcon } from 'lucide-react'

// ===================================
// Category Type (imported from categories-config)
// ===================================
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
  tagFilter?: boolean
}

// ===================================
// Tool Type
// ===================================
export interface Tool {
  // Core fields
  id: string
  name: string
  description: string
  category: string

  // Visual
  icon: string
  emoji?: string
  color: string

  // Status
  status: 'live' | 'coming' | 'maintenance'

  // Navigation
  url: string

  // Metadata
  tags: string[]
  difficulty: 'Instant' | 'Simple' | 'Intermediate' | 'Advanced'
  timeToUse: string

  // Display flags
  featured?: boolean
  new?: boolean
  badge?: 'NEW' | 'HOT' | 'BETA' | 'AI' | 'COMING SOON' | 'MAINTENANCE'

  // Technical details
  apiRequired?: boolean
  pricing?: 'free' | 'freemium' | 'paid'
  dataProcessing?: 'local' | 'server' | 'hybrid'
  dependencies?: string[]
  configRequired?: boolean

  // Tracking
  lastUpdated?: string
  projectSource?: string
}