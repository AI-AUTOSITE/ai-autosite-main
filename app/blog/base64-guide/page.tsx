import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Code, Shield, Database, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Base64 Encoding Guide - What, Why & How | AI AutoSite',
  description:
    'Learn about Base64 encoding. Understand when to use it, how it works, and common use cases for developers.',
  keywords: 'base64 encoding, base64 decoder, data encoding, api development, email attachments',
  openGraph: {
    title: 'Complete Guide to Base64 Encoding',
    description: 'Everything developers need to know about Base64',
    type: 'article',
  },
}

export default function Base64GuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

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
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
            Development
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Base64 Encoding: The Developer's Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Everything you need to know about Base64 encoding. Learn when to use it, how it works, and
          common pitfalls to avoid.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Base64 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is Base64?</h2>
          <p className="text-gray-300 mb-4">
            Base64 is an encoding scheme that converts binary data into ASCII text format. It uses
            64 characters (A-Z, a-z, 0-9, +, /) to represent data, making it safe to transmit
            through systems that only support text.
          </p>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-2">Example:</p>
            <code className="text-cyan-400">Hello World</code>
            <span className="text-gray-500 mx-2">→</span>
            <code className="text-green-400">SGVsbG8gV29ybGQ=</code>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Database className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">API Data Transfer</h3>
              <p className="text-gray-400 text-sm">
                Send binary data in JSON APIs where only text is allowed
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Mail className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Email Attachments</h3>
              <p className="text-gray-400 text-sm">Embed files in emails using MIME encoding</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Code className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Data URLs</h3>
              <p className="text-gray-400 text-sm">
                Embed images directly in HTML/CSS without external files
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Shield className="w-8 h-8 text-orange-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Basic Auth Headers</h3>
              <p className="text-gray-400 text-sm">
                HTTP Basic Authentication uses Base64 for credentials
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How Base64 Works</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium">Convert to binary</p>
                <p className="text-gray-400 text-sm mt-1">
                  Each character becomes 8-bit binary (ASCII values)
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium">Group into 6-bit chunks</p>
                <p className="text-gray-400 text-sm mt-1">
                  Binary is regrouped from 8-bit to 6-bit segments
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-pink-500/20 text-pink-400 rounded-lg flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium">Map to Base64 characters</p>
                <p className="text-gray-400 text-sm mt-1">
                  Each 6-bit value maps to a character in the Base64 alphabet
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <p className="text-white font-medium">Add padding if needed</p>
                <p className="text-gray-400 text-sm mt-1">
                  '=' characters pad the output to make it divisible by 4
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Code Examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Code Examples</h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">JavaScript:</p>
              <pre className="text-cyan-400 text-sm overflow-x-auto">
                {`// Encode
const encoded = btoa('Hello World')

// Decode  
const decoded = atob('SGVsbG8gV29ybGQ=')`}
              </pre>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Python:</p>
              <pre className="text-cyan-400 text-sm overflow-x-auto">
                {`import base64

# Encode
encoded = base64.b64encode(b'Hello World')

# Decode
decoded = base64.b64decode('SGVsbG8gV29ybGQ=')`}
              </pre>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Important to Remember</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⚠️</span>
                <p className="text-gray-300">
                  <strong className="text-white">Not encryption:</strong> Base64 is encoding, not
                  encryption. Anyone can decode it.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">📈</span>
                <p className="text-gray-300">
                  <strong className="text-white">Size increase:</strong> Base64 increases size by
                  ~33% due to the encoding overhead.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <p className="text-gray-300">
                  <strong className="text-white">URL-safe variant:</strong> Use URL-safe Base64 for
                  URLs (replaces +/ with -_).
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">🔍</span>
                <p className="text-gray-300">
                  <strong className="text-white">Character set:</strong> Only uses ASCII characters,
                  safe for any text system.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Try Base64 Encoder/Decoder</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free online Base64 tool. Encode and decode text, files, and images instantly.
        </p>
        <Link
          href="/tools/base64"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Code className="mr-2" size={20} />
          Try Base64 Tool
        </Link>
      </section>
    </article>
  )
}
