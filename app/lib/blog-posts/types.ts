import type { LucideIcon } from 'lucide-react'

export interface BlogPost {
  id: string
  title: string
  description: string
  readTime: string
  publishDate: string
  icon: LucideIcon
  featured: boolean
  status: 'published' | 'coming-soon' | 'draft'
  relatedTool?: {
    name: string
    url: string
  }
}