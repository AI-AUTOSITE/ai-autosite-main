// app/blog/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Clock, ArrowRight, BookOpen, Code, Zap, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer Tools Blog | AI-Powered Development Guides',
  description: 'Learn about modern web development, tech stack decisions, and AI-powered developer tools. Expert guides on frameworks, performance, and best practices.',
  keywords: 'web development blog, tech stack guide, developer tutorials, framework comparison, AI development, code analysis, React vs Vue, Next.js guide',
  openGraph: {
    title: 'Developer Tools Blog - Expert Guides & AI-Powered Tutorials',
    description: 'Professional guides on web development, tech stacks, and developer productivity with AI integration.',
    type: 'website',
    url: 'https://ai-autosite.com/blog',
    images: [
      {
        url: 'https://ai-autosite.com/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'AI-AutoSite Developer Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Tools Blog | AI-AutoSite',
    description: 'Expert guides on modern development with AI-powered tools',
    images: ['https://ai-autosite.com/og-blog.png'],
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog',
  },
};

const blogPosts = [
  {
    id: 'choosing-the-right-tech-stack',
    title: 'Choosing the Right Tech Stack in 2025',
    description: 'A complete guide to selecting frameworks, databases, and tools for modern web development projects. Compare React, Vue, Next.js and more.',
    category: 'Tech Stack',
    readTime: '12 min read',
    publishDate: 'January 2025',
    featured: true,
    status: 'published',
    url: '/blog/choosing-the-right-tech-stack',
    icon: Code,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'ai-powered-development',
    title: 'AI-Powered Development Workflow',
    description: 'How to leverage AI tools like Claude and ChatGPT to accelerate your development process without sacrificing quality.',
    category: 'AI Development',
    readTime: '10 min read',
    publishDate: 'February 2025',
    featured: false,
    status: 'coming-soon',
    url: '/blog/ai-powered-development',
    icon: Zap,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'performance-optimization-guide',
    title: 'Web Performance Optimization Guide',
    description: 'Learn how to optimize your web applications for maximum speed and user experience. Core Web Vitals, lazy loading, and more.',
    category: 'Performance',
    readTime: '8 min read',
    publishDate: 'Coming Soon',
    featured: false,
    status: 'coming-soon',
    url: '/blog/performance-optimization-guide',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'database-design-principles',
    title: 'Database Design for Modern Apps',
    description: 'Design scalable database schemas that grow with your application. PostgreSQL, MongoDB, and serverless options compared.',
    category: 'Database',
    readTime: '15 min read',
    publishDate: 'Coming Soon',
    featured: false,
    status: 'coming-soon',
    url: '/blog/database-design-principles',
    icon: Database,
    color: 'from-orange-500 to-red-600'
  }
];

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'AI-AutoSite Developer Blog',
  description: 'Expert guides on modern web development and AI-powered tools',
  url: 'https://ai-autosite.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'AI-AutoSite',
    url: 'https://ai-autosite.com'
  },
  blogPost: blogPosts.map(post => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate !== 'Coming Soon' ? '2025-01-01' : undefined,
    url: `https://ai-autosite.com${post.url}`,
    author: {
      '@type': 'Organization',
      name: 'AI-AutoSite'
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
            Written by developers who actually build things.
          </p>
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
              return (
                <Link 
                  key={post.id} 
                  href={post.url} 
                  className={`group block ${post.status === 'coming-soon' ? 'pointer-events-none' : ''}`}
                >
                  <article className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 h-full">
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
                    
                    <p className="text-gray-400 mb-4">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm text-gray-500">{post.publishDate}</span>
                      {post.status !== 'coming-soon' && (
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                    
                    {/* Coming Soon Overlay */}
                    {post.status === 'coming-soon' && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-medium bg-white/10 px-4 py-2 rounded-lg">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </article>
                </Link>
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
            and developer productivity. No spam, unsubscribe anytime.
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
            Try Our Developer Tools
          </h2>
          <p className="text-gray-400 mb-8">
            Put these guides into practice with our free, privacy-focused developer tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/tech-stack-analyzer"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Tech Stack Analyzer
            </Link>
            <Link 
              href="/tools/code-reader"
              className="px-6 py-3 border border-cyan-500/30 text-cyan-400 font-medium rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              Code Dependency Visualizer
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}