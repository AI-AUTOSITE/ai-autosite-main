import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, MessageCircle, Link2, Phone, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'WhatsApp Link Generator - Create Click-to-Chat Links | AI AutoSite',
  description: 'Create WhatsApp chat links without saving numbers. Generate click-to-chat links for business and personal use. Free WhatsApp link creator.',
  keywords: 'whatsapp link generator, whatsapp chat link, click to chat whatsapp, wa.me link generator, whatsapp business link',
  openGraph: {
    title: 'WhatsApp Link Generator - Click to Chat Guide',
    description: 'Create instant WhatsApp chat links for your business',
    type: 'article',
  },
}

export default function WhatsappLinkGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full">
            Business Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          WhatsApp Link Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Create direct WhatsApp chat links for your business. Let customers 
          message you without saving your number first.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is a WhatsApp Link */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a WhatsApp Link?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A WhatsApp link (wa.me link) lets anyone start a chat with you without 
              having to save your phone number first. Perfect for businesses and customer support.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-green-500 text-sm">
              https://wa.me/1234567890?text=Hello
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <MessageCircle className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="text-white font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-400 text-sm">
                Quick support access from website
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Marketing</h3>
              <p className="text-gray-400 text-sm">
                Social media and email campaigns
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Phone className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Sales</h3>
              <p className="text-gray-400 text-sm">
                Direct inquiries from ads
              </p>
            </div>
          </div>
        </div>

        {/* Where to Use */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Where to Use WhatsApp Links</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Platform</th>
                  <th className="text-white pb-3">How to Use</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-500">Website</td>
                  <td className="py-3">Add as floating chat button</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-500">Instagram</td>
                  <td className="py-3">Bio link or story swipe-up</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-500">Email</td>
                  <td className="py-3">Signature or CTA button</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-500">Facebook</td>
                  <td className="py-3">Page button or posts</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-500">QR Code</td>
                  <td className="py-3">Print materials and stores</td>
                </tr>
                <tr>
                  <td className="py-3 text-green-500">Google Ads</td>
                  <td className="py-3">Landing page CTA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pre-filled Messages */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pre-filled Message Examples</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="border-b border-white/10 pb-2">
                <p className="text-white font-semibold mb-1">E-commerce:</p>
                <p className="text-gray-400 text-sm">"Hi! I'm interested in [product name]. Is it available?"</p>
              </li>
              <li className="border-b border-white/10 pb-2">
                <p className="text-white font-semibold mb-1">Service Business:</p>
                <p className="text-gray-400 text-sm">"Hello! I'd like to book an appointment for [service]"</p>
              </li>
              <li className="border-b border-white/10 pb-2">
                <p className="text-white font-semibold mb-1">Restaurant:</p>
                <p className="text-gray-400 text-sm">"Hi! I'd like to make a reservation for [date]"</p>
              </li>
              <li>
                <p className="text-white font-semibold mb-1">Support:</p>
                <p className="text-gray-400 text-sm">"Hello! I need help with my order #[order number]"</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">WhatsApp Link Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p className="text-gray-300">
                  Include country code in phone number
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p className="text-gray-300">
                  Keep pre-filled messages short and relevant
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p className="text-gray-300">
                  Test links on both mobile and desktop
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <p className="text-gray-300">
                  Use URL shorteners for cleaner links
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Create Your WhatsApp Link
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free WhatsApp link generator with pre-filled message templates.
        </p>
        <Link 
          href="/tools/whatsapp-link" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <MessageCircle className="mr-2" size={20} />
          Generate WhatsApp Link
        </Link>
      </section>
    </article>
  )
}