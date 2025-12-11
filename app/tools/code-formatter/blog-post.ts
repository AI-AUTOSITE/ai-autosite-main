// app/tools/code-formatter/blog-post.ts
import { Braces } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const codeFormatterPost: BlogPost = {
  id: 'code-formatter-guide',
  title: 'Code Formatter: Beautify Any Code',
  description: 'Format JSON, HTML, CSS, SQL, and XML with customizable indent options.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Braces,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Code Formatter',
    url: '/tools/code-formatter',
  },
  
  tags: ['code-formatter', 'beautifier', 'json', 'html', 'css', 'sql'],
  keywords: ['code formatter', 'json beautifier', 'html formatter', 'code beautify'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Code Formatter - Beautify JSON, HTML, CSS, SQL',
  seoDescription: 'Format and beautify code online. Supports JSON, HTML, CSS, SQL, XML. Minify option included. 100% private.',
  ogImage: '/og/code-formatter-guide.png',
  canonical: 'https://ai-autosite.com/blog/code-formatter-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
