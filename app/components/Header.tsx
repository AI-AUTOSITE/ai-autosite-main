// app/components/Header.tsx

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Sparkles, Menu, X, HelpCircle } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [GuideComponent, setGuideComponent] = useState<React.ComponentType<any> | null>(null)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Check if tool page
  const isToolPage = pathname.startsWith('/tools/') && pathname !== '/tools'
  
  // Load guide component dynamically
  useEffect(() => {
    const loadGuide = async () => {
      if (!isToolPage) {
        setGuideComponent(null)
        return
      }

      try {
        const toolName = pathname.split('/').pop()
        if (!toolName) {
          setGuideComponent(null)
          return
        }

        const guideModule = await import(`../tools/${toolName}/guide`).catch(() => null)
        if (guideModule && guideModule.default) {
          setGuideComponent(() => guideModule.default)
        } else {
          setGuideComponent(null)
        }
      } catch {
        setGuideComponent(null)
      }
    }
    loadGuide()
    setShowGuide(false) // Reset when changing pages
  }, [pathname, isToolPage])

  // ESCキーでガイドを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGuide) {
        setShowGuide(false)
      }
    }
    
    if (showGuide) {
      document.addEventListener('keydown', handleEsc)
      // スクロールを防ぐ
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [showGuide])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/95 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI AutoSite
                </h1>
                <p className="text-xs text-gray-400">Free • Private • Instant</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Guide button - before navigation items */}
              {isToolPage && GuideComponent && (
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all mr-2"
                  title="View tool guide"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Guide</span>
                </button>
              )}
              
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                               (item.href === '/blog' && pathname.startsWith('/blog'))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900/95 backdrop-blur-xl">
            <nav className="px-4 py-4 space-y-2">
              {/* Mobile Guide button */}
              {isToolPage && GuideComponent && (
                <button
                  onClick={() => {
                    setShowGuide(true)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-base font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>Tool Guide</span>
                </button>
              )}
              
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                               (item.href === '/blog' && pathname.startsWith('/blog'))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg text-base font-medium transition-all
                      ${isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-gray-300 bg-gray-800/50 hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Guide Modal - 修正版 */}
      {showGuide && GuideComponent && (
        <>
          {/* 背景オーバーレイ（クリックで閉じる） */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100000] backdrop-blur-sm animate-fade-in"
            onClick={() => setShowGuide(false)}
            aria-label="Close modal overlay"
          />
          
          {/* モーダルコンテンツコンテナ */}
          <div className="fixed inset-0 z-[100001] overflow-y-auto pointer-events-none">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* モーダル本体（pointer-events-autoで独立したクリック領域に） */}
              <div className="pointer-events-auto animate-scale-in">
                <Suspense fallback={
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-3 text-gray-300">Loading guide...</span>
                    </div>
                  </div>
                }>
                  <GuideComponent onClose={() => setShowGuide(false)} />
                </Suspense>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}