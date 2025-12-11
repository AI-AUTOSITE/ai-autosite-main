import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Code2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Code Formatter Guide - Beautify & Minify Code | AI AutoSite',
  description: 'Learn how to format and minify JSON, HTML, CSS, and JavaScript code for better readability.',
  keywords: 'code formatter guide, json beautifier, html formatter, minify code',
}

export default function CodeFormatterGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-sm">Dev Tools</span>
        <h1 className="text-4xl font-bold text-white my-6">Code Formatter Guide</h1>
        <p className="text-xl text-gray-300">Format and minify your code for better readability or smaller file sizes.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Supported Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['JSON', 'HTML', 'CSS', 'JavaScript'].map(lang => (
              <div key={lang} className="p-3 bg-gray-800/50 rounded-lg text-center text-sky-400 font-mono">{lang}</div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Format vs Minify</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-sky-500/10 rounded-lg"><strong className="text-sky-400">Format:</strong><p className="text-gray-400 text-sm mt-1">Adds indentation and line breaks for readability</p></div>
            <div className="p-4 bg-purple-500/10 rounded-lg"><strong className="text-purple-400">Minify:</strong><p className="text-gray-400 text-sm mt-1">Removes whitespace for smaller file size</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-xl p-8 text-center">
          <Code2 className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Code Formatter</h2>
          <Link href="/tools/code-formatter" className="inline-flex px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold rounded-xl">Open Formatter</Link>
        </div>
      </section>
    </article>
  )
}
