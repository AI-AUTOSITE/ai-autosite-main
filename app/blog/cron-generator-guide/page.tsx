import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cron Expression Guide - Build Cron Jobs | AI AutoSite',
  description: 'Learn how to create cron expressions for scheduling tasks. Complete guide with examples.',
  keywords: 'cron guide, crontab, cron expression, scheduled tasks',
}

export default function CronGeneratorGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">Dev Tools</span>
        <h1 className="text-4xl font-bold text-white my-6">Cron Expression Complete Guide</h1>
        <p className="text-xl text-gray-300">Learn how to create and understand cron expressions for scheduling tasks.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Cron Format</h2>
          <pre className="p-4 bg-gray-800/50 rounded-lg font-mono text-amber-400 text-sm overflow-x-auto">
{`┌───── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─ day of month (1-31)
│ │ │ ┌ month (1-12)
│ │ │ │ ┌ day of week (0-6)
* * * * *`}
          </pre>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Common Examples</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between p-2 bg-gray-800/30 rounded"><span className="text-amber-400">0 9 * * 1-5</span><span className="text-gray-400">Weekdays at 9am</span></div>
            <div className="flex justify-between p-2 bg-gray-800/30 rounded"><span className="text-amber-400">*/15 * * * *</span><span className="text-gray-400">Every 15 minutes</span></div>
            <div className="flex justify-between p-2 bg-gray-800/30 rounded"><span className="text-amber-400">0 0 1 * *</span><span className="text-gray-400">First of month</span></div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-8 text-center">
          <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Cron Generator</h2>
          <Link href="/tools/cron-generator" className="inline-flex px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl">Open Cron Generator</Link>
        </div>
      </section>
    </article>
  )
}
