// app/tools/ai-dev-dictionary/components/TermCard.tsx
'use client'

import { MousePointer, Code2, Sparkles, ExternalLink } from 'lucide-react'

interface TermCardProps {
  term: any
  isActive: boolean
  onTriggerDemo: () => void
  onViewDetails: () => void
}

export default function TermCard({ term, isActive, onTriggerDemo, onViewDetails }: TermCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all group">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{term.term}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{term.description}</p>
      </div>

      {/* AI Synonyms Preview */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-400 font-medium">AI Terms</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {term.aiSynonyms.slice(0, 3).map((synonym: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30"
            >
              {synonym}
            </span>
          ))}
          {term.aiSynonyms.length > 3 && (
            <span className="px-2 py-1 text-purple-300 text-xs">
              +{term.aiSynonyms.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Demo Section */}
      <div className={`
        h-24 bg-black/30 rounded-lg mb-4 flex items-center justify-center border border-white/10
        ${isActive ? 'animate-pulse' : ''}
      `}>
        <DemoPreview type={term.demoType} isActive={isActive} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onTriggerDemo}
          className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-cyan-500/30"
        >
          <MousePointer className="w-4 h-4" />
          Try Demo
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-white/20"
        >
          <ExternalLink className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  )
}

// Mini demo preview based on type
function DemoPreview({ type, isActive }: { type: string, isActive: boolean }) {
  const demos: Record<string, JSX.Element> = {
    modal: (
      <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
        <div className="w-32 h-20 bg-white/10 rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-xs text-gray-400">Modal Preview</span>
        </div>
      </div>
    ),
    toast: (
      <div className={`${isActive ? 'translate-y-2' : 'translate-y-8'} transition-transform`}>
        <div className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/30">
          Toast Message
        </div>
      </div>
    ),
    dropdown: (
      <div className="space-y-1">
        <div className="w-24 h-6 bg-white/10 rounded"></div>
        {isActive && (
          <div className="w-24 h-16 bg-white/10 rounded animate-fadeIn"></div>
        )}
      </div>
    ),
    accordion: (
      <div className="space-y-1 w-32">
        <div className="h-6 bg-white/10 rounded"></div>
        {isActive && (
          <div className="h-12 bg-white/5 rounded animate-expand"></div>
        )}
        <div className="h-6 bg-white/10 rounded"></div>
      </div>
    ),
    tabs: (
      <div className="w-32">
        <div className="flex gap-1 mb-1">
          <div className={`h-6 w-10 ${isActive ? 'bg-cyan-500/30' : 'bg-white/10'} rounded-t transition-colors`}></div>
          <div className="h-6 w-10 bg-white/10 rounded-t"></div>
          <div className="h-6 w-10 bg-white/10 rounded-t"></div>
        </div>
        <div className="h-10 bg-white/5 rounded-b"></div>
      </div>
    ),
    tooltip: (
      <div className="relative">
        <div className="w-20 h-8 bg-white/10 rounded"></div>
        {isActive && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded animate-fadeIn">
            Tooltip
          </div>
        )}
      </div>
    ),
    drawer: (
      <div className="relative w-32 h-20 bg-white/5 rounded overflow-hidden">
        <div className={`absolute left-0 top-0 h-full w-10 bg-white/10 transform transition-transform ${
          isActive ? 'translate-x-0' : '-translate-x-full'
        }`}></div>
      </div>
    ),
    badge: (
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">Badge</span>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30">New</span>
      </div>
    ),
    skeleton: (
      <div className="space-y-2 w-32">
        <div className={`h-4 bg-gray-600 rounded ${isActive ? 'animate-pulse' : ''}`}></div>
        <div className={`h-3 bg-gray-600 rounded w-24 ${isActive ? 'animate-pulse' : ''}`}></div>
        <div className={`h-3 bg-gray-600 rounded w-20 ${isActive ? 'animate-pulse' : ''}`}></div>
      </div>
    ),
    spinner: (
      <div className={`w-8 h-8 border-4 border-gray-600 border-t-cyan-400 rounded-full ${
        isActive ? 'animate-spin' : ''
      }`}></div>
    ),
    progress: (
      <div className="w-32">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className={`bg-cyan-500 h-2 rounded-full transition-all duration-1000 ${
            isActive ? 'w-3/4' : 'w-1/4'
          }`}></div>
        </div>
      </div>
    ),
    alert: (
      <div className="px-3 py-2 bg-yellow-500/20 border-l-4 border-yellow-500 rounded">
        <span className="text-xs text-yellow-400">Alert Message</span>
      </div>
    )
  }

  return demos[type] || <span className="text-xs text-gray-500">Demo</span>
}