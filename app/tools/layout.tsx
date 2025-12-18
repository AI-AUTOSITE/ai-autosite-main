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
    '/tools/bg-eraser': 'Background Eraser',
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
    '/tools/cornell-note': 'Cornell Note Generator',
    '/tools/markdown-html': 'Markdown to HTML',
    '/tools/network-checker': 'Network Checker',
    '/tools/qr-code': 'QR Code Maker',
    '/tools/unit-converter': 'Unit Converter',
    '/tools/base64': 'Base64 Tool',
    '/tools/image-compress': 'Image Compress',
    '/tools/code-dependency-visualizer': 'Code Dependency Visualizer',
    '/tools/bmi-calculator': 'BMI Calculator',
    '/tools/percentage-calculator': 'Percentage Calculator',
    '/tools/haiku-generator': 'AI Haiku Generator',
    '/tools/hashtag-generator': 'Hashtag Generator',
    '/tools/twitter-counter': 'Twitter Counter',
    '/tools/instagram-bio': 'Instagram Bio Generator',
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
    '/tools/pomodoro-timer': 'Pomodoro Timer',
    '/tools/spam-email-checker': 'Spam Email Checker',
    '/tools/stack-recommender': 'Stack Recommender',
    '/tools/tech-stack-analyzer': 'Tech Stack Analyzer',
    '/tools/token-compressor': 'AI Token Compressor',
    '/tools/pdf-test-generator': 'PDF Test Generator',
    '/tools/timestamp-converter': 'Timestamp Converter',
    '/tools/url-encoder': 'URL Encoder / Decoder',
    '/tools/aspect-ratio-calculator': 'Aspect Ratio Calculator',
    '/tools/word-counter-pro': 'Word Counter Pro',
    '/tools/hash-generator': 'Hash Generator',
    '/tools/regex-tester': 'Regex Tester',
    '/tools/code-formatter': 'Code Formatter',
    '/tools/meta-tag-generator': 'Meta Tag Generator',
    '/tools/cron-generator': 'Cron Generator',
    '/tools/diff-checker': 'Diff Checker',
    '/tools/voice-transcription': 'Voice Transcription',
  }
  return toolMap[pathname] || ''
}

