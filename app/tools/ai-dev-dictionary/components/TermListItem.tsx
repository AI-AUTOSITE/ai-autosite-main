// app/tools/ai-dev-dictionary/components/TermListItem.tsx

'use client'

import { Eye, Code, Sparkles, ChevronRight } from 'lucide-react'
import type { TechTerm } from '../lib/terms'

interface TermListItemProps {
  term: TechTerm
  onViewDetails: () => void
}

export default function TermListItem({ term, onViewDetails }: TermListItemProps) {
  // Get category color
  const getCategoryStyle = () => {
    const colors: Record<string, string> = {
      'ui-components': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'data-display': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'layout': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'navigation': 'bg-green-500/20 text-green-400 border-green-500/30',
      'forms': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'feedback': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'advanced': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    }
    return colors[term.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="group bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="p-4 flex items-center gap-4">
        {/* Category Badge */}
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border ${getCategoryStyle()}`}>
          {term.category.replace('-', ' ')}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                {term.term}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-1">
                {term.description}
              </p>
            </div>

            {/* AI Synonyms */}
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <div className="flex gap-1">
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {term.codeExample && (
            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
              <Code className="w-4 h-4" />
            </div>
          )}
          <button
            onClick={onViewDetails}
            className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white text-sm rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center gap-2 group"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}