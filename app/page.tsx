'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Search,
  Sparkles,
  Clock,
  Grid3x3,
  List,
  Zap,
  Code,
  BookOpen,
  Palette,
  Briefcase,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  X
} from 'lucide-react'

// Import unified data system
import {
  getActiveTools,
  getToolsByCategory,
  getFeaturedTools,
  getNewTools,
  searchTools,
  getStatistics
} from '@/lib/unified-data'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)
// Categories configuration - matching screenshot style
const CATEGORIES = [
  {
    id: 'quick-tools',
    name: 'Quick Tools',
    emoji: '⚡',
    icon: Zap,
    bgColor: 'bg-yellow-500',
    description: 'Instant tools for everyday tasks',
    enabled: true
  },
  {
    id: 'dev-tools',
    name: 'Developer Tools',
    emoji: '🔧',
    icon: Code,
    bgColor: 'bg-blue-500',
    description: 'Tools for developers and coders',
    enabled: true
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    emoji: '📚',
    icon: BookOpen,
    bgColor: 'bg-green-500',
    description: 'Educational and learning resources',
    enabled: true
  },
  {
    id: 'study-tools',
    name: 'Study Tools',
    emoji: '🎓',
    icon: GraduationCap,
    bgColor: 'bg-purple-500',
    description: 'AI-powered study assistance',
    enabled: true
  },
  {
    id: 'business-tools',
    name: 'Business Tools',
    emoji: '💼',
    icon: Briefcase,
    bgColor: 'bg-amber-500',
    description: 'Professional productivity tools',
    enabled: true
  },
  {
    id: 'creative-tools',
    name: 'Creative Tools',
    emoji: '🎨',
    icon: Palette,
    bgColor: 'bg-pink-500',
    description: 'Design and creative tools',
    enabled: true
  }
]

