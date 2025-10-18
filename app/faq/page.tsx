// app/faq/page.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, Shield, Lock, Zap, DollarSign, Code, HelpCircle, Mail, Smartphone, AlertTriangle, Cloud } from 'lucide-react'
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
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const faqCategories: FAQCategory[] = [
    {
      id: 'ai-tools',
      title: 'AI Tools & Data Safety',
      icon: Cloud,
      questions: [
        {
          q: 'What are AI-powered tools and how are they different?',
          a: (
            <div className="space-y-3">
              <p>AI-powered tools use Claude API (by Anthropic) to provide advanced analysis and recommendations.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-semibold mb-2">🌐 Browser-Only Tools (Most Tools)</p>
                  <ul className="text-sm space-y-1">
                    <li>✓ Everything processes in your browser</li>
                    <li>✓ No data sent to any server</li>
                    <li>✓ Works offline after page load</li>
                    <li>✓ Maximum privacy</li>
                  </ul>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-400 font-semibold mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mr-1">AI</span>
                    AI-Powered Tools
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>⚠ Requires internet connection</li>
                    <li>⚠ Data sent to Claude API</li>
                    <li>✓ Not stored after processing</li>
                    <li>✓ Clearly labeled with badge</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Look for the <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                on tool cards to identify AI-powered tools!
              </p>
            </div>
          ),
        },
        {
          q: 'Is it safe to use AI tools with my data?',
          a: (
            <div className="space-y-3">
              <p className="text-yellow-300 font-semibold">
                ⚠️ It depends on what type of data you're uploading!
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-semibold mb-2">❌ NEVER Upload to AI Tools:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Personal information (names, addresses, emails, phone numbers)</li>
                  <li>• Confidential business data (trade secrets, strategic plans, financial records)</li>
                  <li>• Medical or legal sensitive information</li>
                  <li>• Proprietary source code or intellectual property</li>
                  <li>• Passwords, API keys, or credentials</li>
                  <li>• Customer data or PII (Personally Identifiable Information)</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">✅ Safe to Use AI Tools With:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Sample or dummy data</li>
                  <li>• Anonymized content (all identifying info removed)</li>
                  <li>• Public information already available online</li>
                  <li>• Generic questions or hypothetical scenarios</li>
                  <li>• Test data without real information</li>
                </ul>
              </div>

              <p className="text-cyan-400 text-sm font-semibold">
                When in doubt, DON'T upload it to AI tools. Use our browser-only tools instead!
              </p>
            </div>
          ),
        },
        {
          q: 'Where does my data go when I use AI tools?',
          a: (
            <div className="space-y-3">
              <p>Here's the complete journey of your data:</p>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-semibold mb-3">🔄 Data Flow:</p>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li>You submit data → Sent via HTTPS to our server</li>
                  <li>Our server forwards it to Claude API (Anthropic)</li>
                  <li>Claude processes and returns results</li>
                  <li>Results displayed in your browser</li>
                  <li><strong>Your input is discarded</strong> - not stored by us or Anthropic</li>
                </ol>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 mb-2">
                  <strong>🛡️ Anthropic's Commitments:</strong>
                </p>
                <ul className="text-sm space-y-1">
                  <li>✓ Does NOT use your data to train AI models</li>
                  <li>✓ Does NOT store your data after processing</li>
                  <li>✓ SOC 2 Type II certified for security</li>
                  <li>✓ GDPR and CCPA compliant</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  Learn more: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Anthropic Privacy Policy</a>
                </p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-300 text-sm">
                  <strong>⚠️ Important:</strong> While we trust Anthropic's security, we cannot guarantee 
                  what happens to data sent through third-party APIs. Use AI tools with non-sensitive data only!
                </p>
              </div>
            </div>
          ),
        },
        {
          q: 'How can I tell which tools are AI-powered?',
          a: (
            <div className="space-y-3">
              <p>Very easy! AI-powered tools are clearly marked with an AI badge:</p>

              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="mb-3">Look for this badge on tool cards:</p>
                <span className="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  AI
                </span>
                <p className="text-xs text-gray-400 mt-3">
                  If you see this badge, the tool requires internet and sends data to Claude API
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 font-semibold mb-2">Examples of AI Tools:</p>
                <ul className="text-sm space-y-1">
                  <li>• Tech Stack Analyzer (framework recommendations)</li>
                  <li>• AI-powered code analysis tools</li>
                  <li>• Content generators and summarizers</li>
                </ul>
              </div>

              <p className="text-sm text-gray-400">
                Most of our tools (40+) are browser-only and don't use AI or send any data!
              </p>
            </div>
          ),
        },
        {
          q: 'What happens if I accidentally upload sensitive data to an AI tool?',
          a: (
            <div className="space-y-3">
              <p className="text-orange-300 font-semibold">
                Don't panic, but act quickly:
              </p>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-semibold mb-2">🚨 Immediate Actions:</p>
                <ol className="space-y-2 list-decimal list-inside text-sm">
                  <li><strong>Stop using the tool immediately</strong></li>
                  <li><strong>Close the browser tab</strong></li>
                  <li><strong>Change any exposed passwords or credentials</strong></li>
                  <li><strong>Contact us</strong> at aiautosite@gmail.com with details</li>
                </ol>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  <strong>Good news:</strong> According to Anthropic's policy, your data is not stored 
                  after processing completes. However, it's still best practice to change any exposed credentials.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-300 text-sm">
                  <strong>Prevention:</strong> Always double-check what you're about to upload before clicking submit. 
                  If you're unsure, use our browser-only tools instead!
                </p>
              </div>
            </div>
          ),
        },
        {
          q: 'Can I use AI tools for work projects?',
          a: (
            <div className="space-y-3">
              <p>Yes, but with important restrictions:</p>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">✅ Safe for Work:</p>
                <ul className="text-sm space-y-1">
                  <li>• Public documentation or open-source code</li>
                  <li>• Generic technical questions</li>
                  <li>• Anonymized sample data</li>
                  <li>• General framework comparisons</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-semibold mb-2">❌ NOT Safe for Work:</p>
                <ul className="text-sm space-y-1">
                  <li>• Proprietary company code</li>
                  <li>• Confidential business strategies</li>
                  <li>• Customer data or internal documents</li>
                  <li>• Unreleased product information</li>
                </ul>
              </div>

              <p className="text-yellow-300 text-sm">
                <strong>⚠️ Check with your employer:</strong> Some companies have policies against using 
                third-party AI services with any work-related data. Always verify first!
              </p>
            </div>
          ),
        },
      ],
    },
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
                  <li>• 📓 Writing notes on YOUR notebook (local storage)</li>
                  <li>• NOT sending those notes to us (no server storage)</li>
                </ul>
              </div>

              <p className="text-cyan-400">
                We literally cannot see your settings even if we tried.
              </p>
              <p className="text-sm text-gray-400">
                You can verify this by checking your browser's Network tab - zero data sent!
              </p>
            </div>
          ),
        },
        {
          q: 'How do you know which tools are popular then?',
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

              <p className="text-gray-400">
                It's like a turnstile counter - we know someone passed through, but not who.
              </p>
            </div>
          ),
        },
        {
          q: 'What happens when I clear my browser data?',
          a: (
            <div className="space-y-3">
              <p>Everything disappears! Your settings, history, preferences - all gone.</p>
              <p className="text-cyan-400 font-semibold">
                This proves we don't store anything on our servers.
              </p>
              <p className="text-gray-400">If we did, your settings would come back. They don't.</p>
            </div>
          ),
        },
        {
          q: 'Where is my purchase information stored?',
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">
                Great question! Your license is stored in THREE places:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">1. Your Browser (Primary) 🌐</p>
                  <p className="text-sm mb-2">
                    License token stored in localStorage. You can see it in DevTools → Application → Local Storage
                  </p>
                  <div className="bg-black/30 rounded p-2 text-xs font-mono">
                    <p className="text-gray-400">pdf_tools_premium_license: {'{'}</p>
                    <p className="text-gray-300 ml-3">"token": "a7f3e9c2..."</p>
                    <p className="text-gray-300 ml-3">"purchasedAt": "2025-10-13T..."</p>
                    <p className="text-gray-300 ml-3">"isActive": true</p>
                    <p className="text-gray-400">{'}'}</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">2. Stripe's Database 💳</p>
                  <p className="text-sm">
                    Purchase record with your email. This is how we can recover your license if you lose it
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">3. Our Servers ❌</p>
                  <p className="text-sm">
                    <strong>NOT stored!</strong> We intentionally don't keep any purchase records for maximum privacy
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm">
                This design means: We can't track you, but you're responsible for not clearing your browser data!
              </p>
            </div>
          ),
        },
        {
          q: 'Is this GDPR/CCPA compliant?',
          a: (
            <div className="space-y-3">
              <p className="text-green-400 font-semibold">
                Even better - these laws don't even apply to us!
              </p>
              <p>Why? Because we don't collect personal data at all.</p>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-cyan-400">
                  No collection = No compliance needed = No privacy risks for you!
                </p>
              </div>
            </div>
          ),
        },
        {
          q: 'Do you use cookies?',
          a: "Nope! Zero cookies. You can check your browser's cookie storage - it's empty for our domain.",
        },
        {
          q: "How can I verify you're not collecting my data?",
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">Multiple ways to verify our claims:</p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">💻 Desktop: Check the Network Tab</p>
                  <p className="text-sm mb-2">
                    Open DevTools (F12) → Network tab → Use our tools → See zero personal data sent
                  </p>
                  <code className="text-xs bg-black/30 p-2 rounded block">
                    Look for: POST requests to our APIs
                    <br />
                    You'll see: Only temporary processing data (AI tools only)
                    <br />
                    You won't see: Your files or personal info being uploaded
                  </code>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">💻 Desktop: Check localStorage</p>
                  <p className="text-sm mb-2">
                    Open DevTools (F12) → Application → Local Storage → ai-autosite.com
                  </p>
                  <code className="text-xs bg-black/30 p-2 rounded block">
                    You'll see: Only your license key (if purchased)
                    <br />
                    That's it! Nothing else.
                  </code>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">📱 iPhone: Safari Web Inspector</p>
                  <p className="text-sm mb-2">
                    1. Enable Developer Menu: Settings → Safari → Advanced → Web Inspector ON
                    <br />
                    2. Connect iPhone to Mac via USB
                    <br />
                    3. Open Safari on Mac → Develop → [Your iPhone] → ai-autosite.com
                    <br />
                    4. Check Storage tab to see localStorage
                  </p>
                  <p className="text-xs text-gray-400">
                    Alternative: Use the Inspect app from App Store
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">📱 Android: Chrome DevTools</p>
                  <p className="text-sm mb-2">
                    Method 1: Remote Debugging
                    <br />
                    1. Enable Developer Options on Android
                    <br />
                    2. Connect to PC via USB
                    <br />
                    3. Chrome on PC → chrome://inspect → Inspect device
                    <br />
                    4. Application tab → Local Storage
                  </p>
                  <p className="text-sm mb-2 mt-3">
                    Method 2: Eruda Console (Easier!)
                    <br />
                    1. Visit: <a href="https://eruda.liriliri.io/" className="text-cyan-400 underline">eruda.liriliri.io</a>
                    <br />
                    2. Drag the "Eruda" button to bookmarks
                    <br />
                    3. Visit our site, tap the Eruda bookmark
                    <br />
                    4. Resources → Local Storage → See our data (or lack thereof!)
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">🔍 Simple Test (All Devices)</p>
                  <p className="text-sm">
                    1. Use any tool and save some settings
                    <br />
                    2. Clear your browser data/cache
                    <br />
                    3. Your settings disappear
                    <br />
                    4. This proves we store nothing server-side!
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">📂 Review Our Code (Technical)</p>
                  <p className="text-sm mb-2">
                    Our entire codebase is deployed via Vercel with GitHub integration
                  </p>
                  <a
                    href="https://github.com/ai-autosite"
                    className="text-cyan-400 hover:underline text-sm"
                  >
                    → Check our GitHub repositories
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Look for database connections, data storage, analytics - you won't find any!
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-green-400 font-semibold mb-2">🔓 Open Source Transparency</p>
                <p className="text-sm text-gray-300">
                  Our deployment: GitHub → Vercel (public build logs available)
                  <br />
                  What this means: Every code change is tracked and verifiable
                </p>
              </div>

              <p className="text-yellow-400 text-sm">
                💡 Pro tip: If you find ANY privacy concern in our code, we'll fix it immediately,
                publicly thank you, and give you free lifetime premium access!
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: 'pricing',
      title: 'Pricing & Payment',
      icon: DollarSign,
      questions: [
        {
          q: 'Why are most tools free?',
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">
                Our philosophy: "If it doesn't cost us to run, it doesn't cost you to use."
              </p>
              <p>
                Most tools run entirely in your browser using JavaScript. No server costs = Free
                forever!
              </p>
            </div>
          ),
        },
        {
          q: 'Which tools might cost money?',
          a: (
            <div className="space-y-3">
              <p>Only tools that use paid APIs:</p>
              <ul className="space-y-2">
                <li>• 🤖 AI-powered features (Claude API)</li>
                <li>• 🖼️ Image generation</li>
                <li>• 📊 Advanced data processing</li>
              </ul>
              <p className="text-sm text-gray-400">
                Look for the <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                on tool cards to identify AI-powered tools.
              </p>
              <p className="text-gray-400 text-sm">
                We charge exactly: API cost + 10% for maintenance
              </p>
            </div>
          ),
        },
        {
          q: 'How does payment work?',
          a: (
            <div className="space-y-3">
              <p>We use Stripe for secure payments. Here's the complete data flow:</p>

              <div className="bg-gray-800/50 rounded-lg p-4 mb-3">
                <p className="font-semibold mb-2">💳 Payment Process:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>You click "Purchase" → Stripe Checkout page opens</li>
                  <li>Enter email & payment details (handled by Stripe, not us)</li>
                  <li>Payment confirmed → We generate a random license token</li>
                  <li>Token sent to your browser → Stored in localStorage</li>
                  <li>Done! No data stored on our servers</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-semibold">✅ Your browser stores:</p>
                  <ul className="text-sm space-y-1">
                    <li>• License key (token)</li>
                    <li>• Purchase date</li>
                    <li>• Product type</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">
                    (Stored in localStorage, you control it!)
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 font-semibold">⚡ Stripe stores:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Email address</li>
                    <li>• Payment details</li>
                    <li>• Transaction history</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">
                    (Handled by Stripe, not us)
                  </p>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-400 font-semibold">🎯 Our servers store:</p>
                <p className="text-lg font-bold">NOTHING! ✨</p>
                <p className="text-xs text-gray-400 mt-1">
                  We can't access your purchase info because we don't store it
                </p>
              </div>

              <p className="text-yellow-400 text-sm">
                ⚠️ Important: Save your license key! Since it's only in your browser, 
                clearing browser data will lose it. We can recover it via email verification 
                through Stripe, but it's easier if you save it yourself!
              </p>
            </div>
          ),
        },
        {
          q: 'Can I request a refund?',
          a: "Since we don't store personal information, refunds are tricky. But contact us with your license key and we'll figure something out!",
        },
      ],
    },
    {
      id: 'technical',
      title: 'Technical Questions',
      icon: Code,
      questions: [
        {
          q: 'Do the tools work offline?',
          a: (
            <div className="space-y-3">
              <p className="text-gray-300">
                Most tools (40+ tools) work completely offline after the initial page load!
              </p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">✅ Offline Tools:</p>
                <p className="text-sm text-gray-300">
                  Base64 converter, Image compressor, PDF merger, QR code generator, 
                  and most other tools work entirely in your browser without internet.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold mb-2">⚠️ Require Internet Connection:</p>
                <p className="text-sm text-gray-300 mb-3">
                  Tools marked with an <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                  use Claude's API service and need an active internet connection.
                </p>
                <p className="text-xs text-gray-400">
                  You can identify these tools easily - just look for the AI badge on the tool card!
                  These tools temporarily send your input to Claude's API for processing.
                </p>
              </div>

              <p className="text-sm text-gray-400 italic">
                💡 Tip: Check the tool card for the AI badge before using it offline.
              </p>
            </div>
          ),
        },
        {
          q: 'What browsers are supported?',
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
          ),
        },
        {
          q: 'Can I use the tools on mobile?',
          a: 'Yes! All tools are responsive and work on mobile devices. Some complex tools work better on larger screens though.',
        },
        {
          q: 'Is the source code available?',
          a: (
            <div className="space-y-3">
              <p>Yes! Our code is publicly accessible.</p>
              <p className="text-gray-400">
                Check our{' '}
                <a href="https://github.com/ai-autosite" className="text-cyan-400 hover:underline">
                  GitHub
                </a>{' '}
                for the full source code.
              </p>
            </div>
          ),
        },
        {
          q: 'Can I embed your tools on my website?',
          a: "Not yet, but it's on our roadmap! Contact us if you're interested in API access.",
        },
      ],
    },
    {
      id: 'mobile',
      title: 'Mobile Verification',
      icon: Smartphone,
      questions: [
        {
          q: 'How can I verify privacy on iPhone?',
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">
                Three ways to verify on iOS:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 1: Safari Web Inspector (Best)</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>On iPhone: Settings → Safari → Advanced → Turn ON "Web Inspector"</li>
                    <li>Connect iPhone to Mac with USB cable</li>
                    <li>On Mac: Open Safari → Develop menu → Select your iPhone → ai-autosite.com</li>
                    <li>Click "Storage" tab → Local Storage → See exactly what's stored</li>
                  </ol>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 2: Inspect Browser App</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Download "Inspect Browser" from App Store (free)</li>
                    <li>Open our website in Inspect Browser</li>
                    <li>Tap the debug icon → Storage → Local Storage</li>
                    <li>View all stored data (spoiler: it's minimal!)</li>
                  </ol>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 3: Simple Clear Test</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Use our tools and change some settings</li>
                    <li>Settings → Safari → Clear History and Website Data</li>
                    <li>Revisit our site → All your settings are gone</li>
                    <li>This proves we store nothing on our servers!</li>
                  </ol>
                </div>
              </div>
            </div>
          ),
        },
        {
          q: 'How can I verify privacy on Android?',
          a: (
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">
                Multiple methods for Android:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 1: Chrome Remote Debugging (Advanced)</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Enable Developer Options: Settings → About Phone → Tap "Build Number" 7 times</li>
                    <li>Developer Options → Turn ON "USB Debugging"</li>
                    <li>Connect Android to PC with USB cable</li>
                    <li>On PC: Chrome → chrome://inspect → Click "inspect" next to our site</li>
                    <li>Application tab → Local Storage → View stored data</li>
                  </ol>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 2: Eruda Console (Easiest!)</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Open Chrome and visit: <a href="https://eruda.liriliri.io/" className="text-cyan-400 underline">eruda.liriliri.io</a></li>
                    <li>Drag the "Eruda" button to your bookmarks bar</li>
                    <li>Visit our website (ai-autosite.com)</li>
                    <li>Tap the Eruda bookmark → Console appears</li>
                    <li>Tap "Resources" → "Local Storage" → See our data</li>
                  </ol>
                  <p className="text-xs text-yellow-400 mt-2">
                    💡 This method works in ANY mobile browser!
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 3: Via:// Browser (Built-in DevTools)</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Download "Via Browser" from Play Store (free)</li>
                    <li>Open our website in Via Browser</li>
                    <li>Menu → Tools → Console</li>
                    <li>Storage tab → View localStorage directly</li>
                  </ol>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Method 4: Simple Clear Test</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Use our tools and save some settings</li>
                    <li>Chrome → Settings → Privacy → Clear browsing data</li>
                    <li>Check "Cookies and site data"</li>
                    <li>Revisit our site → Settings gone = No server storage!</li>
                  </ol>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                Recommended: Start with Method 2 (Eruda) - it's the easiest!
              </p>
            </div>
          ),
        },
        {
          q: 'What should I see in localStorage?',
          a: (
            <div className="space-y-3">
              <p>When you inspect our localStorage, you'll see:</p>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-semibold mb-2">📦 Free Users:</p>
                <code className="text-xs bg-black/30 p-2 rounded block">
                  localStorage: {} (empty!)
                  <br />
                  <span className="text-gray-400">// Literally nothing stored</span>
                </code>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="font-semibold mb-2">💎 Premium Users:</p>
                <code className="text-xs bg-black/30 p-2 rounded block font-mono">
                  pdf_tools_premium_license: {`{`}
                  <br />
                  <span className="ml-4">"token": "a7f3e9c2...",</span>
                  <br />
                  <span className="ml-4">"purchasedAt": "2025-10-13T12:34:56Z",</span>
                  <br />
                  <span className="ml-4">"isActive": true,</span>
                  <br />
                  <span className="ml-4">"productType": "pdf_tools_premium"</span>
                  <br />
                  {`}`}
                  <br />
                  <br />
                  <span className="text-gray-400">// That's it! Just your license key.</span>
                </code>
              </div>

              <p className="text-cyan-400 text-sm">
                ✨ Notice: No name, no email, no usage data, no tracking!
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          q: 'Who created AI AutoSite?',
          a: (
            <div className="space-y-3">
              <p>An individual developer passionate about privacy and free tools!</p>
              <p className="text-gray-400">
                Our mission: Make powerful tools accessible to everyone without compromising
                privacy.
              </p>
            </div>
          ),
        },
        {
          q: 'How do you make money if everything is free?',
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
          ),
        },
        {
          q: 'Can I request a new tool?',
          a: (
            <div className="space-y-3">
              <p>Absolutely! We love suggestions.</p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                <Mail className="w-4 h-4" />
                <span>Request a Tool</span>
              </Link>
            </div>
          ),
        },
        {
          q: 'How often are new tools added?',
          a: 'We aim to add 2-3 new tools every month based on user requests and feedback!',
        },
        {
          q: 'Why English only?',
          a: (
            <div className="space-y-3">
              <p>We're starting with English to reach the largest audience first.</p>
              <p className="text-gray-400">Multi-language support is planned for the future!</p>
            </div>
          ),
        },
      ],
    },
  ]

  const filteredQuestions =
    selectedCategory === 'all'
      ? faqCategories
      : faqCategories.filter((cat) => cat.id === selectedCategory)

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
            <p className="text-sm text-gray-500 mt-4">Last updated: October 17, 2025</p>
          </div>

          {/* AI Tools Warning Banner */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-orange-300 mb-2">
                  ⚠️ Important: AI Tools Safety
                </h3>
                <p className="text-gray-200 text-sm mb-3">
                  Tools with an <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                  send data to Claude API. <strong>Never upload personal information, confidential business data, or sensitive content!</strong>
                </p>
                <Link 
                  href="#ai-tools" 
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                  onClick={() => setSelectedCategory('ai-tools')}
                >
                  → Read AI Tools Safety Guide
                </Link>
              </div>
            </div>
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
            {faqCategories.map((cat) => {
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
            {filteredQuestions.map((category) => {
              const CategoryIcon = category.icon
              return (
                <div key={category.id} id={category.id} className="space-y-4">
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
                          <span className="text-left text-white font-medium">{item.q}</span>
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
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
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