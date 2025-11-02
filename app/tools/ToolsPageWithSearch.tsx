'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Sparkles, Clock, ChevronRight, ArrowRight, X, Grid3x3, List } from 'lucide-react'
import { getEnabledCategories } from '@/lib/categories-config'
import type { Tool } from '@/lib/categories/types'

// Import unified ToolCard components ✨
import ToolCard, { ToolCardCompact } from '@/components/ToolCard'

// ========================================
// Type Definitions
// ========================================
// Omit 'icon' from Tool type (removed in Server Component)
type ClientTool = Omit<Tool, 'icon'>

interface ToolsPageWithSearchProps {
  tools: ClientTool[]
}

type ViewMode = 'grid' | 'list'

// ========================================
// Main Component
// ========================================
export default function ToolsPageWithSearch({ tools }: ToolsPageWithSearchProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(
    searchParams?.get('featured') === 'true'
  )
  const [showNewOnly, setShowNewOnly] = useState(searchParams?.get('new') === 'true')

  // Get enabled categories
  const categories = useMemo(() => getEnabledCategories(), [])

  // Update search query from URL
  useEffect(() => {
    const search = searchParams?.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  // Filter tools
  const filteredTools = useMemo(() => {
    let filtered = tools

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter((tool) => tool.featured)
    }

    // Filter by new
    if (showNewOnly) {
      filtered = filtered.filter((tool) => tool.new)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.name?.toLowerCase().includes(query) ||
          tool.description?.toLowerCase().includes(query) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [tools, selectedCategory, showFeaturedOnly, showNewOnly, searchQuery])

  // Statistics
  const stats = {
    total: tools.length,
    filtered: filteredTools.length,
    featured: tools.filter((t) => t.featured).length,
    new: tools.filter((t) => t.new).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Filters & View Toggle - RESPONSIVE */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 sm:mb-8">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* View Toggle & Quick Filters */}
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <QuickFilters
            showFeaturedOnly={showFeaturedOnly}
            setShowFeaturedOnly={setShowFeaturedOnly}
            showNewOnly={showNewOnly}
            setShowNewOnly={setShowNewOnly}
          />
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Results Count */}
      <ResultsCount
        filtered={stats.filtered}
        total={stats.total}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* Tools Display - WITH UNIFIED CARDS */}
      {viewMode === 'grid' ? (
        <ToolsGrid tools={filteredTools} />
      ) : (
        <ToolsList tools={filteredTools} />
      )}
    </div>
  )
}

// ========================================
// Hero Section Component - RESPONSIVE
// ========================================
function HeroSection({ stats }: { stats: { total: number; featured: number; new: number } }) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 
                    bg-cyan-500/10 rounded-full mb-3 sm:mb-4">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
        <span className="text-xs sm:text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 
                   bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        All Tools
      </h1>
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
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                         text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search all tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 
                   bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 
                   focus:outline-none focus:border-cyan-400 
                   text-base sm:text-lg transition-all"
          aria-label="Search tools"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
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
// Category Filter Component - RESPONSIVE
// ========================================
function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: any[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all
          ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
      >
        All Tools
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm 
                    transition-all flex items-center gap-1.5 sm:gap-2
            ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <span className="text-sm sm:text-base">{cat.emoji}</span>
          <span className="hidden sm:inline">{cat.name}</span>
        </button>
      ))}
    </div>
  )
}

// ========================================
// Quick Filters Component - RESPONSIVE
// ========================================
function QuickFilters({
  showFeaturedOnly,
  setShowFeaturedOnly,
  showNewOnly,
  setShowNewOnly,
}: {
  showFeaturedOnly: boolean
  setShowFeaturedOnly: (show: boolean) => void
  showNewOnly: boolean
  setShowNewOnly: (show: boolean) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all
          ${
            showFeaturedOnly
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
      >
        <span className="sm:hidden">⭐</span>
        <span className="hidden sm:inline">⭐ Featured</span>
      </button>
      <button
        onClick={() => setShowNewOnly(!showNewOnly)}
        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all
          ${
            showNewOnly
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
      >
        <span className="sm:hidden">🆕</span>
        <span className="hidden sm:inline">🆕 New</span>
      </button>
    </div>
  )
}

// ========================================
// View Toggle Component - RESPONSIVE
// ========================================
function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}) {
  return (
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1 ml-auto lg:ml-0">
      <button
        onClick={() => setViewMode('grid')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 
                  rounded-md font-medium text-xs sm:text-sm transition-all
          ${
            viewMode === 'grid'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="Grid view"
      >
        <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 
                  rounded-md font-medium text-xs sm:text-sm transition-all
          ${
            viewMode === 'list'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="List view"
      >
        <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  )
}

// ========================================
// Results Count Component - RESPONSIVE
// ========================================
function ResultsCount({
  filtered,
  total,
  searchQuery,
  selectedCategory,
  categories,
}: {
  filtered: number
  total: number
  searchQuery: string
  selectedCategory: string
  categories: any[]
}) {
  const categoryName = categories.find((c) => c.id === selectedCategory)?.name || 'All'

  return (
    <div className="mb-4 sm:mb-6">
      <p className="text-xs sm:text-sm text-gray-400">
        Showing <span className="text-cyan-400 font-semibold">{filtered}</span> of{' '}
        <span className="font-semibold">{total}</span> tools
        {selectedCategory !== 'all' && (
          <span className="text-cyan-400"> • Category: {categoryName}</span>
        )}
        {searchQuery && <span className="text-cyan-400"> • Search: "{searchQuery}"</span>}
      </p>
    </div>
  )
}

// ========================================
// Tools Grid Component - WITH UNIFIED CARD
// ========================================
function ToolsGrid({ tools }: { tools: ClientTool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <p className="text-gray-400 text-lg sm:text-xl mb-2">No tools found</p>
        <p className="text-gray-500 text-sm sm:text-base">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                  gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// Tools List Component - WITH UNIFIED COMPACT CARD
// ========================================
function ToolsList({ tools }: { tools: ClientTool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <p className="text-gray-400 text-lg sm:text-xl mb-2">No tools found</p>
        <p className="text-gray-500 text-sm sm:text-base">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tools.map((tool) => (
        <ToolCardCompact key={tool.id} tool={tool} />
      ))}
    </div>
  )
}