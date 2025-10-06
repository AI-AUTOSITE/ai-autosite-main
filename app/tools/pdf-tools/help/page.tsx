'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lock,
  CreditCard,
  RefreshCw,
  AlertCircle,
  FileQuestion,
  Zap,
  Shield,
  Download,
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'basic' | 'license' | 'technical' | 'privacy'
}

export default function PDFToolsHelp() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const faqs: FAQItem[] = [
    // Basic Usage
    {
      question: 'How do I upload a PDF file?',
      answer:
        "Click the 'Upload PDF' button to select a file or drag and drop it. Files are processed entirely in your browser and never sent to any server.",
      category: 'basic',
    },
    {
      question: 'What are the 3 tool slots?',
      answer:
        'The left panel has 3 slots where you can place your favorite tools. Click any slot to select or change tools. Pin your most-used tools for one-click access.',
      category: 'basic',
    },
    {
      question: 'How do I rearrange pages?',
      answer:
        'Drag and drop pages in the thumbnail sidebar to reorder them. On mobile, long-press to enter move mode.',
      category: 'basic',
    },
    {
      question: 'How do I select multiple pages?',
      answer:
        'Click to select a page, then Ctrl-click (Cmd on Mac) to select multiple. Selected pages show a blue outline.',
      category: 'basic',
    },

    // License Related
    {
      question: "What's the difference between Free and Pro?",
      answer:
        'Free: 3 tool slots\nPro: 6 tool slots, priority support\n\nOne-time purchase, use forever. No subscriptions.',
      category: 'license',
    },
    {
      question: 'How do I purchase a license?',
      answer:
        "Click the 'PRO' button at the bottom of the tool panel for secure Stripe checkout. Price: $5 USD (one-time).",
      category: 'license',
    },
    {
      question: 'I lost my license code',
      answer:
        "Use the email from your purchase to request reissue below. You'll receive it within 24 hours.",
      category: 'license',
    },
    {
      question: 'Can I use it on multiple devices?',
      answer:
        'Yes, your license code works on any device. Use it simultaneously on multiple devices.',
      category: 'license',
    },

    // Technical
    {
      question: "What's the maximum PDF size?",
      answer: 'Up to 100MB. For larger files, use the compress tool first.',
      category: 'technical',
    },
    {
      question: 'Does it work offline?',
      answer:
        "Yes! Install as a PWA using the 'Install App' button for full offline functionality.",
      category: 'technical',
    },
    {
      question: 'Processing is slow?',
      answer:
        'Large PDFs take time. Try:\n1. Close other browser tabs\n2. Compress the file first\n3. Use latest Chrome/Edge/Firefox',
      category: 'technical',
    },

    // Privacy
    {
      question: 'Where are my PDFs stored?',
      answer: 'Nowhere. All processing happens in your browser. Files never leave your device.',
      category: 'privacy',
    },
    {
      question: 'Do you collect personal data?',
      answer:
        'No. Even for purchases, we only store a hash of your email. No personally identifiable information.',
      category: 'privacy',
    },
  ]

  const filteredFAQs =
    activeCategory === 'all' ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/tools/pdf-tools"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PDF Tools
          </Link>

          <h1 className="text-3xl font-bold mb-2">PDF Tools Help</h1>
          <p className="text-gray-400">Usage, licensing, and troubleshooting</p>
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="#license-recovery"
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-400 transition"
          >
            <RefreshCw className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="font-semibold mb-1">License Recovery</h3>
            <p className="text-sm text-gray-400">Retrieve your purchased license</p>
          </Link>

          <Link
            href="/tools/pdf-tools"
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-400 transition"
          >
            <Zap className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-semibold mb-1">Upgrade</h3>
            <p className="text-sm text-gray-400">Get 6 slots ($5)</p>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('basic')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'basic'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Basic Usage
          </button>
          <button
            onClick={() => setActiveCategory('license')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'license'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            License
          </button>
          <button
            onClick={() => setActiveCategory('technical')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'technical'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setActiveCategory('privacy')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === 'privacy'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Privacy
          </button>
        </div>

        {/* FAQ Section */}
        <div className="space-y-2 mb-12">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-700/50 transition"
              >
                <span className="font-medium">{faq.question}</span>
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedItems.has(index) && (
                <div className="px-4 pb-3 text-gray-300 whitespace-pre-line">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        {/* License Recovery Section */}
        <div id="license-recovery" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">License Recovery</h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <p className="text-gray-300 mb-4">
              Enter your purchase email to resend license information.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="example@email.com"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              />
              <button className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition">
                Recover
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-3">
              If you don't receive an email within 24 hours, please contact support.
            </p>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 p-6">
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-gray-300 mb-4">Contact us with:</p>
          <ul className="space-y-1 text-sm text-gray-400 mb-4">
            <li>• Browser and version</li>
            <li>• Device (PC/Mobile/Tablet)</li>
            <li>• Description of the issue</li>
            <li>• Error messages (if any)</li>
          </ul>
          <a
            href="mailto:support@ai-autosite.com?subject=PDF Tools Support"
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
