'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Shield, Sparkles, Home, Zap, Code, BookOpen, Menu, X, Palette } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'

// Header内容をSuspenseでラップ
function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPersona, setCurrentPersona] = useState<string | null>(null)
  
  // personaパラメータを取得
  useEffect(() => {
    const persona = searchParams.get('persona')
    setCurrentPersona(persona)
  }, [searchParams])
  
  // Determine current section
  const isTools = pathname.startsWith('/tools')
  const isBlog = pathname.startsWith('/blog')
  const isHome = pathname === '/'
  
  // Updated navigation with personas
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { 
      href: '/?persona=quick-tools', 
      label: 'Quick Tools', 
      icon: Zap,
      scrollTo: true,
      persona: 'quick-tools'
    },
    { 
      href: '/?persona=dev-tools', 
      label: 'Dev Tools', 
      icon: Code,
      scrollTo: true,
      persona: 'dev-tools'
    },
    { 
      href: '/?persona=learning', 
      label: 'Learning', 
      icon: BookOpen,
      scrollTo: true,
      persona: 'learning'
    },
    { href: '/blog', label: 'Blog', icon: Palette },
  ]
  
  // アクティブ状態の判定
  const isNavItemActive = (item: any) => {
    // Blogページの場合
    if (item.href === '/blog' && pathname.startsWith('/blog')) {
      return true
    }
    
    // Homeページの場合
    if (item.href === '/' && pathname === '/' && !item.persona) {
      return !currentPersona // personaがない場合のみHomeがアクティブ
    }
    
    // Persona付きリンクの場合
    if (item.persona && pathname === '/') {
      return currentPersona === item.persona
    }
    
    return false
  }
  
  // Handle navigation click for persona links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (item.scrollTo && pathname === '/') {
      e.preventDefault()
      
      // Update URL with persona parameter
      const url = new URL(window.location.href)
      url.searchParams.set('persona', item.persona)
      window.history.pushState({}, '', url)
      
      // Update current persona state
      setCurrentPersona(item.persona)
      
      // Trigger custom event to update the persona
      window.dispatchEvent(new CustomEvent('personaChange', { detail: item.persona }))
      
      // Scroll to tools section
      const toolsSection = document.getElementById('tools-section')
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    // Close mobile menu
    setMobileMenuOpen(false)
  }
  
  // Get current tool name if on a tool page
  const getToolName = () => {
    const toolPaths: Record<string, string> = {
      '/tools/blurtap': 'BlurTap',
      '/tools/code-reader': 'Code Reader',
      '/tools/tech-stack-analyzer': 'Tech Stack Analyzer',
      '/tools/ai-dev-dictionary': 'AI Dev Dictionary',
      '/tools/text-case': 'Text Case Converter',
      '/tools/json-format': 'JSON Beautify',
    }
    return toolPaths[pathname] || 'Tools'
  }
  
  return (
    <header className="relative z-50 backdrop-blur-xl bg-gray-900/95 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Shield className="w-10 h-10 text-cyan-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {isTools ? getToolName() : isBlog ? 'Tech Blog' : 'AI AutoSite'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Free • Private • Instant
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isNavItemActive(item)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`
                    relative flex items-center space-x-2 px-3 py-2 rounded-lg
                    text-sm overflow-hidden
                    ${isActive 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {/* 背景エフェクト（別レイヤー） */}
                  <div 
                    className={`
                      absolute inset-0 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-100' 
                        : 'bg-gray-800/50 opacity-100 hover:bg-gray-700/50'
                      }
                    `}
                  />
                  
                  {/* ボーダーエフェクト（別レイヤー） */}
                  <div 
                    className={`
                      absolute inset-0 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'border border-cyan-500/30' 
                        : 'border border-transparent'
                      }
                    `}
                  />
                  
                  {/* コンテンツ（最前面） */}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="hidden lg:inline relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isNavItemActive(item)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Suspense境界でラップしたHeaderコンポーネント
export default function Header() {
  return (
    <Suspense fallback={
      <header className="relative z-50 backdrop-blur-xl bg-gray-900/95 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-10 h-10 text-cyan-400" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI AutoSite
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Free • Private • Instant
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
}