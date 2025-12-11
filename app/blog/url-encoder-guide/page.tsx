import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Link2, Zap, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'URL Encoding Guide - Percent Encoding Explained | AI AutoSite',
  description:
    'Learn about URL encoding, percent encoding, and when to use encodeURI vs encodeURIComponent. Complete guide with examples.',
  keywords:
    'url encoding guide, percent encoding, encodeURIComponent, encodeURI, query string encoding',
  openGraph: {
    title: 'URL Encoding - Complete Guide',
    description: 'Master URL encoding with our comprehensive guide',
    type: 'article',
  },
}

export default function UrlEncoderGuidePage() {
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
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">Converters</span>
          <span>•</span>
          <time>2025-12-04</time>
          <span>•</span>
          <span>4 min read</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          URL Encoding Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Understand percent encoding and learn when to use encodeURI vs encodeURIComponent.
        </p>
      </header>

      <section className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is URL Encoding?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              URL encoding (percent encoding) replaces unsafe characters with a % followed by their hex value.
              This ensures URLs are valid and can be transmitted safely.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono">
              <div className="text-gray-400 text-sm mb-2">Original:</div>
              <div className="text-white mb-3">hello world & goodbye</div>
              <div className="text-gray-400 text-sm mb-2">Encoded:</div>
              <div className="text-emerald-400">hello%20world%20%26%20goodbye</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">encodeURI vs encodeURIComponent</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <h3 className="text-cyan-400 font-medium mb-2">encodeURI</h3>
                <p className="text-gray-300 text-sm mb-2">For complete URLs</p>
                <p className="text-gray-400 text-xs">Preserves: ; / ? : @ & = + $ , #</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <h3 className="text-emerald-400 font-medium mb-2">encodeURIComponent</h3>
                <p className="text-gray-300 text-sm mb-2">For query parameter values</p>
                <p className="text-gray-400 text-xs">Encodes ALL special characters</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            Avoid Double Encoding
          </h2>
          <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
            <p className="text-gray-300 mb-4">
              A common mistake is encoding an already-encoded string, turning <code className="text-yellow-400">%20</code> into <code className="text-yellow-400">%2520</code>.
            </p>
            <p className="text-gray-400 text-sm">
              Always decode first if you&apos;re unsure whether input is already encoded.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-8 border border-emerald-500/30 text-center">
          <Link2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our URL Encoder</h2>
          <p className="text-gray-300 mb-6">
            Smart encoding detection, URL parser, and query string builder.
          </p>
          <Link
            href="/tools/url-encoder"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Open URL Encoder
          </Link>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Written by AI AutoSite Team • Last updated 2025-12-04
        </p>
      </footer>
    </article>
  )
}
