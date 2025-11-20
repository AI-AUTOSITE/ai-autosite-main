// app/automation/page.tsx
import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'
import { ArrowRight, Coffee, Calendar, MessageSquare, QrCode, Clock, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Business Automation Consulting | AI AutoSite',
  description: 'Transform your business with custom chatbots and automation solutions. Live demos available. First 5 clients special pricing.',
  keywords: 'automation consulting, chatbot development, cafe automation, business automation, AI chatbot',
}

export default function AutomationPage() {
  const spotsRemaining = 5 // TODO: Vercel KVから取得

  return (
    <div className="overflow-x-hidden w-full">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute inset-0 bg-grid-gray-100 bg-grid opacity-5"></div>
        <Container>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Now Accepting First 5 Clients</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl leading-normal">
              Business Automation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 leading-normal">
                Consulting & Development
              </span>
            </h1>

            <p className="mx-auto mb-10 text-xl leading-relaxed text-gray-600 max-w-3xl">
              Start your automation revolution with cafes. 24/7 chatbots that work for you, 
              taking your business to the next level. Experience the value with live demos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/automation/demos/cafe-chatbot"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Try Live Demo
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/automation/first-5-clients"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 transition-all duration-200 bg-white border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Get Special Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">🛡️</span>
                <span>60-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">🚀</span>
                <span>3-5 Week Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">💰</span>
                <span>No Hidden Costs</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Special Offer Banner */}
      <section className="py-8 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-white">
              <h2 className="text-2xl font-bold">🎯 First 5 Clients Special Offer</h2>
              <p className="mt-1 text-yellow-50">
                Building my portfolio - Get $1,700 off regular pricing
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center text-white">
                <div className="text-3xl font-bold">${'2,800'}</div>
                <div className="text-sm line-through opacity-75">${'4,500'}</div>
              </div>
              <div className="px-6 py-3 text-lg font-bold text-amber-600 bg-white rounded-lg">
                {spotsRemaining} Spots Left
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
              Stop Losing Customers to Busy Phone Lines
            </h2>
            <p className="mb-12 text-xl text-center text-gray-600">
              Your staff should focus on serving customers, not answering the same questions
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Before */}
              <div className="p-8 bg-red-50 rounded-2xl">
                <h3 className="mb-6 text-2xl font-bold text-red-700">
                  😫 Without Automation
                </h3>
                <ul className="space-y-3">
                  {[
                    'Missing calls during peak hours',
                    'Staff constantly interrupted',
                    'Lost bookings after business hours',
                    'Answering same questions 50+ times/day',
                    'No data on customer inquiries',
                    'Manual scheduling errors'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-red-500">✕</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="p-8 bg-green-50 rounded-2xl">
                <h3 className="mb-6 text-2xl font-bold text-green-700">
                  😊 With Our Chatbot
                </h3>
                <ul className="space-y-3">
                  {[
                    '24/7 automatic responses',
                    'Staff focus on customer service',
                    'Never miss a booking opportunity',
                    'Instant answers anytime',
                    'Complete analytics dashboard',
                    'Error-free automated scheduling'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-green-500">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-x-hidden">
        <Container>
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Experience It Yourself
              </h2>
              <p className="text-xl text-gray-600">
                Our fully functional cafe chatbot demo - no signup required
              </p>
            </div>

            <div className="grid gap-6 lg:gap-12 lg:grid-cols-2 items-center min-w-0">
              {/* Demo Preview */}
              <div className="relative pb-4 pr-4 sm:pb-6 sm:pr-6 lg:pb-8 lg:pr-8 max-w-full min-w-0">
                <div className="aspect-[3/4] sm:aspect-[4/5] min-h-[400px] sm:min-h-[500px] bg-white rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 w-full max-w-full min-w-0">
                  <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex flex-col overflow-hidden min-w-0">
                    {/* Mock Chat Interface */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 sm:p-3 lg:p-4 rounded-t-lg flex-shrink-0 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base truncate">Signal Cafe NYC Bot</h3>
                      <p className="text-xs sm:text-sm opacity-90 truncate">24/7 Automated Reservations</p>
                    </div>
                    
                    <div className="flex-1 p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 overflow-y-auto min-w-0">
                      <div className="bg-white rounded-lg p-2 sm:p-3 max-w-[85%] min-w-0">
                        <p className="text-xs sm:text-sm break-words">Welcome to Signal Cafe NYC! ☕</p>
                        <p className="text-xs sm:text-sm mt-1 break-words">How can I help you today?</p>
                      </div>
                      
                      <div className="bg-emerald-500 text-white rounded-lg p-2 sm:p-3 max-w-[85%] ml-auto min-w-0">
                        <p className="text-xs sm:text-sm break-words">I'd like to make a reservation</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-1.5 sm:p-2 max-w-[98%] sm:max-w-[95%] min-w-0">
                        <p className="text-[10px] sm:text-xs mb-1 sm:mb-1.5">Perfect! For how many people?</p>
                        <div className="grid grid-cols-2 gap-0.5 sm:gap-1 min-w-0">
                          {['1', '2', '3', '4+'].map(num => (
                            <button key={num} className="py-0.5 px-1 sm:py-1 sm:px-1.5 bg-emerald-100 text-emerald-700 rounded text-[8px] sm:text-[10px] font-medium hover:bg-emerald-200 transition-colors leading-tight min-w-0 break-words">
                              {num} {num === '1' ? 'person' : 'people'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Action Button */}
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-xl flex items-center justify-center text-white text-xl sm:text-2xl animate-bounce">
                  💬
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  What Your Customers Experience:
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      icon: <MessageSquare className="w-6 h-6" />,
                      title: 'Natural Conversation',
                      desc: 'Button-based navigation for ease of use'
                    },
                    {
                      icon: <Calendar className="w-6 h-6" />,
                      title: 'Visual Calendar',
                      desc: 'Pick dates and times with intuitive interface'
                    },
                    {
                      icon: <QrCode className="w-6 h-6" />,
                      title: 'QR Confirmations',
                      desc: 'Modern, contactless check-in system'
                    },
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: '24/7 Availability',
                      desc: 'Accept bookings even when closed'
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/automation/demos/cafe-chatbot"
                  className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  Try Full Demo Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">
              Automation Solutions
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Cafe Chatbot */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">☕</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Cafe & Restaurant
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Automated reservations, menu inquiries, and customer service
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Reservation system
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Menu & dietary info
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> QR confirmations
                    </li>
                  </ul>
                  <Link
                    href="/automation/demos/cafe-chatbot"
                    className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                  >
                    Live Demo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Excel Automation */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Excel Automation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Spreadsheet automation, data processing, and reporting
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Data processing
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Report generation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Workflow automation
                    </li>
                  </ul>
                  <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Workflow Automation */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Workflow Automation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Business process automation and system integration
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Process automation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> API integrations
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span> Custom solutions
                    </li>
                  </ul>
                  <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">
              Ready to Automate Your Business?
            </h2>
            <p className="mb-8 text-xl text-emerald-100">
              Join the first 5 clients and save $1,700 on custom chatbot development
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/automation/first-5-clients"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Claim Your Spot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Schedule Discovery Call
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}