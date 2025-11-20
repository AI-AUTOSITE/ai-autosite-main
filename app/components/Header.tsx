// app/components/Header.tsx

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, HelpCircle, Home, FileText, Zap } from 'lucide-react'
import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import SignalBrand from './icons/SignalBrand'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [GuideComponent, setGuideComponent] = useState<React.ComponentType<any> | null>(null)
  
  // ✅ Ref for DOM operations (avoid forced reflow)
  const headerRef = useRef<HTMLElement>(null)

  // Navigation items with icons - Automationを追加 
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { 
      href: '/automation', 
      label: 'Automation', 
      icon: Zap,
      badge: 'NEW',
      highlight: true 
    },
    { href: '/blog', label: 'Blog', icon: FileText },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  // Check if current page is a tool page
  const isToolPage = pathname.startsWith('/tools/') && pathname !== '/tools'

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

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
    setShowGuide(false)
  }, [pathname, isToolPage])

  // ✅ Optimized: Handle ESC key press and body overflow
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showGuide) setShowGuide(false)
        if (mobileMenuOpen) setMobileMenuOpen(false)
      }
    }

    // ✅ Batch DOM operations to prevent forced reflow
    if (showGuide || mobileMenuOpen) {
      document.addEventListener('keydown', handleEsc)
      // ✅ Use requestAnimationFrame to batch style changes
      requestAnimationFrame(() => {
        if (showGuide) {
          document.body.style.overflow = 'hidden'
        }
      })
    } else {
      // ✅ Cleanup in batch
      requestAnimationFrame(() => {
        document.body.style.overflow = ''
      })
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      requestAnimationFrame(() => {
        document.body.style.overflow = ''
      })
    }
  }, [showGuide, mobileMenuOpen])

  // ✅ Optimized: Close mobile menu when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('header')) return
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      // ✅ Use setTimeout to avoid immediate event listener trigger
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [mobileMenuOpen, handleClickOutside])

  return (
    <>
      {/* Main Header */}
      <header 
        ref={headerRef}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/95 border-b border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - SignalBrandコンポーネントを使用 */}
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => {
                setMobileMenuOpen(false)
                setShowGuide(false)
              }}
            >
              <SignalBrand size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Guide button (only on tool pages) */}
              {isToolPage && GuideComponent && (
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all mr-2"
                  title="View tool guide"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Guide</span>
                </button>
              )}

              {/* Navigation links */}
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || 
                  (item.href === '/blog' && pathname.startsWith('/blog')) ||
                  (item.href === '/automation' && pathname.startsWith('/automation'))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      flex items-center gap-2 relative
                      ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : item.highlight
                          ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
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
          <>
            {/* Background overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu overlay"
            />

            {/* Menu content */}
            <div className="md:hidden fixed right-0 top-16 left-0 z-50 border-t border-gray-700 bg-gray-900/95 backdrop-blur-xl animate-slide-down">
              <nav className="px-4 py-4 space-y-2">
                {/* Mobile Guide button */}
                {isToolPage && GuideComponent && (
                  <button
                    onClick={() => {
                      setShowGuide(true)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-start gap-2 w-full px-4 py-3 rounded-lg text-base font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all"
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Tool Guide</span>
                  </button>
                )}

                {/* Navigation links */}
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/blog' && pathname.startsWith('/blog')) ||
                    (item.href === '/automation' && pathname.startsWith('/automation'))
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all relative
                        ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : item.highlight
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-gray-300 bg-gray-800/50 hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </>
        )}
      </header>

      {/* Guide Modal */}
      {showGuide && GuideComponent && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[100000] backdrop-blur-sm animate-fade-in"
            onClick={() => setShowGuide(false)}
            aria-label="Close modal overlay"
          />

          {/* Modal content container */}
          <div className="fixed inset-0 z-[100001] overflow-y-auto pointer-events-none">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Modal body */}
              <div className="pointer-events-auto animate-scale-in">
                <Suspense
                  fallback={
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span className="ml-3 text-gray-300">Loading guide...</span>
                      </div>
                    </div>
                  }
                >
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