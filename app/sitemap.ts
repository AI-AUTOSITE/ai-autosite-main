// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ai-autosite.com'
  
  // Tool category pages (NEW!)
  const toolCategories = [
    'converters',
    'editors',
    'generators',
    'analyzers',
    'ai-tools',
    'dev-tools',
    'learning'
  ]
  
  const tools = [
    'age-calculator',
    'ai-dev-dictionary',
    'ai-project-visualizer',
    'ai-prompt-generator',
    'ai-resume',
    'ai-summarizer',
    'base64',
    'blurtap',
    'bmi-calculator',
    'code-dependency-visualizer',
    'code-roaster',
    'color-palette',
    'competitive-analyzer',
    'cornell-note',
    'countdown-timer',
    'debate-trainer',
    'favicon-generator',
    'gradient-generator',
    'haiku-generator',
    'hashtag-generator',
    'image-compress',
    'image-grid-maker',
    'image-splitter',
    'instagram-bio',
    'japanese-ocr',
    'json-csv',
    'json-format',
    'lorem-ipsum',
    'markdown-html',
    'network-checker',
    'password-generator',
    'pc-optimizer',
    'pdf-summarizer',
    'pdf-test-generator', 
    'pdf-to-data',
    'pdf-tools',
    'percentage-calculator',
    'pomodoro-timer',
    'qr-code',
    'spam-email-checker',
    'stack-recommender',
    'tech-stack-analyzer',
    'test-file-generator',
    'test-image-generator',
    'test-text-generator',
    'text-case',
    'text-counter',
    'token-compressor',
    'twitter-counter',
    'unit-converter',
    'uuid-generator',
    'whatsapp-link'
    ]

  const blogPosts = [
    'age-calculator-guide',
    'ai-dev-dictionary',
    'ai-project-visualizer-guide',
    'ai-prompt-generator-guide',
    'ai-resume-generator',
    'ai-stack-recommender-guide',
    'ai-summarizer-guide',
    'base64-guide',
    'bmi-calculator-guide',
    'choosing-the-right-tech-stack',
    'code-dependency-visualizer',
    'code-roaster-guide',
    'color-palette-guide',
    'competitive-analyzer-guide',
    'cornell-note-guide',
    'countdown-timer-guide',
    'debate-trainer-guide',
    'favicon-generator-guide',
    'gradient-generator-guide',
    'hashtag-generator-guide',
    'how-to-use-code-roaster',
    'image-compress-guide',
    'image-grid-maker-complete-guide',
    'image-splitter-paper-sizes',
    'instagram-bio-generator-guide',
    'japanese-ocr-guide',
    'json-beautify-guide',
    'json-csv-converter-guide',
    'lorem-ipsum-generator-guide',
    'markdown-guide',
    'network-checker-guide',
    'password-security-guide',
    'pc-optimizer-guide',
    'pdf-summarizer-guide',
    'pdf-test-generator-guide',
    'pdf-tools-guide',
    'percentage-calculator-guide',
    'privacy-in-development',
    'qr-code-guide',
    'spam-email-checker-guide',
    'test-file-generator-guide',
    'test-image-generator-guide',
    'test-text-generator-guide',
    'text-case-converter',
    'text-counter-guide',
    'token-compressor-guide',
    'twitter-counter-guide',
    'unit-converter-guide',
    'uuid-generator-guide',
    'whatsapp-link-generator-guide'
    ]

  const highPriorityTools = [
    'ai-dev-dictionary',
    'ai-project-visualizer',
    'ai-prompt-generator',
    'ai-resume',
    'ai-summarizer',
    'code-roaster',
    'competitive-analyzer',
    'cornell-note',
    'debate-trainer',
    'network-checker',
    'pdf-summarizer',
    'pdf-tools',
    'pomodoro-timer',
    'spam-email-checker',
    'stack-recommender',
    'tech-stack-analyzer'
  ]
  
  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    
    // Main pages
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    // Tool category pages (NEW!)
    ...toolCategories.map(category => ({
      url: `${baseUrl}/tools/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),

    // Individual tools
    ...tools.map(tool => ({
      url: `${baseUrl}/tools/${tool}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: highPriorityTools.includes(tool) ? 0.9 : 0.7,
    })),

    // Blog posts
    ...blogPosts.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  ]
}