// app/components/common/RelatedTools.tsx
'use client'

import Link from 'next/link'
import type { Tool, Category } from '../../lib/categories'
import { TOOLS } from '../../lib/categories'

interface RelatedToolsProps {
  currentTool: Tool
  category: Category
}

export default function RelatedTools({ currentTool, category }: RelatedToolsProps) {
  // TOOLSから直接フィルタリング（getToolsByCategoryの代わり）
  const relatedTools = TOOLS.filter((t) => t.category === category.id)
    .filter((t) => t.id !== currentTool.id && t.status === 'live')
    .slice(0, 3)

  if (relatedTools.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Related Tools</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.url}
            className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center text-lg`}
              >
                {tool.icon}
              </div>
              <h4 className="font-medium text-white text-sm">{tool.name}</h4>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
