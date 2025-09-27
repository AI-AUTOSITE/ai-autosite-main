import { studyToolsPosts } from './study-tools'
import { devToolsPosts } from './dev-tools'
import { quickToolsPosts } from './quick-tools'
import { learningPosts } from './learning'
import { businessToolsPosts } from './business-tools'

import type { BlogPost } from './types'

// Category ID mapping
export const blogPostsByCategory = {
  'study-tools': studyToolsPosts,
  'dev-tools': devToolsPosts,
  'quick-tools': quickToolsPosts,
  'learning': learningPosts,
  'business-tools': businessToolsPosts  // Fixed: "Business" → "business-tools"
}

// All posts flat array (for compatibility)
export const allBlogPosts: BlogPost[] = [
  ...studyToolsPosts,
  ...devToolsPosts,
  ...quickToolsPosts,
  ...learningPosts,
  ...businessToolsPosts
]

// Get post count by category
export const getPostCount = (categoryId: string): number => {
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published').length || 0
}

// Get posts by category
export const getPostsByCategory = (categoryId: string): BlogPost[] => {
  if (categoryId === 'all') return allBlogPosts.filter(p => p.status === 'published')
  return blogPostsByCategory[categoryId]?.filter(p => p.status === 'published') || []
}

// Get featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  return allBlogPosts.filter(p => p.featured && p.status === 'published')
}