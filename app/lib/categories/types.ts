// app/lib/categories/types.ts
import { LucideIcon } from 'lucide-react'

// ===================================
// Type Definitions - Simplified and Consistent
// ===================================

export interface Tool {
  // Core fields
  id: string
  name: string
  description: string // Max 60 chars, simple English
  category: string // Must match Category.id

  // Visual
  icon: string // Emoji
  emoji?: string // Optional additional emoji
  color: string // Tailwind gradient classes

  // Status - Simplified to 3 types
  status: 'live' | 'coming' | 'maintenance'

  // Navigation
  url: string

  // Metadata
  tags: string[]
  difficulty: 'Instant' | 'Simple' | 'Intermediate' | 'Advanced'
  timeToUse: string // Human readable: "30 seconds", "2 minutes"
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
  lastUpdated?: string // YYYY-MM format
  projectSource?: string // Source project name
}

export interface Category {
  // Core fields
  id: string
  title: string
  tagline: string // 3-4 words max

  // Visual
  icon: string // Emoji
  iconComponent?: LucideIcon
  emoji: string
  color: string // Gradient classes
  bgColor: string // Background gradient
  borderColor: string // Border color

  // Content
  description: string // Max 15 words, simple English
  benefits: string[] // 3-4 bullet points

  // Configuration
  enabled: boolean
  order: number
  badge?: 'NEW' | 'COMING SOON' | 'BETA' | 'HOT' | 'POPULAR'
  path?: string // URL path
  toolCount?: number // Calculated dynamically
}
