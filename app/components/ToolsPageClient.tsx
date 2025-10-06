'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, Sparkles, Clock, Grid3x3, List, ChevronRight, ArrowRight, X } from 'lucide-react'

// Import unified data system
import {
  getActiveTools,
  getToolsByCategory,
  getFeaturedTools,
  getNewTools,
  searchTools,
} from '@/lib/unified-data'

// Import categories from unified config
import { getEnabledCategories, getCategoryById } from '@/lib/categories-config'

export default function ToolsPageClient() {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [tools, setTools] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get enabled categories from unified config
  const categories = useMemo(() => getEnabledCategories(), [])

  // Category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    categories.forEach((cat) => {
      const categoryTools = getToolsByCategory(cat.id).filter((t) => t.status === 'active')
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
    setTimeout(loadData, 100)
  }, [])

  // Filtered and sorted tools
  const filteredTools = useMemo(() => {
    if (selectedCategory === null) return []

    let filtered =
      selectedCategory === 'all'
        ? tools
        : getToolsByCategory(selectedCategory).filter((t) => t.status === 'active')

    if (searchQuery) {
      filtered = searchTools(searchQuery)
    }

    if (showOnlyNew) {
      filtered = filtered.filter((tool) => tool.new)
    }

    if (showOnlyFeatured) {
      filtered = filtered.filter((tool) => tool.featured)
    }

    // Alphabetical sorting
    return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [selectedCategory, searchQuery, showOnlyNew, showOnlyFeatured, tools])

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

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(null)
    setSearchQuery('')
    setShowOnlyFeatured(false)
    setShowOnlyNew(false)
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
    <div className="py-6">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 rounded-full mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Instant Tools</h1>
        <p className="text-lg text-gray-400">
          {stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search all tools..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value && selectedCategory === null) {
                setSelectedCategory('all')
              }
            }}
            className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Category Grid (Default View) */}
      {selectedCategory === null && !searchQuery && (
        <CategoryGrid
          categories={categories}
          categoryStats={categoryStats}
          setSelectedCategory={setSelectedCategory}
          setShowOnlyFeatured={setShowOnlyFeatured}
          setShowOnlyNew={setShowOnlyNew}
          featuredTools={featuredTools}
          newTools={newTools}
          stats={stats}
        />
      )}

      {/* Tools List View */}
      {(selectedCategory !== null || searchQuery) && (
        <>
          {/* Controls */}
          <div className="mb-6 space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={resetFilters}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ← Back to Categories
              </button>
              {selectedCategory && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-white font-medium">
                    {selectedCategory === 'all'
                      ? 'All Tools'
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${
                    showOnlyFeatured
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Featured ({stats.featured})
                </button>

                <button
                  onClick={() => setShowOnlyNew(!showOnlyNew)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${
                    showOnlyNew
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  New ({stats.new})
                </button>
              </div>

              <div className="flex gap-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                🎯 All Tools
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-gray-500">
            Showing <span className="text-white font-bold">{filteredTools.length}</span> tools
            {searchQuery && (
              <span>
                {' '}
                matching "<span className="text-white">{searchQuery}</span>"
              </span>
            )}
          </div>

          {/* Tools Display */}
          {filteredTools.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id || tool.name} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredTools.map((tool) => (
                <ToolListItem key={tool.id || tool.name} tool={tool} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Category Grid Component
function CategoryGrid({
  categories,
  categoryStats,
  setSelectedCategory,
  setShowOnlyFeatured,
  setShowOnlyNew,
  featuredTools,
  newTools,
  stats,
}: any) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Choose a Category</h2>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories.map((cat: any) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group relative overflow-hidden bg-gray-800 rounded-2xl p-6
                       hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02]
                       border border-gray-700 hover:border-gray-600 text-left"
            >
              {/* ⭐ この div を追加 */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${cat.bgColor}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl">{cat.emoji}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-gray-700 rounded-full text-sm font-medium text-gray-300">
                    {categoryStats[cat.id] || 0} tools
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-white">{cat.name}</h3>
                <p className="text-base text-gray-400 mb-4">{cat.description}</p>

                <div className="flex items-center text-base font-semibold text-cyan-400 group-hover:gap-3 transition-all">
                  Browse tools
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              {/* ⭐ ここまで */}
            </button>
          )
        })}
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickAccessCard
          title="Featured Tools"
          icon={<Sparkles className="w-5 h-5 mr-2 text-purple-400" />}
          tools={featuredTools}
          count={stats.featured}
          onViewAll={() => {
            setSelectedCategory('all')
            setShowOnlyFeatured(true)
          }}
        />

        <QuickAccessCard
          title="Recently Added"
          icon={<Clock className="w-5 h-5 mr-2 text-cyan-400" />}
          tools={newTools}
          count={stats.new}
          onViewAll={() => {
            setSelectedCategory('all')
            setShowOnlyNew(true)
          }}
        />
      </div>
    </div>
  )
}

// Quick Access Card Component
function QuickAccessCard({ title, icon, tools, count, onViewAll }: any) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold mb-4 flex items-center text-white">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {tools.map((tool: any) => (
          <Link key={tool.id} href={tool.url || `/tools/${tool.id}`}>
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-700 transition-all group">
              <span className="flex items-center gap-3">
                <span className="text-xl">{tool.emoji || tool.icon || '🔧'}</span>
                <div>
                  <span className="font-medium text-sm text-white block">{tool.name}</span>
                  <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                </div>
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </div>
          </Link>
        ))}
        <button
          onClick={onViewAll}
          className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium pt-1"
        >
          View all {count} {title.toLowerCase()} →
        </button>
      </div>
    </div>
  )
}

