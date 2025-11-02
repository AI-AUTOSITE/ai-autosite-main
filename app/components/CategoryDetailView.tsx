'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, X, Grid3x3, List, Clock, ArrowUpDown } from 'lucide-react'
import type { Category } from '@/lib/categories-config'
import { getEnabledCategories } from '@/lib/categories-config'

// Import unified ToolCard components ✨
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
  badge?: string
  timeToUse?: string
  categoryId?: string
  isActive?: boolean
  status?: string
  tags?: string[]
}

interface CategoryDetailViewProps {
  category: Category
  tools: Tool[]
}

type ViewMode = 'grid' | 'list'
type SortOrder = 'alpha' | 'popular' | 'newest'

// ========================================
// Category-specific Tags Configuration
// ========================================
const CATEGORY_TAGS: Record<string, string[]> = {
  converters: ['All', 'Text', 'Data', 'Format', 'Units'],
  editors: ['All', 'Images', 'Videos', 'Documents', 'PDF'],
  generators: ['All', 'Passwords', 'QR Codes', 'Templates', 'Test Data'],
  analyzers: ['All', 'Performance', 'SEO', 'Code', 'Network'],
  'ai-tools': ['All', 'Text', 'Code', 'Analysis', 'Creative'],
  'dev-tools': ['All', 'JSON', 'API', 'Database', 'Testing'],
  learning: ['All', 'Notes', 'Timer', 'Memory', 'Study'],
}

// ========================================
// Sort Options Configuration
// ========================================
const SORT_OPTIONS = [
  { id: 'alpha', label: 'A-Z', icon: '🔤', description: 'Alphabetical order' },
  { id: 'popular', label: 'Popular', icon: '⭐', description: 'Featured first' },
  { id: 'newest', label: 'Newest', icon: '🆕', description: 'New tools first' },
] as const

// ========================================
// Main Component
// ========================================
export default function CategoryDetailView({
  category,
  tools,
}: CategoryDetailViewProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOrder, setSortOrder] = useState<SortOrder>('alpha')

  // Get tags for current category
  const categoryTags = CATEGORY_TAGS[category.id] || ['All']

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = tools

    // Filter by tag
    if (activeTag !== 'All') {
      filtered = filtered.filter(
        (tool) =>
          tool.tags?.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()) ||
          tool.name?.toLowerCase().includes(activeTag.toLowerCase()) ||
          tool.description?.toLowerCase().includes(activeTag.toLowerCase())
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.name?.toLowerCase().includes(query) ||
          tool.description?.toLowerCase().includes(query)
      )
    }

    // Sort based on selected order
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'alpha':
          // Alphabetical order (A-Z)
          return a.name.localeCompare(b.name)

        case 'popular':
          // Featured first, then new, then alphabetical
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          if (a.new && !b.new) return -1
          if (!a.new && b.new) return 1
          return a.name.localeCompare(b.name)

        case 'newest':
          // New first, then featured, then alphabetical
          if (a.new && !b.new) return -1
          if (!a.new && b.new) return 1
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.name.localeCompare(b.name)

        default:
          return 0
      }
    })

    return sorted
  }, [tools, searchQuery, activeTag, sortOrder])

  const Icon = category.icon

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back Navigation - RESPONSIVE */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white 
                 mb-4 sm:mb-6 transition-colors group text-sm sm:text-base"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
        Back to All Tools
      </Link>

      {/* Category Header */}
      <CategoryHeader category={category} Icon={Icon} toolCount={tools.length} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={`Search ${category.name.toLowerCase()}...`}
      />

      {/* Tag Filter & Controls Row - RESPONSIVE */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 sm:mb-8">
        {/* Tag Filter (only show if category has tagFilter enabled) */}
        {category.tagFilter && categoryTags.length > 1 && (
          <TagFilter tags={categoryTags} activeTag={activeTag} setActiveTag={setActiveTag} />
        )}

        {/* Controls: Sort + View Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Sort Selector */}
          <SortSelector sortOrder={sortOrder} setSortOrder={setSortOrder} />

          {/* View Toggle */}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Results Count - RESPONSIVE */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm text-gray-400">
          Showing {filteredTools.length} of {tools.length} tools
          {activeTag !== 'All' && (
            <span className="text-cyan-400"> • Filtered by: {activeTag}</span>
          )}
          <span className="text-gray-600 hidden sm:inline"> • Sorted by: {SORT_OPTIONS.find(opt => opt.id === sortOrder)?.label}</span>
        </p>
      </div>

      {/* Tools Display (Grid or List) - WITH UNIFIED CARDS */}
      {viewMode === 'grid' ? (
        <ToolsGrid tools={filteredTools} />
      ) : (
        <ToolsList tools={filteredTools} />
      )}

      {/* Other Categories */}
      <OtherCategories currentCategoryId={category.id} />
    </div>
  )
}

// ========================================
// Category Header Component - RESPONSIVE
// ========================================
function CategoryHeader({
  category,
  Icon,
  toolCount,
}: {
  category: Category
  Icon: any
  toolCount: number
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${category.bgColor}`}>
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            <span className="text-2xl sm:text-3xl md:text-4xl">{category.emoji}</span>
            {category.badge && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-500/20 text-cyan-400 
                           text-xs sm:text-sm font-semibold rounded-full">
                {category.badge}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-1 sm:mb-2">{category.description}</p>
          <p className="text-xs sm:text-sm text-gray-500">{toolCount} tools available</p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Search Bar Component - RESPONSIVE
// ========================================
function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  placeholder: string
}) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 
                         text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 
                   bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 
                   focus:outline-none focus:border-cyan-400 
                   text-sm sm:text-base transition-all"
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
// Tag Filter Component - RESPONSIVE
// ========================================
function TagFilter({
  tags,
  activeTag,
  setActiveTag,
}: {
  tags: string[]
  activeTag: string
  setActiveTag: (tag: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setActiveTag(tag)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all
            ${
              activeTag === tag
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

// ========================================
// Sort Selector Component - RESPONSIVE
// ========================================
function SortSelector({
  sortOrder,
  setSortOrder,
}: {
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
}) {
  return (
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1 flex-1 lg:flex-initial">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setSortOrder(option.id as SortOrder)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 
                    rounded-md font-medium text-xs sm:text-sm transition-all flex-1 lg:flex-initial
                    justify-center
            ${
              sortOrder === option.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          title={option.description}
        >
          <span>{option.icon}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
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
    <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 
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
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 
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
// Tools Grid Component - WITH UNIFIED CARD
// ========================================
function ToolsGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-gray-400 text-base sm:text-lg">No tools found</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                  gap-4 sm:gap-5 md:gap-6 auto-rows-fr mb-8 sm:mb-12">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// Tools List Component - WITH UNIFIED COMPACT CARD
// ========================================
function ToolsList({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-gray-400 text-base sm:text-lg">No tools found</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
      {tools.map((tool) => (
        <ToolCardCompact key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// ========================================
// Other Categories Component - RESPONSIVE
// ========================================
function OtherCategories({ currentCategoryId }: { currentCategoryId: string }) {
  const categories = useMemo(
    () => getEnabledCategories().filter((cat) => cat.id !== currentCategoryId),
    [currentCategoryId]
  )

  return (
    <div className="border-t border-gray-700 pt-6 sm:pt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Explore Other Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              href={`/tools/${cat.id}`}
              className="flex items-center gap-3 p-3 sm:p-4 bg-gray-800 rounded-xl 
                       border border-gray-700 hover:border-gray-600 transition-all group"
            >
              <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-white 
                           group-hover:text-cyan-400 transition-colors truncate">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{cat.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}