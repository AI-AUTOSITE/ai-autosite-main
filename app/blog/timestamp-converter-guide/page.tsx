import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Clock, Globe, MessageSquare, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Unix Timestamp Guide - Convert Epoch Time | AI AutoSite',
  description:
    'Learn about Unix timestamps, epoch time, and how to convert between timestamps and human-readable dates. Includes timezone handling and Discord timestamp codes.',
  keywords:
    'unix timestamp guide, epoch time, timestamp converter, date conversion, timezone, discord timestamp',
  openGraph: {
    title: 'Unix Timestamp Converter - Complete Guide',
    description: 'Master Unix timestamps with our comprehensive guide and free converter tool',
    type: 'article',
  },
}

export default function TimestampConverterGuidePage() {
  const publishDate = '2025-12-04'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

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
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Converters</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Unix Timestamp Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Understand Unix timestamps, epoch time, and master date conversions across timezones.
          Plus: Discord and Slack timestamp formatting.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Unix Timestamp */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a Unix Timestamp?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A Unix timestamp (also called Epoch time or POSIX time) represents the number of seconds
              that have elapsed since January 1, 1970, at 00:00:00 UTC. This date is known as the Unix Epoch.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-cyan-400 text-center text-2xl">
              1701648000
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center">
              Example: December 4, 2023 00:00:00 UTC
            </p>
          </div>
        </div>

        {/* Seconds vs Milliseconds */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Seconds vs Milliseconds</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Different systems use different precisions. The key is to count the digits:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <div className="font-mono text-cyan-400 text-lg mb-2">1701648000</div>
                <p className="text-white font-medium">10 digits = Seconds</p>
                <p className="text-gray-400 text-sm">Used by: Unix/Linux, Python, PHP</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="font-mono text-purple-400 text-lg mb-2">1701648000000</div>
                <p className="text-white font-medium">13 digits = Milliseconds</p>
                <p className="text-gray-400 text-sm">Used by: JavaScript, Java</p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">API Responses</h3>
                  <p className="text-gray-400 text-sm">APIs often return timestamps for created_at, updated_at fields</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Log Analysis</h3>
                  <p className="text-gray-400 text-sm">Server logs use timestamps for event tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Database Storage</h3>
                  <p className="text-gray-400 text-sm">Timestamps are timezone-agnostic and sortable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discord Timestamps */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            Discord Timestamp Codes
          </h2>
          <div className="bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/20">
            <p className="text-gray-300 mb-4">
              Discord supports dynamic timestamps that automatically adjust to each user&apos;s timezone.
              Use the format: <code className="text-indigo-400">&lt;t:TIMESTAMP:FORMAT&gt;</code>
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <code className="text-indigo-400 font-mono">&lt;t:1701648000:F&gt;</code>
                <span className="text-gray-400 text-sm">Thursday, December 4, 2023 12:00 AM</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <code className="text-indigo-400 font-mono">&lt;t:1701648000:R&gt;</code>
                <span className="text-gray-400 text-sm">2 months ago (relative)</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <code className="text-indigo-400 font-mono">&lt;t:1701648000:d&gt;</code>
                <span className="text-gray-400 text-sm">12/04/2023 (short date)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-8 border border-cyan-500/30 text-center">
          <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Timestamp Converter</h2>
          <p className="text-gray-300 mb-6">
            Convert timestamps instantly with auto-detection, timezone support, and Discord formatters.
          </p>
          <Link
            href="/tools/timestamp-converter"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Open Timestamp Converter
          </Link>
        </div>

        {/* Code Examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Get Current Timestamp (Code)</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">JavaScript</h3>
              <pre className="p-3 bg-gray-800/50 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
{`// Milliseconds
Date.now()

// Seconds
Math.floor(Date.now() / 1000)`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Python</h3>
              <pre className="p-3 bg-gray-800/50 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
{`import time
time.time()  # Seconds as float`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Bash</h3>
              <pre className="p-3 bg-gray-800/50 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
{`date +%s  # Seconds`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Written by {author} • Last updated {publishDate}
        </p>
      </footer>
    </article>
  )
}
