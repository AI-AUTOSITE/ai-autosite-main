// app/blog/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Tools Blog | AI-AutoSite',
  description: 'Learn about modern web development, tech stack decisions, performance optimization, and developer tools. Expert guides and tutorials.',
  keywords: 'web development blog, tech stack guide, developer tutorials, programming tips, framework comparison',
  openGraph: {
    title: 'Developer Tools Blog - Expert Guides & Tutorials',
    description: 'Professional guides on web development, tech stacks, and developer productivity.',
    type: 'website',
    url: 'https://ai-autosite.com/blog'
  }
};

const blogPosts = [
  {
    id: 'choosing-the-right-tech-stack',
    title: 'Choosing the Right Tech Stack in 2025',
    description: 'A complete guide to selecting frameworks, databases, and tools for modern web development projects.',
    category: 'Tech Stack',
    readTime: '12 min read',
    publishDate: 'January 2025',
    featured: true,
    url: '/blog/choosing-the-right-tech-stack'
  },
  {
    id: 'performance-optimization-guide',
    title: 'Web Performance Optimization Guide',
    description: 'Learn how to optimize your web applications for maximum speed and user experience.',
    category: 'Performance',
    readTime: '8 min read',
    publishDate: 'Coming Soon',
    featured: false,
    url: '/blog/performance-optimization-guide'
  },
  {
    id: 'deployment-best-practices',
    title: 'Modern Deployment Best Practices',
    description: 'Master modern deployment strategies with CI/CD, preview environments, and monitoring.',
    category: 'DevOps',
    readTime: '10 min read',
    publishDate: 'Coming Soon',
    featured: false,
    url: '/blog/deployment-best-practices'
  },
  {
    id: 'database-design-principles',
    title: 'Database Design Principles',
    description: 'Design scalable database schemas that grow with your application.',
    category: 'Database',
    readTime: '15 min read',
    publishDate: 'Coming Soon',
    featured: false,
    url: '/blog/database-design-principles'
  }
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-gray-600 hover:text-gray-900">Tools</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Developer Tools
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides on modern web development, tech stack decisions, performance optimization, 
            and developer productivity. Written by developers, for developers.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600">FEATURED ARTICLE</span>
            </div>
            
            <Link href={featuredPost.url} className="group">
              <article className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm opacity-80">{featuredPost.readTime}</span>
                  <span className="text-sm opacity-80">•</span>
                  <span className="text-sm opacity-80">{featuredPost.publishDate}</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 group-hover:text-blue-100 transition-colors">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg opacity-90 mb-6 max-w-3xl">
                  {featuredPost.description}
                </p>
                
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="font-medium">Read Full Guide</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link key={post.id} href={post.url} className="group">
                <article className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex-grow">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.publishDate}</span>
                    {post.publishDate !== 'Coming Soon' && (
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </div>
                  
                  {post.publishDate === 'Coming Soon' && (
                    <div className="absolute inset-0 bg-gray-50/80 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 font-medium">Coming Soon</span>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 py-16 px-8 bg-gray-50 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with New Articles
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get notified when we publish new guides on web development, performance optimization, 
            and developer productivity. No spam, unsubscribe anytime.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* CTA to Tools */}
        <section className="mt-16 py-12 px-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Try Our Developer Tools
          </h2>
          <p className="text-gray-300 mb-8">
            Put these guides into practice with our free, privacy-focused developer tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/tech-stack-analyzer"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tech Stack Analyzer
            </Link>
            <Link 
              href="/tools/code-reader"
              className="px-6 py-3 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Code Dependency Visualizer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}