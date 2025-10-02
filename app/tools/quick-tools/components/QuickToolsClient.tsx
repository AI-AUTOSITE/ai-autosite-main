'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { getToolsByCategory } from '@/lib/unified-data'
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react'

export default function QuickToolsClient() {
  const tools = useMemo(() => 
    getToolsByCategory('quick-tools').filter(t => t.status === 'active')
  , [])

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Navigation */}
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tools
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⚡</span>
            <h1 className="text-4xl font-bold">Quick Tools</h1>
          </div>
          <p className="text-xl text-gray-400">
            {tools.length} instant tools for everyday tasks. No setup needed.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolCard({ tool }: any) {
  return (
    <Link href={tool.url} className="block group">
      <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all 
                      border border-gray-700 hover:border-gray-600 h-full min-h-[240px]
                      flex flex-col hover:scale-[1.02] transform">
        {/* Icon and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{tool.icon || tool.emoji}</div>
          <div className="flex gap-1">
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

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">
          {tool.name}
        </h3>
        <p className="text-base text-gray-400 mb-4 line-clamp-3 flex-grow">
          {tool.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-gray-700">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tool.timeToUse}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 
                        group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}