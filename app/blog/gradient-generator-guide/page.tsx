import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Palette, Sparkles, Code, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gradient Generator CSS - Beautiful Color Combinations | AI AutoSite',
  description:
    'Create stunning CSS gradients for your website. Generate linear and radial gradients with custom colors. Free gradient generator tool.',
  keywords:
    'gradient generator, css gradient, linear gradient, radial gradient, color gradient, gradient maker',
  openGraph: {
    title: 'CSS Gradient Generator - Design Guide',
    description: 'Create beautiful gradients for modern web design',
    type: 'article',
  },
}

export default function GradientGeneratorGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

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
            Creative Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          CSS Gradient Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master the art of CSS gradients. Create stunning backgrounds and effects for modern web
          design.
        </p>
      </header>

      <section className="space-y-12">
        {/* Gradient Types */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Types of CSS Gradients</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Linear Gradient</h3>
              <div
                className="h-24 rounded-lg mb-2"
                style={{ background: 'linear-gradient(90deg, #667eea, #764ba2)' }}
              ></div>
              <code className="text-purple-400 text-xs">
                linear-gradient(90deg, #667eea, #764ba2)
              </code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Radial Gradient</h3>
              <div
                className="h-24 rounded-lg mb-2"
                style={{ background: 'radial-gradient(circle, #667eea, #764ba2)' }}
              ></div>
              <code className="text-purple-400 text-xs">
                radial-gradient(circle, #667eea, #764ba2)
              </code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Conic Gradient</h3>
              <div
                className="h-24 rounded-lg mb-2"
                style={{ background: 'conic-gradient(from 180deg, #667eea, #764ba2, #667eea)' }}
              ></div>
              <code className="text-purple-400 text-xs">conic-gradient(from 180deg, ...)</code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Repeating Gradient</h3>
              <div
                className="h-24 rounded-lg mb-2"
                style={{
                  background:
                    'repeating-linear-gradient(45deg, #667eea 0px, #667eea 10px, #764ba2 10px, #764ba2 20px)',
                }}
              ></div>
              <code className="text-purple-400 text-xs">repeating-linear-gradient(...)</code>
            </div>
          </div>
        </div>

        {/* Popular Gradient Styles */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Trending Gradient Styles</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Style</th>
                  <th className="text-white pb-3">Description</th>
                  <th className="text-white pb-3">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Sunset</td>
                  <td className="py-3">Orange to pink transitions</td>
                  <td className="py-3">Hero sections, CTAs</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-blue-400">Ocean</td>
                  <td className="py-3">Blue to teal gradients</td>
                  <td className="py-3">Professional sites</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400">Nature</td>
                  <td className="py-3">Green to yellow tones</td>
                  <td className="py-3">Eco-friendly brands</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-pink-400">Pastel</td>
                  <td className="py-3">Soft, light colors</td>
                  <td className="py-3">Minimal designs</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-red-400">Fire</td>
                  <td className="py-3">Red to orange intense</td>
                  <td className="py-3">Energy, excitement</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-400">Grayscale</td>
                  <td className="py-3">Black to white</td>
                  <td className="py-3">Elegant, timeless</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Direction Options */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Direction</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <p className="text-gray-300">
                  <strong className="text-white">to right:</strong> Left to right (90deg)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">↓</span>
                <p className="text-gray-300">
                  <strong className="text-white">to bottom:</strong> Top to bottom (180deg)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">↘</span>
                <p className="text-gray-300">
                  <strong className="text-white">to bottom right:</strong> Diagonal (135deg)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">°</span>
                <p className="text-gray-300">
                  <strong className="text-white">45deg:</strong> Custom angle
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* CSS Implementation */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">CSS Implementation</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-purple-400 text-sm">{`/* Simple two-color gradient */
.gradient-simple {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

/* Multi-color gradient */
.gradient-multi {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 50%,
    #f093fb 100%
  );
}

/* Gradient with transparency */
.gradient-transparent {
  background: linear-gradient(
    to right,
    rgba(102, 126, 234, 0.5),
    rgba(118, 75, 162, 0.5)
  );
}

/* Animated gradient */
.gradient-animated {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`}</code>
            </pre>
          </div>
        </div>

        {/* Performance Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Performance Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">⚡</span>
                <p className="text-gray-300">Use CSS gradients instead of images when possible</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">⚡</span>
                <p className="text-gray-300">Limit gradient stops to 3-4 colors maximum</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">⚡</span>
                <p className="text-gray-300">
                  Use transform for animations instead of background-position
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">⚡</span>
                <p className="text-gray-300">Consider using CSS variables for reusable gradients</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Create Beautiful Gradients</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free gradient generator with live preview and CSS code export.
        </p>
        <Link
          href="/tools/gradient-generator"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Palette className="mr-2" size={20} />
          Try Gradient Generator
        </Link>
      </section>
    </article>
  )
}
