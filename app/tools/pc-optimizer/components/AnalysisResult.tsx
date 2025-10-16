// app/tools/pc-optimizer/components/AnalysisResult.tsx

import React, { useState, useMemo, memo } from 'react'
import {
  HardDrive,
  Calendar,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Trash2,
  Shield,
  Globe,
  Gamepad2,
  Code,
  Image,
  MessageSquare,
  Wrench,
  HelpCircle,
} from 'lucide-react'
import { AnalyzedSoftware, SoftwareCategory } from '../lib/types'
import { formatBytes } from '../utils'
import { PRIORITY_CONFIG, CATEGORY_CONFIG, UI_MESSAGES } from '../constants'

interface AnalysisResultProps {
  data: AnalyzedSoftware[]
}

// Category icons mapping
const categoryIcons: Record<SoftwareCategory, JSX.Element> = {
  browser: <Globe className="w-5 h-5" />,
  gaming: <Gamepad2 className="w-5 h-5" />,
  productivity: <Wrench className="w-5 h-5" />,
  development: <Code className="w-5 h-5" />,
  media: <Image className="w-5 h-5" />,
  communication: <MessageSquare className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  utility: <Wrench className="w-5 h-5" />,
  system: <Shield className="w-5 h-5" />,
  unknown: <HelpCircle className="w-5 h-5" />,
}

// Summary stats component - Mobile optimized
const SummaryStats = memo(({ stats }: { stats: any }) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Summary</h3>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
      <div className="bg-blue-500/10 p-3 sm:p-4 rounded-lg border border-blue-500/20">
        <p className="text-xs sm:text-sm text-blue-400 mb-1">Total Size</p>
        <p className="text-lg sm:text-2xl font-bold text-blue-300">{formatBytes(stats.totalSize)}</p>
      </div>
      <div className="bg-purple-500/10 p-3 sm:p-4 rounded-lg border border-purple-500/20">
        <p className="text-xs sm:text-sm text-purple-400 mb-1">Cache</p>
        <p className="text-lg sm:text-2xl font-bold text-purple-300">{formatBytes(stats.totalCache)}</p>
      </div>
      <div className="bg-orange-500/10 p-3 sm:p-4 rounded-lg border border-orange-500/20">
        <p className="text-xs sm:text-sm text-orange-400 mb-1">Removable</p>
        <p className="text-lg sm:text-2xl font-bold text-orange-300">{formatBytes(stats.removableSize)}</p>
      </div>
      <div className="bg-green-500/10 p-3 sm:p-4 rounded-lg border border-green-500/20">
        <p className="text-xs sm:text-sm text-green-400 mb-1">Apps</p>
        <p className="text-lg sm:text-2xl font-bold text-green-300">{stats.count}</p>
      </div>
    </div>
  </div>
))

SummaryStats.displayName = 'SummaryStats'

