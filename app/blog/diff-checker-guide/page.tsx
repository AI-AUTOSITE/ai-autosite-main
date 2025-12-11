import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, GitCompare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Diff Checker Guide - Compare Text Online | AI AutoSite',
  description: 'Learn how to compare texts and find differences with our free online diff checker tool.',
  keywords: 'diff checker guide, text compare, find differences, code diff',
}

export default function DiffCheckerGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">Dev Tools</span>
        <h1 className="text-4xl font-bold text-white my-6">Diff Checker Complete Guide</h1>
        <p className="text-xl text-gray-300">Compare texts and find differences instantly with our browser-based tool.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">What is a Diff Checker?</h2>
          <p className="text-gray-300">A diff checker compares two texts and highlights the differences between them. Its essential for code review, document comparison, and version control.</p>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">View Modes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-violet-500/10 rounded-lg"><strong className="text-violet-400">Side by Side:</strong><p className="text-gray-400 text-sm">See both texts with aligned differences</p></div>
            <div className="p-4 bg-purple-500/10 rounded-lg"><strong className="text-purple-400">Unified:</strong><p className="text-gray-400 text-sm">Compact view with +/- markers</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl p-8 text-center">
          <GitCompare className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Diff Checker</h2>
          <Link href="/tools/diff-checker" className="inline-flex px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl">Open Diff Checker</Link>
        </div>
      </section>
    </article>
  )
}
