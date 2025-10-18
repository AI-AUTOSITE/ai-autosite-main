'use client'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Tool title mapping
const getToolTitle = (pathname: string) => {
  const toolMap: Record<string, string> = {
    '/tools/pdf-to-data': 'PDF → CSV/Excel',
    '/tools/pc-optimizer': 'PC Optimizer',
    '/tools/test-file-generator': 'Test File Generator',
    '/tools/test-image-generator': 'Test Image Generator',
    '/tools/test-text-generator': 'Test Text Generator',
    '/tools/ai-summarizer': 'AI Text Summarizer',
    '/tools/text-case': 'Text Case Converter',
    '/tools/json-format': 'JSON Formatter',
    '/tools/image-grid-maker': 'Image Grid Maker',
    '/tools/image-splitter': 'Image Splitter',
    '/tools/json-csv': 'JSON to CSV',
    '/tools/age-calculator': 'Age Calculator',
    '/tools/japanese-ocr': 'Japanese OCR',
    '/tools/blurtap': 'BlurTap',
    '/tools/color-palette': 'Color Palette',
    '/tools/password-generator': 'Password Generator',
    '/tools/text-counter': 'Text Counter',
    '/tools/code-roaster': 'Code Roaster',
    '/tools/markdown-html': 'Markdown to HTML',
    '/tools/qr-code': 'QR Code Maker',
    '/tools/unit-converter': 'Unit Converter',
    '/tools/base64': 'Base64 Tool',
    '/tools/image-compress': 'Image Compress',
    '/tools/code-dependency-visualizer': 'Code Dependency Visualizer',
    '/tools/bmi-calculator': 'BMI Calculator',
    '/tools/percentage-calculator': 'Percentage Calculator',
    '/tools/hashtag-generator': 'Hashtag Generator',
    '/tools/twitter-counter': 'Twitter Counter',
    '/tools/instagram-bio': 'Instagram Bio Generator',
    '/tools/youtube-thumbnail': 'YouTube Thumbnail',
    '/tools/whatsapp-link': 'WhatsApp Link Generator',
    '/tools/ai-prompt-generator': 'AI Prompt Generator',
    '/tools/favicon-generator': 'Favicon Generator',
    '/tools/lorem-ipsum': 'Lorem Ipsum Generator',
    '/tools/gradient-generator': 'Gradient Generator',
    '/tools/uuid-generator': 'UUID Generator',
    '/tools/countdown-timer': 'Countdown Timer Generator',
    '/tools/ai-dev-dictionary': 'AI Dev Dictionary',
    '/tools/ai-project-visualizer': 'AI Project Visualizer',
    '/tools/ai-resume': 'AI Resume Generator',
    '/tools/competitive-analyzer': 'Competitive Tool Analyzer',
    '/tools/debate-trainer': 'Master Debate Skills with AI',
    '/tools/pdf-summarizer': 'PDF SUMMARIZER',
    '/tools/pdf-tools': 'PDF Editor',
    '/tools/spam-email-checker': 'Spam Email Checker',
    '/tools/stack-recommender': 'Stack Recommender',
    '/tools/tech-stack-analyzer': 'Tech Stack Analyzer',
    '/tools/token-compressor': 'AI Token Compressor',
    '/tools/pdf-test-generator': 'PDF Test Generator',
  }
  return toolMap[pathname] || ''
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [toolTitle, setToolTitle] = useState('')

  useEffect(() => {
    setToolTitle(getToolTitle(pathname))
  }, [pathname])

  return (
    // ✅ Flexbox構造を追加
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main wrapper with background */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Tool-specific header (breadcrumb + title) */}
        {pathname !== '/tools' && toolTitle && (
          <nav className="container mx-auto px-4 pt-6 pb-4">
            <div className="relative flex items-center">
              {/* Breadcrumb - hidden on mobile */}
              <div className="hidden md:block absolute left-0 text-xs text-gray-500">
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
                <span className="mx-2">›</span>
                <Link href="/tools" className="hover:text-gray-300 transition-colors">
                  Tools
                </Link>
              </div>

              {/* Tool title - center on desktop, left on mobile */}
              <h1 className="text-xl font-medium text-white md:mx-auto">{toolTitle}</h1>
            </div>
          </nav>
        )}

        {/* Tools index page breadcrumb */}
        {pathname === '/tools' && (
          <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="text-gray-300">Tools</span>
              </div>
            </div>
          </nav>
        )}

        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Main content */}
        <main className="relative z-10">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}