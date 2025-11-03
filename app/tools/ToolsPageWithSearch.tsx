'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Sparkles, Clock, ChevronRight, ArrowRight, X, Grid3x3, List } from 'lucide-react'
import { getEnabledCategories } from '@/lib/categories-config'
import type { Tool } from '@/lib/categories/types'

declare module 'lucide-react' {
  export interface LucideProps {
    className?: string
  }
}
// Import unified ToolCard components ✨
import ToolCard, { ToolCardCompact } from '@/components/ToolCard'

// ========================================
// 🎨 ELEGANT STYLE CONSTANTS - Minimal & Sophisticated
// ========================================

// Transitions - Smooth and natural
const TRANSITION_BASE = 'transition-all duration-300 ease-out'
const TRANSITION_FAST = 'transition-all duration-200 ease-out'

// Category Filter Buttons - Elegant with subtle effects
const CATEGORY_BASE = `
  relative px-4 sm:px-5 py-2.5 sm:py-3
  rounded-lg
  font-medium text-sm sm:text-base
  ${TRANSITION_BASE}
  whitespace-nowrap flex-shrink-0
  inline-flex items-center gap-2
`

const CATEGORY_INACTIVE = `
  text-gray-400 
  hover:text-gray-200 
  hover:bg-gray-800/50
  border border-transparent
`

const CATEGORY_ACTIVE = `
  text-white
  bg-gradient-to-br from-gray-800/80 to-gray-800/50
  border border-gray-700/50
  shadow-lg shadow-cyan-500/10
  after:absolute after:bottom-0 after:left-0 after:right-0
  after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-purple-400
  after:rounded-full
`

// Quick Filter Chips - Toggle style with elegant colors
const CHIP_BASE = `
  px-4 py-2
  rounded-full
  font-medium text-sm
  ${TRANSITION_BASE}
  inline-flex items-center gap-2
  border
`

const CHIP_FEATURED_OFF = `
  bg-gray-800/30
  border-gray-700/30
  text-gray-400
  hover:bg-gray-800/50
  hover:border-gray-700/50
  hover:text-gray-300
`

const CHIP_FEATURED_ON = `
  bg-gradient-to-r from-purple-500/20 to-pink-500/20
  border-purple-400/40
  text-purple-300
  shadow-lg shadow-purple-500/20
`

const CHIP_NEW_OFF = `
  bg-gray-800/30
  border-gray-700/30
  text-gray-400
  hover:bg-gray-800/50
  hover:border-gray-700/50
  hover:text-gray-300
`

const CHIP_NEW_ON = `
  bg-gradient-to-r from-green-500/20 to-emerald-500/20
  border-green-400/40
  text-green-300
  shadow-lg shadow-green-500/20
`

// View Toggle - Segmented control style
const VIEW_TOGGLE_CONTAINER = `
  relative
  inline-flex
  p-1
  bg-gray-800/50
  border border-gray-700/30
  rounded-lg
  ${TRANSITION_BASE}
`

const VIEW_BUTTON_BASE = `
  relative z-10
  px-3 sm:px-4
  py-2
  rounded-md
  font-medium text-sm
  ${TRANSITION_FAST}
  inline-flex items-center gap-2
`

const VIEW_BUTTON_INACTIVE = `
  text-gray-400
  hover:text-gray-200
`

const VIEW_BUTTON_ACTIVE = `
  text-white
`

// Icon sizes
const ICON_SM = 'w-4 h-4'
const ICON_BASE = 'w-4 h-4 sm:w-5 sm:h-5'

// Spacing
const SPACING_SECTION = 'mb-6 sm:mb-8'
const SPACING_RESULTS = 'mb-4 sm:mb-6'

// ========================================
// Type Definitions
// ========================================
type ClientTool = Omit<Tool, 'icon'>

interface ToolsPageWithSearchProps {
  tools: ClientTool[]
}

type ViewMode = 'grid' | 'list'

