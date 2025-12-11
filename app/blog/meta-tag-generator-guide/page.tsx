import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Meta Tag Guide - SEO Tags Explained | AI AutoSite',
  description: 'Learn about meta tags, Open Graph, and Twitter cards for better SEO and social sharing.',
  keywords: 'meta tag guide, seo tags, open graph, twitter card',
}

export default function MetaTagGeneratorGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">Dev Tools</span>
        <h1 className="text-4xl font-bold text-white my-6">Meta Tags Complete Guide</h1>
        <p className="text-xl text-gray-300">Learn about SEO meta tags, Open Graph, and Twitter cards.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Essential Meta Tags</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="p-2 bg-gray-800/50 rounded"><code className="text-indigo-400">&lt;title&gt;</code> - Page title (50-60 chars)</div>
            <div className="p-2 bg-gray-800/50 rounded"><code className="text-indigo-400">meta description</code> - Summary (150-160 chars)</div>
            <div className="p-2 bg-gray-800/50 rounded"><code className="text-indigo-400">og:image</code> - Social sharing image (1200x630)</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-8 text-center">
          <Code className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Generator</h2>
          <Link href="/tools/meta-tag-generator" className="inline-flex px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl">Open Meta Tag Generator</Link>
        </div>
      </section>
    </article>
  )
}
