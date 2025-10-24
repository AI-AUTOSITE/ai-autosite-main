// app/lib/unified-data.ts
import { mapToolStatus, mapPostStatus, mapCategoryId } from './core/status-map'

// ===================================
// 同期インポート - すべてのデータを即座に読み込み
// ===================================

// ツールデータの同期インポート（新構造）
import { converters } from './categories/converters'
import { editors } from './categories/editors'
import { generators } from './categories/generators'
import { analyzers } from './categories/analyzers'
import { aiTools } from './categories/ai-tools'
import { devTools } from './categories/dev-tools'
import { learning } from './categories/learning'

// ブログ記事データの同期インポート（新構造）
import { convertersPosts } from './blog-posts/converters'
import { editorsPosts } from './blog-posts/editors'
import { generatorsPosts } from './blog-posts/generators'
import { analyzersPosts } from './blog-posts/analyzers'
import { aiToolsPosts } from './blog-posts/ai-tools'
import { devToolsPosts } from './blog-posts/dev-tools'
import { learningPosts } from './blog-posts/learning'

// ===================================
// 型定義
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
// 統一フォーマット変換関数
// ===================================

function unifyTool(tool: any): UnifiedTool | null {
  if (!tool) return null
  const mappedStatus = mapToolStatus(tool.status || 'coming')
  
  return {
    ...tool,
    // 新しい統一フィールド
    status: mappedStatus,
    categoryId: mapCategoryId(tool.category || 'uncategorized'),
    // 元のデータも保持（後方互換性）
    originalStatus: tool.status,
    originalCategory: tool.category,

    // 追加のメタデータ（修正: 'live'と比較）
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
    // 新しい統一フィールド
    status: mappedStatus,
    categoryId: post.category ? mapCategoryId(post.category) : 'uncategorized',
    // 元のデータも保持
    originalStatus: post.status,
    originalCategory: post.category,

    // 追加のメタデータ（修正: 'active'と比較）
    isActive: mappedStatus === 'active',
    isDraft: post.status === 'draft',
    isComingSoon: post.status === 'coming-soon',
  }
}

// ===================================
// データの統合と変換（即座に実行）
// ===================================

// すべてのツールを統合して変換（新構造）
const ALL_TOOLS: UnifiedTool[] = [
  ...(converters || []),
  ...(editors || []),
  ...(generators || []),
  ...(analyzers || []),
  ...(aiTools || []),
  ...(devTools || []),
  ...(learning || []),
]
  .map(unifyTool)
  .filter((tool): tool is UnifiedTool => tool !== null)

// すべてのブログ記事を統合して変換（新構造）
const ALL_POSTS: UnifiedPost[] = [
  ...(convertersPosts || []),
  ...(editorsPosts || []),
  ...(generatorsPosts || []),
  ...(analyzersPosts || []),
  ...(aiToolsPosts || []),
  ...(devToolsPosts || []),
  ...(learningPosts || []),
]
  .map(unifyPost)
  .filter((post): post is UnifiedPost => post !== null)

// データロード完了をログ出力
console.log('📊 Unified Data System Loaded:', {
  tools: ALL_TOOLS.length,
  posts: ALL_POSTS.length,
  activeTools: ALL_TOOLS.filter((t) => t.isActive).length,
  activePosts: ALL_POSTS.filter((p) => p.isActive).length,
  categories: [...new Set(ALL_TOOLS.map((t) => t.categoryId))],
})

// ===================================
// エクスポート関数（同期版）
// ===================================

/**
 * 全ツールを統一フォーマットで取得
 */
export function getAllTools(): UnifiedTool[] {
  return ALL_TOOLS
}

/**
 * カテゴリー別にツールを取得
 */
export function getToolsByCategory(categoryId: string): UnifiedTool[] {
  return ALL_TOOLS.filter(
    (tool) => tool.categoryId === categoryId || tool.originalCategory === categoryId
  )
}

/**
 * アクティブなツールのみ取得
 */
export function getActiveTools(): UnifiedTool[] {
  return ALL_TOOLS.filter((tool) => tool.isActive)
}

/**
 * 全ブログ記事を統一フォーマットで取得
 */
export function getAllPosts(): UnifiedPost[] {
  return ALL_POSTS
}

/**
 * カテゴリー別にブログ記事を取得
 */
export function getPostsByCategory(categoryId: string): UnifiedPost[] {
  return ALL_POSTS.filter(
    (post) => post.categoryId === categoryId || post.originalCategory === categoryId
  )
}

/**
 * アクティブなブログ記事のみ取得
 */
export function getActivePosts(): UnifiedPost[] {
  return ALL_POSTS.filter((post) => post.isActive)
}

/**
 * 注目のツールを取得
 */
export function getFeaturedTools(limit?: number): UnifiedTool[] {
  const tools = ALL_TOOLS.filter((tool) => tool.featured && tool.isActive)
  return limit ? tools.slice(0, limit) : tools
}

/**
 * 注目のブログ記事を取得
 */
export function getFeaturedPosts(limit?: number): UnifiedPost[] {
  const posts = ALL_POSTS.filter((post) => post.featured && post.isActive)
  return limit ? posts.slice(0, limit) : posts
}

/**
 * 新着ツールを取得
 */
export function getNewTools(limit?: number): UnifiedTool[] {
  const tools = ALL_TOOLS.filter((tool) => tool.new && tool.isActive)
  return limit ? tools.slice(0, limit) : tools
}

/**
 * ツール検索
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
 * ブログ記事検索
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
 * 統計情報
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
      generators: getToolsByCategory('generators').filter((t) => t.isActive).length,
      analyzers: getToolsByCategory('analyzers').filter((t) => t.isActive).length,
      'ai-tools': getToolsByCategory('ai-tools').filter((t) => t.isActive).length,
      'dev-tools': getToolsByCategory('dev-tools').filter((t) => t.isActive).length,
      learning: getToolsByCategory('learning').filter((t) => t.isActive).length,
    },
  }
}

/**
 * 非同期版の取得関数（互換性のため残す）
 */
export async function getUnifiedData() {
  return {
    tools: getAllTools(),
    posts: getAllPosts(),
    statistics: getStatistics(),
  }
}

// ===================================
// 開発環境でのデバッグ用グローバル公開
// ===================================

if (typeof window !== 'undefined') {
  ;(window as any).unifiedData = {
    // 関数
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
    // 生データ（デバッグ用）
    _raw: {
      tools: ALL_TOOLS,
      posts: ALL_POSTS,
    },
  }
  console.log('✅ Unified Data System ready. Access via window.unifiedData')
  console.log('🔍 Debug: window.unifiedData.getActiveTools() で全ツールを確認')
}

// デフォルトエクスポート
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