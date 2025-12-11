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

// Import unified ToolCard component
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
// Bento Grid Layout Configuration
// ========================================
// Define which categories get larger cards (featured)
const FEATURED_CATEGORIES = ['ai-tools', 'privacy']

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
    <div className="relative min-h-screen overflow-hidden">
      {/* ✨ Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-4 sm:py-6 md:py-8">
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
    </div>
  )
}

// ========================================
// Hero Section Component - WITH GRADIENT TEXT
// ========================================
function HeroSection({ stats }: { stats: Stats }) {
  return (
    <div className="max-w-7xl mx-auto text-center mb-6 sm:mb-8 md:mb-12 px-4 sm:px-6 lg:px-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                    bg-white/5 backdrop-blur-sm border border-white/10 
                    rounded-full mb-4 sm:mb-6">
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
        <span className="text-xs sm:text-sm text-gray-300">Free Forever • No Sign-up Required</span>
      </div>
      
      {/* Title with Gradient */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Instant Tools
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        <span className="text-white font-semibold">{stats.total}+</span> free tools • 
        <span className="text-cyan-400"> Zero Ads</span> • 
        <span className="text-purple-400"> Zero Tracking</span> • 
        <span className="text-emerald-400"> 100% Private</span>
      </p>
    </div>
  )
}

// ========================================
// Search Bar Component - GLASSMORPHISM
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e as any).key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="max-w-7xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-2xl mx-auto">
        {/* Glassmorphism Search Input */}
        <div className="relative group">
          <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 
                           text-gray-400 w-5 h-5 sm:w-6 sm:h-6 
                           group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search all tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3.5 sm:py-4 
                     bg-white/5 backdrop-blur-xl 
                     border border-white/10 rounded-2xl 
                     text-white placeholder-gray-500 
                     focus:outline-none focus:border-cyan-400/50 focus:bg-white/10
                     focus:ring-2 focus:ring-cyan-400/20
                     transition-all duration-300
                     text-base sm:text-lg"
            aria-label="Search tools"
          />
          {searchQuery && (
            <button
              onClick={onClear}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 
                       p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Keyboard Hint */}
        <div className="flex justify-center mt-3 gap-4 text-xs text-gray-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Enter</kbd> to search</span>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Search Results Component - GLASSMORPHISM CARDS
// ========================================
function SearchResults({ searchQuery, filteredTools, onClearSearch }: SearchResultsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Search Results Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
          Search Results for "{searchQuery}"
        </h2>
        <button
          onClick={onClearSearch}
          className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm 
                   font-medium flex items-center gap-1.5 sm:gap-2 flex-shrink-0
                   px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
        >
          <span className="hidden sm:inline">Clear search</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count */}
      <p className="text-sm sm:text-base text-gray-400">
        Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
      </p>

      {/* Results Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 
                        bg-white/5 backdrop-blur-xl rounded-2xl mb-6">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No tools found</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto">
            Try searching with different keywords or browse by category
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-400 hover:to-blue-400
                     text-white font-medium rounded-xl transition-all
                     shadow-lg shadow-cyan-500/25"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

// ========================================
// Category Grid Component - BENTO LAYOUT
// ========================================
function CategoryGrid({
  categories,
  categoryStats,
  featuredTools,
  newTools,
  stats,
}: CategoryGridProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* ✨ Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
        {categories.map((cat, index) => {
          // Determine if this category should be featured (larger)
          const isFeatured = FEATURED_CATEGORIES.includes(cat.id)
          
          return (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              toolCount={categoryStats[cat.id] || 0}
              isFeatured={isFeatured}
            />
          )
        })}
      </div>

      {/* Quick Access Sections - GLASSMORPHISM */}
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
// Category Card Component - GLASSMORPHISM + BENTO
// ========================================
function CategoryCard({ 
  category, 
  toolCount,
  isFeatured = false
}: { 
  category: Category
  toolCount: number
  isFeatured?: boolean
}) {
  const Icon = category.icon

  return (
    <Link
      href={`/tools/${category.id}`}
      className={`
        relative group overflow-hidden block
        bg-white/5 backdrop-blur-xl
        rounded-2xl sm:rounded-3xl 
        p-5 sm:p-6 md:p-7
        border border-white/10 
        hover:border-white/20 hover:bg-white/10
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-purple-500/10
        hover:-translate-y-1
        ${isFeatured 
          ? 'sm:col-span-2 lg:col-span-3' 
          : 'lg:col-span-2'
        }
      `}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-cyan-500/0 
                    group-hover:from-purple-500/10 group-hover:to-cyan-500/10 
                    transition-all duration-500 rounded-2xl sm:rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Icon with glow effect */}
            <div className={`
              relative p-3 sm:p-4 rounded-xl sm:rounded-2xl ${category.bgColor}
              shadow-lg group-hover:shadow-xl transition-shadow
              ${isFeatured ? 'p-4 sm:p-5' : ''}
            `}>
              <Icon className={`text-white ${isFeatured ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
              {/* Glow */}
              <div className={`absolute inset-0 ${category.bgColor} blur-xl opacity-50 -z-10`} />
            </div>
            <span className={`${isFeatured ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>
              {category.emoji}
            </span>
          </div>
          
          {/* Tool Count Badge */}
          <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 
                        bg-white/10 backdrop-blur-sm rounded-full 
                        text-xs sm:text-sm font-medium text-gray-300
                        border border-white/10">
            {toolCount} tools
          </span>
        </div>

        {/* Title & Description */}
        <div className="flex-1">
          <h3 className={`font-bold mb-2 sm:mb-3 text-white
            ${isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}
          `}>
            {category.name}
          </h3>
          <p className={`text-gray-400 leading-relaxed
            ${isFeatured ? 'text-base sm:text-lg line-clamp-3' : 'text-sm sm:text-base line-clamp-2'}
          `}>
            {category.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10">
          <span className="text-sm sm:text-base font-semibold text-cyan-400 
                        group-hover:text-cyan-300 transition-colors">
            Browse tools
          </span>
          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 
                               group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Quick Access Card Component - GLASSMORPHISM
// ========================================
function QuickAccessCard({ title, icon, tools, count, href }: QuickAccessCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl 
                  p-5 sm:p-6 md:p-7 border border-white/10
                  hover:border-white/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-lg sm:text-xl font-bold flex items-center text-white">
          {icon}
          {title}
        </h3>
        <Link
          href={href}
          className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          View all →
        </Link>
      </div>
      
      {/* Tool List */}
      <div className="space-y-2 sm:space-y-3">
        {tools.map((tool) => (
          <ToolCardCompact key={tool.id} tool={tool} />
        ))}
      </div>
      
      {/* Footer Stats */}
      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10 
                    text-center text-sm text-gray-500">
        {count} {title.toLowerCase()} available
      </div>
    </div>
  )
}