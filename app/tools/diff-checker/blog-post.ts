// app/tools/diff-checker/blog-post.ts
import { GitCompare } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const diffCheckerPost: BlogPost = {
  id: 'diff-checker-guide',
  title: 'Diff Checker: Compare Text Like Git',
  description: 'Compare text with side-by-side or unified view, ignore whitespace/case options.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: GitCompare,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Diff Checker',
    url: '/tools/diff-checker',
  },
  
  tags: ['diff', 'compare', 'text', 'git', 'developer'],
  keywords: ['diff checker', 'text compare', 'code diff', 'file comparison'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Diff Checker - Compare Text Side-by-Side',
  seoDescription: 'Compare text files with side-by-side and unified views. Ignore whitespace, export diffs. Privacy-first, browser-based.',
  ogImage: '/og/diff-checker-guide.png',
  canonical: 'https://ai-autosite.com/blog/diff-checker-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
