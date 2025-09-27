
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Hash, FileText, Zap, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Markdown Guide - Write Better Documentation | AI AutoSite',
  description: 'Complete guide to Markdown syntax. Learn to write documentation, README files, and blog posts efficiently.',
  keywords: 'markdown guide, markdown syntax, markdown tutorial, documentation, github markdown',
  openGraph: {
    title: 'Complete Markdown Guide for Developers',
    description: 'Master Markdown for better documentation',
    type: 'article',
  },
}

export default function MarkdownGuidePage() {
  const publishDate = '2025-01-20'
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
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            Documentation
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Master Markdown: The Developer's Writing Tool
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Learn how to write clean, formatted documentation using Markdown. 
          Perfect for README files, documentation, and technical writing.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Markdown */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is Markdown?</h2>
          <p className="text-gray-300 mb-4">
            Markdown is a lightweight markup language that converts plain text to HTML. 
            Created by John Gruber in 2004, it's now the standard for documentation 
            on GitHub, Stack Overflow, Reddit, and countless other platforms.
          </p>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2">The beauty of Markdown:</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">You write:</p>
                <code className="text-cyan-400">**Bold** and *italic*</code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">You get:</p>
                <p className="text-white"><strong>Bold</strong> and <em>italic</em></p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use Markdown */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Developers Love Markdown</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Fast to Write</h3>
              <p className="text-gray-400 text-sm">
                No clicking buttons or menus - just type and format
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <FileText className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Version Control</h3>
              <p className="text-gray-400 text-sm">
                Plain text works perfectly with Git
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Globe className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Universal</h3>
              <p className="text-gray-400 text-sm">
                Supported everywhere - GitHub, blogs, documentation
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Hash className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Readable</h3>
              <p className="text-gray-400 text-sm">
                Clean even in raw text format
              </p>
            </div>
          </div>
        </div>

        {/* Essential Syntax */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Essential Markdown Syntax</h2>
          
          <div className="space-y-6">
            {/* Headings */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Headings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <pre className="text-cyan-400 text-sm">
{`# Heading 1
## Heading 2
### Heading 3
#### Heading 4`}
                </pre>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Heading 1</h1>
                  <h2 className="text-xl font-bold">Heading 2</h2>
                  <h3 className="text-lg font-bold">Heading 3</h3>
                  <h4 className="text-base font-bold">Heading 4</h4>
                </div>
              </div>
            </div>

            {/* Text Formatting */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Text Formatting</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 pb-2">Markdown</th>
                    <th className="text-left text-gray-400 pb-2">Result</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono">**bold**</td>
                    <td className="py-2"><strong>bold</strong></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono">*italic*</td>
                    <td className="py-2"><em>italic</em></td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono">~~strikethrough~~</td>
                    <td className="py-2"><s>strikethrough</s></td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">`code`</td>
                    <td className="py-2"><code className="bg-black/30 px-1 rounded">code</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Lists */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Lists</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Unordered:</p>
                  <pre className="text-cyan-400 text-sm">
{`- Item 1
- Item 2
  - Nested item
- Item 3`}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Ordered:</p>
                  <pre className="text-cyan-400 text-sm">
{`1. First item
2. Second item
3. Third item`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Links and Images */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Links & Images</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <code className="text-cyan-400 text-sm">[Link text](https://url.com)</code>
                  <span className="text-gray-400 text-sm">→ Creates a link</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-cyan-400 text-sm">![Alt text](image.jpg)</code>
                  <span className="text-gray-400 text-sm">→ Embeds an image</span>
                </div>
              </div>
            </div>

            {/* Code Blocks */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Code Blocks</h3>
              <p className="text-gray-400 text-sm mb-3">Use triple backticks with language name:</p>
              <pre className="text-cyan-400 text-sm">
{`\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\``}
              </pre>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Where to Use Markdown</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">README files:</strong> Project documentation on GitHub
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Documentation:</strong> API docs, user guides, wikis
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Blog posts:</strong> Static site generators like Jekyll, Hugo
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Note-taking:</strong> Obsidian, Notion, Bear
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Forums:</strong> Stack Overflow, Reddit, Discord
              </p>
            </li>
          </ul>
        </div>

        {/* Pro Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Use blank lines between elements for better readability
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Escape special characters with backslash: \* \# \[
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Use reference-style links for repeated URLs
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Tables look better with alignment colons
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Convert Markdown to HTML
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Try our free Markdown to HTML converter with live preview. Perfect for blogs and documentation.
        </p>
        <Link 
          href="/tools/markdown-html" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Hash className="mr-2" size={20} />
          Try Markdown Converter
        </Link>
      </section>
    </article>
  )
}