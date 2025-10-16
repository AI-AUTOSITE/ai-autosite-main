'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'basic' | 'technical' | 'privacy'
}

interface GuideProps {
  onClose: () => void
}

export default function Guide({ onClose }: GuideProps) {
  const [mounted, setMounted] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Mount/unmount handling
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

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
        "Click the 'Upload PDF' button in the toolbar or drag and drop a file. All files are processed entirely in your browser and never sent to any server.",
      category: 'basic',
    },
    {
      question: 'What are the 6 tool slots?',
      answer:
        'The left panel has 6 slots where you can place your favorite tools (all free!). Click any slot to select or change tools. Pin your most-used tools for quick access.',
      category: 'basic',
    },
    {
      question: 'How do I rearrange pages?',
      answer:
        'Drag and drop pages in the thumbnail sidebar to reorder them. On mobile, long-press a page to enter drag mode.',
      category: 'basic',
    },
    {
      question: 'How do I select multiple pages?',
      answer:
        'Click to select a page, then Ctrl+Click (Cmd+Click on Mac) to select additional pages. Selected pages show a blue outline. Use Shift+Click to select a range of pages.',
      category: 'basic',
    },
    {
      question: 'What tools are available?',
      answer:
        'All 14 tools are completely free:\n• Rotate, Merge, Split, Delete\n• Compress, Page Numbers, Blank Page, Duplicate\n• OCR, Watermark, Signature, Annotate\n• Convert to Word, Convert to Excel',
      category: 'basic',
    },
    {
      question: 'How does "Keep Selection" work?',
      answer:
        'When enabled, page selections remain after operations. When disabled, selections automatically clear after each action. Toggle it based on your workflow.',
      category: 'basic',
    },

    // Technical
    {
      question: 'What are the file size and page limits?',
      answer:
        'Maximum file size: 20MB\nMaximum pages: 100 pages per PDF\n\nFor larger files, try using the Compress tool first to reduce file size.',
      category: 'technical',
    },
    {
      question: 'Does it work offline?',
      answer:
        "Yes! Install as a PWA (Progressive Web App) by clicking 'Install App' in your browser menu for full offline functionality. All processing happens locally in your browser.",
      category: 'technical',
    },
    {
      question: 'Processing is slow on my device?',
      answer:
        'PDF processing is CPU-intensive. To improve speed:\n\n1. Close other browser tabs and applications\n2. Use the Compress tool to reduce file size first\n3. Use the latest version of Chrome, Edge, or Firefox\n4. On mobile, some heavy operations (like OCR) may be slower',
      category: 'technical',
    },
    {
      question: 'Which browsers are supported?',
      answer:
        'Recommended browsers:\n• Chrome 90+ (best performance)\n• Edge 90+\n• Firefox 88+\n• Safari 14+\n\nFor best results, keep your browser updated to the latest version.',
      category: 'technical',
    },
    {
      question: 'Can I undo/redo my changes?',
      answer:
        'Yes! Use Ctrl+Z (Cmd+Z on Mac) to undo and Ctrl+Y (Cmd+Shift+Z on Mac) to redo. You can also use the undo/redo buttons in the toolbar.',
      category: 'technical',
    },

    // Privacy
    {
      question: 'Where are my PDFs stored?',
      answer:
        'Nowhere! All processing happens entirely in your browser using JavaScript. Your files never leave your device and are never uploaded to any server. When you close the tab, everything is cleared from memory.',
      category: 'privacy',
    },
    {
      question: 'Do you collect any data?',
      answer:
        'No. We do not collect, store, or transmit any personal information or file data. Your PDFs and edits exist only in your browser session and are never sent anywhere.',
      category: 'privacy',
    },
    {
      question: 'Is it safe to use with confidential documents?',
      answer:
        'Yes, absolutely! Since all processing happens locally in your browser and nothing is sent to any server, you can safely use it with confidential, sensitive, or private documents.',
      category: 'privacy',
    },
  ]

  const filteredFAQs =
    activeCategory === 'all' ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  // Don't render until mounted
  if (!mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto py-12"
      style={{ zIndex: 100000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-4xl my-12 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">PDF Tools Help</h2>
            <p className="text-gray-400 text-sm mt-1">Usage, troubleshooting, and privacy</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto">
          {/* Key Features Banner */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">🎉 All Features Free!</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>✅ 6 tool slots (customize freely)</div>
              <div>✅ 14 powerful tools included</div>
              <div>✅ 100% private & offline capable</div>
              <div>✅ No registration required</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('basic')}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'basic'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Basic Usage
            </button>
            <button
              onClick={() => setActiveCategory('technical')}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'technical'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setActiveCategory('privacy')}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'privacy'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Privacy
            </button>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-700/50 transition rounded-lg"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedItems.has(index) && (
                  <div className="px-6 pt-2 pb-6 text-gray-300 text-sm leading-loose whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  // Render to document.body using createPortal
  return createPortal(modalContent, document.body)
}