import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Type, FileText, Copy, Layout, Moon, Sun, Download, Zap, Keyboard, Share2, Code, Maximize2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Light/Dark Mode, Floating Preview, API | AI AutoSite',
  description:
    'Modern Lorem Ipsum generator with light/dark mode toggle, floating preview panel, download in 4 formats, keyboard shortcuts, and API access. Privacy-first alternative to traditional generators.',
  keywords: 'lorem ipsum generator, dummy text, placeholder text, dark mode lorem ipsum, light mode, floating preview, lorem ipsum api, download lorem ipsum, modern lorem ipsum generator',
  openGraph: {
    title: 'Modern Lorem Ipsum Generator - Light/Dark Mode, Floating Preview, API',
    description: 'Privacy-first Lorem Ipsum generator with modern features including floating preview',
    type: 'article',
  },
}

export default function LoremIpsumGuidePage() {
  const publishDate = '2025-11-26'
  const updateDate = '2025-11-26'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

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
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Dev Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Updated {updateDate}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Modern Lorem Ipsum Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Privacy-first Lorem Ipsum generator with light/dark mode toggle, floating preview panel, multiple download formats, keyboard shortcuts, and API access. A modern alternative to traditional generators.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Lorem Ipsum */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is Lorem Ipsum?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Lorem Ipsum is placeholder text used in the design and printing industry since the
              1500s. It's scrambled Latin from Cicero's "De Finibus Bonorum et Malorum" that looks
              like readable text.
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
              <p className="text-gray-400 text-sm">Removes content distractions</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Layout className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Realistic Layout</h3>
              <p className="text-gray-400 text-sm">Shows how real text will look</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Type className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Professional</h3>
              <p className="text-gray-400 text-sm">Industry standard practice</p>
            </div>
          </div>
        </div>

        {/* What Makes This Different */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What Makes This Different?</h2>
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
            <p className="text-gray-300 mb-4">
              Unlike traditional Lorem Ipsum generators (some 23+ years old!), our modern generator prioritizes privacy, user experience, and developer workflow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-6 h-6 text-purple-400" />
                <Sun className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Light/Dark Mode Toggle</h3>
              <p className="text-gray-400 text-sm">Switch between light and dark themes instantly - work comfortably in any environment</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20">
              <Maximize2 className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Floating Preview Panel</h3>
              <p className="text-gray-400 text-sm">
                <span className="text-purple-400 font-medium">NEW!</span> See your generated text in a floating panel that slides up from the bottom. Copy or download without scrolling!
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Download className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Multiple Formats</h3>
              <p className="text-gray-400 text-sm">Download as TXT, HTML, Markdown, or JSON - ready for any workflow</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Keyboard className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Keyboard Shortcuts</h3>
              <p className="text-gray-400 text-sm">Ctrl+Enter to generate, Ctrl+Shift+C to copy - built for speed</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Code className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">API Access</h3>
              <p className="text-gray-400 text-sm">Programmatic generation with rate-limited API endpoint</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Zap className="w-8 h-8 text-orange-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Quick Presets</h3>
              <p className="text-gray-400 text-sm">One-click generation of common amounts - no typing needed</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Share2 className="w-8 h-8 text-pink-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">100% client-side, no tracking, no cookies, no data collection</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Layout className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Fully Responsive</h3>
              <p className="text-gray-400 text-sm">Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
          </div>
        </div>

        {/* Floating Preview Feature */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm mr-2">NEW</span>
            Floating Preview Panel
          </h2>
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
            <p className="text-gray-300 mb-4">
              The new floating preview panel appears at the bottom of your screen when text is generated. No more scrolling back and forth!
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">👆</div>
                <h4 className="text-white font-medium mb-1">Click to Expand</h4>
                <p className="text-gray-400 text-xs">Tap the tab to show the full preview panel</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📋</div>
                <h4 className="text-white font-medium mb-1">Quick Actions</h4>
                <p className="text-gray-400 text-xs">Copy or download directly from the panel</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">✕</div>
                <h4 className="text-white font-medium mb-1">Minimize</h4>
                <p className="text-gray-400 text-xs">Click × to minimize to a small pill button</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Panel States</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-24 text-purple-400 font-medium">Collapsed:</span>
                <span className="text-gray-300">Shows tab with word count - click to expand</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-purple-400 font-medium">Expanded:</span>
                <span className="text-gray-300">Shows preview, stats, copy & download buttons</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 text-purple-400 font-medium">Minimized:</span>
                <span className="text-gray-300">Small pill button - click to restore</span>
              </div>
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
                <strong className="text-white">Bacon Ipsum:</strong> Meat-themed placeholder text
                for food sites
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Hipster Ipsum:</strong> Trendy words for modern
                designs
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

        {/* Keyboard Shortcuts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Keyboard Shortcuts</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">Speed up your workflow with these keyboard shortcuts:</p>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3 pr-4">Action</th>
                  <th className="text-white pb-3">Shortcut</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Generate Lorem Ipsum</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Ctrl</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Enter</kbd>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Copy to Clipboard</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Ctrl</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Shift</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">C</kbd>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Download</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Ctrl</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">D</kbd>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4">Clear Output</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Escape</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Toggle Light/Dark Mode</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Ctrl</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">/</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-gray-400 text-sm mt-4">
              💡 <strong>Tip:</strong> On Mac, use <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Cmd</kbd> instead of <kbd className="px-2 py-1 bg-gray-800 rounded text-purple-400 text-xs font-mono">Ctrl</kbd>
            </p>
          </div>
        </div>

        {/* API Documentation */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">API Documentation</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Use our API endpoint for programmatic Lorem Ipsum generation:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                GET /api/lorem?type=paragraphs&amount=3&format=text&start=true
              </code>
            </div>
            <h3 className="text-white font-semibold mb-2">Query Parameters</h3>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-2 pr-4">Parameter</th>
                  <th className="text-white pb-2 pr-4">Values</th>
                  <th className="text-white pb-2">Default</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4"><code className="text-purple-400">type</code></td>
                  <td className="py-2 pr-4">words, sentences, paragraphs</td>
                  <td className="py-2">paragraphs</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4"><code className="text-purple-400">amount</code></td>
                  <td className="py-2 pr-4">1-100</td>
                  <td className="py-2">3</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4"><code className="text-purple-400">format</code></td>
                  <td className="py-2 pr-4">text, html, markdown, json</td>
                  <td className="py-2">text</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="text-purple-400">start</code></td>
                  <td className="py-2 pr-4">true, false</td>
                  <td className="py-2">true</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                <strong>⚡ Rate Limit:</strong> 100 requests per hour per IP address
              </p>
            </div>
          </div>
        </div>

        {/* Download Formats */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Download Formats</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">📄 Plain Text (.txt)</h3>
              <p className="text-gray-400 text-sm">Simple paragraphs separated by line breaks - perfect for quick copy-paste</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">🌐 HTML (.html)</h3>
              <p className="text-gray-400 text-sm">Wrapped in &lt;p&gt; tags - ready to drop into your web projects</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">📝 Markdown (.md)</h3>
              <p className="text-gray-400 text-sm">With headers and formatting - ideal for documentation</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">💾 JSON (.json)</h3>
              <p className="text-gray-400 text-sm">Structured data with metadata - perfect for API testing</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Is this really privacy-first?</h3>
              <p className="text-gray-400 text-sm">
                Yes! All generation happens in your browser. We don't use cookies, tracking scripts, or collect any data. Compare this to traditional generators that load 6+ ad networks and track your location.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Why does it start with "Lorem ipsum"?</h3>
              <p className="text-gray-400 text-sm">
                Toggle the "Start with Lorem ipsum..." checkbox if you want completely random text. Starting with the classic phrase helps clients recognize it as placeholder text.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">What is the floating preview panel?</h3>
              <p className="text-gray-400 text-sm">
                The floating preview is a panel that appears at the bottom of your screen when text is generated. It lets you see your text, copy it, or download it without scrolling. You can minimize it to a small button if you prefer more screen space.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Can I use the API commercially?</h3>
              <p className="text-gray-400 text-sm">
                Yes! The API is free for commercial use within the rate limits (100 requests/hour). Need higher limits? Contact us about enterprise access.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">What's auto-generate mode?</h3>
              <p className="text-gray-400 text-sm">
                When enabled, text regenerates automatically as you change settings. Great for previewing different amounts without clicking Generate each time.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Does it work on mobile?</h3>
              <p className="text-gray-400 text-sm">
                Yes! The generator is fully responsive and works great on phones and tablets. The floating preview panel adapts to smaller screens automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Replace Lorem Ipsum before going live</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Use consistent amounts across similar elements</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Test with both short and long text variations</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Consider using real draft content when available</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Try the Modern Lorem Ipsum Generator</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Light/dark mode toggle, floating preview panel, multiple formats, keyboard shortcuts, API access - all privacy-first and 100% free.
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