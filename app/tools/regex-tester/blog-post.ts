// app/tools/regex-tester/blog-post.ts
import { Code } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const regexTesterPost: BlogPost = {
  id: 'regex-tester-guide',
  title: 'Regex Tester: Master Regular Expressions',
  description: 'Learn regex patterns with real-time testing, multi-color highlighting, and code generation for 6 languages.',
  readTime: '8 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Code,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Regex Tester',
    url: '/tools/regex-tester',
  },
  
  tags: ['regex', 'regular-expression', 'pattern', 'developer', 'testing'],
  keywords: ['regex tester', 'regular expression tester', 'regex pattern', 'regex code generator'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Regex Tester - Test Regular Expressions with Code Generation',
  seoDescription: 'Test regex patterns with multi-color highlighting, ReDoS detection, and code generation for JavaScript, Python, PHP, Go, Java, and C#.',
  ogImage: '/og/regex-tester-guide.png',
  canonical: 'https://ai-autosite.com/blog/regex-tester-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
