// app/lib/unified-data.ts
import { mapToolStatus, mapPostStatus, mapCategoryId } from './core/status-map'

// ===================================
// Synchronous Imports - Load all data immediately
// ===================================

// Tool data synchronous import (new structure)
import { converters } from './categories/converters'
import { editors } from './categories/editors'
import { imageTools } from './categories/image-tools'
import { generators } from './categories/generators'
import { analyzers } from './categories/analyzers'
import { aiTools } from './categories/ai-tools'
import { devTools } from './categories/dev-tools'
import { learning } from './categories/learning'

// Blog post data synchronous import (new structure)
import { convertersPosts } from './blog-posts/converters'
import { editorsPosts } from './blog-posts/editors'
import { imageToolsPosts } from './blog-posts/image-tools'
import { generatorsPosts } from './blog-posts/generators'
import { analyzersPosts } from './blog-posts/analyzers'
import { aiToolsPosts } from './blog-posts/ai-tools'
import { devToolsPosts } from './blog-posts/dev-tools'
import { learningPosts } from './blog-posts/learning'

// ===================================
// Type Definitions
// ===================================

interface UnifiedTool {
  id: string
  name: string
  description: string
  url: string
  icon?: string
  emoji?: string
  category: string
  categoryId: string
  status: string
  originalStatus: string
  originalCategory: string
  isActive: boolean
  isComingSoon: boolean
  isMaintenance: boolean
  featured?: boolean
  new?: boolean
  tags?: string[]
}

interface UnifiedPost {
  id: string
  title: string
  description: string
  category?: string
  categoryId: string
  status: string
  originalStatus: string
  originalCategory?: string
  isActive: boolean
  isDraft: boolean
  isComingSoon: boolean
  featured?: boolean
  tags?: string[]
}

// ===================================
// Unified Format Conversion Functions
// ===================================

function unifyTool(tool: any): UnifiedTool | null {
  if (!tool) return null
  const mappedStatus = mapToolStatus(tool.status || 'coming')

  return {
    ...tool,
    // New unified fields
    status: mappedStatus,
    categoryId: mapCategoryId(tool.category || 'uncategorized'),
    // Keep original data for backward compatibility
    originalStatus: tool.status,
    originalCategory: tool.category,

    // Additional metadata (fix: compare with 'live')
    isActive: mappedStatus === 'live',
    isComingSoon: mappedStatus === 'coming',
    isMaintenance: mappedStatus === 'maintenance',
  }
}

function unifyPost(post: any): UnifiedPost | null {
  if (!post) return null
  const mappedStatus = mapPostStatus(post.status || 'draft')

  return {
    ...post,
    // New unified fields
    status: mappedStatus,
    categoryId: post.category ? mapCategoryId(post.category) : 'uncategorized',
    // Keep original data
    originalStatus: post.status,
    originalCategory: post.category,

    // Additional metadata (fix: compare with 'active')
    isActive: mappedStatus === 'active',
    isDraft: post.status === 'draft',
    isComingSoon: post.status === 'coming-soon',
  }
}

// ===================================
// Data Integration and Conversion (Execute immediately)
// ===================================

// Integrate and convert all tools (new structure)
const ALL_TOOLS: UnifiedTool[] = [
  ...(converters || []),
  ...(editors || []),
  ...(imageTools || []),
  ...(generators || []),
  ...(analyzers || []),
  ...(aiTools || []),
  ...(devTools || []),
  ...(learning || []),
]
  .map(unifyTool)
  .filter((tool): tool is UnifiedTool => tool !== null)

// Integrate and convert all blog posts (new structure)
const ALL_POSTS: UnifiedPost[] = [
  ...(convertersPosts || []),
  ...(editorsPosts || []),
  ...(imageToolsPosts || []),
  ...(generatorsPosts || []),
  ...(analyzersPosts || []),
  ...(aiToolsPosts || []),
  ...(devToolsPosts || []),
  ...(learningPosts || []),
]
  .map(unifyPost)
  .filter((post): post is UnifiedPost => post !== null)

// Log data load completion (development only)
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Unified Data System Loaded:', {
    tools: ALL_TOOLS.length,
    posts: ALL_POSTS.length,
    activeTools: ALL_TOOLS.filter((t) => t.isActive).length,
    activePosts: ALL_POSTS.filter((p) => p.isActive).length,
    categories: [...new Set(ALL_TOOLS.map((t) => t.categoryId))],
  })
}

// ===================================
// Export Functions (Synchronous)
// ===================================

/**
 * Get all tools in unified format
 */
export function getAllTools(): UnifiedTool[] {
  return ALL_TOOLS
}

/**
 * Get tools by category
 */
export function getToolsByCategory(categoryId: string): UnifiedTool[] {
  return ALL_TOOLS.filter(
    (tool) => tool.categoryId === categoryId || tool.originalCategory === categoryId
  )
}

/**
 * Get only active tools
 */
export function getActiveTools(): UnifiedTool[] {
  return ALL_TOOLS.filter((tool) => tool.isActive)
}

