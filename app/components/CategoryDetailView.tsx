'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, X, Grid3x3, List, Clock, ArrowUpDown } from 'lucide-react'
import type { Category } from '@/lib/categories-config'
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
  console.log('🎯 CategoryDetailView RENDERED!', {
    categoryId: category.id,
    categoryName: category.name,
    tagFilter: category.tagFilter,
    toolsCount: tools.length,
  })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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

      {/* Tag Filter & Controls Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        {/* Tag Filter (only show if category has tagFilter enabled) */}
        {category.tagFilter && categoryTags.length > 1 && (
          <TagFilter tags={categoryTags} activeTag={activeTag} setActiveTag={setActiveTag} />
        )}

        {/* Controls: Sort + View Toggle */}
        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <SortSelector sortOrder={sortOrder} setSortOrder={setSortOrder} />

          {/* View Toggle */}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Showing {filteredTools.length} of {tools.length} tools
          {activeTag !== 'All' && (
            <span className="text-cyan-400"> • Filtered by: {activeTag}</span>
          )}
          <span className="text-gray-600"> • Sorted by: {SORT_OPTIONS.find(opt => opt.id === sortOrder)?.label}</span>
        </p>
      </div>

      {/* Tools Display (Grid or List) */}
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
// Category Header Component
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
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-4 rounded-2xl ${category.bgColor}`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
            <span className="text-4xl">{category.emoji}</span>
            {category.badge && (
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded-full">
                {category.badge}
              </span>
            )}
          </div>
          <p className="text-lg text-gray-400">{category.description}</p>
          <p className="text-sm text-gray-500 mt-2">{toolCount} tools available</p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Search Bar Component
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
    <div className="mb-6">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400
                   text-lg transition-all"
          aria-label="Search tools in category"
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
// Sort Selector Component
// ========================================
function SortSelector({
  sortOrder,
  setSortOrder,
}: {
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setSortOrder(option.id as SortOrder)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all
            ${
              sortOrder === option.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          aria-label={`Sort by ${option.description}`}
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
// Tag Filter Component
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
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setActiveTag(tag)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${
              activeTag === tag
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600'
            }`}
          aria-label={`Filter by ${tag}`}
        >
          {tag}
        </button>
      ))}
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
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
      <button
        onClick={() => setViewMode('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all
          ${
            viewMode === 'grid'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="Grid view"
      >
        <Grid3x3 className="w-4 h-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all
          ${
            viewMode === 'list'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  )
}

// ========================================
// Tools Grid Component
// ========================================
function ToolsGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No tools found</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No tools found</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-12">
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
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="group relative bg-gray-800 rounded-2xl p-6 border border-gray-700 
                 hover:border-cyan-500/50 transition-all duration-300 
                 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02]"
    >
      {/* Badge */}
      {tool.badge && (
        <span className="absolute top-4 right-4 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">
          {tool.badge}
        </span>
      )}

      {/* Icon */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{tool.emoji || tool.icon || '🔧'}</span>
        {tool.timeToUse && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {tool.timeToUse}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
        {tool.name}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-2">{tool.description}</p>

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Hover Arrow */}
      <div className="mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium">Try now</span>
        <svg
          className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
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
      <div className="flex-shrink-0">
        <span className="text-3xl">{tool.emoji || tool.icon || '🔧'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
            {tool.name}
          </h3>
          {tool.badge && (
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">
              {tool.badge}
            </span>
          )}
          {tool.timeToUse && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {tool.timeToUse}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm line-clamp-1">{tool.description}</p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tool.tags.slice(0, 4).map((tag, index) => (
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
        <svg
          className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

// ========================================
// Other Categories Component
// ========================================
function OtherCategories({ currentCategoryId }: { currentCategoryId: string }) {
  const categories = useMemo(
    () => getEnabledCategories().filter((cat) => cat.id !== currentCategoryId),
    [currentCategoryId]
  )

  return (
    <div className="border-t border-gray-700 pt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Explore Other Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.id}
              href={`/tools/${cat.id}`}
              className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 
                       hover:border-gray-600 transition-all group"
            >
              <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500">{cat.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}