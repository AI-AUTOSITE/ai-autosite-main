'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
getActiveTools,
getToolsByCategory,
getFeaturedTools,
getNewTools,
searchTools,
getStatistics
} from '@/lib/unified-data'
import {
Search,
Sparkles,
Clock,
Grid3x3,
List,
ChevronRight,
ArrowRight,
Zap,
Code,
BookOpen,
Briefcase,
Palette,
GraduationCap
} from 'lucide-react'
// カテゴリー定義（アイコン追加・改善版）
const CATEGORIES = [
{
id: 'quick-tools',
name: 'Quick Tools',
emoji: '⚡',
icon: Zap,
color: 'from-cyan-500 to-blue-500',
bgGradient: 'from-cyan-500/20 to-blue-500/20',
description: 'Instant tools for everyday tasks'
},
{
id: 'dev-tools',
name: 'Dev Tools',
emoji: '💻',
icon: Code,
color: 'from-purple-500 to-indigo-500',
bgGradient: 'from-purple-500/20 to-indigo-500/20',
description: 'Tools for developers and coders'
},
{
id: 'study-tools',
name: 'Study Tools',
emoji: '📚',
icon: BookOpen,
color: 'from-green-500 to-teal-500',
bgGradient: 'from-green-500/20 to-teal-500/20',
description: 'AI-powered learning assistance'
},
{
id: 'business-tools',
name: 'Business',
emoji: '💼',
icon: Briefcase,
color: 'from-blue-500 to-purple-600',
bgGradient: 'from-blue-500/20 to-purple-600/20',
description: 'Professional productivity tools'
},
{
id: 'creative-tools',
name: 'Creative',
emoji: '🎨',
icon: Palette,
color: 'from-pink-500 to-rose-500',
bgGradient: 'from-pink-500/20 to-rose-500/20',
description: 'Design and creative tools'
},
{
id: 'learning-hub',
name: 'Learning',
emoji: '🎓',
icon: GraduationCap,
color: 'from-amber-500 to-orange-500',
bgGradient: 'from-amber-500/20 to-orange-500/20',
description: 'Interactive learning resources'
}
]
export default function ToolsPageV3() {
// State Management
const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
const [searchQuery, setSearchQuery] = useState('')
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
const [showOnlyNew, setShowOnlyNew] = useState(false)
const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
const [tools, setTools] = useState<any[]>([])
const [filteredTools, setFilteredTools] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
const [categoryStats, setCategoryStats] = useState<Record<string, number>>({})
// Load data on mount
useEffect(() => {
const loadData = () => {
const allTools = getActiveTools()
setTools(allTools)
  // Calculate stats for each category
  const stats: Record<string, number> = {}
  CATEGORIES.forEach(cat => {
    const categoryTools = getToolsByCategory(cat.id).filter(t => t.status === 'active')
    stats[cat.id] = categoryTools.length
  })
  setCategoryStats(stats)
  
  setIsLoading(false)
}

setTimeout(loadData, 100)
}, [])
// Filter logic
useEffect(() => {
if (selectedCategory === null) {
setFilteredTools([])
return
}
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

setFilteredTools(filtered)
}, [selectedCategory, searchQuery, showOnlyNew, showOnlyFeatured, tools])
// Statistics
const stats = {
total: tools.length,
featured: tools.filter(t => t.featured).length,
new: tools.filter(t => t.new).length,
displayed: filteredTools.length
}
// Loading State
if (isLoading) {
return (
<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
<p className="text-gray-400">Loading tools...</p>
</div>
</div>
)
}
return (
<div className="min-h-screen bg-gray-900 text-white">
{/* Header */}
<div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
<div className="max-w-7xl mx-auto px-6">
<h1 className="text-5xl font-bold mb-4">Free Tools Collection</h1>
<p className="text-xl opacity-90">
{stats.total} tools available • Zero Ads • Zero Tracking • 100% Free
</p>
</div>
</div>
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Search Bar - Always visible */}
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
          className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                   text-lg transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>

    {/* Category Selection (Default View) */}
    {selectedCategory === null && !searchQuery && (
      <div className="animate-fadeIn">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose a Category</h2>
        
        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group relative overflow-hidden bg-gray-800 rounded-2xl p-6 
                         hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]
                         border border-gray-700 hover:border-gray-600 text-left"
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-5xl">{cat.emoji}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium">
                      {categoryStats[cat.id] || 0} tools
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{cat.description}</p>
                  
                  {/* Action */}
                  <div className={`flex items-center text-sm font-semibold bg-gradient-to-r ${cat.color} 
                                 bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                    Browse tools 
                    <ArrowRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quick Access Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Featured Tools */}
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-8 border border-purple-800/50">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
              Featured Tools
            </h3>
            <div className="space-y-3">
              {getFeaturedTools(4).map((tool, idx) => (
                <Link key={idx} href={tool.url || '#'}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-800/20 
                                transition-all group">
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{tool.emoji || tool.icon || '🔧'}</span>
                      <div>
                        <span className="font-medium">{tool.name}</span>
                        <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                      </div>
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setShowOnlyFeatured(true)
                }}
                className="w-full text-center text-purple-400 hover:text-purple-300 font-medium pt-2"
              >
                View all {stats.featured} featured tools →
              </button>
            </div>
          </div>

          {/* New Tools */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-8 border border-blue-800/50">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-blue-400" />
              Recently Added
            </h3>
            <div className="space-y-3">
              {getNewTools(4).map((tool, idx) => (
                <Link key={idx} href={tool.url || '#'}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-800/20 
                                transition-all group">
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{tool.emoji || tool.icon || '🔧'}</span>
                      <div>
                        <span className="font-medium">{tool.name}</span>
                        <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                      </div>
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setShowOnlyNew(true)
                }}
                className="w-full text-center text-blue-400 hover:text-blue-300 font-medium pt-2"
              >
                View all {stats.new} new tools →
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Tools List View */}
    {(selectedCategory !== null || searchQuery) && (
      <>
        {/* Breadcrumb and Controls */}
        <div className="mb-6 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery('')
                setShowOnlyFeatured(false)
                setShowOnlyNew(false)
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Categories
            </button>
            {selectedCategory && (
              <>
                <span className="text-gray-500">/</span>
                <span className="text-white font-medium">
                  {selectedCategory === 'all' ? 'All Tools' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  showOnlyFeatured
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Featured ({stats.featured})
              </button>

              <button
                onClick={() => setShowOnlyNew(!showOnlyNew)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  showOnlyNew
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                New ({stats.new})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-gray-700 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gray-700 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎯 All Tools
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-400">
          Showing <span className="text-white font-bold">{filteredTools.length}</span> tools
          {searchQuery && <span> matching "<span className="text-white">{searchQuery}</span>"</span>}
        </div>

        {/* Tools Grid/List */}
{filteredTools.length === 0 ? (
  <div className="text-center py-12 sm:py-16">
    <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🔍</div>
    <p className="text-xl sm:text-2xl text-gray-400 mb-2">No tools found</p>
    <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters or search query</p>
  </div>
) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.id || tool.name} tool={tool} />
                ))}
              </div>
) : (
  // リストビュー - ToolListItemを使用
  <div className="space-y-2">
    {filteredTools.map(tool => (
      <ToolListItem key={tool.id || tool.name} tool={tool} />
    ))}
  </div>
)}
      </>
    )}
  </div>
</div>
)
}
// Fixed Tool Card Component - 統一された高さ（既存のものをそのまま使用）
function ToolCard({ tool }: { tool: any }) {
// 既存のToolCardコードはそのまま
const getStatusColor = (status: string) => {
switch (status) {
case 'active': return 'bg-green-500/20 border-green-500 text-green-400'
case 'coming': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
case 'maintenance': return 'bg-red-500/20 border-red-500 text-red-400'
default: return 'bg-gray-500/20 border-gray-500 text-gray-400'
}
}
return (
<Link href={tool.url || '#'}>
<div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all 
                 hover:shadow-xl hover:scale-[1.01] cursor-pointer 
                 h-full min-h-[200px] flex flex-col border border-gray-700 hover:border-gray-600">
{/* Header - Fixed height */}
<div className="flex items-start justify-between mb-3 h-10">
<div className="text-3xl">{tool.icon || tool.emoji || '🔧'}</div>
<div className="flex gap-2 flex-wrap justify-end">
{tool.featured && (
<span className="px-2 py-1 bg-purple-500/20 border border-purple-500 rounded-md text-xs text-purple-400 font-medium">
⭐ Featured
</span>
)}
{tool.new && (
<span className="px-2 py-1 bg-blue-500/20 border border-blue-500 rounded-md text-xs text-blue-400 font-medium">
🆕 New
</span>
)}
</div>
</div>
    {/* Title - Fixed height with ellipsis */}
    <h3 className="text-lg font-bold mb-2 h-7 line-clamp-1">{tool.name}</h3>
    
    {/* Description - Flexible height with min-height */}
    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow min-h-[40px]">
      {tool.description || 'No description available'}
    </p>
    
    {/* Footer - Always at bottom */}
    <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-gray-700">
      <span className={`px-2 py-1 rounded-md border ${getStatusColor(tool.status)}`}>
        {tool.status === 'active' ? '🟢 Live' : tool.status}
      </span>
      <span className="text-gray-500">
        {tool.difficulty || 'Simple'}
      </span>
    </div>
  </div>
</Link>
)
}
// Fixed List Item Component - 完全修正版
function ToolListItem({ tool }: { tool: any }) {
const getStatusColor = (status: string) => {
switch (status) {
case 'active': return 'bg-green-500/20 border-green-500 text-green-400'
case 'coming': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
case 'maintenance': return 'bg-red-500/20 border-red-500 text-red-400'
default: return 'bg-gray-500/20 border-gray-500 text-gray-400'
}
}
const getDifficultyColor = (difficulty: string) => {
switch (difficulty?.toLowerCase()) {
case 'simple': return 'text-green-400'
case 'medium': return 'text-yellow-400'
case 'advanced': return 'text-orange-400'
default: return 'text-gray-400'
}
}
return (
<Link href={tool.url || '#'}>
<div className="bg-gray-800 rounded-xl hover:bg-gray-750 transition-all 
                 cursor-pointer border border-gray-700 hover:border-gray-600 hover:shadow-lg">
<div className="p-4">
<div className="flex items-center gap-4">
{/* Icon - 固定幅 */}
<div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl">
{tool.icon || tool.emoji || '🔧'}
</div>
        {/* Main Content - 可変幅 */}
        <div className="flex-grow min-w-0">
          {/* Title Row */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-bold text-base leading-tight flex-shrink-0">
              {tool.name}
            </h3>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-1">
            {tool.description || 'No description available'}
          </p>
        </div>
        
        {/* Right Section - 固定幅 */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* Badges - 固定幅エリア */}
          <div className="flex gap-2 min-w-[140px] justify-end">
            {tool.featured && (
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500 rounded text-xs text-purple-400 font-medium whitespace-nowrap">
                Featured
              </span>
            )}
            {tool.new && (
              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500 rounded text-xs text-blue-400 font-medium whitespace-nowrap">
                New
              </span>
            )}
          </div>
          
          {/* Status - 固定幅 */}
          <div className="min-w-[80px] flex justify-center">
            <span className={`px-2 py-0.5 rounded text-xs border font-medium whitespace-nowrap ${getStatusColor(tool.status)}`}>
              {tool.status === 'active' ? 'Live' : tool.status}
            </span>
          </div>
          
          {/* Difficulty - 固定幅 */}
          <div className={`min-w-[60px] text-xs text-right ${getDifficultyColor(tool.difficulty)}`}>
            {tool.difficulty || 'Simple'}
          </div>
          
          {/* Arrow */}
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  </div>
</Link>
)
}