// ========================================
// 🏗️ MAIN COMPONENT
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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter((tool) => tool.featured)
    }

    if (showNewOnly) {
      filtered = filtered.filter((tool) => tool.new)
    }

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

      {/* Category Filter - Full width with elegant scroll */}
      <div className={SPACING_SECTION}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Quick Filters & View Toggle - Elegant layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        {/* Quick Filters - Left side */}
        <QuickFilters
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          showNewOnly={showNewOnly}
          setShowNewOnly={setShowNewOnly}
        />

        {/* View Toggle - Right side */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Results Count */}
      <ResultsCount
        filtered={stats.filtered}
        total={stats.total}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* Tools Display */}
      {viewMode === 'grid' ? (
        <ToolsGrid tools={filteredTools} />
      ) : (
        <ToolsList tools={filteredTools} />
      )}
    </div>
  )
}

// ========================================
// 🎭 HERO SECTION
// ========================================
function HeroSection({ stats }: { stats: { total: number; featured: number; new: number } }) {
  return (
    <div className={`text-center ${SPACING_SECTION}`}>
      {/* Badge with refined styling */}
      <div className="inline-flex items-center gap-2 
                    px-4 py-1.5 
                    bg-gradient-to-r from-cyan-500/10 to-purple-500/10
                    border border-cyan-400/20
                    rounded-full 
                    mb-4">
        <Sparkles className={`${ICON_SM} text-cyan-400`} />
        <span className="text-xs sm:text-sm text-cyan-300 font-medium">
          Free Forever • No Sign-up Required
        </span>
      </div>

      {/* Title with elegant gradient */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl 
                   font-bold 
                   mb-3 
                   bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300
                   bg-clip-text text-transparent
                   tracking-tight">
        All Tools
      </h1>

      {/* Subtitle with refined spacing */}
      <p className="text-sm sm:text-base md:text-lg 
                  text-gray-400 
                  font-light
                  px-4">
        {stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
      </p>
    </div>
  )
}

// ========================================
// 🔍 SEARCH BAR - Elegant with refined borders
// ========================================
function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
    <div className={SPACING_SECTION}>
      <div className="relative max-w-2xl mx-auto">
        {/* Search Icon */}
        <Search className={`absolute 
                          left-4 sm:left-5
                          top-1/2 -translate-y-1/2 
                          ${ICON_BASE}
                          text-gray-500
                          ${TRANSITION_BASE}`} 
        />

        {/* Input Field - Elegant styling */}
        <input
          type="text"
          placeholder="Search all tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`
            w-full 
            pl-11 sm:pl-14
            pr-11 sm:pr-14
            py-3.5 sm:py-4
            bg-gray-800/50
            border border-gray-700/50
            rounded-xl
            text-white placeholder-gray-500
            text-base sm:text-lg
            font-light
            ${TRANSITION_BASE}
            focus:outline-none 
            focus:border-cyan-400/50
            focus:bg-gray-800/70
            focus:shadow-lg focus:shadow-cyan-500/10
          `}
          aria-label="Search tools"
        />

        {/* Clear Button - Refined hover effect */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`
              absolute 
              right-4 sm:right-5
              top-1/2 -translate-y-1/2 
              p-1.5
              rounded-lg
              text-gray-500
              hover:text-gray-300
              hover:bg-gray-700/50
              ${TRANSITION_FAST}
            `}
            aria-label="Clear search"
          >
            <X className={ICON_SM} />
          </button>
        )}
      </div>
    </div>
  )
}

// ========================================
// 📂 CATEGORY FILTER - Elegant horizontal scroll
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
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-2 min-w-max items-center justify-start sm:justify-center">
        {/* All Tools Button */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`${CATEGORY_BASE} ${
            selectedCategory === 'all' ? CATEGORY_ACTIVE : CATEGORY_INACTIVE
          }`}
        >
          All Tools
        </button>

        {/* Category Buttons */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${CATEGORY_BASE} ${
              selectedCategory === cat.id ? CATEGORY_ACTIVE : CATEGORY_INACTIVE
            }`}
          >
            <span className="text-base sm:text-lg">{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.name}</span>
            <span className="sm:hidden text-xs">{cat.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ========================================
// ⚡ QUICK FILTERS - Elegant chip toggles
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
    <div className="flex gap-3 items-center flex-wrap">
      {/* Featured Chip */}
      <button
        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
        className={`${CHIP_BASE} ${
          showFeaturedOnly ? CHIP_FEATURED_ON : CHIP_FEATURED_OFF
        }`}
      >
        <span className="text-base">⭐</span>
        <span>Featured</span>
      </button>

      {/* New Chip */}
      <button
        onClick={() => setShowNewOnly(!showNewOnly)}
        className={`${CHIP_BASE} ${
          showNewOnly ? CHIP_NEW_ON : CHIP_NEW_OFF
        }`}
      >
        <span className="text-base">🆕</span>
        <span>New</span>
      </button>
    </div>
  )
}