// Software item component - Mobile optimized
const SoftwareItem = memo(
  ({
    software,
    isExpanded,
    onToggle,
  }: {
    software: AnalyzedSoftware
    isExpanded: boolean
    onToggle: () => void
  }) => {
    const priorityConfig = PRIORITY_CONFIG[software.priority]

    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
        <div 
          className="p-4 sm:p-6 cursor-pointer min-h-[80px]" 
          onClick={onToggle}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-1">{categoryIcons[software.category]}</div>
              <div className="flex-1 min-w-0">
                {/* Title and badges - responsive */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="text-base sm:text-lg font-semibold text-white truncate">{software.displayName}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${priorityConfig.color}`}
                  >
                    {priorityConfig.label}
                  </span>
                  {software.isStartup && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Zap className="w-3 h-3 inline mr-1" />
                      <span className="hidden sm:inline">Startup</span>
                    </span>
                  )}
                </div>

                {software.description && (
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">{software.description}</p>
                )}

                {/* Info row - responsive */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-300">
                    <HardDrive className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="font-medium">{software.sizeFormatted}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>{software.lastUsedFormatted}</span>
                  </div>
                  {software.cacheSizeFormatted && (
                    <div className="flex items-center text-gray-300">
                      <HardDrive className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>Cache: {software.cacheSizeFormatted}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Expand button - LARGER touch target */}
            <div className="flex-shrink-0 ml-2 p-2">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details - Mobile optimized */}
        {isExpanded && (
          <div className="border-t border-white/10 px-4 sm:px-6 py-4 bg-white/5">
            <div className="space-y-4 sm:space-y-6 sm:grid sm:grid-cols-2 sm:gap-6">
              <div>
                <h5 className="font-semibold text-white mb-3 flex items-center text-sm sm:text-base">
                  <Info className="w-4 h-4 mr-2" />
                  Details
                </h5>
                <dl className="space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium text-gray-400 sm:w-24">Path:</dt>
                    <dd className="text-gray-300 break-all mt-1 sm:mt-0">{software.path}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-400 w-24">Category:</dt>
                    <dd className="text-gray-300">{CATEGORY_CONFIG[software.category].name}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-400 w-24">Priority:</dt>
                    <dd className="text-gray-300">{priorityConfig.label}</dd>
                  </div>
                </dl>
              </div>

              {software.tips && software.tips.length > 0 && (
                <div>
                  <h5 className="font-semibold text-white mb-3 flex items-center text-sm sm:text-base">
                    <Zap className="w-4 h-4 mr-2" />
                    Tips
                  </h5>
                  <ul className="space-y-2">
                    {software.tips.map((tip, index) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-300 flex items-start">
                        <span className="text-cyan-400 mr-2">-</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Warning messages - Mobile optimized */}
            {software.priority === 'removable' && (
              <div className="mt-4 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-amber-300">
                    <p className="font-semibold mb-1">Can Remove</p>
                    <p>Not used for 3+ months. Safe to uninstall.</p>
                    <p className="mt-2">
                      Settings - Apps - {software.displayName} - Uninstall
                    </p>
                  </div>
                </div>
              </div>
            )}

            {software.priority === 'critical' && (
              <div className="mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-red-300">
                    <p className="font-semibold mb-1">System Critical</p>
                    <p>Required for Windows. Do not remove.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Mobile optimized with larger touch targets */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button className="px-4 py-3 text-xs sm:text-sm bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors min-h-[44px]">
                Task Manager
              </button>
              {software.isStartup && (
                <button className="px-4 py-3 text-xs sm:text-sm bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors min-h-[44px]">
                  Manage Startup
                </button>
              )}
              {software.priority === 'removable' && (
                <button className="px-4 py-3 text-xs sm:text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors min-h-[44px]">
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  How to Uninstall
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

SoftwareItem.displayName = 'SoftwareItem'

// Main component
export default function AnalysisResult({ data }: AnalysisResultProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'size' | 'lastUsed'>('size')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  // Memoized filtering and sorting
  const { filteredData, stats, categories } = useMemo(() => {
    let filtered =
      selectedCategory === 'all' ? data : data.filter((item) => item.category === selectedCategory)

    // Sort data
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'size') return b.size - a.size
      if (sortBy === 'lastUsed') {
        if (!a.lastUsed) return 1
        if (!b.lastUsed) return -1
        return b.lastUsed.getTime() - a.lastUsed.getTime()
      }
      return 0
    })

    // Calculate stats
    const totalSize = filtered.reduce((sum, item) => sum + item.size, 0)
    const totalCache = filtered.reduce((sum, item) => sum + (item.cacheSize || 0), 0)
    const removableSize = filtered
      .filter((item) => item.priority === 'removable')
      .reduce((sum, item) => sum + item.size, 0)

    // Count categories
    const categoryCount = new Map<SoftwareCategory, number>()
    data.forEach((item) => {
      categoryCount.set(item.category, (categoryCount.get(item.category) || 0) + 1)
    })

    return {
      filteredData: filtered,
      stats: {
        totalSize,
        totalCache,
        removableSize,
        count: filtered.length,
      },
      categories: categoryCount,
    }
  }, [data, selectedCategory, sortBy])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Statistics */}
      <SummaryStats stats={stats} />

      {/* Filters - Mobile optimized */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-300">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SoftwareCategory | 'all')}
              className="px-2 sm:px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[36px]"
            >
              <option value="all">All ({data.length})</option>
              {Array.from(categories.entries()).map(([cat, count]) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].name} ({count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'size' | 'lastUsed')}
              className="px-2 sm:px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[36px]"
            >
              <option value="size">Size</option>
              <option value="lastUsed">Last Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Software List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredData.map((software) => (
          <SoftwareItem
            key={software.id}
            software={software}
            isExpanded={expandedItems.has(software.id)}
            onToggle={() => toggleExpanded(software.id)}
          />
        ))}
      </div>

      {/* Optimization Summary - Mobile optimized */}
      {filteredData.filter((s) => s.priority === 'removable').length > 0 && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-4 sm:p-6 border border-green-500/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
            Save Space
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-gray-300">
            <p>
              <strong className="text-white">
                {filteredData.filter((s) => s.priority === 'removable').length}
              </strong>{' '}
              apps can be removed. Free up{' '}
              <strong className="text-base sm:text-lg mx-1 text-white">
                {formatBytes(stats.removableSize)}
              </strong>
            </p>
            <div className="mt-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold mb-2 text-white">Steps:</h4>
              <ol className="space-y-1 text-gray-300">
                <li>1. Remove unused apps</li>
                <li>2. Clear browser cache</li>
                <li>3. Disable startup apps</li>
                <li>4. Run Disk Cleanup</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}