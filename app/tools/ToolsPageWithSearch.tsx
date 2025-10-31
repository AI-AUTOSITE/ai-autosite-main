'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Sparkles, Clock, ChevronRight, ArrowRight, X, Grid3x3, List } from 'lucide-react'
import { getEnabledCategories } from '@/lib/categories-config'

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
  badge?: 'NEW' | 'HOT' | 'BETA' | 'AI' | 'COMING SOON' | 'MAINTENANCE'
  timeToUse?: string
  categoryId?: string
  isActive?: boolean
  status?: string
  tags?: string[]
}

interface ToolsPageWithSearchProps {
  tools: Tool[]
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
      filtered = filtered.filter((tool) => tool.categoryId === selectedCategory)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* View Toggle & Quick Filters */}
        <div className="flex items-center gap-4">
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
// Hero Section Component
// ========================================
function HeroSection({ stats }: { stats: { total: number; featured: number; new: number } }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 rounded-full mb-4">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        All Tools
      </h1>
      <p className="text-lg text-gray-400">
        {stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
      </p>
    </div>
  )
}

// ========================================
// Search Bar Component
// ========================================
function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search all tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                   text-lg transition-all"
          aria-label="Search tools"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-lg transition-colors"
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
// Category Filter Component
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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
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
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2
            ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}

// ========================================
// Quick Filters Component
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
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all
          ${
            showFeaturedOnly
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
      >
        ⭐ Featured
      </button>
      <button
        onClick={() => setShowNewOnly(!showNewOnly)}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all
          ${
            showNewOnly
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
      >
        🆕 New
      </button>
    </div>
  )
}

// ========================================
// View Toggle Component
// ========================================
function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}) {
  return (
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all
          ${
            viewMode === 'grid'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="Grid view"
      >
        <Grid3x3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all
          ${
            viewMode === 'list'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}

// ========================================
// Results Count Component
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
    <div className="mb-6">
      <p className="text-sm text-gray-400">
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
// Tools Grid Component
// ========================================
function ToolsGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-xl mb-2">No tools found</p>
        <p className="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// Tools List Component
// ========================================
function ToolsList({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-xl mb-2">No tools found</p>
        <p className="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tools.map((tool) => (
        <ToolListItem key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// Tool Card Component (Grid View)
// ========================================
function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.url || `/tools/${tool.id}`} className="block group">
      <div
        className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all 
                      border border-gray-700 hover:border-gray-600 h-full min-h-[240px]
                      flex flex-col hover:scale-[1.02] transform"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{tool.icon || tool.emoji || '🔧'}</div>
          <div className="flex gap-1">
            {tool.featured && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                Featured
              </span>
            )}
            {tool.new && (
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium">
                New
              </span>
            )}
            {tool.badge === 'AI' && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                AI
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">{tool.name}</h3>
        <p className="text-base text-gray-400 mb-4 line-clamp-3 flex-grow">{tool.description}</p>

        <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-gray-700">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tool.timeToUse}
          </span>
          <ChevronRight
            className="w-4 h-4 text-gray-500 group-hover:text-gray-300 
                        group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Tool List Item Component (List View)
// ========================================
function ToolListItem({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="group flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700 
                 hover:border-cyan-500/50 transition-all duration-300 
                 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
        <span className="text-3xl">{tool.emoji || tool.icon || '🔧'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            {tool.name}
          </h3>
          {tool.featured && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
              ⭐
            </span>
          )}
          {tool.new && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
              🆕
            </span>
          )}
          {tool.timeToUse && (
            <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
              <Clock className="w-3 h-3" />
              {tool.timeToUse}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm line-clamp-1 mb-2">{tool.description}</p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}