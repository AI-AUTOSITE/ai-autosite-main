'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
  Shield, 
  Sparkles, 
  Home, 
  Zap, 
  Code, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Menu, 
  X, 
  ChevronDown, 
  Palette, 
  HelpCircle 
} from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { CATEGORIES, getEnabledCategories } from '../lib/categories.config'

type NavItem = {
  href?: string
  label: string
  icon: any
  isDropdown?: boolean
  clearCategory?: boolean
}

function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  
  const enabledCategories = getEnabledCategories()
  const allCategories = CATEGORIES

  useEffect(() => {
    const category = searchParams.get('category') || searchParams.get('persona')
    setCurrentCategory(category)
  }, [searchParams])

  const isTools = pathname.startsWith('/tools')
  const isBlog = pathname.startsWith('/blog')
  const isHome = pathname === '/'

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home, clearCategory: true },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { label: 'Tools', icon: Zap, isDropdown: true },
    { href: '/blog', label: 'Blog', icon: Palette },
  ]

  const isNavItemActive = (item: NavItem) => {
    if (!item.isDropdown && item.href === '/blog' && pathname.startsWith('/blog')) {
      return true
    }
    if (!item.isDropdown && item.href === '/' && pathname === '/' && !currentCategory) {
      return true
    }
    if (item.isDropdown && (isTools || currentCategory)) {
      return true
    }
    return false
  }

  const handleCategoryClick = (category: any) => {
    if (!category.enabled) return
    
    // Always navigate to home page with category parameter
    window.location.href = `/?category=${category.id}`
    
    setToolsDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <header className="relative z-50 backdrop-blur-xl bg-gray-900/95 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo - Always goes to home without category */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              // Clear category and navigate to clean home
              window.location.href = '/'
            }}
          >
            <div className="relative">
              <Shield className="w-10 h-10 text-cyan-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI AutoSite
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Free • Private • Instant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isNavItemActive(item)
              
              if (item.isDropdown) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                      className={`
                        relative flex items-center space-x-2 px-3 py-2 rounded-lg
                        text-sm overflow-hidden
                        ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}
                      `}
                    >
                      {/* Background */}
                      <div
                        className={`
                          absolute inset-0 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-100' 
                            : 'bg-gray-800/50 opacity-100 hover:bg-gray-700/50'
                          }
                        `}
                      />
                      {/* Content */}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="hidden lg:inline relative z-10">{item.label}</span>
                      <ChevronDown className={`w-4 h-4 relative z-10 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {toolsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* All Tools Link */}
                        <Link
                          href="/tools"
                          onClick={() => setToolsDropdownOpen(false)}
                          className="flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-xl">🎯</span>
                          <div>
                            <div className="text-white font-medium">All Tools</div>
                            <div className="text-xs text-gray-400">Browse everything</div>
                          </div>
                        </Link>
                        
                        <div className="my-1 border-t border-white/10"></div>
                        
                        {/* Categories */}
                        <div className="p-2">
                          {allCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryClick(cat)}
                              disabled={!cat.enabled}
                              className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                cat.enabled 
                                  ? 'hover:bg-white/10 cursor-pointer' 
                                  : 'opacity-50 cursor-not-allowed'
                              } ${currentCategory === cat.id ? 'bg-white/10' : ''}`}
                            >
                              <span className="text-xl">{cat.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-white text-sm">{cat.title}</span>
                                  {cat.badge && (
                                    <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                                      {cat.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              if (!item.isDropdown && item.href) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center space-x-2 px-3 py-2 rounded-lg
                      text-sm overflow-hidden
                      ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}
                    `}
                    onClick={(e) => {
                      // If this is the Home link, ensure clean navigation
                      if (item.clearCategory) {
                        e.preventDefault()
                        window.location.href = '/'
                      }
                    }}
                  >
                    {/* Background */}
                    <div
                      className={`
                        absolute inset-0 rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-100' 
                          : 'bg-gray-800/50 opacity-100 hover:bg-gray-700/50'
                        }
                      `}
                    />
                    {/* Border effect */}
                    <div
                      className={`
                        absolute inset-0 rounded-lg transition-all duration-300
                        ${isActive ? 'border border-cyan-500/30' : 'border border-transparent'}
                      `}
                    />
                    {/* Content */}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="hidden lg:inline relative z-10">{item.label}</span>
                  </Link>
                )
              }

              return null
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="space-y-2">
              {/* Home */}
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  window.location.href = '/'
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {/* All Tools */}
              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              >
                <Sparkles className="w-5 h-5" />
                <span>All Tools</span>
              </Link>

              {/* Categories */}
              <div className="pl-4">
                {enabledCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.title}</span>
                  </button>
                ))}
              </div>

              {/* Blog */}
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              >
                <Palette className="w-5 h-5" />
                <span>Blog</span>
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              >
                <HelpCircle className="w-5 h-5" />
                <span>FAQ</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

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
                <p className="text-xs text-gray-400 mt-0.5">Free • Private • Instant</p>
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