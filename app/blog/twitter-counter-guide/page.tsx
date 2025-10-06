import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Twitter, MessageSquare, Hash, Link2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Twitter Character Counter - Stay Within X/Twitter Limits | AI AutoSite',
  description:
    'Count characters for Twitter/X posts in real-time. Never exceed the 280 character limit. Free Twitter character counter tool.',
  keywords:
    'twitter character counter, x character limit, tweet counter, 280 characters, twitter limit checker',
  openGraph: {
    title: 'Twitter/X Character Counter Guide',
    description: 'Master Twitter character limits and optimize your tweets',
    type: 'article',
  },
}

export default function TwitterCounterGuidePage() {
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
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Twitter/X Character Counter Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Optimize your tweets with our character counter. Stay within limits while maximizing
          engagement on Twitter/X.
        </p>
      </header>

      <section className="space-y-12">
        {/* Twitter Limits */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Twitter/X Character Limits</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Content Type</th>
                  <th className="text-white pb-3">Limit</th>
                  <th className="text-white pb-3">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Regular Tweet</td>
                  <td className="py-3 text-cyan-400">280</td>
                  <td className="py-3">Standard posts</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Twitter Blue</td>
                  <td className="py-3 text-cyan-400">25,000</td>
                  <td className="py-3">Premium feature</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Username</td>
                  <td className="py-3 text-cyan-400">15</td>
                  <td className="py-3">@handle length</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Display Name</td>
                  <td className="py-3 text-cyan-400">50</td>
                  <td className="py-3">Profile name</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Bio</td>
                  <td className="py-3 text-cyan-400">160</td>
                  <td className="py-3">Profile description</td>
                </tr>
                <tr>
                  <td className="py-3">DM</td>
                  <td className="py-3 text-cyan-400">10,000</td>
                  <td className="py-3">Direct messages</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Character Counting Rules */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What Counts Toward the Limit?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">✅ Counts</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Regular text and spaces</li>
                <li>• Emojis (count as 2)</li>
                <li>• Hashtags</li>
                <li>• @mentions</li>
                <li>• Punctuation</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">❌ Doesn't Count</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Attached images</li>
                <li>• GIFs</li>
                <li>• Videos</li>
                <li>• Quote tweet text</li>
                <li>• Links (count as 23)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tweet Optimization Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Tweet Optimization Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">🎯</span>
                <p className="text-gray-300">
                  <strong className="text-white">Sweet spot:</strong> 71-100 characters get 17% more
                  engagement
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">🎯</span>
                <p className="text-gray-300">
                  <strong className="text-white">Use threads:</strong> Break long content into
                  multiple tweets
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">🎯</span>
                <p className="text-gray-300">
                  <strong className="text-white">Front-load:</strong> Put important info in first
                  100 chars
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">🎯</span>
                <p className="text-gray-300">
                  <strong className="text-white">Use abbreviations:</strong> w/ instead of "with", &
                  instead of "and"
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Hashtag Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Hashtag Best Practices</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">Use 1-2 hashtags maximum for best engagement</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">Place hashtags at the end, not in the middle</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">Research trending hashtags in your niche</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">Create branded hashtags for campaigns</p>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Count Your Tweet Characters</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free Twitter/X character counter with real-time updates and optimization tips.
        </p>
        <Link
          href="/tools/twitter-counter"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Twitter className="mr-2" size={20} />
          Try Twitter Counter
        </Link>
      </section>
    </article>
  )
}
