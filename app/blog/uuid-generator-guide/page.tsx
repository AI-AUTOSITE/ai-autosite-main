import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Key, Shield, Copy, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'UUID Generator Online - Create Unique Identifiers | AI AutoSite',
  description: 'Generate UUIDs (Universally Unique Identifiers) for databases and applications. Create v1, v4 UUIDs instantly. Free UUID generator tool.',
  keywords: 'uuid generator, guid generator, unique id generator, uuid v4, universally unique identifier',
  openGraph: {
    title: 'UUID Generator - Unique Identifier Guide',
    description: 'Generate secure unique identifiers for your applications',
    type: 'article',
  },
}

export default function UuidGeneratorGuidePage() {
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
            Dev Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          UUID Generator Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Generate universally unique identifiers for databases, APIs, and 
          distributed systems. Understand UUID versions and best practices.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is UUID */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a UUID?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A UUID (Universally Unique Identifier) is a 128-bit number used to identify 
              information in computer systems. The probability of duplicates is negligible.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-purple-400 text-sm break-all">
              550e8400-e29b-41d4-a716-446655440000
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Format: 8-4-4-4-12 hexadecimal digits (36 characters total)
            </p>
          </div>
        </div>

        {/* UUID Versions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">UUID Versions Explained</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Version</th>
                  <th className="text-white pb-3">Based On</th>
                  <th className="text-white pb-3">Use Case</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">v1</td>
                  <td className="py-3">MAC + Timestamp</td>
                  <td className="py-3">When creation time matters</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">v3</td>
                  <td className="py-3">MD5 Hash</td>
                  <td className="py-3">Namespace + name (deprecated)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400">v4</td>
                  <td className="py-3">Random</td>
                  <td className="py-3">Most common, general use</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">v5</td>
                  <td className="py-3">SHA-1 Hash</td>
                  <td className="py-3">Namespace + name</td>
                </tr>
                <tr>
                  <td className="py-3 text-blue-400">v7</td>
                  <td className="py-3">Unix Timestamp</td>
                  <td className="py-3">Sortable by creation time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Where UUIDs Are Used</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Database className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Databases</h3>
              <p className="text-gray-400 text-sm">
                Primary keys in distributed systems
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Shield className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">API Keys</h3>
              <p className="text-gray-400 text-sm">
                Session tokens and API identifiers
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Key className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">File Systems</h3>
              <p className="text-gray-400 text-sm">
                Unique file and object identifiers
              </p>
            </div>
          </div>
        </div>

        {/* UUID vs Other IDs */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">UUID vs Other Identifiers</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Type</th>
                  <th className="text-white pb-3">Pros</th>
                  <th className="text-white pb-3">Cons</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">UUID</td>
                  <td className="py-3">Globally unique, no coordination</td>
                  <td className="py-3">128 bits, not human-readable</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Auto-increment</td>
                  <td className="py-3">Simple, sequential</td>
                  <td className="py-3">Not distributed-friendly</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Time-sortable</td>
                  <td className="py-3">Collision risk</td>
                </tr>
                <tr>
                  <td className="py-3">Snowflake ID</td>
                  <td className="py-3">Sortable, distributed</td>
                  <td className="py-3">Complex setup</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Generate UUID in Different Languages</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-purple-400 text-sm">{`// JavaScript
crypto.randomUUID() // Built-in browser/Node.js

// Python
import uuid
str(uuid.uuid4())

// Java
UUID.randomUUID().toString()

// C#
Guid.NewGuid().ToString()

// SQL (PostgreSQL)
SELECT gen_random_uuid();

// PHP
uniqid('', true);`}</code>
            </pre>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">UUID Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✅</span>
                <p className="text-gray-300">
                  Use UUID v4 for most applications
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✅</span>
                <p className="text-gray-300">
                  Store as binary(16) in databases, not varchar(36)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✅</span>
                <p className="text-gray-300">
                  Consider UUID v7 for time-ordered requirements
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✅</span>
                <p className="text-gray-300">
                  Index UUID columns appropriately
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✅</span>
                <p className="text-gray-300">
                  Validate UUID format before processing
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate UUIDs Instantly
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free UUID generator with bulk generation and format options.
        </p>
        <Link 
          href="/tools/uuid-generator" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Key className="mr-2" size={20} />
          Generate UUIDs
        </Link>
      </section>
    </article>
  )
}