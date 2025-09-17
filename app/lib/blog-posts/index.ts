import { studyToolsPosts } from './study-tools'
import { devToolsPosts } from './dev-tools'
import { quickToolsPosts } from './quick-tools'
import { learningPosts } from './learning'
import type { BlogPost } from './types'

// カテゴリ別エクスポート
export const blogPostsByCategory = {
  'study-tools': studyToolsPosts,
  'dev-tools': devToolsPosts,
  'quick-tools': quickToolsPosts,
  'learning': learningPosts
}

// 全記事のフラット配列（互換性のため）
export const allBlogPosts: BlogPost[] = [
  ...studyToolsPosts,
  ...devToolsPosts,
  ...quickToolsPosts,
  ...learningPosts
]

// カテゴリ別の記事数を取得
export const getPostCount = (categoryId: string): number => {
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published').length || 0
}

// 記事を取得
export const getPostsByCategory = (categoryId: string): BlogPost[] => {
  if (categoryId === 'all') return allBlogPosts.filter(p => p.status === 'published')
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published') || []
}

// Featured記事を取得
export const getFeaturedPosts = (): BlogPost[] => {
  return allBlogPosts.filter(p => p.featured && p.status === 'published')
}