/**
 * Get all blog posts in unified format
 */
export function getAllPosts(): UnifiedPost[] {
  return ALL_POSTS
}

/**
 * Get blog posts by category
 */
export function getPostsByCategory(categoryId: string): UnifiedPost[] {
  return ALL_POSTS.filter(
    (post) => post.categoryId === categoryId || post.originalCategory === categoryId
  )
}

/**
 * Get only active blog posts
 */
export function getActivePosts(): UnifiedPost[] {
  return ALL_POSTS.filter((post) => post.isActive)
}

/**
 * Get featured tools
 */
export function getFeaturedTools(limit?: number): UnifiedTool[] {
  const tools = ALL_TOOLS.filter((tool) => tool.featured && tool.isActive)
  return limit ? tools.slice(0, limit) : tools
}

/**
 * Get featured blog posts
 */
export function getFeaturedPosts(limit?: number): UnifiedPost[] {
  const posts = ALL_POSTS.filter((post) => post.featured && post.isActive)
  return limit ? posts.slice(0, limit) : posts
}

/**
 * Get new tools
 */
export function getNewTools(limit?: number): UnifiedTool[] {
  const tools = ALL_TOOLS.filter((tool) => tool.new && tool.isActive)
  return limit ? tools.slice(0, limit) : tools
}

/**
 * Search tools
 */
export function searchTools(query: string): UnifiedTool[] {
  const lowerQuery = query.toLowerCase()
  return ALL_TOOLS.filter(
    (tool) =>
      tool.isActive &&
      (tool.name?.toLowerCase().includes(lowerQuery) ||
        tool.description?.toLowerCase().includes(lowerQuery) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
  )
}

/**
 * Search blog posts
 */
export function searchPosts(query: string): UnifiedPost[] {
  const lowerQuery = query.toLowerCase()
  return ALL_POSTS.filter(
    (post) =>
      post.isActive &&
      (post.title?.toLowerCase().includes(lowerQuery) ||
        post.description?.toLowerCase().includes(lowerQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
  )
}

/**
 * Statistics
 */
export function getStatistics() {
  return {
    tools: {
      total: ALL_TOOLS.length,
      active: ALL_TOOLS.filter((t) => t.isActive).length,
      coming: ALL_TOOLS.filter((t) => t.isComingSoon).length,
      maintenance: ALL_TOOLS.filter((t) => t.isMaintenance).length,
      featured: ALL_TOOLS.filter((t) => t.featured && t.isActive).length,
      new: ALL_TOOLS.filter((t) => t.new && t.isActive).length,
    },
    posts: {
      total: ALL_POSTS.length,
      active: ALL_POSTS.filter((p) => p.isActive).length,
      coming: ALL_POSTS.filter((p) => p.isComingSoon).length,
      draft: ALL_POSTS.filter((p) => p.isDraft).length,
      featured: ALL_POSTS.filter((p) => p.featured && p.isActive).length,
    },
    categories: {
      converters: getToolsByCategory('converters').filter((t) => t.isActive).length,
      editors: getToolsByCategory('editors').filter((t) => t.isActive).length,
      'image-tools': getToolsByCategory('image-tools').filter((t) => t.isActive).length,
      generators: getToolsByCategory('generators').filter((t) => t.isActive).length,
      analyzers: getToolsByCategory('analyzers').filter((t) => t.isActive).length,
      privacy: getToolsByCategory('privacy').filter((t) => t.isActive).length,
      'ai-tools': getToolsByCategory('ai-tools').filter((t) => t.isActive).length,
      'dev-tools': getToolsByCategory('dev-tools').filter((t) => t.isActive).length,
      learning: getToolsByCategory('learning').filter((t) => t.isActive).length,
    },
  }
}

/**
 * Async version of get function (kept for compatibility)
 */
export async function getUnifiedData() {
  return {
    tools: getAllTools(),
    posts: getAllPosts(),
    statistics: getStatistics(),
  }
}

// ===================================
// Global Exposure for Development Debugging
// ===================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).unifiedData = {
    // Functions
    getAllTools,
    getAllPosts,
    getStatistics,
    getActiveTools,
    getActivePosts,
    getToolsByCategory,
    getPostsByCategory,
    getFeaturedTools,
    getFeaturedPosts,
    getNewTools,
    searchTools,
    searchPosts,
    // Raw data (for debugging)
    _raw: {
      tools: ALL_TOOLS,
      posts: ALL_POSTS,
    },
  }
  console.log('✅ Unified Data System ready. Access via window.unifiedData')
  console.log('🔍 Debug: window.unifiedData.getActiveTools() to view all tools')
}

// Default Export
export default {
  getAllTools,
  getActiveTools,
  getToolsByCategory,
  getAllPosts,
  getActivePosts,
  getPostsByCategory,
  getFeaturedTools,
  getFeaturedPosts,
  getNewTools,
  searchTools,
  searchPosts,
  getStatistics,
  getUnifiedData,
}