// app/tools/page.tsx
import { Metadata } from 'next'
import ToolsPageWithSearch from './ToolsPageWithSearch'
import { getActiveTools } from '@/lib/unified-data'

export const metadata: Metadata = {
  title: 'All Tools | AI AutoSite',
  description: 'Browse all available tools - converters, editors, generators, analyzers, and more.',
}

// ========================================
// Main Tools Page (Server Component)
// ========================================
export default function ToolsPage() {
  // Get all active tools
  const tools = getActiveTools()

  // Sort tools alphabetically by name
  const sortedTools = tools.sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '')
  })

  return (
    <div className="min-h-screen bg-gray-900">
      <ToolsPageWithSearch tools={sortedTools} />
    </div>
  )
}