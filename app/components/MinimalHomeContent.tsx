'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Search,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Filter,
  X,
  MousePointer2,
  Zap
} from 'lucide-react'
import { 
  CATEGORIES, 
  TOOLS, 
  getEnabledCategories, 
  getToolsByCategory 
} from '@/lib/categories.config'
import { 
  getGridClassName, 
  getCardPaddingClass, 
  getIconSizeClass 
} from '@/lib/grid-utils'

// Badge component for tool cards
const BadgeLabel = ({ type, label }: { type: string; label: string }) => {
  const styles = {
    new: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    live: 'bg-green-500/20 text-green-400 border-green-500/30',
    ai: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    featured: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${styles[type as keyof typeof styles]}`}>
      {label}
    </span>
  )
}

export default function MinimalHomeContent() {
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showTools, setShowTools] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleToolsCount, setVisibleToolsCount] = useState(6)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const enabledCategories = getEnabledCategories()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    // If category param exists and is valid, select it
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      handleCategorySelect(categoryParam)
    } else if (!categoryParam && (showTools || selectedCategory)) {
      // If no category param but tools are showing, reset to category selection
      setSelectedCategory(null)
      setShowTools(false)
      setSearchQuery('')
      setVisibleToolsCount(6)
    }
  }, [searchParams])

  // Filter tools
  const filteredTools = selectedCategory 
    ? TOOLS.filter(tool => {
        const matchesCategory = tool.category === selectedCategory
        const matchesSearch = searchQuery === '' || 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesCategory && matchesSearch && tool.status === 'live'
      })
    : []

  // Scroll navigation for mobile
  const scrollToCategory = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Handle category selection with transition
  const handleCategorySelect = (categoryId: string) => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSelectedCategory(categoryId)
      setShowTools(true)
      setVisibleToolsCount(6)
      
      // Update URL
      const url = new URL(window.location.href)
      url.searchParams.set('category', categoryId)
      window.history.pushState({}, '', url)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  // Clear selection with transition
  const clearSelection = () => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSelectedCategory(null)
      setShowTools(false)
      setSearchQuery('')
      
      // Clear URL params
      const url = new URL(window.location.href)
      url.searchParams.delete('category')
      window.history.pushState({}, '', url)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  // Load more tools
  const loadMoreTools = () => {
    setVisibleToolsCount(prev => prev + 6)
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Show either categories OR tools, never both */}
      {!showTools ? (
        /* === CATEGORY SELECTION VIEW === */
        <>
          {/* Hero Section - Only shown in category view */}
          <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Free Tools • No Signup • 100% Private</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              What do you need
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                to get done today?
              </span>
            </h1>
            
            <p className="text-gray-400 mt-4 flex items-center justify-center gap-2">
              <MousePointer2 className="w-4 h-4" />
              Select a category to explore tools
            </p>
          </section>

          {/* Category Grid - Main Selection */}
          <section className="mb-8">
            <div className={`grid gap-4 ${getGridClassName(enabledCategories.length)}`}>
              {enabledCategories.map(category => {
                const toolCount = getToolsByCategory(category.id).filter(t => t.status === 'live').length
                const paddingClass = getCardPaddingClass(enabledCategories.length)
                const iconSizeClass = getIconSizeClass(enabledCategories.length)
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      relative ${paddingClass} rounded-xl transition-all hover:scale-105 
                      flex flex-col items-center justify-center min-h-[180px]
                      bg-white/5 hover:bg-white/10 border border-white/10
                      group cursor-pointer
                    `}
                  >
                    {category.badge && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-yellow-500 text-black rounded-lg font-bold">
                        {category.badge}
                      </span>
                    )}
                    
                    <div className={`${iconSizeClass} mb-3 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-center">{category.title}</h3>
                    <p className="text-xs text-cyan-400 mb-2 text-center">{category.tagline}</p>
                    <p className="text-xs text-gray-400 text-center">{toolCount} tools</p>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-cyan-400">
                    {TOOLS.filter(t => t.status === 'live').length}
                  </p>
                  <p className="text-xs text-gray-400">Live Tools</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-400">100%</p>
                  <p className="text-xs text-gray-400">Private</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-400">Free</p>
                  <p className="text-xs text-gray-400">Forever</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* === TOOLS VIEW === */
        <>
          {/* Breadcrumb / Back Navigation */}
          <section className="mb-6">
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </button>
          </section>

          {/* Selected Category Header */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.title}
                  </h2>
                  <p className="text-gray-400">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.description}
                  </p>
                  <p className="text-sm text-cyan-400 mt-1">
                    {filteredTools.length} tools available
                  </p>
                </div>
              </div>

              {/* Search within category */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search within ${CATEGORIES.find(c => c.id === selectedCategory)?.title}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.slice(0, visibleToolsCount).map((tool, index) => (
                  <Link
                    key={tool.id}
                    href={tool.url}
                    className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 hover:scale-105 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center text-xl group-hover:rotate-12 transition-transform`}>
                        {tool.icon}
                      </div>
                      
                      <div className="flex gap-1">
                        {tool.new && <BadgeLabel type="new" label="NEW" />}
                        {tool.apiRequired && <BadgeLabel type="ai" label="AI" />}
                        {tool.featured && <BadgeLabel type="featured" label="★" />}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tool.timeToUse}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {tool.users}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {visibleToolsCount < filteredTools.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreTools}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Show More ({filteredTools.length - visibleToolsCount} remaining)
                  </button>
                </div>
              )}
            </section>
          ) : (
            /* Empty State when no tools match search */
            <section className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 mb-4">No tools found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all"
              >
                Clear search
              </button>
            </section>
          )}

          {/* CTA Section - Also shown in tools view */}
          <section className="mt-20 text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Can't find what you need?
              </h3>
              <p className="text-gray-400 mb-6">
                We're constantly adding new tools based on user feedback.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all hover:scale-105"
              >
                Request a Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}