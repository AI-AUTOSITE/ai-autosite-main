// app/tools/network-checker/components/RuleBotChat.tsx
'use client'

import { Bot, CheckCircle, AlertCircle, Info } from 'lucide-react'
import type { DiagnosticResult } from '../lib/types'

interface RuleBotChatProps {
  result: DiagnosticResult
}

export default function RuleBotChat({ result }: RuleBotChatProps) {
  const getIcon = () => {
    switch (result.severity) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      default:
        return <Info className="w-6 h-6 text-blue-400" />
    }
  }

  const getBackgroundColor = () => {
    switch (result.severity) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      default:
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  const getTextColor = () => {
    switch (result.severity) {
      case 'success':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-blue-400'
    }
  }

  return (
    <div className={`rounded-xl p-6 border ${getBackgroundColor()} animate-fadeIn`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Network Helper</span>
          </div>
          <h3 className={`font-bold text-lg ${getTextColor()}`}>{result.title}</h3>
        </div>
      </div>

      {/* Message */}
      <p className="text-white/90 mb-4 leading-relaxed">{result.message}</p>

      {/* Solutions */}
      {result.solutions && result.solutions.length > 0 && (
        <div className={`${getBackgroundColor()} rounded-lg p-4`}>
          <p className="text-white font-medium mb-3 text-sm">
            {result.severity === 'success' ? '💡 Tips:' : '🔧 How to fix:'}
          </p>
          <div className="space-y-2">
            {result.solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0 text-sm">•</span>
                <p className="text-white/80 text-sm leading-relaxed">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical details */}
      {result.technicalDetails && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-white transition-colors">
              Technical details
            </summary>
            <div className="mt-2 space-y-1 pl-4">
              <p>Networks found: {result.technicalDetails.networks.join(', ')}</p>
              <p>Can connect: {result.technicalDetails.canConnect ? 'Yes ✓' : 'No ✗'}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}