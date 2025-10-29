// app/tools/[category]/CategoryPageClient.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Search, Sparkles, Clock, Grid3x3, List, ArrowRight, X, Home } from 'lucide-react'

// ✅ トップレベルで import（require は使わない）
import { getToolsByCategory, searchTools } from '@/lib/unified-data'
import { getCategoryById } from '@/lib/categories-config'

interface CategoryPageClientProps {
  category: string
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [tools, setTools] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get category info
  const categoryInfo = useMemo(() => getCategoryById(category), [category])

  // Load tools for this category
  useEffect(() => {
    if (!categoryInfo) {
      notFound()
      return
    }

    const loadTools = () => {
      const categoryTools = getToolsByCategory(category).filter(
        (t) => t.isActive || t.status === 'live'
      )
      setTools(categoryTools)
      setIsLoading(false)
    }

    setTimeout(loadTools, 100)
  }, [category, categoryInfo])

  // Filtered tools
  const filteredTools = useMemo(() => {
    let filtered = tools

    if (searchQuery) {
      // Search within category tools only
      const searchResults = searchTools(searchQuery)
      filtered = tools.filter(tool => 
        searchResults.some(result => result.id === tool.id)
      )
    }

    if (showOnlyNew) {
      filtered = filtered.filter((tool) => tool.new)
    }

    if (showOnlyFeatured) {
      filtered = filtered.filter((tool) => tool.featured)
    }

    // Alphabetical sorting
    return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [searchQuery, showOnlyNew, showOnlyFeatured, tools])

  // Statistics
  const stats = useMemo(
    () => ({
      total: tools.length,
      featured: tools.filter((t) => t.featured).length,
      new: tools.filter((t) => t.new).length,
    }),
    [tools]
  )

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

  if (!categoryInfo) {
    return null // notFound() handles this
  }

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          All Tools
          <ArrowRight className="w-3 h-3" />
          <span className="text-white font-medium">{categoryInfo.name}</span>
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{categoryInfo.emoji}</span>
        </div>
        <h1 className="text-4xl font-bold mb-3">{categoryInfo.name}</h1>
        <p className="text-lg text-gray-400 mb-4">{categoryInfo.description}</p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{stats.total} tools available</span>
          {stats.featured > 0 && (
            <>
              <span>•</span>
              <span>{stats.featured} featured</span>
            </>
          )}
          {stats.new > 0 && (
            <>
              <span>•</span>
              <span>{stats.new} new</span>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search in ${categoryInfo.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
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

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
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
            className={`p-2 rounded transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-all ${
              viewMode === 'list'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tools Display */}
      {filteredTools.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              Showing {filteredTools.length} of {stats.total} tools
            </span>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTools.map((tool) => (
                <ToolListItem key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ========================================
// Tool Card Component (Grid View)
// ========================================
function ToolCard({ tool }: { tool: any }) {
  // ✅ getCategoryById はトップレベルで import 済み
  const category = getCategoryById(tool.categoryId)

  return (
    <Link href={tool.url || `/tools/${tool.id}`} className="block">
      <div className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-all hover:scale-[1.02] cursor-pointer h-full min-h-[260px] flex flex-col border border-gray-700 hover:border-gray-600 group p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-16 h-16 rounded-xl ${category?.bgColor || 'bg-gray-600'} flex items-center justify-center text-3xl group-hover:scale-105 transition-transform`}
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
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Tool List Item Component (List View)
// ========================================
function ToolListItem({ tool }: { tool: any }) {
  // ✅ getCategoryById はトップレベルで import 済み
  const category = getCategoryById(tool.categoryId)

  return (
    <Link href={tool.url || `/tools/${tool.id}`} className="block">
      <div className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-gray-600 group p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-14 h-14 ${category?.bgColor || 'bg-gray-600'} rounded-lg flex items-center justify-center text-2xl`}
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
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Empty State Component
// ========================================
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <p className="text-2xl text-gray-400 mb-2">No tools found</p>
      <p className="text-base text-gray-500">Try adjusting your filters or search query</p>
    </div>
  )
}