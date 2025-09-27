// app/lib/blog-utils.ts
import { BlogPost } from './blog-posts/types'

// Badge types configuration
export const BADGE_TYPES = {
  featured: {
    label: 'Featured',
    icon: '⭐',
    className: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
    cardBorder: 'hover:border-amber-500/30',
    iconColor: 'text-amber-400',
    glowEffect: 'hover:shadow-amber-500/20'
  },
  new: {
    label: 'New',
    icon: '🆕',
    className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    cardBorder: 'hover:border-green-500/30',
    iconColor: 'text-green-400',
    glowEffect: 'hover:shadow-green-500/20'
  },
  popular: {
    label: 'Popular',
    icon: '🔥',
    className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    cardBorder: 'hover:border-orange-500/30',
    iconColor: 'text-orange-400',
    glowEffect: 'hover:shadow-orange-500/20'
  },
  updated: {
    label: 'Updated',
    icon: '🔄',
    className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    cardBorder: 'hover:border-blue-500/30',
    iconColor: 'text-blue-400',
    glowEffect: 'hover:shadow-blue-500/20'
  }
} as const

export type BadgeType = keyof typeof BADGE_TYPES

// Badge determination logic
export function getPostBadge(post: BlogPost): BadgeType | null {
  // Featured posts take priority
  if (post.featured) return 'featured'
  
  // Check if updated recently (example: within 7 days)
  if (post.lastUpdated) {
    const updatedDate = new Date(post.lastUpdated)
    const daysSinceUpdate = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceUpdate <= 7) return 'updated'
  }
  
  // New posts from current month
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  if (post.publishDate === currentMonth) return 'new'
  
  // Popular posts logic (this could be based on view count, etc.)
  const popularPosts = ['choosing-the-right-tech-stack', 'ai-dev-dictionary', 'competitive-analyzer-guide']
  if (popularPosts.includes(post.id)) return 'popular'
  
  return null
}

// Search functionality
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase()
  
  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.relatedTool?.name.toLowerCase().includes(lowerQuery) ||
      false
    )
  })
}

// Sort posts by different criteria
export function sortPosts(posts: BlogPost[], sortBy: 'date' | 'title' | 'readTime' = 'date'): BlogPost[] {
  const sorted = [...posts]
  
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => {
        // Assuming newer dates are "greater"
        const dateA = new Date(a.publishDate).getTime()
        const dateB = new Date(b.publishDate).getTime()
        return dateB - dateA
      })
    
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    
    case 'readTime':
      return sorted.sort((a, b) => {
        const timeA = parseInt(a.readTime) || 0
        const timeB = parseInt(b.readTime) || 0
        return timeA - timeB
      })
    
    default:
      return sorted
  }
}

// Group posts by status
export function groupPostsByStatus(posts: BlogPost[]) {
  return {
    published: posts.filter(p => p.status === 'published'),
    comingSoon: posts.filter(p => p.status === 'coming-soon'),
    draft: posts.filter(p => p.status === 'draft')
  }
}

// Get related posts
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[] {
  return allPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.status === 'published' &&
      // Same category or has same related tool
      (post.relatedTool?.name === currentPost.relatedTool?.name)
    )
    .slice(0, limit)
}

// Pagination helper
export interface PaginationData {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export function getPaginationData(
  totalItems: number, 
  currentPage: number = 1, 
  itemsPerPage: number = 6
): PaginationData {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  return {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

export function paginatePosts(
  posts: BlogPost[], 
  page: number = 1, 
  itemsPerPage: number = 6
): BlogPost[] {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  return posts.slice(start, end)
}