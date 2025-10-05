'use client'

import { X, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onReset?: () => void
}

export default function ErrorMessage({ message, onReset }: ErrorMessageProps) {
  if (!message) return null
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md w-full px-4">
      <div className="bg-red-500/90 backdrop-blur-sm text-white rounded-xl shadow-lg border border-red-400/50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>
          </div>
          
          {onReset && (
            <div className="mt-3 pt-3 border-t border-red-400/30">
              <button
                onClick={onReset}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg text-sm font-medium 
                         transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}