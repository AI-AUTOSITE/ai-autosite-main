// app/blog/hashtag-generator-guide/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Hash, TrendingUp, Instagram, Twitter, Music2, Sparkles, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hashtag Generator Guide - Best Tags for Instagram, Twitter, TikTok | AI AutoSite',
  description: 'Generate perfect hashtags for social media. Learn hashtag strategies to increase reach and engagement on Instagram, Twitter, and TikTok.',
  keywords: 'hashtag generator, instagram hashtags, twitter tags, tiktok hashtags, social media marketing, hashtag strategy',
  openGraph: {
    title: 'Master Hashtag Strategy - Get More Social Media Reach',
    description: 'Generate perfect hashtags and boost your social media engagement',
    type: 'article',
  },
}

export default function HashtagGeneratorGuidePage() {
  const publishDate = '2025-01-26'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

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
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Business Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Master Hashtag Strategy: Get More Reach on Social Media
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Learn how to generate perfect hashtags for Instagram, Twitter, and TikTok. 
          Boost engagement with strategic tag selection and proven hashtag techniques.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Hashtags Matter */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Hashtags Matter in 2025</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Increase Reach</h3>
              <p className="text-gray-400 text-sm">
                Posts with hashtags get 12.6% more engagement
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Target className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Target Audience</h3>
              <p className="text-gray-400 text-sm">
                Connect with people interested in your content
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Sparkles className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Boost Discovery</h3>
              <p className="text-gray-400 text-sm">
                Appear in searches and explore pages
              </p>
            </div>
          </div>
        </div>

        {/* Platform-Specific Strategies */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Platform-Specific Hashtag Strategies</h2>
          
          {/* Instagram */}
          <div className="bg-white/5 rounded-xl p-6 border border-pink-500/20 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Instagram className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-semibold text-white">Instagram</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300">
                <strong className="text-white">Optimal Count:</strong> 11-30 hashtags per post
              </p>
              <p className="text-gray-300">
                <strong className="text-white">Best Mix:</strong> 30% popular + 50% medium + 20% niche tags
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  Popular tags (1M+ posts): Maximum exposure but high competition
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  Medium tags (100K-1M posts): Good balance of reach and visibility
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  Niche tags (under 100K): Higher chance of staying visible longer
                </li>
              </ul>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Twitter className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Twitter (X)</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300">
                <strong className="text-white">Optimal Count:</strong> 1-3 hashtags per tweet
              </p>
              <p className="text-gray-300">
                <strong className="text-white">Strategy:</strong> Focus on trending and relevant tags
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Check trending hashtags daily for opportunities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Create branded hashtags for campaigns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Join conversations with event hashtags
                </li>
              </ul>
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Music2 className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">TikTok</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300">
                <strong className="text-white">Optimal Count:</strong> 3-5 hashtags per video
              </p>
              <p className="text-gray-300">
                <strong className="text-white">Must-Have:</strong> Always include #fyp or #foryou
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-1">•</span>
                  Mix trending sounds with relevant hashtags
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-1">•</span>
                  Use challenge hashtags to join viral trends
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-300 mt-1">•</span>
                  Include location-based tags for local reach
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hashtag Formula */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">The Perfect Hashtag Formula</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl text-cyan-400 font-bold">1</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Content Tags</h3>
                  <p className="text-gray-400 text-sm">Describe what's in your post (#sunset, #coffee, #workout)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-purple-400 font-bold">2</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Industry Tags</h3>
                  <p className="text-gray-400 text-sm">Your niche or field (#digitalmarketing, #foodie, #fitness)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-pink-400 font-bold">3</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Community Tags</h3>
                  <p className="text-gray-400 text-sm">Connect with groups (#igers, #bookstagram, #techtwitter)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl text-yellow-400 font-bold">4</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Branded Tags</h3>
                  <p className="text-gray-400 text-sm">Your unique tags (#yourbrand, #yourcampaign)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Hashtag Mistakes to Avoid</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Using banned hashtags:</strong> Check if tags are shadowbanned
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Only popular tags:</strong> You'll get lost in millions of posts
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Irrelevant tags:</strong> Hurts your engagement rate
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Same tags every post:</strong> Algorithm sees this as spam
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">❌</span>
                <p className="text-gray-300">
                  <strong className="text-white">Too generic:</strong> #love #happy won't help you stand out
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Hashtag Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
              <p className="text-gray-300">
                <span className="text-cyan-400 font-semibold">Research competitors:</span> See what hashtags successful accounts in your niche use
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
              <p className="text-gray-300">
                <span className="text-purple-400 font-semibold">Create hashtag sets:</span> Save different sets for different types of content
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-gray-300">
                <span className="text-yellow-400 font-semibold">Track performance:</span> Monitor which hashtags bring the most engagement
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20">
              <p className="text-gray-300">
                <span className="text-green-400 font-semibold">Update regularly:</span> Hashtag trends change, refresh your strategy monthly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Perfect Hashtags Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free hashtag generator for Instagram, Twitter, and TikTok. Get 30 relevant tags instantly.
        </p>
        <Link 
          href="/tools/hashtag-generator" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Hash className="mr-2" size={20} />
          Try Hashtag Generator
        </Link>
      </section>
    </article>
  )
}