// app/tools/cornell-note/blog-post.ts
import { BookOpen } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const cornellNotePost: BlogPost = {
    id: 'cornell-note-guide',
    title: 'Cornell Notes: The Science-Backed Method That Boosts Retention by 58%',
    description: 'Discover why Cornell Notes work better than regular note-taking. Proven by 70+ years of research at top universities.',
    readTime: '8 min',
    publishDate: '2025-10-20',
    lastUpdated: '2025-10-20',
    icon: BookOpen,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Cornell Note Generator',
      url: '/tools/cornell-note'
    },
    tags: ['cornell notes', 'study techniques', 'note-taking', 'learning science', 'memory retention'],
    keywords: ['cornell notes', 'note-taking method', 'study skills', 'academic success', 'handwriting vs typing'],
    category: 'study-tools',

    seoTitle: 'Cornell Notes Method: 58% Better Retention - Free Templates & Guide',
    seoDescription: 'Learn why Cornell Notes boost test scores by 9.5%. Get free printable templates and master the 4-step method used at top universities.',
    priority: 0.9,
    changeFreq: 'monthly',

    schema: {
      type: 'HowTo',
      headline: 'How to Use Cornell Notes for Better Grades',
      datePublished: '2025-10-20',
      dateModified: '2025-10-20',
      author: {
        type: 'Organization',
        name: 'AI AutoSite',
        url: 'https://ai-autosite.com'
      },
      articleSection: 'Study Skills',
      wordCount: 2800,
      inLanguage: 'en'
    },

    openGraph: {
      title: 'Cornell Notes: 58% Better Memory Retention - Science Explains Why',
      description: 'Free templates + research-backed guide. Learn the note-taking method that actually works.',
      type: 'article',
      images: [{
        url: '/og-cornell-note-guide.png',
        width: 1200,
        height: 630,
        alt: 'Cornell Notes Method Explained'
      }],
      article: {
        publishedTime: '2025-10-20',
        section: 'Education',
        tags: ['study skills', 'note-taking', 'learning techniques']
      }
    }
  }