// Tool Card Component
function ToolCard({ tool }: { tool: any }) {
  const getIconBgClass = () => {
    const category = getCategoryById(tool.categoryId)
    return category?.bgColor || 'bg-gray-600'
  }

  return (
    <Link href={tool.url || `/tools/${tool.id}`} className="block">
      <div
        className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-all 
                     hover:scale-[1.02] cursor-pointer h-full min-h-[260px]
                     flex flex-col border border-gray-700 hover:border-gray-600 group p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-16 h-16 rounded-xl ${getIconBgClass()} 
                         flex items-center justify-center text-3xl
                         group-hover:scale-105 transition-transform`}
          >
            {tool.icon || tool.emoji || '🔧'}
          </div>
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
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">{tool.name}</h3>
        <p className="text-base text-gray-400 mb-4 line-clamp-3 flex-grow">
          {tool.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-gray-700">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tool.timeToUse || 'Instant'}
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

// Tool List Item Component
function ToolListItem({ tool }: { tool: any }) {
  const getIconBgClass = () => {
    const category = getCategoryById(tool.categoryId)
    return category?.bgColor || 'bg-gray-600'
  }

  return (
    <Link href={tool.url || `/tools/${tool.id}`} className="block">
      <div
        className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-all 
                     cursor-pointer border border-gray-700 hover:border-gray-600 group p-5"
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-14 h-14 ${getIconBgClass()} 
                        rounded-lg flex items-center justify-center text-2xl`}
          >
            {tool.icon || tool.emoji || '🔧'}
          </div>

          <div className="flex-grow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">{tool.name}</h3>
                  {(tool.featured || tool.new) && (
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
                    </div>
                  )}
                </div>
                <p className="text-base text-gray-400 line-clamp-1">
                  {tool.description || 'No description available'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tool.timeToUse || 'Instant'}
                </span>
                <ChevronRight
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-300 
                              group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <p className="text-2xl text-gray-400 mb-2">No tools found</p>
      <p className="text-base text-gray-500">Try adjusting your filters or search query</p>
    </div>
  )
}
