import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Word Counter Pro Guide - Text Analysis Tips | AI AutoSite',
  description: 'Learn to use Word Counter Pro for text analysis, readability scoring, and social media character limits.',
  keywords: 'word counter guide, text analysis, readability score, character limits',
}

export default function WordCounterProGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-full text-sm">Converters</span>
        <h1 className="text-4xl font-bold text-white my-6">Word Counter Pro Complete Guide</h1>
        <p className="text-xl text-gray-300">Master text analysis for content creation and social media.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Social Media Character Limits</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-gray-800/50 rounded-lg"><span className="text-sky-400">Twitter/X:</span> 280 chars</div>
            <div className="p-3 bg-gray-800/50 rounded-lg"><span className="text-pink-400">Instagram:</span> 2,200 chars</div>
            <div className="p-3 bg-gray-800/50 rounded-lg"><span className="text-blue-400">LinkedIn:</span> 3,000 chars</div>
            <div className="p-3 bg-gray-800/50 rounded-lg"><span className="text-red-400">YouTube:</span> 5,000 chars</div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Readability Scores</h2>
          <p className="text-gray-300 mb-4">The Flesch Reading Ease score helps you write for your audience:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-green-400">80-100:</span> Very Easy (5th grade)</div>
            <div className="flex justify-between"><span className="text-emerald-400">60-79:</span> Easy (6-8th grade)</div>
            <div className="flex justify-between"><span className="text-yellow-400">40-59:</span> Medium (9-12th grade)</div>
            <div className="flex justify-between"><span className="text-orange-400">20-39:</span> Difficult (College)</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Word Counter Pro</h2>
          <Link href="/tools/word-counter-pro" className="inline-flex px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold rounded-xl">Open Tool</Link>
        </div>
      </section>
    </article>
  )
}
