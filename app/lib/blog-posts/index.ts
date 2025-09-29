// app/lib/blog-posts/index.ts
import { studyToolsPosts } from './study-tools'
import { devToolsPosts } from './dev-tools'
import { quickToolsPosts } from './quick-tools'
import { learningPosts } from './learning'
import { businessToolsPosts } from './business-tools'
import { creativeToolsPosts } from './creative-tools'  // 新規追加
import type { BlogPost } from './types'

// ツールのカテゴリーIDに合わせて修正
export const blogPostsByCategory = {
  'study-tools': studyToolsPosts,
  'dev-tools': devToolsPosts,
  'quick-tools': quickToolsPosts,
  'learning': learningPosts,        // 'learning-hub' → 'learning'
  'business': businessToolsPosts,   // 'business-tools' → 'business'
  'creative': creativeToolsPosts    // 新規追加
}

// 全ブログ記事を統合
export const allBlogPosts: BlogPost[] = [
  ...studyToolsPosts,
  ...devToolsPosts,
  ...quickToolsPosts,
  ...learningPosts,
  ...businessToolsPosts,
  ...creativeToolsPosts  // 新規追加
]

// カテゴリー別の記事数を取得
export const getPostCount = (categoryId: string): number => {
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published').length || 0
}

// カテゴリー別に記事を取得
export const getPostsByCategory = (categoryId: string): BlogPost[] => {
  if (categoryId === 'all') return allBlogPosts.filter(p => p.status === 'published')
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published') || []
}

// 注目記事を取得
export const getFeaturedPosts = (): BlogPost[] => {
  return allBlogPosts.filter(p => p.featured && p.status === 'published')
}