// Tool to Category mapping
const getToolCategory = (pathname: string): { id: string; name: string } | null => {
  const toolCategoryMap: Record<string, { id: string; name: string }> = {
    // Converters
    '/tools/text-case': { id: 'converters', name: 'Converters' },
    '/tools/json-format': { id: 'converters', name: 'Converters' },
    '/tools/json-csv': { id: 'converters', name: 'Converters' },
    '/tools/markdown-html': { id: 'converters', name: 'Converters' },
    '/tools/base64': { id: 'converters', name: 'Converters' },
    '/tools/unit-converter': { id: 'converters', name: 'Converters' },
    '/tools/age-calculator': { id: 'converters', name: 'Converters' },
    '/tools/bmi-calculator': { id: 'converters', name: 'Converters' },
    '/tools/percentage-calculator': { id: 'converters', name: 'Converters' },
    '/tools/text-counter': { id: 'converters', name: 'Converters' },
    '/tools/twitter-counter': { id: 'converters', name: 'Converters' },
    '/tools/whatsapp-link': { id: 'converters', name: 'Converters' },
    '/tools/timestamp-converter': { id: 'converters', name: 'Converters' },
    '/tools/url-encoder': { id: 'converters', name: 'Converters' },
    '/tools/aspect-ratio-calculator': { id: 'converters', name: 'Converters' },
    '/tools/word-counter-pro': { id: 'converters', name: 'Converters' },
    
    // Editors
    '/tools/pdf-tools': { id: 'editors', name: 'Editors' },
    
    // Image Tools
    '/tools/bg-eraser': { id: 'image-tools', name: 'Image Tools' },
    '/tools/blurtap': { id: 'image-tools', name: 'Image Tools' },
    '/tools/color-palette': { id: 'image-tools', name: 'Image Tools' },
    '/tools/image-compress': { id: 'image-tools', name: 'Image Tools' },
    '/tools/image-grid-maker': { id: 'image-tools', name: 'Image Tools' },
    '/tools/image-splitter': { id: 'image-tools', name: 'Image Tools' },
    '/tools/japanese-ocr': { id: 'image-tools', name: 'Image Tools' },
    
    // Generators
    '/tools/password-generator': { id: 'generators', name: 'Generators' },
    '/tools/qr-code': { id: 'generators', name: 'Generators' },
    '/tools/favicon-generator': { id: 'generators', name: 'Generators' },
    '/tools/lorem-ipsum': { id: 'generators', name: 'Generators' },
    '/tools/gradient-generator': { id: 'generators', name: 'Generators' },
    '/tools/uuid-generator': { id: 'generators', name: 'Generators' },
    '/tools/countdown-timer': { id: 'generators', name: 'Generators' },
    '/tools/hashtag-generator': { id: 'generators', name: 'Generators' },
    '/tools/instagram-bio': { id: 'generators', name: 'Generators' },
    '/tools/haiku-generator': { id: 'generators', name: 'Generators' },
    
    // Analyzers
    '/tools/network-checker': { id: 'analyzers', name: 'Analyzers' },
    '/tools/pc-optimizer': { id: 'analyzers', name: 'Analyzers' },
    '/tools/spam-email-checker': { id: 'analyzers', name: 'Analyzers' },
    '/tools/competitive-analyzer': { id: 'analyzers', name: 'Analyzers' },
    '/tools/tech-stack-analyzer': { id: 'analyzers', name: 'Analyzers' },
    
    // Privacy
    '/tools/pdf-to-data': { id: 'privacy', name: 'Privacy' },
    
    // AI Tools
    '/tools/ai-summarizer': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/code-roaster': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/ai-prompt-generator': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/ai-dev-dictionary': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/ai-project-visualizer': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/ai-resume': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/pdf-summarizer': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/stack-recommender': { id: 'ai-tools', name: 'AI Tools' },
    '/tools/token-compressor': { id: 'ai-tools', name: 'AI Tools' },
    
    // Dev Tools
    '/tools/test-file-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/test-image-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/test-text-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/pdf-test-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/code-dependency-visualizer': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/hash-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/regex-tester': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/code-formatter': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/meta-tag-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/cron-generator': { id: 'dev-tools', name: 'Dev Tools' },
    '/tools/diff-checker': { id: 'dev-tools', name: 'Dev Tools' },
    
    // Learning
    '/tools/cornell-note': { id: 'learning', name: 'Learning' },
    '/tools/debate-trainer': { id: 'learning', name: 'Learning' },
    '/tools/pomodoro-timer': { id: 'learning', name: 'Learning' },
    
    // Audio Tools
    '/tools/voice-transcription': { id: 'audio-tools', name: 'Audio Tools' },
  }
  return toolCategoryMap[pathname] || null
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [toolTitle, setToolTitle] = useState('')
  const [toolCategory, setToolCategory] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    setToolTitle(getToolTitle(pathname))
    setToolCategory(getToolCategory(pathname))
  }, [pathname])

  // Get category name from pathname for category pages (e.g., /tools/editors)
  const getCategoryFromPath = (): { id: string; name: string } | null => {
    const categoryMap: Record<string, string> = {
      'converters': 'Converters',
      'editors': 'Editors',
      'image-tools': 'Image Tools',
      'generators': 'Generators',
      'analyzers': 'Analyzers',
      'privacy': 'Privacy',
      'ai-tools': 'AI Tools',
      'dev-tools': 'Dev Tools',
      'learning': 'Learning',
      'audio-tools': 'Audio Tools',
    }
    const parts = pathname.split('/')
    if (parts.length === 3 && parts[1] === 'tools') {
      const categoryId = parts[2]
      const categoryName = categoryMap[categoryId]
      if (categoryName) {
        return { id: categoryId, name: categoryName }
      }
    }
    return null
  }

  const currentCategory = getCategoryFromPath()
  const isCategoryPage = currentCategory !== null && !toolTitle

  return (
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
                {toolCategory && (
                  <>
                    <span className="mx-2">›</span>
                    <Link 
                      href={`/tools/${toolCategory.id}`} 
                      className="hover:text-gray-300 transition-colors"
                    >
                      {toolCategory.name}
                    </Link>
                  </>
                )}
              </div>

              {/* Tool title - center on desktop, left on mobile */}
              <div className="flex items-center gap-3 md:mx-auto">
                <h1 className="text-xl font-medium text-white">{toolTitle}</h1>
                {/* Portal target for tool-specific action buttons */}
                <div id="tool-header-actions" className="flex items-center gap-2" />
              </div>
            </div>
          </nav>
        )}

        {/* Category page breadcrumb (e.g., /tools/editors) */}
        {isCategoryPage && currentCategory && (
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
                <Link
                  href="/tools"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tools
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="text-gray-300">{currentCategory.name}</span>
              </div>
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