

import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Type, Twitter, MessageSquare, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Word & Character Counter Guide - For Essays, Twitter, SEO | AI AutoSite',
  description: 'Learn how to count words and characters for essays, social media, and SEO. Free online text counter with reading time.',
  keywords: 'word counter, character counter, text counter, essay word count, twitter character limit',
  openGraph: {
    title: 'Word & Character Counter - Complete Guide',
    description: 'Everything about counting words and characters for different platforms',
    type: 'article',
  },
}

export default function TextCounterGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
            Quick Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Word & Character Counter Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master word and character limits for essays, social media, and SEO. 
          Know exactly how long your text is.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Count Matters */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Text Length Matters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Twitter className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Social Media</h3>
              <p className="text-gray-400 text-sm">
                Stay within platform limits for posts
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <FileText className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Academic</h3>
              <p className="text-gray-400 text-sm">
                Meet essay and paper requirements
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Type className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">SEO</h3>
              <p className="text-gray-400 text-sm">
                Optimize meta descriptions and titles
              </p>
            </div>
          </div>
        </div>

        {/* Platform Limits */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Character Limits by Platform</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Platform</th>
                  <th className="text-white pb-3">Limit</th>
                  <th className="text-white pb-3">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Twitter/X</td>
                  <td className="py-3 text-cyan-400">280</td>
                  <td className="py-3 text-sm">Standard tweets</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Instagram</td>
                  <td className="py-3 text-cyan-400">2,200</td>
                  <td className="py-3 text-sm">Caption limit</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">LinkedIn</td>
                  <td className="py-3 text-cyan-400">3,000</td>
                  <td className="py-3 text-sm">Post limit</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">SMS</td>
                  <td className="py-3 text-cyan-400">160</td>
                  <td className="py-3 text-sm">Single message</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Meta Title</td>
                  <td className="py-3 text-cyan-400">60</td>
                  <td className="py-3 text-sm">SEO best practice</td>
                </tr>
                <tr>
                  <td className="py-3">Meta Description</td>
                  <td className="py-3 text-cyan-400">155</td>
                  <td className="py-3 text-sm">SEO best practice</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Word Count Guidelines */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Word Count Guidelines</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Blog posts:</strong> 1,000-2,500 words for good SEO
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">College essays:</strong> Usually 250-650 words
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Email subject:</strong> 30-50 characters best
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Product descriptions:</strong> 150-300 words ideal
              </p>
            </li>
          </ul>
        </div>

        {/* Reading Time */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Understanding Reading Time</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Average reading speeds:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">200 words/minute:</strong> Average adult</li>
              <li>• <strong className="text-white">250 words/minute:</strong> Above average</li>
              <li>• <strong className="text-white">300 words/minute:</strong> Fast reader</li>
              <li>• <strong className="text-white">100 words/minute:</strong> Technical content</li>
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Writing Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Count as you write to avoid major edits later
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Characters with spaces vs without matters for some platforms
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Keep 10% buffer - platforms may count differently
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Emojis count as 2+ characters on most platforms
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Count Your Text Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free online word and character counter. Real-time counting as you type.
        </p>
        <Link 
          href="/tools/text-counter" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Type className="mr-2" size={20} />
          Try Text Counter
        </Link>
      </section>
    </article>
  )
}