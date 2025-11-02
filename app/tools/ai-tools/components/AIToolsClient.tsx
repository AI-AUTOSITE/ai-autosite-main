'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Tool } from '@/lib/categories/types'
import ToolCard from '@/components/ToolCard'

// Omit 'icon' from Tool type (removed in Server Component)
type ClientTool = Omit<Tool, 'icon'>

interface AIToolsClientProps {
  tools: ClientTool[]
}

export default function AIToolsClient({ tools }: AIToolsClientProps) {
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
            <span className="text-4xl">🤖</span>
            <h1 className="text-4xl font-bold">AI Tools</h1>
          </div>
          <p className="text-xl text-gray-400">
            {tools.length} AI-powered tools for productivity and creativity.
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