'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
Search,
ChevronRight,
Clock,
Sparkles,
X,
AlertCircle,
Monitor,
Zap,
Code,
BookOpen,
Briefcase,
Palette,
GraduationCap
} from 'lucide-react'
// 統一データシステムをインポート
import {
getActiveTools,
getToolsByCategory,
getFeaturedTools,
getNewTools,
searchTools,
getStatistics
} from '@/lib/unified-data'
// デバイス検出（既存のまま使用）
import { useDeviceDetection, isToolMobileCompatible, getToolMobileInfo } from '@/lib/device-utils'
// 統一カテゴリー定義
const UNIFIED_CATEGORIES = [
{
id: 'quick-tools',
title: 'Quick',
icon: '⚡',
lucideIcon: Zap,
color: 'from-cyan-500 to-blue-500',
enabled: true
},
{
id: 'dev-tools',
title: 'Developer',
icon: '💻',
lucideIcon: Code,
color: 'from-purple-500 to-indigo-500',
enabled: true
},
{
id: 'study-tools',
title: 'Study',
icon: '📚',
lucideIcon: BookOpen,
color: 'from-green-500 to-teal-500',
enabled: true
},
{
id: 'business-tools',
title: 'Business',
icon: '💼',
lucideIcon: Briefcase,
color: 'from-blue-500 to-purple-600',
enabled: true
},
{
id: 'creative-tools',
title: 'Creative',
icon: '🎨',
lucideIcon: Palette,
color: 'from-pink-500 to-rose-500',
enabled: true
},
{
id: 'learning-hub',
title: 'Learning',
icon: '🎓',
lucideIcon: GraduationCap,
color: 'from-amber-500 to-orange-500',
enabled: false  // 現在無効
}
]
export default function MinimalHomeContent() {
    console.log('MinimalHomeContent loaded - using unified data system')

const searchParams = useSearchParams()
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('all')
const [tools, setTools] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
const [statistics, setStatistics] = useState<any>(null)
// Device detection
const { isMobile, isTablet, isDesktop } = useDeviceDetection()
// 有効なカテゴリーのみ取得
const enabledCategories = UNIFIED_CATEGORIES.filter(c => c.enabled)
// データ読み込み
useEffect(() => {
const loadData = async () => {
console.log('🔍 Starting data load...')
setIsLoading(true)
  try {
    // 統一データシステムから取得
    console.log('📊 Calling getActiveTools...')
    const activeTools = getActiveTools()
    console.log('✅ Active tools loaded:', activeTools.length, 'tools')
    console.log('🔧 First 3 tools:', activeTools.slice(0, 3))
    
    console.log('📈 Calling getStatistics...')
    const stats = getStatistics()
    console.log('✅ Statistics loaded:', stats)
    
    setTools(activeTools)
    setStatistics(stats)
    console.log('💾 State updated with tools')
    
  } catch (error) {
    console.error('❌ Failed to load tools:', error)
  } finally {
    setIsLoading(false)
    console.log('✨ Loading complete')
  }
}

// 少し遅延を入れて読み込み
setTimeout(loadData, 100)
}, [])
// フィルタリング結果もログ出力
const filteredTools = (() => {
let result = tools
// カテゴリーフィルター
if (selectedCategory !== 'all') {
  result = getToolsByCategory(selectedCategory).filter(t => t.status === 'active')
  console.log(`📁 Category filter (${selectedCategory}):`, result.length, 'tools')
}

// 検索フィルター
if (searchQuery) {
  result = searchTools(searchQuery)
  console.log(`🔍 Search filter (${searchQuery}):`, result.length, 'tools')
}

return result
})()
console.log('📋 Current state:', {
isLoading,
toolsCount: tools.length,
filteredCount: filteredTools.length,
selectedCategory,
searchQuery
})

// Separate mobile compatible and incompatible tools
const mobileTools = filteredTools.filter(tool => isToolMobileCompatible(tool.id))
const desktopOnlyTools = filteredTools.filter(tool => !isToolMobileCompatible(tool.id))
// Category tool count (統一データから取得)
const getCategoryCount = (categoryId: string) => {
return getToolsByCategory(categoryId).filter(t => t.status === 'active').length
}
// Handle category change
const handleCategorySelect = (categoryId: string) => {
setSelectedCategory(categoryId)
const url = new URL(window.location.href)
if (categoryId === 'all') {
  url.searchParams.delete('category')
} else {
  url.searchParams.set('category', categoryId)
}
window.history.pushState({}, '', url)
}
// Clear all filters
const clearFilters = () => {
setSearchQuery('')
handleCategorySelect('all')
}
// Tool card component with mobile awareness
const ToolCard = ({ tool }: { tool: any }) => {
const mobileInfo = getToolMobileInfo(tool.id)
const isCompatible = mobileInfo.compatible
const showAsDisabled = (isMobile || isTablet) && !isCompatible
// カテゴリー情報を取得
const category = UNIFIED_CATEGORIES.find(c => c.id === tool.categoryId)
const colorClass = category?.color || 'from-gray-500 to-gray-600'

if (showAsDisabled) {
  return (
    <div className="block p-5 bg-gray-900/50 rounded-xl border border-gray-700 opacity-60 cursor-not-allowed relative">
      {/* Desktop Only Badge */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 rounded flex items-center gap-1">
        <Monitor className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-400">Desktop Only</span>
      </div>
      
      {/* Tool Info (Grayed Out) */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-2xl opacity-50`}>
          {tool.emoji || tool.icon || '🔧'}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-500 mb-2">
        {tool.name}
      </h3>
      
      {/* Mobile Warning Message */}
      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-2 mt-3">
        <p className="text-xs text-yellow-400 flex items-start gap-1">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{mobileInfo.alternativeMessage}</span>
        </p>
      </div>
    </div>
  )
}

// Normal tool card for compatible tools
return (
  <Link
    key={tool.id}
    href={tool.url || `/tools/${tool.id}`}
    className="block p-5 bg-white/10 rounded-xl hover:bg-white/15 hover:scale-[1.02] transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
        {tool.emoji || tool.icon || '🔧'}
      </div>
      <div className="flex gap-1">
        {tool.new && (
          <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded font-medium">
            NEW
          </span>
        )}
        {tool.featured && (
          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded font-medium">
            ⭐
          </span>
        )}
        {tool.apiRequired && (
          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded font-medium">
            AI
          </span>
        )}
      </div>
    </div>

    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
      {tool.name}
    </h3>
    <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
      {tool.description}
    </p>

    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {tool.timeToUse || 'Instant'}
      </span>
      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
)
}
// Loading state
if (isLoading) {
return (
<div className="max-w-7xl mx-auto px-4 py-16 text-center">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
<p className="text-gray-400">Loading tools...</p>
</div>
)
}
return (
<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
{/* Simple Hero */}
<section className="text-center mb-8">
<div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full mb-4">
<Sparkles className="w-4 h-4 text-cyan-400" />
<span className="text-sm text-cyan-400">Free Forever • No Sign-up Required</span>
</div>
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
      Instant Tools
    </h1>
    <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
      Free online tools that work instantly in your browser
    </p>
  </section>

  {/* Mobile Device Notice */}
  {(isMobile || isTablet) && desktopOnlyTools.length > 0 && (
    <section className="mb-6">
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 max-w-2xl mx-auto">
        <p className="text-sm text-blue-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Some tools work better on desktop. They're marked with "Desktop Only".
        </p>
      </div>
    </section>
  )}

  {/* Search Bar */}
  <section className="mb-8">
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-12 py-4 text-base bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="Search tools"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  </section>

  {/* Category Filter - 統一カテゴリー使用 */}
  <section className="mb-8">
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => handleCategorySelect('all')}
        className={`px-4 py-3 rounded-lg transition-all font-medium min-w-[44px] min-h-[44px] ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
            : 'bg-white/10 text-gray-300 hover:bg-white/15'
        }`}
        aria-pressed={selectedCategory === 'all'}
      >
        All ({statistics?.tools.active || 0})
      </button>
      
      {enabledCategories.map(category => {
        const count = getCategoryCount(category.id)
        return (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 font-medium min-w-[44px] min-h-[44px] ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
            aria-pressed={selectedCategory === category.id}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.title}</span>
            <span className="text-sm opacity-75">({count})</span>
          </button>
        )
      })}
    </div>
  </section>

  {/* Tools Grid */}
  <section>
    {filteredTools.length > 0 ? (
      <>
        {/* Mobile/Tablet: Show compatible tools first, then desktop-only */}
        {(isMobile || isTablet) ? (
          <>
            {/* Mobile Compatible Tools */}
            {mobileTools.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Works on Your Device
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mobileTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Desktop Only Tools (Grayed Out) */}
            {desktopOnlyTools.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Desktop Only
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {desktopOnlyTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop: Show all tools normally */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-8 text-sm text-gray-400">
          {filteredTools.length} tools found
          {(isMobile || isTablet) && desktopOnlyTools.length > 0 && (
            <span className="ml-2">
              ({mobileTools.length} work on mobile, {desktopOnlyTools.length} desktop only)
            </span>
          )}
        </div>
      </>
    ) : (
      /* Empty State */
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
          <Search className="w-10 h-10 text-gray-600" />
        </div>
        <p className="text-lg text-gray-400 mb-2">
          No tools found
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Try adjusting your search or filters
        </p>
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          Clear filters
        </button>
      </div>
    )}
  </section>

  {/* CTA Section */}
  <section className="mt-16 text-center">
    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 p-8">
      <h3 className="text-2xl font-bold text-white mb-4">
        Can't find what you need?
      </h3>
      <p className="text-gray-400 mb-6">
        We're constantly adding new tools based on user feedback
      </p>
      <Link
        href="/request"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
      >
        Request a Tool
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </section>

  {/* Quick Stats - 統一データから取得 */}
  <section className="mt-12">
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      <div className="text-center p-4 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-cyan-400">
          {statistics?.tools.active || 0}
        </p>
        <p className="text-xs text-gray-400 mt-1">Tools</p>
      </div>
      <div className="text-center p-4 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-green-400">100%</p>
        <p className="text-xs text-gray-400 mt-1">Free</p>
      </div>
      <div className="text-center p-4 bg-white/5 rounded-lg">
        <p className="text-2xl font-bold text-purple-400">Safe</p>
        <p className="text-xs text-gray-400 mt-1">Private</p>
      </div>
    </div>
  </section>
</div>
)
}
