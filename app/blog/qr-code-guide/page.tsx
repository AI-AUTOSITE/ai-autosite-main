import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, QrCode, Download, Smartphone, Store } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free QR Code Generator - Complete Guide 2025 | AI AutoSite Blog',
  description:
    'Learn how to create QR codes for your business, restaurant menu, or personal use. Free online QR code maker with instant download.',
  keywords:
    'qr code generator, free qr code, qr code maker, how to make qr code, qr code for business',
  openGraph: {
    title: 'How to Create QR Codes - Free Generator Guide',
    description:
      'Everything you need to know about creating QR codes for business and personal use',
    type: 'article',
  },
}

export default function QRCodeGuidePage() {
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
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          How to Create QR Codes in 2025 - Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Everything you need to know about creating QR codes for business, events, and personal
          use. Learn the best practices and common use cases.
        </p>
      </header>

      <section className="space-y-12">
        {/* Introduction */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a QR Code?</h2>
          <p className="text-gray-300 mb-4">
            QR (Quick Response) codes are two-dimensional barcodes that can store various types of
            information. When scanned with a smartphone camera, they instantly connect users to
            websites, menus, contact info, or any text data.
          </p>
          <p className="text-gray-300">
            In 2025, QR codes are everywhere - from restaurant menus to business cards, event
            tickets to WiFi passwords. They've become essential for contactless interactions and
            quick information sharing.
          </p>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Popular QR Code Uses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Store className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Restaurant Menus</h3>
              <p className="text-gray-400 text-sm">
                Digital menus that update instantly. No printing costs, always current prices.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Smartphone className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Business Cards</h3>
              <p className="text-gray-400 text-sm">
                Share contact info instantly. One scan adds you to their phone contacts.
              </p>
            </div>
          </div>
        </div>

        {/* How to Create */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Create a QR Code</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium">Enter your content</p>
                <p className="text-gray-400 text-sm mt-1">
                  Type or paste any text, URL, or information up to 2000 characters.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium">Choose your size</p>
                <p className="text-gray-400 text-sm mt-1">
                  Select Small (256px), Medium (512px), or Large (1024px) based on your needs.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium">Download and use</p>
                <p className="text-gray-400 text-sm mt-1">
                  Click download to save as PNG. Print or share digitally.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Test before printing:</strong> Always scan your QR
                code before using it publicly
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Size matters:</strong> Minimum 2x2 cm for print,
                larger for posters
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">High contrast:</strong> Black on white works best for
                scanning
              </p>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Questions</h2>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2">Do QR codes expire?</p>
              <p className="text-gray-400">
                No, QR codes don't expire. Once created, they work forever as long as the linked
                content exists.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">How much data can a QR code hold?</p>
              <p className="text-gray-400">
                Up to 2,953 bytes (about 2000 characters). Enough for most URLs, contact info, or
                short messages.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Can I track QR code scans?</p>
              <p className="text-gray-400">
                Static QR codes (like ours) can't be tracked. For analytics, you'd need dynamic QR
                codes with redirect URLs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Create Your QR Code Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free, instant, no signup required. Create unlimited QR codes for your business or personal
          use.
        </p>
        <Link
          href="/tools/qr-code"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <QrCode className="mr-2" size={20} />
          Try QR Code Maker
        </Link>
      </section>
    </article>
  )
}
