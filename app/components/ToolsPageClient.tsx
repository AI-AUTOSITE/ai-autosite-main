'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Clock, ArrowRight, X } from 'lucide-react'

// Import unified data system
import {
  getActiveTools,
  getToolsByCategory,
  getFeaturedTools,
  getNewTools,
} from '@/lib/unified-data'

// Import categories from unified config
import { getEnabledCategories } from '@/lib/categories-config'

// Import unified ToolCard component ✨ NEW
import ToolCard, { ToolCardCompact } from '@/components/ToolCard'

// ========================================
// Type Definitions
// ========================================
interface Tool {
  id: string
  name: string
  description: string
  url: string
  icon?: string
  emoji?: string
  featured?: boolean
  new?: boolean
  timeToUse?: string
  categoryId?: string
  isActive?: boolean
  status?: string
}

interface Category {
  id: string
  name: string
  description: string
  emoji: string
  icon: any
  bgColor: string
}

interface Stats {
  total: number
  featured: number
  new: number
}

interface QuickAccessCardProps {
  title: string
  icon: ReactNode
  tools: Tool[]
  count: number
  href: string
}

interface CategoryGridProps {
  categories: Category[]
  categoryStats: Record<string, number>
  featuredTools: Tool[]
  newTools: Tool[]
  stats: Stats
}

interface SearchResultsProps {
  searchQuery: string
  filteredTools: Tool[]
  onClearSearch: () => void
}

// ========================================
// Main Component
// ========================================
export default function ToolsPageClient() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get enabled categories
  const categories = useMemo(() => getEnabledCategories(), [])

  // Category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    categories.forEach((cat) => {
      const categoryTools = getToolsByCategory(cat.id).filter(
        (t: Tool) => t.isActive || t.status === 'live'
      )
      stats[cat.id] = categoryTools.length
    })
    return stats
  }, [categories])

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      const allTools = getActiveTools()
      setTools(allTools)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Statistics
  const stats = useMemo(
    () => ({
      total: tools.length,
      featured: tools.filter((t) => t.featured).length,
      new: tools.filter((t) => t.new).length,
    }),
    [tools]
  )

  // Featured and new tools for quick access
  const featuredTools = useMemo(() => getFeaturedTools(4), [])
  const newTools = useMemo(() => getNewTools(4), [])

  // Real-time search filtering
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    
    return tools.filter((tool) => {
      const nameMatch = tool.name.toLowerCase().includes(query)
      const descMatch = tool.description.toLowerCase().includes(query)
      const idMatch = tool.id.toLowerCase().includes(query)
      
      return nameMatch || descMatch || idMatch
    })
  }, [searchQuery, tools])

  // Handle search - use Next.js router for Enter key
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/tools?search=${encodeURIComponent(query)}`)
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6 md:py-8">
      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* Conditional Rendering: Search Results or Category Grid */}
      {searchQuery.trim() ? (
        <SearchResults
          searchQuery={searchQuery}
          filteredTools={filteredTools}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <CategoryGrid
          categories={categories}
          categoryStats={categoryStats}
          featuredTools={featuredTools}
          newTools={newTools}
          stats={stats}
        />
      )}
    </div>
  )
}

// ========================================
// Hero Section Component - RESPONSIVE
// ========================================
function HeroSection({ stats }: { stats: Stats }) {
  return (
    <div className="text-center mb-4 sm:mb-6 md:mb-8 px-4">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 
                    bg-cyan-500/10 rounded-full mb-2 sm:mb-3">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
        <span className="text-xs sm:text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">Instant Tools</h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">
        {stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
      </p>
    </div>
  )
}

// ========================================
// Search Bar Component - RESPONSIVE
// ========================================
function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: (query: string) => void
  onClear: () => void
}) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="mb-4 sm:mb-6 md:mb-8 px-4">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                         text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search all tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 
                   bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 
                   focus:outline-none focus:border-cyan-400 
                   text-base sm:text-lg"
          aria-label="Search tools"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 
                     p-1 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  )
}

// ========================================
// Search Results Component - WITH UNIFIED CARD
// ========================================
function SearchResults({ searchQuery, filteredTools, onClearSearch }: SearchResultsProps) {
  return (
    <div className="space-y-4 sm:space-y-6 px-4">
      {/* Search Results Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
          Search Results for "{searchQuery}"
        </h2>
        <button
          onClick={onClearSearch}
          className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm 
                   font-medium flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
        >
          <span className="hidden sm:inline">Clear search</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count */}
      <p className="text-sm sm:text-base text-gray-400">
        Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
      </p>

      {/* Results Grid - FULLY RESPONSIVE */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-5xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No tools found</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4">
            Try searching with different keywords or browse by category
          </p>
          <button
            onClick={onClearSearch}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 
                     text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

// ========================================
// Category Grid Component - RESPONSIVE
// ========================================
function CategoryGrid({
  categories,
  categoryStats,
  featuredTools,
  newTools,
  stats,
}: CategoryGridProps) {
  return (
    <div className="space-y-6 sm:space-y-8 px-4">
      {/* Category Cards Grid - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} toolCount={categoryStats[cat.id] || 0} />
        ))}
      </div>

      {/* Quick Access Sections - RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <QuickAccessCard
          title="Featured Tools"
          icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />}
          tools={featuredTools}
          count={stats.featured}
          href="/tools?featured=true"
        />

        <QuickAccessCard
          title="Recently Added"
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />}
          tools={newTools}
          count={stats.new}
          href="/tools?new=true"
        />
      </div>
    </div>
  )
}

// ========================================
// Category Card Component - RESPONSIVE
// ========================================
function CategoryCard({ category, toolCount }: { category: Category; toolCount: number }) {
  const Icon = category.icon

  return (
    <Link
      href={`/tools/${category.id}`}
      className="relative group bg-gradient-to-br from-gray-800 to-gray-900 
                 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 
                 border border-gray-700 hover:border-cyan-500/50 
                 transition-all duration-300 
                 hover:shadow-xl hover:shadow-cyan-500/20 
                 hover:scale-[1.02] cursor-pointer overflow-hidden block"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${category.bgColor}`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl">{category.emoji}</span>
          </div>
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-700 rounded-full 
                       text-xs sm:text-sm font-medium text-gray-300 flex-shrink-0">
            {toolCount} tools
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{category.name}</h3>
        <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 line-clamp-2">
          {category.description}
        </p>

        <div className="flex items-center text-sm sm:text-base font-semibold 
                      text-cyan-400 group-hover:gap-3 transition-all">
          Browse tools
          <ArrowRight className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 
                               group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Quick Access Card Component - WITH COMPACT VARIANT
// ========================================
function QuickAccessCard({ title, icon, tools, count, href }: QuickAccessCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-700">
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <ToolCardCompact key={tool.id} tool={tool} />
        ))}
        <Link
          href={href}
          className="w-full text-center text-cyan-400 hover:text-cyan-300 
                   text-xs sm:text-sm font-medium pt-2 block"
        >
          View all {count} {title.toLowerCase()} →
        </Link>
      </div>
    </div>
  )
}