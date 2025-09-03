// app/tools/ai-dev-dictionary/components/ChatStyleDemoCard.tsx

'use client'

import { useState } from 'react'
import { User, Bot, Copy, Check, Eye, ArrowRight } from 'lucide-react'
import type { TechTerm } from '../lib/terms'

interface ChatStyleDemoCardProps {
  term: TechTerm
  onViewDemo: () => void
}

export default function ChatStyleDemoCard({ term, onViewDemo }: ChatStyleDemoCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // Copy the AI phrase that can be used in actual chat
    const textToCopy = `Create a ${term.term} component with ${term.aiSynonyms[0] || 'modern design'}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
      {/* Chat Messages */}
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-4 space-y-3">
        {/* User Message */}
        <div className="flex gap-3">
          <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-[90%]">
              <p className="text-sm text-gray-300">
                {term.aiPhrases[0] || `I need a ${term.term} for my app`}
              </p>
            </div>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg rounded-tl-none p-3 border border-cyan-500/20">
              <p className="text-sm text-gray-300 mb-2">
                I'll help you create a <span className="text-cyan-400 font-semibold">{term.term}</span>
              </p>
              <p className="text-xs text-gray-400">
                Also known as: {term.aiSynonyms.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Term Definition Area */}
      <div className="px-4 py-3 bg-black/30 border-y border-white/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">
              {term.term}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2">
              {term.description}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Copy prompt"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onViewDemo}
        className="w-full px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all flex items-center justify-center gap-2 group"
      >
        <Eye className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-white">See what this looks like</span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}