// app/automation/first-5-clients/page.tsx
'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'
import { Check, Clock, Shield, Users, ArrowRight, AlertCircle } from 'lucide-react'

// メタデータはexportできないので、別ファイルで定義する必要があります
// export const metadata: Metadata = {
//   title: 'First 5 Clients Special Offer | AI AutoSite',
//   description: 'Building my portfolio - Get $1,700 off custom chatbot development. 60-day money-back guarantee. Limited to 5 clients.',
// }

export default function First5ClientsPage() {
  const [spotsRemaining, setRemainingSpots] = useState(5)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    website: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: APIエンドポイントに送信
    try {
      const response = await fetch('/api/automation/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        // 成功ページへリダイレクト
        window.location.href = '/automation/thank-you'
      }
    } catch (error) {
      console.error('申し込みエラー:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="absolute inset-0 bg-grid-gray-100 bg-grid opacity-5"></div>
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-amber-800 bg-amber-100 rounded-full animate-pulse">
              <Clock className="w-4 h-4" />
              <span>Limited Time Offer - {spotsRemaining} Spots Remaining</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              First 5 Clients
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Special Launch Pricing
              </span>
            </h1>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">$2,800</div>
                <div className="text-sm text-gray-600">Launch Price</div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl text-gray-400">vs</span>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 line-through">$4,500</div>
                <div className="text-sm text-gray-600">Regular Price</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-green-800 bg-green-100 rounded-lg">
              <span>You Save:</span>
              <span className="text-2xl">$1,700</span>
              <span className="text-sm">(38% OFF)</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Honest Explanation */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="p-8 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <h2 className="mb-4 text-2xl font-bold text-blue-900">
                🎯 Why This Special Offer? (Full Transparency)
              </h2>
              <div className="space-y-4 text-blue-800">
                <p>
                  I'll be completely honest with you - I'm building my portfolio as an automation consultant.
                </p>
                <div className="pl-4 space-y-2">
                  <p>✓ I need 5 detailed case studies with real results</p>
                  <p>✓ I need video testimonials from satisfied clients</p>
                  <p>✓ I need to prove my system works at scale</p>
                  <p>✓ I need real-world feedback to refine my process</p>
                </div>
                <p className="font-semibold">
                  In exchange for your trust and feedback, you get the same quality service at 38% off, 
                  plus extra benefits that regular clients won't receive.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">
              What First 5 Clients Receive
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Regular Package */}
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Regular Package ($4,500)
                </div>
                <ul className="space-y-3">
                  {[
                    'Custom chatbot development',
                    'Basic integrations',
                    '30-day support',
                    '3 revisions',
                    'Documentation',
                    'Training session'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* First 5 Package */}
              <div className="relative p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border-2 border-orange-200">
                <div className="absolute -top-3 -right-3 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                  BEST VALUE
                </div>
                <div className="mb-4 text-sm font-semibold text-orange-700 uppercase tracking-wider">
                  First 5 Package ($2,800)
                </div>
                <ul className="space-y-3">
                  {[
                    { text: 'Everything in Regular Package', bold: false },
                    { text: '60-day money-back guarantee', bold: true },
                    { text: '2 months support (vs 1 month)', bold: true },
                    { text: 'Unlimited revisions', bold: true },
                    { text: 'Priority development queue', bold: true },
                    { text: 'Weekly progress calls', bold: true },
                    { text: 'Direct access to me (no middleman)', bold: true },
                    { text: 'Future updates at 50% off', bold: true }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className={`${item.bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Risk Reversal */}
      <section className="py-16 bg-green-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-green-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              60-Day Money-Back Guarantee
            </h2>
            <p className="mb-8 text-lg text-gray-600 max-w-2xl mx-auto">
              I'm so confident in the value I deliver that I offer a full refund within 60 days 
              if you're not completely satisfied. No questions asked. You keep all the code and documentation.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Refund</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">60</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Risk</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
              Apply for First 5 Client Spot
            </h2>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Limited Availability</p>
                  <p>Only {spotsRemaining} spots remaining. Applications are reviewed in order received.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business"
                  required
                  value={formData.business}
                  onChange={(e) => setFormData({...formData, business: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Blue Moon Cafe"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell me about your automation needs *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="What problems are you trying to solve? What would success look like?"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Claim My Spot
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-sm text-center text-gray-500">
                  By applying, you agree to our{' '}
                  <Link href="/terms-of-service" className="text-emerald-600 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Why is it so much cheaper than regular pricing?',
                  a: 'I\'m building my portfolio and need case studies. You get the same quality service, just at a discounted rate in exchange for feedback and testimonials.'
                },
                {
                  q: 'What happens after the first 5 clients?',
                  a: 'Pricing returns to regular rates ($4,500+). As a First 5 client, you\'ll get 50% off any future projects.'
                },
                {
                  q: 'How long does development take?',
                  a: 'Most projects are completed within 3-5 weeks. Complex integrations may take up to 8 weeks.'
                },
                {
                  q: 'What if I\'m not satisfied?',
                  a: '60-day money-back guarantee. If you\'re not happy, you get a full refund and keep all deliverables.'
                },
                {
                  q: 'Do I need technical knowledge?',
                  a: 'Not at all. I handle everything technical and provide training on how to manage your chatbot.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <Users className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h2 className="mb-4 text-3xl font-bold">
              Only {spotsRemaining} Spots Remaining
            </h2>
            <p className="mb-8 text-lg text-amber-100">
              Once these spots are filled, pricing goes back to $4,500
            </p>
            <a
              href="#application"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-amber-700 bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Apply Now Before It's Too Late
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}