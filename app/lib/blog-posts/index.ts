// app/lib/blog-posts/index.ts
import { convertersPosts } from './converters'
import { editorsPosts } from './editors'
import { imageToolsPosts } from './image-tools'
import { generatorsPosts } from './generators'
import { analyzersPosts } from './analyzers'
import { aiToolsPosts } from './ai-tools'
import { devToolsPosts } from './dev-tools'
import { learningPosts } from './learning'
import type { BlogPost } from './types'

// Blog posts organized by new category structure
export const blogPostsByCategory = {
  converters: convertersPosts,
  editors: editorsPosts,
  'image-tools': imageToolsPosts,
  generators: generatorsPosts,
  analyzers: analyzersPosts,
  'ai-tools': aiToolsPosts,
  'dev-tools': devToolsPosts,
  learning: learningPosts,
  
  // Backward compatibility mappings (old → new)
  'quick-tools': [...convertersPosts, ...editorsPosts, ...imageToolsPosts, ...generatorsPosts, ...analyzersPosts],
  'business-tools': aiToolsPosts,
  'creative-tools': [...generatorsPosts, ...editorsPosts, ...imageToolsPosts],
  'study-tools': [...aiToolsPosts, ...learningPosts],
  'learning-hub': learningPosts,
} as const

// All blog posts combined
export const allBlogPosts: BlogPost[] = [
  ...convertersPosts,
  ...editorsPosts,
  ...imageToolsPosts,
  ...generatorsPosts,
  ...analyzersPosts,
  ...aiToolsPosts,
  ...devToolsPosts,
  ...learningPosts,
]

// Get post count for a category
export const getPostCount = (categoryId: string): number => {
  const posts = blogPostsByCategory[categoryId as keyof typeof blogPostsByCategory]
  if (!posts) return 0
  return posts.filter((p) => p.status === 'published').length
}

// Get posts by category
export const getPostsByCategory = (categoryId: string): BlogPost[] => {
  if (categoryId === 'all') {
    return allBlogPosts.filter((p) => p.status === 'published')
  }
  
  const posts = blogPostsByCategory[categoryId as keyof typeof blogPostsByCategory]
  if (!posts) return []
  
  return posts.filter((p) => p.status === 'published')
}

// Get featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  return allBlogPosts.filter((p) => p.featured && p.status === 'published')
}

// Get recent posts
export const getRecentPosts = (limit: number = 5): BlogPost[] => {
  return allBlogPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => {
      const dateA = new Date(a.lastUpdated || a.publishDate)
      const dateB = new Date(b.lastUpdated || b.publishDate)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

// Export individual category collections
export {
  convertersPosts,
  editorsPosts,
  imageToolsPosts,
  generatorsPosts,
  analyzersPosts,
  aiToolsPosts,
  devToolsPosts,
  learningPosts,
}