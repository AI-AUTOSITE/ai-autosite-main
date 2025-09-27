
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Palette, Eye, Brush, Monitor } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Color Palette Guide - Design Beautiful Color Schemes | AI AutoSite',
  description: 'Learn how to create beautiful color palettes for web design, branding, and art. Free color scheme generator included.',
  keywords: 'color palette, color theory, design colors, color scheme, web design colors',
  openGraph: {
    title: 'Complete Guide to Color Palettes',
    description: 'Master color combinations for stunning designs',
    type: 'article',
  },
}

export default function ColorPaletteGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

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
          <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full">
            Design
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          How to Create Beautiful Color Palettes
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master the art of color combinations. Learn how to create stunning palettes 
          for websites, apps, and designs.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Colors Matter */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Color Palettes Matter</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Eye className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">First Impressions</h3>
              <p className="text-gray-400 text-sm">
                90% of snap judgments are based on color
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Brush className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Brand Identity</h3>
              <p className="text-gray-400 text-sm">
                Colors increase brand recognition by 80%
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Monitor className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">User Experience</h3>
              <p className="text-gray-400 text-sm">
                Good colors improve readability and usability
              </p>
            </div>
          </div>
        </div>

        {/* Color Harmony Types */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Types of Color Harmony</h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Monochromatic</h3>
              <p className="text-gray-400 mb-3">Different shades of the same color</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#1e3a8a' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#2563eb' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#3b82f6' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#60a5fa' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#93bbfc' }} />
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Complementary</h3>
              <p className="text-gray-400 mb-3">Opposite colors on the color wheel</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#3b82f6' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#60a5fa' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#fbbf24' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#f59e0b' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#d97706' }} />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Analogous</h3>
              <p className="text-gray-400 mb-3">Colors next to each other on the wheel</p>
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#10b981' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#14b8a6' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#06b6d4' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#0284c7' }} />
                <div className="w-12 h-12 rounded" style={{ backgroundColor: '#0369a1' }} />
              </div>
            </div>
          </div>
        </div>

        {/* How to Choose Colors */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Choose Your Palette</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-pink-500/20 text-pink-400 rounded-lg flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium">Start with one main color</p>
                <p className="text-gray-400 text-sm mt-1">
                  Choose a color that represents your brand or mood
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium">Pick a harmony type</p>
                <p className="text-gray-400 text-sm mt-1">
                  Monochromatic for calm, complementary for energy
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium">Add neutral colors</p>
                <p className="text-gray-400 text-sm mt-1">
                  Include white, black, or gray for balance
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <p className="text-white font-medium">Test your palette</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try it on real designs to see if it works
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Common Uses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Where to Use Color Palettes</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Website Design:</strong> Headers, buttons, backgrounds
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Branding:</strong> Logos, business cards, marketing
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Social Media:</strong> Posts, stories, highlights
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Presentations:</strong> Slides, charts, infographics
              </p>
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Color Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Use 3-5 colors maximum for clean design
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Follow 60-30-10 rule: 60% main, 30% secondary, 10% accent
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Test colors for accessibility (contrast ratio)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Consider color psychology and cultural meanings
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Your Perfect Palette
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free color palette generator with instant preview. Create beautiful color schemes in seconds.
        </p>
        <Link 
          href="/tools/color-palette" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Palette className="mr-2" size={20} />
          Try Color Palette
        </Link>
      </section>
    </article>
  )
}