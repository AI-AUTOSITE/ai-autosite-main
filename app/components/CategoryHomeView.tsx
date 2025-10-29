'use client'

import { useState, useMemo, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { Search, Sparkles, Clock, ArrowRight, X } from 'lucide-react'

// ✅ 修正: getToolsByCategory を追加
import {
  getActiveTools,
  getToolsByCategory,
  getFeaturedTools,
  getNewTools,
} from '@/lib/unified-data'

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
  badge?: string
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

// ========================================
// Main Component
// ========================================
export default function CategoryHomeView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get enabled categories
  const categories = useMemo(() => getEnabledCategories(), [])

  // ✅ 修正: require を削除
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

  // ✅ 修正: setTimeout を削除
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

  // Handle search - redirect to tools page with search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/tools?search=${encodeURIComponent(searchQuery)}`
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Category Grid */}
      <CategoryGrid
        categories={categories}
        categoryStats={categoryStats}
        featuredTools={featuredTools}
        newTools={newTools}
        stats={stats}
      />
    </div>
  )
}

// ========================================
// Hero Section Component
// ========================================
function HeroSection({ stats }: { stats: Stats }) {
  return (
    <section className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full mb-4">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
        Instant Tools
      </h1>
      <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
        {stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
      </p>
    </section>
  )
}

// ========================================
// Search Bar Component
// ========================================
function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <section className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search all tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl 
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
    </section>
  )
}

// ========================================
// Category Grid Component
// ========================================
function CategoryGrid({
  categories,
  categoryStats,
  featuredTools,
  newTools,
  stats,
}: {
  categories: Category[]
  categoryStats: Record<string, number>
  featuredTools: Tool[]
  newTools: Tool[]
  stats: Stats
}) {
  return (
    <div className="space-y-8">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            toolCount={categoryStats[cat.id] || 0}
          />
        ))}
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickAccessCard
          title="Featured Tools"
          icon={<Sparkles className="w-5 h-5 mr-2 text-purple-400" />}
          tools={featuredTools}
          count={stats.featured}
          href="/tools?featured=true"
        />

        <QuickAccessCard
          title="Recently Added"
          icon={<Clock className="w-5 h-5 mr-2 text-cyan-400" />}
          tools={newTools}
          count={stats.new}
          href="/tools?new=true"
        />
      </div>
    </div>
  )
}

// ========================================
// Category Card Component
// ========================================
function CategoryCard({
  category,
  toolCount,
}: {
  category: Category
  toolCount: number
}) {
  const Icon = category.icon

  return (
    <Link
      href={`/tools/${category.id}`}
      className="group relative overflow-hidden bg-gray-800 rounded-2xl p-6
                 hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02]
                 border border-gray-700 hover:border-gray-600 block"
    >
      <div className="relative z-10 w-full">
        <div className="flex items-start justify-between mb-4 w-full">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 p-2.5 rounded-xl ${category.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl leading-none">{category.emoji}</span>
          </div>
          <span className="px-2.5 py-1 bg-gray-700 rounded-full text-sm font-medium text-gray-300 flex-shrink-0">
            {toolCount} tools
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-2 text-white text-left w-full">
          {category.name}
        </h3>

        <p className="text-base text-gray-400 mb-4 text-left w-full min-h-[3rem] leading-relaxed">
          {category.description}
        </p>

        <div className="flex items-center text-base font-semibold text-cyan-400 group-hover:gap-3 transition-all w-full">
          Browse tools
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

// ========================================
// Quick Access Card Component
// ========================================
function QuickAccessCard({ title, icon, tools, count, href }: QuickAccessCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold mb-4 flex items-center text-white">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <ToolQuickLink key={tool.id} tool={tool} />
        ))}
        <Link
          href={href}
          className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium pt-1 block"
        >
          View all {count} {title.toLowerCase()} →
        </Link>
      </div>
    </div>
  )
}

// ========================================
// Tool Quick Link Component
// ========================================
function ToolQuickLink({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-700 transition-all group"
    >
      <span className="flex items-center gap-3">
        <span className="text-xl">{tool.emoji || tool.icon || '🔧'}</span>
        <div>
          <span className="font-medium text-sm text-white block">{tool.name}</span>
          <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
        </div>
      </span>
      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
    </Link>
  )
}