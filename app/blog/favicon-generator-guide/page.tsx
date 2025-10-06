import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Globe, Image, Download, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Favicon Generator - Create Website Icons All Sizes | AI AutoSite',
  description:
    'Generate favicon.ico and app icons for websites. Create all icon sizes from one image. Free favicon generator tool.',
  keywords:
    'favicon generator, favicon creator, website icon, favicon.ico generator, app icon generator',
  openGraph: {
    title: 'Favicon Generator - Complete Icon Guide',
    description: 'Create perfect website favicons and app icons',
    type: 'article',
  },
}

export default function FaviconGeneratorGuidePage() {
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
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Dev Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Favicon Generator Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Create professional favicons for your website. Generate all required icon sizes for
          browsers, mobile devices, and app stores.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is a Favicon */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a Favicon?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A favicon (favorite icon) is the small icon that appears in browser tabs, bookmarks,
              and address bars. It's essential for brand recognition and professional appearance.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🔖</div>
                <p className="text-sm text-gray-400">Browser Tab</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm text-gray-400">Bookmarks</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-sm text-gray-400">Home Screen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Required Sizes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Essential Favicon Sizes</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Size</th>
                  <th className="text-white pb-3">Purpose</th>
                  <th className="text-white pb-3">File Name</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">16×16</td>
                  <td className="py-3">Browser tabs</td>
                  <td className="py-3 font-mono text-sm">favicon-16x16.png</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">32×32</td>
                  <td className="py-3">Taskbar (Windows)</td>
                  <td className="py-3 font-mono text-sm">favicon-32x32.png</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">48×48</td>
                  <td className="py-3">Windows site icons</td>
                  <td className="py-3 font-mono text-sm">favicon.ico</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">180×180</td>
                  <td className="py-3">Apple Touch Icon</td>
                  <td className="py-3 font-mono text-sm">apple-touch-icon.png</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">192×192</td>
                  <td className="py-3">Android Chrome</td>
                  <td className="py-3 font-mono text-sm">android-chrome-192x192.png</td>
                </tr>
                <tr>
                  <td className="py-3 text-purple-400">512×512</td>
                  <td className="py-3">PWA Splash Screen</td>
                  <td className="py-3 font-mono text-sm">android-chrome-512x512.png</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* HTML Implementation */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">HTML Implementation</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">Add these lines to your HTML &lt;head&gt;:</p>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-purple-400 text-sm">{`<!-- Basic favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="manifest" href="/site.webmanifest">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">

<!-- Windows Tile -->
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">`}</code>
            </pre>
          </div>
        </div>

        {/* Design Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Favicon Design Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">✅ Do's</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Keep it simple and recognizable</li>
                <li>• Use your brand colors</li>
                <li>• Test at small sizes</li>
                <li>• High contrast design</li>
                <li>• Square aspect ratio</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">❌ Don'ts</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Avoid tiny text</li>
                <li>• No complex details</li>
                <li>• Skip gradients</li>
                <li>• Avoid thin lines</li>
                <li>• No photo-realistic images</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testing */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Testing Your Favicon</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ol className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">1.</span>
                <p className="text-gray-300">Clear browser cache (Ctrl+Shift+Delete)</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <p className="text-gray-300">Hard refresh page (Ctrl+Shift+R)</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">3.</span>
                <p className="text-gray-300">Check different browsers and devices</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">4.</span>
                <p className="text-gray-300">Test bookmarking and home screen addition</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Generate Your Favicon Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free favicon generator - create all icon sizes from one image.
        </p>
        <Link
          href="/tools/favicon-generator"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Globe className="mr-2" size={20} />
          Try Favicon Generator
        </Link>
      </section>
    </article>
  )
}
