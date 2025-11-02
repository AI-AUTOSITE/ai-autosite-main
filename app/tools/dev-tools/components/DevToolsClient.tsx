'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { getToolsByCategory } from '@/lib/categories'
import { ArrowLeft } from 'lucide-react'
import ToolCard from '@/components/ToolCard'

export default function DevToolsClient() {
  const tools = useMemo(
    () => getToolsByCategory('dev-tools')
      .filter((t) => t.status === 'live')
      .sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔧</span>
            <h1 className="text-4xl font-bold">Developer Tools</h1>
          </div>
          <p className="text-xl text-gray-400">
            {tools.length} professional tools for code analysis and debugging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                      gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}