// app/tools/code-dependency-visualizer/blog-post.ts
import { Database } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const codeDependencyVisualizerPost: BlogPost = {
    id: 'code-dependency-analysis',
    title: 'Understanding Code Dependencies',
    description: 'Master project architecture by visualizing file relationships.',
    readTime: '12 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Database,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Code Dependency Visualizer',
      url: '/tools/code-reader',
    },
    
    tags: ['code-analysis', 'dependencies', 'architecture', 'visualization'],
    keywords: ['code dependencies', 'project architecture', 'dependency visualization'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Code Dependency Visualizer - Understand Project Architecture',
    seoDescription:
      'Visualize code dependencies and file relationships. Master project architecture with interactive dependency graphs. Free developer tool.',
    ogImage: '/og/code-dependency-guide.png',
    canonical: 'https://ai-autosite.com/blog/code-dependency-analysis',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
