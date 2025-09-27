import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Type, FileText, Copy, Layout } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Dummy Text for Designers | AI AutoSite',
  description: 'Generate Lorem Ipsum placeholder text for designs and mockups. Create dummy content in various lengths and formats. Free Lorem Ipsum tool.',
  keywords: 'lorem ipsum generator, dummy text, placeholder text, mock text, lorem ipsum dolor',
  openGraph: {
    title: 'Lorem Ipsum Generator - Designer Text Guide',
    description: 'Generate perfect placeholder text for your designs',
    type: 'article',
  },
}

export default function LoremIpsumGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Dev Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Lorem Ipsum Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Generate placeholder text for your designs and mockups. 
          The designer's essential tool for content-free layouts.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Lorem Ipsum */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is Lorem Ipsum?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Lorem Ipsum is placeholder text used in the design and printing industry since the 1500s. 
              It's scrambled Latin from Cicero's "De Finibus Bonorum et Malorum" that looks like readable text.
            </p>
            <div className="bg-white/10 rounded-lg p-4 text-gray-400 italic">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
            </div>
          </div>
        </div>

        {/* Why Use Lorem Ipsum */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Use Lorem Ipsum?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <FileText className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Focus on Design</h3>
              <p className="text-gray-400 text-sm">
                Removes content distractions
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Layout className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Realistic Layout</h3>
              <p className="text-gray-400 text-sm">
                Shows how real text will look
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Type className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Professional</h3>
              <p className="text-gray-400 text-sm">
                Industry standard practice
              </p>
            </div>
          </div>
        </div>

        {/* Common Uses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Uses</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Use Case</th>
                  <th className="text-white pb-3">Amount Needed</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Headlines</td>
                  <td className="py-3 text-purple-400">2-5 words</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Button Text</td>
                  <td className="py-3 text-purple-400">1-3 words</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Card Description</td>
                  <td className="py-3 text-purple-400">20-50 words</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Blog Preview</td>
                  <td className="py-3 text-purple-400">100-200 words</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Article Body</td>
                  <td className="py-3 text-purple-400">300-500 words</td>
                </tr>
                <tr>
                  <td className="py-3">Long Form Content</td>
                  <td className="py-3 text-purple-400">1000+ words</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Alternatives */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Lorem Ipsum Alternatives</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Bacon Ipsum:</strong> Meat-themed placeholder text for food sites
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Hipster Ipsum:</strong> Trendy words for modern designs
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Corporate Ipsum:</strong> Business jargon placeholder
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Cicero:</strong> Original unscrambled Latin text
              </p>
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Replace Lorem Ipsum before going live
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Use consistent amounts across similar elements
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Test with both short and long text variations
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Consider using real draft content when available
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Lorem Ipsum Text
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free Lorem Ipsum generator with custom lengths and formats.
        </p>
        <Link 
          href="/tools/lorem-ipsum" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Type className="mr-2" size={20} />
          Generate Lorem Ipsum
        </Link>
      </section>
    </article>
  )
}