import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Privacy & Security Tips | BlurTap',
  description: 'Learn about image privacy, data protection, and security best practices. Tips for protecting sensitive information online.',
}

// ブログ記事データ（後でCMSやMDXに移行可能）
const blogPosts = [
  {
    slug: 'protect-screenshot-privacy-2024',
    title: 'How to Protect Privacy in Screenshots: Complete Guide 2024',
    excerpt: 'Learn essential techniques for hiding sensitive information in screenshots before sharing. Covers tools, best practices, and common mistakes to avoid.',
    date: '2024-01-20',
    readTime: '5 min read',
    category: 'Privacy',
    featured: true,
  },
  {
    slug: 'gdpr-compliance-image-masking',
    title: 'GDPR Compliance: Why Image Masking Matters for Businesses',
    excerpt: 'Discover how proper image masking helps maintain GDPR compliance when sharing documents and screenshots containing personal data.',
    date: '2024-01-18',
    readTime: '7 min read',
    category: 'Compliance',
    featured: false,
  },
  {
    slug: 'remote-work-privacy-tips',
    title: '10 Screenshot Privacy Tips for Remote Workers',
    excerpt: 'Working from home? Here\'s how to protect sensitive company information when sharing screenshots with your team.',
    date: '2024-01-15',
    readTime: '4 min read',
    category: 'Remote Work',
    featured: false,
  },
]

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="space-y-12">
      {/* ページタイトル */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Privacy & Security
          <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Tips, Guides & Best Practices
          </span>
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Learn how to protect sensitive information in your digital content.
          All guides are free and focus on practical privacy solutions.
        </p>
      </div>

      {/* Featured記事 */}
      {featuredPost && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/[0.07] transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xs font-semibold text-white">
              FEATURED
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300">
              {featuredPost.category}
            </span>
          </div>
          
          <Link href={`/blog/${featuredPost.slug}`} className="group">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-gray-300 mb-4 line-clamp-2">
              {featuredPost.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{featuredPost.readTime}</span>
                </span>
              </div>
              
              <span className="flex items-center space-x-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* 通常記事グリッド */}
      <div className="grid md:grid-cols-2 gap-6">
        {regularPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/[0.07] transition-all"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-gray-300">
                {post.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{post.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          Try BlurTap Now
        </h3>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Start protecting your privacy with our free image masking tool. 
          No signup, no uploads, 100% local processing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
        >
          <span>Try BlurTap Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}