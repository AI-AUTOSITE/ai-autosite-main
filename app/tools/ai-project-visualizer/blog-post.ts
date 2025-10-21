// app/tools/ai-project-visualizer/blog-post.ts
import { GitBranch } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aiProjectVisualizerPost: BlogPost = {
    id: 'ai-project-visualizer-guide',
    title: 'Transform Your Code into AI-Friendly Diagrams - Project Visualizer Guide',
    description:
      'Learn how to create Mermaid diagrams, tree structures, and shareable project visualizations that AI tools understand perfectly.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: GitBranch,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'AI Project Visualizer',
      url: '/tools/ai-project-visualizer',
    },
    
    tags: ['developer-tools', 'AI-collaboration', 'visualization', 'mermaid', 'documentation'],
    keywords: ['project visualizer', 'mermaid diagrams', 'code visualization', 'ai collaboration'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Project Visualizer - Create Code Diagrams & Documentation',
    seoDescription:
      'Transform code into AI-friendly diagrams. Create Mermaid charts, tree structures, and shareable visualizations. Perfect for AI collaboration.',
    ogImage: '/og/ai-project-visualizer-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-project-visualizer-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Visualize Code for AI Collaboration',
      image: ['/og/ai-project-visualizer-guide.png'],
      datePublished: '2025-10-19',
      dateModified: '2025-10-19',
      author: {
        type: 'Organization',
        name: 'AI AutoSite Team',
        url: 'https://ai-autosite.com'
      },
      publisher: {
        type: 'Organization',
        name: 'AI AutoSite',
        logo: {
          type: 'ImageObject',
          url: 'https://ai-autosite.com/logo.png'
        }
      },
      wordCount: 3000,
      inLanguage: 'en'
    },
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'AI Project Visualizer Guide',
      description: 'Create AI-friendly code diagrams',
      image: '/og/ai-project-visualizer-guide.png'
    },
    
    openGraph: {
      title: 'Transform Your Code into AI-Friendly Diagrams',
      description: 'Project visualization for AI collaboration',
      type: 'article',
      url: 'https://ai-autosite.com/blog/ai-project-visualizer-guide',
      images: [{
        url: 'https://ai-autosite.com/og/ai-project-visualizer-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Project Visualizer Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['visualization', 'ai-collaboration', 'mermaid'],
        section: 'Dev Tools'
      }
    }
  }