export default function ToolsPage() {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [tools, setTools] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get enabled categories
  const categories = useMemo(() => CATEGORIES.filter(c => c.enabled), [])

  // Category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    categories.forEach(cat => {
      const categoryTools = getToolsByCategory(cat.id).filter(t => t.status === 'active')
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


const filteredTools = useMemo(() => {
  if (selectedCategory === null) return []
  
  let filtered = selectedCategory === 'all' 
    ? tools 
    : getToolsByCategory(selectedCategory).filter(t => t.status === 'active')

  if (searchQuery) {
    filtered = searchTools(searchQuery)
  }

  if (showOnlyNew) {
    filtered = filtered.filter(tool => tool.new)
  }

  if (showOnlyFeatured) {
    filtered = filtered.filter(tool => tool.featured)
  }

  // Sort tools AFTER all filtering - this is the correct position!
  filtered.sort((a, b) => {
    // Featured tools always come first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    
    // Among featured or non-featured, new tools come second
    if (a.featured === b.featured) {
      if (a.new && !b.new) return -1
      if (!a.new && b.new) return 1
    }
    
    // Finally, sort alphabetically by name (case-insensitive)
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })

  return filtered
}, [selectedCategory, searchQuery, showOnlyNew, showOnlyFeatured, tools])

  // Statistics
  const stats = useMemo(() => ({
    total: tools.length,
    featured: tools.filter(t => t.featured).length,
    new: tools.filter(t => t.new).length,
    displayed: filteredTools.length
  }), [tools, filteredTools])

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
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
{/* Hero Section - Black background with Minimal Padding */}
      <div className="bg-gray-950 py-2 sm:py-3 md:py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-2 mb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-cyan-500/10 rounded-full">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
            </div>
            <a 
              href="https://github.com/ai-autosite" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-700 hover:border-gray-600"
            >
              <GithubIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-400">Open Source</span>
            </a>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-center">Instant Tools</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 text-center">
            <span className="block sm:inline">{stats.total} tools available</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">Zero Ads • Zero Tracking • 100% Free</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search Bar - Reduced Spacing */}
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
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
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400
                       text-base sm:text-lg transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Category Selection (Default View) */}
        {selectedCategory === null && !searchQuery && (
          <CategoryGrid 
            categories={categories}
            categoryStats={categoryStats}
            setSelectedCategory={setSelectedCategory}
            setShowOnlyFeatured={setShowOnlyFeatured}
            setShowOnlyNew={setShowOnlyNew}
            stats={stats}
          />
        )}

        {/* Tools List View */}
        {(selectedCategory !== null || searchQuery) && (
          <>
            {/* Controls - Reduced Spacing */}
            <div className="mb-4 space-y-3">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={resetFilters}
                  className="text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>← Back to Categories</span>
                </button>
                {selectedCategory && (
                  <>
                    <span className="text-gray-600">/</span>
                    <span className="text-white font-medium">
                      {selectedCategory === 'all' 
                        ? 'All Tools' 
                        : categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </>
                )}
              </div>

              {/* Filter Controls - Reduced Spacing */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                    className={`px-2.5 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      showOnlyFeatured
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                    <span className="hidden sm:inline">({stats.featured})</span>
                  </button>
                  
                  <button
                    onClick={() => setShowOnlyNew(!showOnlyNew)}
                    className={`px-2.5 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      showOnlyNew
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>New</span>
                    <span className="hidden sm:inline">({stats.new})</span>
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-gray-800 p-1 rounded-lg border border-gray-700 self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                    title="Grid View"
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
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Pills - Horizontal Scrollable Container */}
              <div className="w-full overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-max">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    🎯 All Tools
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      <span className="text-base">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-gray-500">
              Showing <span className="text-white font-bold">{filteredTools.length}</span> tools
              {searchQuery && <span> matching "<span className="text-white">{searchQuery}</span>"</span>}
            </div>

            {/* Tools Grid/List - Improved Responsive */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🔍</div>
                <p className="text-xl sm:text-2xl text-gray-400 mb-2">No tools found</p>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : viewMode === 'grid' ? (
<div className="flex flex-col gap-2 w-full">
  {filteredTools.map(tool => (
    <div key={tool.id || tool.name} className="w-full">
      <ToolListItem tool={tool} />
    </div>
  ))}
</div>
            ) : (
              <div className="space-y-2">
                {filteredTools.map(tool => (
                  <ToolListItem key={tool.id || tool.name} tool={tool} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

// Category Grid Component - Reduced Spacing
function CategoryGrid({ categories, categoryStats, setSelectedCategory, setShowOnlyFeatured, setShowOnlyNew, stats }: any) {
  const featuredTools = useMemo(() => getFeaturedTools(4), [])
  const newTools = useMemo(() => getNewTools(4), [])

  return (
    <div className="animate-fadeIn px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Choose a Category</h2>
      
      {/* Category Cards - Reduced Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
        {categories.map((cat: any) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group relative overflow-hidden bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 
                       hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02]
                       border border-gray-700 hover:border-gray-600 text-left"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2 sm:mb-3 h-12">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${cat.bgColor}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-xl sm:text-2xl">{cat.emoji}</span>
                  </div>
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-700 rounded-full text-xs sm:text-sm font-medium text-gray-300">
                    {categoryStats[cat.id] || 0} tools
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{cat.description}</p>
                
                <div className="flex items-center text-xs sm:text-sm font-semibold text-cyan-400 group-hover:gap-3 transition-all">
                  Browse tools 
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Quick Access Sections - Reduced Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Featured Tools */}
        <QuickAccessCard
          title="Featured Tools"
          icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />}
          tools={featuredTools}
          count={stats.featured}
          onViewAll={() => {
            setSelectedCategory('all')
            setShowOnlyFeatured(true)
          }}
        />

        {/* New Tools */}
        <QuickAccessCard
          title="Recently Added"
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />}
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

// Quick Access Card Component - Reduced Spacing
function QuickAccessCard({ title, icon, tools, count, onViewAll }: any) {
  return (
    <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-700">
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-white">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {tools.map((tool: any, idx: number) => (
          <Link key={idx} href={tool.url || `/tools/${tool.id}`}>
            <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-gray-700 
                          transition-all group">
              <span className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-lg sm:text-xl flex-shrink-0">{tool.emoji || tool.icon || '🔧'}</span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm text-white block truncate">{tool.name}</span>
                  <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                </div>
              </span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-gray-300 transition-colors flex-shrink-0" />
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

// Tool Card Component - Fixed Height for Uniformity
// Tool Card Component - Fixed Height for Uniformity
function ToolCard({ tool }: { tool: any }) {
  // Get icon background color based on tool
  const getIconBgClass = () => {
    if (tool.id === 'pc-optimizer') return 'bg-gray-700'
    if (tool.id === 'password-generator') return 'bg-yellow-500'
    if (tool.id === 'age-calculator') return 'bg-amber-700'
    
    // Default based on category
    const category = CATEGORIES.find(c => c.id === tool.categoryId)
    return category?.bgColor || 'bg-gray-600'
  }

  return (
    <Link href={tool.url || `/tools/${tool.id}`}>
      <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:bg-gray-750 transition-all 
                     hover:scale-[1.01] cursor-pointer h-[240px] sm:h-[260px] w-full
                     flex flex-col border border-gray-700 hover:border-gray-600">
        {/* Header - Fixed Height */}
        <div className="flex items-start justify-between mb-3 h-12">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${getIconBgClass()} flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}>
            {tool.icon || tool.emoji || '🔧'}
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            {tool.featured && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                Featured
              </span>
            )}
            {tool.new && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium">
                New
              </span>
            )}
          </div>
        </div>

        {/* Title - Fixed Height with 2 Line Max */}
        <h3 className="text-base sm:text-lg font-bold mb-2 text-white line-clamp-2 min-h-[3rem] break-words">
          {tool.name}
        </h3>
        
        {/* Description - Fixed Height with Line Clamp */}
        <p className="text-xs sm:text-sm text-gray-400 mb-4 line-clamp-2 flex-grow min-h-[2.5rem]">
          {tool.description || 'No description available'}
        </p>
        
        {/* Footer - Always at Bottom */}
        <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-gray-700">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {tool.timeToUse || 'Instant'}
          </span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
        </div>
      </div>
    </Link>
  )
}

// Tool List Item Component - Clean and Organized
function ToolListItem({ tool }: { tool: any }) {
  // Get icon background color based on tool
  const getIconBgClass = () => {
    if (tool.id === 'pc-optimizer') return 'bg-gray-700'
    if (tool.id === 'password-generator') return 'bg-yellow-500'
    if (tool.id === 'age-calculator') return 'bg-amber-700'
    
    // Default based on category
    const category = CATEGORIES.find(c => c.id === tool.categoryId)
    return category?.bgColor || 'bg-gray-600'
  }

  return (
    <Link href={tool.url || `/tools/${tool.id}`}>
      <div className="bg-gray-800 rounded-lg sm:rounded-xl hover:bg-gray-750 transition-all 
                     cursor-pointer border border-gray-700 hover:border-gray-600">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Icon - Fixed Size */}
            <div className={`flex-shrink-0 w-12 h-12 ${getIconBgClass()} rounded-lg flex items-center justify-center text-2xl`}>
              {tool.icon || tool.emoji || '🔧'}
            </div>

            {/* Main Content - Fixed Width */}
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow min-w-0">
                  {/* Title with Badges inline */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">
                      {tool.name}
                    </h3>
                    {/* Badges */}
                    <div className="flex gap-1 flex-shrink-0">
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
                  {/* Description */}
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {tool.description || 'No description available'}
                  </p>
                </div>
                
                {/* Time and Arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tool.timeToUse || 'Instant'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}