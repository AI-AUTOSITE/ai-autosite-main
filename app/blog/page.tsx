// app/blog/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Zap, 
  Database, 
  ExternalLink,
  Type,
  Braces,
  HardDrive 

} from 'lucide-react';
export const metadata: Metadata = {
  title: 'Developer Tools Blog | AI-Powered Development Guides & Tech Stack Analysis',
  description: 'Expert guides on modern web development, tech stack decisions, and AI-powered developer tools. Interactive tutorials on frameworks, performance optimization, and best practices.',
  keywords: 'web development blog, tech stack guide, developer tutorials, framework comparison, AI development tools, code analysis, Next.js guide, React vs Vue, performance optimization',
  authors: [{ name: 'AI-AutoSite Team' }],
  creator: 'AI-AutoSite',
  publisher: 'AI-AutoSite',
  robots: 'index, follow, max-image-preview:large',
  openGraph: {
    title: 'Developer Tools Blog - Expert Guides & AI-Powered Tutorials | AI-AutoSite',
    description: 'Professional guides on web development, tech stacks, and developer productivity with interactive tools and AI integration.',
    type: 'website',
    url: 'https://ai-autosite.com/blog',
    siteName: 'AI-AutoSite',
    images: [
      {
        url: 'https://ai-autosite.com/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'AI-AutoSite Developer Blog - Expert Guides and Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ai_autosite',
    creator: '@ai_autosite',
    title: 'Developer Tools Blog | AI-AutoSite',
    description: 'Expert guides on modern development with interactive AI-powered tools',
    images: ['https://ai-autosite.com/og-blog.png'],
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog',
  },
};

const blogPosts = [
  {
    id: 'ai-dev-dictionary',
    title: 'Introducing AI Dev Dictionary',
    description: 'Master AI and development terminology with our interactive dictionary featuring visual demonstrations, code examples, and real-world applications.',
    category: 'Learning Tools',
    readTime: '5 min read',
    publishDate: 'December 2024',
    featured: true,
    status: 'published',
    url: '/blog/ai-dev-dictionary',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    relatedTool: {
      name: 'AI Dev Dictionary',
      url: '/tools/ai-dev-dictionary',
      description: 'Interactive learning tool'
    }
  },
  {
    id: 'choosing-the-right-tech-stack',
    title: 'Choosing the Right Tech Stack in 2025',
    description: 'A complete guide to selecting frameworks, databases, and tools for modern web development projects. Includes interactive comparison tool and AI recommendations.',
    category: 'Tech Stack',
    readTime: '12 min read',
    publishDate: 'January 2025',
    featured: false,
    status: 'published',
    url: '/blog/choosing-the-right-tech-stack',
    icon: Code,
    color: 'from-green-500 to-emerald-600',
    relatedTool: {
      name: 'Tech Stack Analyzer',
      url: '/tools/tech-stack-analyzer',
      description: 'Interactive tool mentioned in this article'
    }
  },
  // Add this to the blogPosts array in blog/page.tsx

{
  id: 'pc-optimizer-guide',
  title: 'Complete Guide to PC Optimization',
  description: 'Learn how to free up disk space, improve performance, and identify software to safely remove. Includes our free PC Optimizer tool for automated analysis.',
  category: 'Performance',
  readTime: '15 min read',
  publishDate: 'January 2025',
  featured: false,
  status: 'published',
  url: '/blog/pc-optimizer-guide',
  icon: HardDrive, // Import from lucide-react
  color: 'from-blue-500 to-cyan-500',
  relatedTool: {
    name: 'PC Optimizer Advisor',
    url: '/tools/pc-optimizer',
    description: 'Analyze your PC performance'
  }
},
  {
    id: 'code-dependency-analysis',
    title: 'Understanding Code Dependencies',
    description: 'Master project architecture by visualizing file relationships and dependencies. Learn to identify bottlenecks and improve code organization with AI assistance.',
    category: 'Code Analysis',
    readTime: '12 min read',
    publishDate: 'January 2025',
    featured: false,
    status: 'published',
    url: '/blog/code-dependency-analysis',
    icon: Database,
    color: 'from-blue-500 to-indigo-600',
    relatedTool: {
      name: 'Code Dependency Visualizer',
      url: '/tools/code-reader',
      description: 'Analyze your codebase structure'
    }
  },
  {
    id: 'ai-powered-development',
    title: 'AI-Powered Development Workflow',
    description: 'How to leverage AI tools like Claude and ChatGPT to accelerate your development process without sacrificing quality. Complete workflow guide.',
    category: 'AI Development',
    readTime: '10 min read',
    publishDate: 'February 2025',
    featured: false,
    status: 'coming-soon',
    url: '/blog/ai-powered-development',
    icon: Zap,
    color: 'from-purple-500 to-pink-600',
    relatedTool: {
      name: 'All Developer Tools',
      url: '/tools',
      description: 'Tools built with AI assistance'
    }
  },
  {
    id: 'performance-optimization-guide',
    title: 'Web Performance Optimization Guide',
    description: 'Learn how to optimize your web applications for maximum speed and user experience. Core Web Vitals, lazy loading, and bundle optimization.',
    category: 'Performance',
    readTime: '15 min read',
    publishDate: 'Coming Soon',
    featured: false,
    status: 'coming-soon',
    url: '/blog/performance-optimization-guide',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    relatedTool: {
      name: 'Tech Stack Analyzer',
      url: '/tools/tech-stack-analyzer',
      description: 'Choose performance-optimized stacks'
    }
  },
  {
    id: 'privacy-in-development',
    title: 'Privacy-First Development Practices',
    description: 'Build applications that respect user privacy from the ground up. GDPR compliance, data minimization, and secure development practices.',
    category: 'Privacy & Security',
    readTime: '12 min read',
    publishDate: 'Coming Soon',
    featured: false,
    status: 'coming-soon',
    url: '/blog/privacy-in-development',
    icon: Database,
    color: 'from-cyan-500 to-blue-600',
    relatedTool: {
      name: 'BlurTap',
      url: '/tools/blurtap',
      description: 'Privacy tool for sensitive data'
  }
  },
  {
    id: 'text-case-converter-guide',
    title: 'Master Text Case Conversion: 10 Essential Formats',
    description: 'Complete guide to text case conversion. Learn when to use camelCase, snake_case, PascalCase and more in your development workflow.',
    category: 'Developer Tools',
    readTime: '8 min read',
    publishDate: 'January 2025',
    featured: false,
    status: 'published',
    url: '/blog/text-case-converter',
    icon: Type,
    color: 'from-cyan-500 to-purple-500',
    relatedTool: {
      name: 'Text Case Converter',
      url: '/tools/text-case',
      description: 'Convert between 10 text formats'
    }
  },
  {
    id: 'json-beautify-guide',
    title: 'JSON Beautify: Format & Debug Like a Pro',
    description: 'Learn how to format, validate, and debug JSON effectively. Essential guide for API development and configuration management.',
    category: 'Developer Tools',
    readTime: '10 min read',
    publishDate: 'January 2025',
    featured: false,
    status: 'published',
    url: '/blog/json-beautify-guide',
    icon: Braces,
    color: 'from-green-500 to-emerald-500',
    relatedTool: {
      name: 'JSON Beautify',
      url: '/tools/json-format',
      description: 'Format and validate JSON'
    }
  }
]

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'AI-AutoSite Developer Blog',
  description: 'Expert guides on modern web development and AI-powered tools with interactive tutorials',
  url: 'https://ai-autosite.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'AI-AutoSite',
    url: 'https://ai-autosite.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ai-autosite.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://ai-autosite.com/blog'
  },
  blogPost: blogPosts.filter(post => post.status === 'published').map(post => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate !== 'Coming Soon' ? '2025-01-15' : undefined,
    url: `https://ai-autosite.com${post.url}`,
    author: {
      '@type': 'Organization',
      name: 'AI-AutoSite'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI-AutoSite',
      url: 'https://ai-autosite.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ai-autosite.com${post.url}`
    }
  }))
};

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Developer Tools
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-2">
              Blog & Guides
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Expert guides on modern web development, AI-powered tools, and best practices. 
            Each article includes interactive tools and hands-on examples you can try immediately.
          </p>
        </section>

        {/* Tools Integration Callout - Updated with AI Dev Dictionary */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Learn by Doing</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Our articles aren't just theory. Each guide connects to our free developer tools 
              so you can practice concepts immediately and see real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tools/ai-dev-dictionary"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                AI Dev Dictionary
              </Link>
              <Link 
                href="/tools/tech-stack-analyzer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                <Code className="w-4 h-4 mr-2" />
                Tech Stack Analyzer
              </Link>
              <Link 
                href="/tools/code-reader"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                <Database className="w-4 h-4 mr-2" />
                Code Dependency Visualizer
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-400">FEATURED ARTICLE</span>
            </div>
            
            <Link href={featuredPost.url} className="group block">
              <article className={`bg-gradient-to-r ${featuredPost.color} rounded-2xl p-8 text-white hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02]`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm opacity-80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readTime}
                  </span>
                  <span className="text-sm opacity-80">•</span>
                  <span className="text-sm opacity-80 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {featuredPost.publishDate}
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 group-hover:text-white/90 transition-colors">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg opacity-90 mb-6 max-w-3xl">
                  {featuredPost.description}
                </p>
                
                {/* Related Tool Highlight */}
                {featuredPost.relatedTool && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 inline-block">
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span className="opacity-90">Includes: </span>
                      <span className="font-medium">
                        {featuredPost.relatedTool.name}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="font-medium">Read Full Guide</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            All Articles
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => {
              const Icon = post.icon;
              const isClickable = post.status === 'published';
              
              return (
                <div key={post.id} className="group">
                  {isClickable ? (
                    <Link href={post.url} className="block">
                      <article className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 h-full flex flex-col">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${post.color} bg-opacity-20 flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Category and Read Time */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 flex-1">
                          {post.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-sm text-gray-500">{post.publishDate}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </article>
                    </Link>
                  ) : (
                    <div className="block">
                      <article className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full flex flex-col">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${post.color} bg-opacity-20 flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Category and Read Time */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 flex-1">
                          {post.description}
                        </p>
                        
                        {/* Related Tool for Coming Soon */}
                        {post.relatedTool && (
                          <div className="bg-white/5 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <ExternalLink className="w-3 h-3" />
                              <span className="text-xs">Try now:</span>
                              <Link 
                                href={post.relatedTool.url}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                              >
                                {post.relatedTool.name}
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-sm text-gray-500">{post.publishDate}</span>
                        </div>
                        
                        {/* Coming Soon Overlay */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 font-medium bg-white/10 px-4 py-2 rounded-lg">
                            Coming Soon
                          </span>
                        </div>
                      </article>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 py-16 px-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Stay Updated with New Articles
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get notified when we publish new guides on web development, AI tools, 
            and developer productivity. Plus get early access to new tools and features.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* CTA to Tools */}
        <section className="mt-16 py-12 px-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Put Knowledge into Practice
          </h2>
          <p className="text-gray-400 mb-8">
            Ready to apply what you've learned? Our free developer tools let you experiment 
            with the concepts covered in our articles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              <span>View All Tools</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/tools/ai-dev-dictionary"
              className="inline-flex items-center px-6 py-3 border border-amber-500/30 text-amber-400 font-medium rounded-lg hover:bg-amber-500/10 transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Try AI Dev Dictionary
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}