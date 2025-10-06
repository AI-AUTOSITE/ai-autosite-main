// app/tools/ai-dev-dictionary/components/cards/TermCard.tsx
'use client'

import { Eye, Code, Sparkles } from 'lucide-react'
import type { TechTerm } from '../../lib/terms'

interface TermCardProps {
  term: TechTerm
  onSelect: () => void
  compact?: boolean
}

export default function TermCard({ term, onSelect, compact = false }: TermCardProps) {
  const getCategoryStyle = () => {
    const styles: Record<string, { bg: string; border: string; badge: string }> = {
      'ui-components': {
        bg: 'from-cyan-500/10 to-transparent',
        border: 'border-cyan-500/20 hover:border-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-400',
      },
      'data-display': {
        bg: 'from-blue-500/10 to-transparent',
        border: 'border-blue-500/20 hover:border-blue-400',
        badge: 'bg-blue-500/20 text-blue-400',
      },
      forms: {
        bg: 'from-yellow-500/10 to-transparent',
        border: 'border-yellow-500/20 hover:border-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-400',
      },
      layout: {
        bg: 'from-purple-500/10 to-transparent',
        border: 'border-purple-500/20 hover:border-purple-400',
        badge: 'bg-purple-500/20 text-purple-400',
      },
      navigation: {
        bg: 'from-green-500/10 to-transparent',
        border: 'border-green-500/20 hover:border-green-400',
        badge: 'bg-green-500/20 text-green-400',
      },
      feedback: {
        bg: 'from-pink-500/10 to-transparent',
        border: 'border-pink-500/20 hover:border-pink-400',
        badge: 'bg-pink-500/20 text-pink-400',
      },
      advanced: {
        bg: 'from-orange-500/10 to-transparent',
        border: 'border-orange-500/20 hover:border-orange-400',
        badge: 'bg-orange-500/20 text-orange-400',
      },
    }
    return (
      styles[term.category] || {
        bg: 'from-gray-500/10 to-transparent',
        border: 'border-gray-500/20 hover:border-gray-500',
        badge: 'bg-gray-500/20 text-gray-400',
      }
    )
  }

  const style = getCategoryStyle()

  return (
    <div
      className={`group relative cursor-pointer ${compact ? 'h-full' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-label={`View demo for ${term.term}`}
    >
      <div
        className={`relative bg-slate-800/50 backdrop-blur rounded-xl 
                     border ${style.border} transition-all hover:scale-[1.02]
                     hover:shadow-lg hover:shadow-black/20
                     ${compact ? 'h-full' : ''}`}
      >
        {/* 背景グラデーション */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.bg} 
                      opacity-50 group-hover:opacity-100 transition-opacity rounded-xl`}
        />

        <div className="relative p-4">
          {/* カテゴリーバッジ */}
          <div className="flex items-start justify-between mb-3">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${style.badge}`}>
              {term.category.replace('-', ' ')}
            </span>
            {term.codeExample && <Code className="w-4 h-4 text-gray-400" />}
          </div>

          {/* タイトル */}
          <h3 className="text-lg font-bold text-white mb-2">{term.term}</h3>

          {/* 説明 */}
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{term.description}</p>

          {/* AI同義語 */}
          <div className="flex items-center gap-1 mb-3">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <div className="flex flex-wrap gap-1">
              {term.aiSynonyms.slice(0, 2).map((syn, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded"
                >
                  {syn}
                </span>
              ))}
              {term.aiSynonyms.length > 2 && (
                <span className="text-xs text-gray-500">+{term.aiSynonyms.length - 2}</span>
              )}
            </div>
          </div>

          {/* ビジュアルボタン（クリック不可、見た目のみ） */}
          <div
            className="w-full py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
                       text-white rounded-lg flex items-center justify-center gap-2
                       group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all
                       pointer-events-none select-none"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View Demo</span>
          </div>
        </div>

        {/* ホバー時の光沢効果 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 
                      opacity-0 group-hover:opacity-100 transition-opacity rounded-xl 
                      pointer-events-none"
        />
      </div>
    </div>
  )
}