// ========================================
// 👁️ VIEW TOGGLE - Elegant segmented control
// ========================================
function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}) {
  return (
    <div className={VIEW_TOGGLE_CONTAINER}>
      {/* Sliding background indicator */}
      <div
        className={`
          absolute inset-y-1 w-[calc(50%-4px)]
          bg-gradient-to-br from-cyan-500 to-blue-500
          rounded-md
          shadow-lg shadow-cyan-500/30
          ${TRANSITION_BASE}
          ${viewMode === 'grid' ? 'left-1' : 'left-[calc(50%+4px-1px)]'}
        `}
      />

      {/* Grid Button */}
      <button
        onClick={() => setViewMode('grid')}
        className={`${VIEW_BUTTON_BASE} ${
          viewMode === 'grid' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_INACTIVE
        }`}
        aria-label="Grid view"
      >
        <Grid3x3 className={ICON_SM} />
        <span className="hidden sm:inline">Grid</span>
      </button>

      {/* List Button */}
      <button
        onClick={() => setViewMode('list')}
        className={`${VIEW_BUTTON_BASE} ${
          viewMode === 'list' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_INACTIVE
        }`}
        aria-label="List view"
      >
        <List className={ICON_SM} />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  )
}

// ========================================
// 📊 RESULTS COUNT
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
    <div className={SPACING_RESULTS}>
      <p className="text-xs sm:text-sm text-gray-400 font-light">
        Showing{' '}
        <span className="text-cyan-300 font-semibold">{filtered}</span>
        {' '}of{' '}
        <span className="font-semibold">{total}</span>
        {' '}tools
        {selectedCategory !== 'all' && (
          <span className="text-gray-500"> • Category: <span className="text-cyan-300">{categoryName}</span></span>
        )}
        {searchQuery && (
          <span className="text-gray-500"> • Search: <span className="text-cyan-300">"{searchQuery}"</span></span>
        )}
      </p>
    </div>
  )
}

// ========================================
// 📦 TOOLS GRID
// ========================================
function ToolsGrid({ tools }: { tools: ClientTool[] }) {
  if (tools.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid 
                  grid-cols-1 
                  sm:grid-cols-2 
                  lg:grid-cols-3 
                  gap-4 sm:gap-5 md:gap-6 
                  auto-rows-fr">
      {tools.map((tool) => (
        // @ts-expect-error - React key prop is not part of component props
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// 📋 TOOLS LIST
// ========================================
function ToolsList({ tools }: { tools: ClientTool[] }) {
  if (tools.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tools.map((tool) => (
        // @ts-expect-error - React key prop is not part of component props
        <ToolCardCompact key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// 🚫 EMPTY STATE
// ========================================
function EmptyState() {
  return (
    <div className="text-center py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 
                      rounded-full 
                      bg-gray-800/50 
                      border border-gray-700/50
                      flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-300 text-lg sm:text-xl mb-2 font-medium">
          No tools found
        </p>
        <p className="text-gray-500 text-sm sm:text-base font-light">
          Try adjusting your filters or search query
        </p>
      </div>
    </div>
  )
}