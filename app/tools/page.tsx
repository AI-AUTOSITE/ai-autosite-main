// app/tools/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import ToolsPageWithSearch from './ToolsPageWithSearch'
import { getLiveTools } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'All Tools | AI AutoSite',
  description: 'Browse all available tools - converters, editors, generators, analyzers, and more.',
}

// ========================================
// Main Tools Page (Server Component)
// ========================================
export default function ToolsPage() {
  // Get all live tools from categories
  const tools = getLiveTools()

  // Sort tools alphabetically by name and preserve emoji/icon
  const sortedTools = tools
    .sort((a, b) => {
      return (a.name || '').localeCompare(b.name || '')
    })
    .map((tool) => ({
      ...tool,
      // Ensure emoji is available, use icon as fallback
      emoji: tool.emoji || tool.icon || '🔧',
    }))

  return (
    <div className="min-h-screen bg-gray-900">
      <Suspense fallback={<LoadingFallback />}>
        <ToolsPageWithSearch tools={sortedTools} />
      </Suspense>
    </div>
  )
}

// ========================================
// Loading Fallback Component
// ========================================
function LoadingFallback() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading tools...</p>
        </div>
      </div>
    </div>
  )
}