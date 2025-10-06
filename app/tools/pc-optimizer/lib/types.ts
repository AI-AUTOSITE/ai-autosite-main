// Type definitions for PC Optimizer

export interface RawFileData {
  Name: string
  DirectoryName: string
  Length: string
  LastAccessTime?: string
  LastWriteTime?: string
}

export interface AnalyzedSoftware {
  id: string
  name: string
  displayName: string
  path: string
  size: number
  sizeFormatted: string
  lastUsed: Date | null
  lastUsedFormatted: string
  category: SoftwareCategory
  priority: Priority
  isStartup: boolean
  cacheSize?: number
  cacheSizeFormatted?: string
  description?: string
  tips?: string[]
  relatedFiles?: RelatedFile[]
  dependencies?: string[]
}

export interface RelatedFile {
  path: string
  size: number
  type: 'cache' | 'config' | 'data' | 'temp'
}

export type SoftwareCategory =
  | 'browser'
  | 'gaming'
  | 'productivity'
  | 'development'
  | 'media'
  | 'communication'
  | 'security'
  | 'utility'
  | 'system'
  | 'unknown'

export type Priority =
  | 'critical' // System critical
  | 'high' // Frequently used
  | 'medium' // Occasionally used
  | 'low' // Rarely used
  | 'removable' // Safe to remove

export interface OptimizationTip {
  category: 'quick' | 'advanced' | 'hardware'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  cost: 'free' | 'low' | 'medium' | 'high'
}

export interface SystemInfo {
  totalSize: number
  analyzedCount: number
  categories: Map<SoftwareCategory, number>
  recommendations: string[]
}
