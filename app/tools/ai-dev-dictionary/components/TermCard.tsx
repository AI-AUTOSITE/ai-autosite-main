// app/tools/ai-dev-dictionary/components/TermCard.tsx

'use client'

import { useState } from 'react'
import { Eye, Info, Code, Sparkles } from 'lucide-react'
import type { TechTerm } from '../lib/terms'

interface TermCardProps {
  term: TechTerm
  isActive?: boolean
  onTriggerDemo?: () => void
  onViewDetails: () => void
}

export default function TermCard({ term, isActive, onTriggerDemo, onViewDetails }: TermCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get category color
  const getCategoryStyle = () => {
    const colors: Record<string, string> = {
      'ui-components': 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/30',
      'data-display': 'from-blue-500/20 to-blue-500/10 border-blue-500/30',
      'layout': 'from-purple-500/20 to-purple-500/10 border-purple-500/30',
      'navigation': 'from-green-500/20 to-green-500/10 border-green-500/30',
      'forms': 'from-yellow-500/20 to-yellow-500/10 border-yellow-500/30',
      'feedback': 'from-pink-500/20 to-pink-500/10 border-pink-500/30',
      'advanced': 'from-orange-500/20 to-orange-500/10 border-orange-500/30',
    }
    return colors[term.category] || 'from-gray-500/20 to-gray-500/10 border-gray-500/30'
  }

  return (
    <div 
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryStyle().split(' ')[0]} ${getCategoryStyle().split(' ')[1]} rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
      
      <div className={`relative h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl border ${getCategoryStyle().split(' ')[2]} overflow-hidden hover:border-white/30 transition-all duration-300`}>
        {/* Compact Header */}
        <div className="p-5">
          {/* Category Badge */}
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex px-2.5 py-1 bg-gradient-to-r ${getCategoryStyle().split(' ').slice(0, 2).join(' ')} text-xs rounded-full border ${getCategoryStyle().split(' ')[2]} text-gray-300`}>
              {term.category.replace('-', ' ')}
            </span>
            {isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Term Title */}
          <h3 className="text-lg font-bold text-white mb-1">
            {term.term}
          </h3>
          
          {/* Short Description */}
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {term.description}
          </p>

          {/* AI Synonyms Preview */}
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <div className="flex flex-wrap gap-1">
              {term.aiSynonyms.slice(0, 2).map((synonym, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
                >
                  {synonym}
                </span>
              ))}
              {term.aiSynonyms.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{term.aiSynonyms.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - Simplified */}
          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white text-sm rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Demo
            </button>
            
            {term.codeExample && (
              <button
                onClick={onViewDetails}
                className="px-3 py-2 bg-white/10 text-gray-300 text-sm rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                title="View code"
              >
                <Code className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
        )}
      </div>
    </div>
  )
}