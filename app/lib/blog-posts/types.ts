import type { LucideIcon } from 'lucide-react'

// Extended blog post type with additional metadata
export interface BlogPost {
  // Core fields
  id: string
  title: string
  description: string
  
  // Time-related
  readTime: string
  publishDate: string
  lastUpdated?: string  // New: for tracking updates
  
  // Visual
  icon: LucideIcon
  coverImage?: string   // New: optional cover image
  
  // Status & Display
  featured: boolean
  status: 'published' | 'coming-soon' | 'draft'
  
  // Related content
  relatedTool?: {
    name: string
    url: string
  }
  
  // New fields for better organization
  tags?: string[]       // New: for better categorization
  author?: string       // New: author attribution
  views?: number        // New: for tracking popularity
  category?: string     // New: explicit category reference
  
  // SEO & Social
  seoTitle?: string     // New: custom SEO title
  seoDescription?: string  // New: custom SEO description
  ogImage?: string      // New: Open Graph image
}

// Category type
export interface BlogCategory {
  id: string
  name: string
  shortName: string
  icon: LucideIcon
  color: string
  description: string
}

// Pagination type
export interface BlogPagination {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

// Filter options
export interface BlogFilters {
  category?: string
  status?: BlogPost['status']
  featured?: boolean
  searchQuery?: string
  tags?: string[]
  sortBy?: 'date' | 'title' | 'readTime' | 'views'
  sortOrder?: 'asc' | 'desc'
}

// Blog statistics
export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  featuredPosts: number
  categories: number
  totalReadTime: number
  mostPopularCategory: string
}

// Author information (for future use)
export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}