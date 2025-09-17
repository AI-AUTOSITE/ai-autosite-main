// app/faq/page.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, Shield, Lock, Zap, DollarSign, Code, HelpCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

type FAQCategory = {
  id: string
  title: string
  icon: any
  questions: {
    q: string
    a: string | JSX.Element
  }[]
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const faqCategories: FAQCategory[] = [
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: Shield,
      questions: [
        {
          q: "You say 'no data collection' but my settings are saved?",
          a: (
            <div className="space-y-3">
              <p>Great question! Your settings are stored ONLY in your browser's local storage.</p>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Think of it like:</p>
                <ul className="space-y-1">
                  <li>• 📝 Writing notes on YOUR notebook (local storage)</li>
                  <li>• NOT sending those notes to us (no server storage)</li>
                </ul>
              </div>
              
              <p className="text-cyan-400">We literally cannot see your settings even if we tried.</p>
              <p className="text-sm text-gray-400">You can verify this by checking your browser's Network tab - zero data sent!</p>
            </div>
          )
        },
        {
          q: "How do you know which tools are popular then?",
          a: (
            <div className="space-y-3">
              <p>We only count tool visits without identifying users:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-semibold">✅ What we count:</p>
                  <p className="text-sm">"PDF tool was used"</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 font-semibold">❌ What we DON'T know:</p>
                  <p className="text-sm">"WHO used it"</p>
                </div>
              </div>
              
              <p className="text-gray-400">It's like a turnstile counter - we know someone passed through, but not who.</p>
            </div>
          )
        },
        {
          q: "What happens when I clear my browser data?",
          a: (
            <div className="space-y-3">
              <p>Everything disappears! Your settings, history, preferences - all gone.</p>
              <p className="text-cyan-400 font-semibold">This proves we don't store anything on our servers.</p>
              <p className="text-gray-400">If we did, your settings would come back. They don't.</p>
            </div>
          )
        },
        {
          q: "Is this GDPR/CCPA compliant?",
          a: (
            <div className="space-y-3">
              <p className="text-green-400 font-semibold">Even better - these laws don't even apply to us!</p>
              <p>Why? Because we don't collect personal data at all.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-cyan-400">No collection = No compliance needed = No privacy risks for you!</p>
              </div>
            </div>
          )
        },
        {
          q: "Do you use cookies?",
          a: "Nope! Zero cookies. You can check your browser's cookie storage - it's empty for our domain."
        },
        {
          q: "How can I verify you're not collecting my data?",
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">Multiple ways to verify our claims:</p>
              
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">1. Check the Network Tab (Easy)</p>
                  <p className="text-sm">Open DevTools (F12) → Network tab → Use our tools → See zero personal data sent</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">2. Review Our Code (Technical)</p>
                  <p className="text-sm">Everything is on <a href="https://github.com/ai-autosite" className="text-cyan-400 hover:underline">GitHub</a> - have a developer friend check it out</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">3. Test It Yourself (Practical)</p>
                  <p className="text-sm">Clear your browser data → Your settings disappear → Proof we store nothing!</p>
                </div>
              </div>
              
              <p className="text-yellow-400 text-sm">
                💡 Pro tip: If you find ANY privacy concern in our code, we'll fix it immediately and publicly thank you!
              </p>
            </div>
          )
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing & Payment',
      icon: DollarSign,
      questions: [
        {
          q: "Why are most tools free?",
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">Our philosophy: "If it doesn't cost us to run, it doesn't cost you to use."</p>
              <p>Most tools run entirely in your browser using JavaScript. No server costs = Free forever!</p>
            </div>
          )
        },
        {
          q: "Which tools might cost money?",
          a: (
            <div className="space-y-3">
              <p>Only tools that use paid APIs:</p>
              <ul className="space-y-2">
                <li>• 🤖 AI-powered features (GPT-4, Claude API)</li>
                <li>• 🖼️ Image generation</li>
                <li>• 📊 Advanced data processing</li>
              </ul>
              <p className="text-gray-400 text-sm">We charge exactly: API cost + 10% for maintenance</p>
            </div>
          )
        },
        {
          q: "How does payment work?",
          a: (
            <div className="space-y-3">
              <p>We use Stripe for secure payments. Here's what we store:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-semibold">✅ We store:</p>
                  <ul className="text-sm space-y-1">
                    <li>• License key</li>
                    <li>• Purchase date</li>
                    <li>• Plan type</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 font-semibold">❌ We DON'T store:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Your name</li>
                    <li>• Email address</li>
                    <li>• Card details</li>
                    <li>• Any personal info</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-yellow-400 text-sm">⚠️ Important: Save your license key! We can't recover it because we don't know who you are.</p>
            </div>
          )
        },
        {
          q: "Can I request a refund?",
          a: "Since we don't store personal information, refunds are tricky. But contact us with your license key and we'll figure something out!"
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Questions',
      icon: Code,
      questions: [
        {
          q: "Do the tools work offline?",
          a: (
            <div className="space-y-3">
              <p>Most tools work offline after the initial page load!</p>
              <p className="text-gray-400">Exceptions: Tools that need API access (AI features, real-time data)</p>
            </div>
          )
        },
        {
          q: "What browsers are supported?",
          a: (
            <div className="space-y-3">
              <p>All modern browsers:</p>
              <ul className="space-y-1">
                <li>• ✅ Chrome/Edge (2020+)</li>
                <li>• ✅ Firefox (2020+)</li>
                <li>• ✅ Safari (14+)</li>
                <li>• ⚠️ Internet Explorer (Not supported)</li>
              </ul>
            </div>
          )
        },
        {
          q: "Can I use the tools on mobile?",
          a: "Yes! All tools are responsive and work on mobile devices. Some complex tools work better on larger screens though."
        },
        {
          q: "Is the source code available?",
          a: (
            <div className="space-y-3">
              <p>We're working on open-sourcing our tools!</p>
              <p className="text-gray-400">Check our <a href="https://github.com/ai-autosite" className="text-cyan-400 hover:underline">GitHub</a> for updates.</p>
            </div>
          )
        },
        {
          q: "Can I embed your tools on my website?",
          a: "Not yet, but it's on our roadmap! Contact us if you're interested in API access."
        }
      ]
    },
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          q: "Who created AI AutoSite?",
          a: (
            <div className="space-y-3">
              <p>An individual developer passionate about privacy and free tools!</p>
              <p className="text-gray-400">Our mission: Make powerful tools accessible to everyone without compromising privacy.</p>
            </div>
          )
        },
        {
          q: "How do you make money if everything is free?",
          a: (
            <div className="space-y-3">
              <p>We have a sustainable model:</p>
              <ul className="space-y-1">
                <li>• Optional tips/donations</li>
                <li>• Premium features for power users</li>
                <li>• API access for businesses (coming soon)</li>
              </ul>
              <p className="text-gray-400 text-sm">But the core tools will always be free!</p>
            </div>
          )
        },
        {
          q: "Can I request a new tool?",
          a: (
            <div className="space-y-3">
              <p>Absolutely! We love suggestions.</p>
              <Link href="/request" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
                <Mail className="w-4 h-4" />
                <span>Request a Tool</span>
              </Link>
            </div>
          )
        },
        {
          q: "How often are new tools added?",
          a: "We aim to add 2-3 new tools every month based on user requests and feedback!"
        },
        {
          q: "Why English only?",
          a: (
            <div className="space-y-3">
              <p>We're starting with English to reach the largest audience first.</p>
              <p className="text-gray-400">Multi-language support is planned for the future!</p>
            </div>
          )
        }
      ]
    }
  ]

  const filteredQuestions = selectedCategory === 'all' 
    ? faqCategories 
    : faqCategories.filter(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col overflow-x-hidden">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header />

      <main className="flex-1 overflow-x-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 text-lg">
              Everything you need to know about our privacy-first approach
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              All Questions
            </button>
            {faqCategories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.title}</span>
                </button>
              )
            })}
          </div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {filteredQuestions.map(category => {
              const CategoryIcon = category.icon
              return (
                <div key={category.id} className="space-y-4">
                  <h2 className="flex items-center gap-3 text-xl font-semibold text-white mb-4">
                    <CategoryIcon className="w-6 h-6 text-cyan-400" />
                    <span>{category.title}</span>
                  </h2>
                  
                  {category.questions.map((item, index) => {
                    const itemId = `${category.id}-${index}`
                    const isOpen = openItems.includes(itemId)
                    
                    return (
                      <div 
                        key={itemId}
                        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <span className="text-left text-white font-medium">
                            {item.q}
                          </span>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-300">
                            {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              We're here to help! Contact us and we'll get back to you as soon as possible.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}