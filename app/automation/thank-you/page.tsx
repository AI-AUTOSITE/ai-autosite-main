// app/automation/thank-you/page.tsx
import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'
import { CheckCircle, Calendar, Mail, ArrowRight, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Application Received - Thank You | AI AutoSite',
  description: 'Thank you for applying to our First 5 Clients program. We\'ll be in touch within 24 hours.',
  robots: {
    index: false,
    follow: false
  }
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Success Hero */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 inline-flex">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Application Received!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Thank you for applying to our First 5 Clients program.
              You've taken the first step toward transforming your business with automation.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
              <span className="text-2xl">🎉</span>
              <span>You're in the queue for special pricing!</span>
            </div>
          </div>
        </Container>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What Happens Next?
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Application Review
                  </h3>
                  <p className="text-gray-600">
                    I'll review your application within the next 24 hours and assess how 
                    I can best help automate your business processes.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>Check your email within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Discovery Call
                  </h3>
                  <p className="text-gray-600">
                    We'll schedule a 60-minute discovery call to discuss your specific needs, 
                    current challenges, and desired outcomes.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Flexible scheduling options available</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Custom Proposal
                  </h3>
                  <p className="text-gray-600">
                    Based on our discussion, I'll create a detailed proposal with timeline, 
                    features, and the special First 5 Clients pricing.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>No obligation to proceed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* While You Wait */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              While You Wait...
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Try the Demo */}
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Try Our Demo
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Experience our cafe chatbot demo to see what's possible for your business.
                </p>
                <Link
                  href="/automation/demos/cafe-chatbot"
                  className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                >
                  Try Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Learn About Pricing */}
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Understand Pricing
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  See our transparent pricing structure and what's included in each package.
                </p>
                <Link
                  href="/automation/pricing"
                  className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                >
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Explore Tools */}
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Explore Our Tools
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Check out our 50+ free tools to see our technical capabilities.
                </p>
                <Link
                  href="/tools"
                  className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                >
                  Browse Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Important Reminders */}
      <section className="py-16 bg-amber-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Important Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Check Your Email</p>
                    <p className="text-sm text-gray-600">
                      You should receive a confirmation email shortly. Check spam if you don't see it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">No Payment Required Now</p>
                    <p className="text-sm text-gray-600">
                      You won't be asked for payment until after we've agreed on a proposal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">60-Day Guarantee</p>
                    <p className="text-sm text-gray-600">
                      Remember, all First 5 Clients get a 60-day money-back guarantee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Questions?</p>
                    <p className="text-sm text-gray-600">
                      Feel free to reply to the confirmation email with any questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <Container>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Can't wait to get started?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/automation/demos/cafe-chatbot"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Try the Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/automation"
                className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Automation Hub
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}