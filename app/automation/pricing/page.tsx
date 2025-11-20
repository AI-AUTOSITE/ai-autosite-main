// app/automation/pricing/page.tsx
import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'
import { Check, X, ArrowRight, Zap, Coffee, Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transparent Pricing for Automation Solutions | AI AutoSite',
  description: 'Clear, honest pricing for chatbot development and automation consulting. No hidden costs. Compare all options side-by-side.',
}

export default function AutomationPricingPage() {
  const pricingPlans = [
    {
      id: 'rule-based',
      name: 'Rule-Based Chatbot',
      icon: <Coffee className="w-8 h-8" />,
      description: 'Perfect for straightforward FAQ and appointment booking',
      priceRange: '$3,000 - $8,000',
      specialPrice: '$2,800',
      timeline: '3-5 weeks',
      monthlyMaintenance: '$200/month',
      color: 'from-gray-500 to-gray-600',
      features: [
        'Decision tree logic',
        'Button-based navigation',
        'Pre-defined responses',
        'Calendar integration',
        'QR code generation',
        'Fast response (<0.1s)',
        'No AI costs',
        'Easy updates'
      ],
      limitations: [
        'No natural language understanding',
        'Users must follow exact options',
        'Limited flexibility',
        'No learning capability'
      ],
      idealFor: [
        'Cafes & Restaurants',
        'Appointment booking',
        'FAQ handling',
        'Simple inquiries'
      ],
      hasDemo: true,
      demoUrl: '/automation/demos/cafe-chatbot',
      recommended: true
    },
    {
      id: 'hybrid',
      name: 'Hybrid Chatbot',
      icon: <Zap className="w-8 h-8" />,
      description: 'Best of both worlds - structured flow with AI flexibility',
      priceRange: '$15,000 - $35,000',
      specialPrice: null,
      timeline: '6-10 weeks',
      monthlyMaintenance: '$650/month',
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Rule-based + AI combination',
        'Natural language fallback',
        'Smart routing',
        'Context awareness',
        'Multiple integrations',
        'Analytics dashboard',
        'A/B testing capability',
        'Multi-language support'
      ],
      limitations: [
        'Higher monthly costs',
        'More complex setup',
        'Requires fine-tuning',
        'API dependencies'
      ],
      idealFor: [
        'Medium businesses',
        'Customer service',
        'Sales support',
        'Complex workflows'
      ],
      hasDemo: false,
      comingSoon: true
    },
    {
      id: 'ai-powered',
      name: 'AI-Powered Chatbot',
      icon: <Brain className="w-8 h-8" />,
      description: 'Full AI capabilities with advanced natural language understanding',
      priceRange: '$25,000 - $60,000',
      specialPrice: null,
      timeline: '8-14 weeks',
      monthlyMaintenance: '$1,100/month',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Full Claude/GPT integration',
        'Natural conversations',
        'Context memory',
        'Sentiment analysis',
        'Predictive responses',
        'Voice capabilities',
        'Custom training',
        'Advanced analytics'
      ],
      limitations: [
        'Highest monthly costs',
        'Complex implementation',
        'Requires monitoring',
        'Token usage costs'
      ],
      idealFor: [
        'Enterprise clients',
        'Complex support',
        'Sales automation',
        'Virtual assistants'
      ],
      hasDemo: false,
      comingSoon: true
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              No hidden costs. No surprises. Every expense disclosed upfront with 
              3-year total cost projections.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium">
              <span>🎯</span>
              <span>First 5 Clients: Save $1,700 on Rule-Based Chatbot</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all ${
                  plan.recommended ? 'ring-4 ring-emerald-500 ring-opacity-50' : ''
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
                    RECOMMENDED
                  </div>
                )}

                {/* Coming Soon Badge */}
                {plan.comingSoon && (
                  <div className="absolute top-0 right-0 bg-gray-500 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
                    COMING SOON
                  </div>
                )}

                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>
                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${plan.color} bg-opacity-10 rounded-lg text-gray-700`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6">
                    {plan.specialPrice ? (
                      <>
                        <div className="text-3xl font-bold text-emerald-600">
                          {plan.specialPrice}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          Regular: {plan.priceRange}
                        </div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {plan.priceRange}
                      </div>
                    )}
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        ⏱️ Delivery: {plan.timeline}
                      </p>
                      <p className="text-sm text-gray-600">
                        💰 Maintenance: {plan.monthlyMaintenance}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.features.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{plan.features.length - 5} more features
                      </p>
                    )}
                  </div>

                  {/* Limitations */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Limitations</h4>
                    <ul className="space-y-2">
                      {plan.limitations.slice(0, 3).map((limitation, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">Ideal For</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.idealFor.map((use, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {plan.hasDemo ? (
                    <Link
                      href={plan.demoUrl!}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      Try Live Demo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  ) : plan.comingSoon ? (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Cost Breakdown */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              3-Year Total Cost Comparison
            </h2>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">
                      Cost Component
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-900">
                      Rule-Based
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-900">
                      Hybrid
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-900">
                      AI-Powered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-700">Initial Development</td>
                    <td className="text-center px-6 py-4">$2,800 - $8,000</td>
                    <td className="text-center px-6 py-4">$15,000 - $35,000</td>
                    <td className="text-center px-6 py-4">$25,000 - $60,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-700">Monthly Maintenance</td>
                    <td className="text-center px-6 py-4">$200</td>
                    <td className="text-center px-6 py-4">$650</td>
                    <td className="text-center px-6 py-4">$1,100</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-700">3-Year Maintenance Total</td>
                    <td className="text-center px-6 py-4">$7,200</td>
                    <td className="text-center px-6 py-4">$23,400</td>
                    <td className="text-center px-6 py-4">$39,600</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold">
                    <td className="px-6 py-4 text-gray-900">3-Year Total Cost</td>
                    <td className="text-center px-6 py-4 text-emerald-600">
                      $10,000 - $15,200
                    </td>
                    <td className="text-center px-6 py-4 text-blue-600">
                      $38,400 - $58,400
                    </td>
                    <td className="text-center px-6 py-4 text-purple-600">
                      $64,600 - $99,600
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">
                💡 First 5 Clients Special
              </h3>
              <p className="text-amber-800">
                Save $1,700 on Rule-Based Chatbot development. 
                3-year total becomes just $10,000 (vs $15,200 regular).
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Transparency Promise */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Transparency Promise
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <div className="text-2xl mb-3">💰</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  No Hidden Costs
                </h3>
                <p className="text-gray-600">
                  Every API call, hosting fee, and maintenance cost disclosed upfront. 
                  No surprise charges ever.
                </p>
              </div>

              <div className="text-left">
                <div className="text-2xl mb-3">🔍</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  API Pass-Through Pricing
                </h3>
                <p className="text-gray-600">
                  We charge exactly what providers charge us for API usage. 
                  Zero markup on third-party costs.
                </p>
              </div>

              <div className="text-left">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Weekly Progress Reports
                </h3>
                <p className="text-gray-600">
                  Every Friday, detailed update on progress, next steps, and any blockers. 
                  Complete transparency.
                </p>
              </div>

              <div className="text-left">
                <div className="text-2xl mb-3">📖</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  You Own Everything
                </h3>
                <p className="text-gray-600">
                  All code, documentation, and IP belongs to you. 
                  No vendor lock-in, ever.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join our First 5 Clients and save $1,700 on your chatbot development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/automation/first-5-clients"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 bg-white rounded-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Claim Your Spot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/automation/demos/cafe-chatbot"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Try Demo First
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}