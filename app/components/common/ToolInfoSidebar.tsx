// app/components/common/ToolInfoSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, Users, Shield, Star, ExternalLink } from 'lucide-react'
import type { Tool } from '../../lib/categories'
import type { Category } from '../../lib/categories-config'

interface ToolInfoSidebarProps {
  tool: Tool
  category: Category | undefined
}

export default function ToolInfoSidebar({ tool, category }: ToolInfoSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sticky top-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 bg-white/10 rounded-full p-1 hover:bg-white/20 transition-colors"
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {!isCollapsed && (
          <>
            {/* Tool Status */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  tool.status === 'live'
                    ? 'bg-green-500/20 text-green-400'
                    : tool.status === 'coming'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {tool.status.toUpperCase()}
              </span>
              {tool.new && (
                <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                  NEW
                </span>
              )}
              {tool.featured && <Star className="w-4 h-4 text-yellow-400" />}
            </div>

            {/* Tool Stats */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Time to use
                </span>
                <span className="text-white">{tool.timeToUse}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Difficulty
                </span>
                <span className="text-white">{tool.difficulty}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Data processing
                </span>
                <span className="text-white capitalize">{tool.dataProcessing || 'local'}</span>
              </div>
            </div>

            {/* Tool Type */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Tool Type</p>
              <div className="flex flex-wrap gap-2">
                {tool.apiRequired && (
                  <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    🤖 AI-Powered
                  </span>
                )}
                {tool.dataProcessing === 'local' && (
                  <span className="px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    🔒 100% Private
                  </span>
                )}
                {tool.new && (
                  <span className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                    ✨ Recently Added
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {tool.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Pricing</p>
              <div
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  tool.pricing === 'free' || !tool.pricing
                    ? 'bg-green-500/20 text-green-400'
                    : tool.pricing === 'freemium'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {!tool.pricing || tool.pricing === 'free'
                  ? 'Free Forever'
                  : tool.pricing === 'freemium'
                    ? 'Free + Premium'
                    : 'Premium'}
              </div>
            </div>

            {/* Category */}
            {category && (
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/tools?category=${category.id}`}
                  className="flex items-center justify-between text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{category.emoji}</span>
                    <span>More {category.name}</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}