'use client'

import { Sparkles } from 'lucide-react'
import { getLoadingMessage } from '../constants'

interface ProcessingStateProps {
  originalUrl: string | undefined
  progress: number
  modelLoaded: boolean
  isTouchDevice: boolean
}

export function ProcessingState({ originalUrl, progress, modelLoaded, isTouchDevice }: ProcessingStateProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {originalUrl && (
        <div className="relative rounded-2xl overflow-hidden bg-gray-800 max-h-60 md:max-h-80 flex items-center justify-center">
          <img 
            src={originalUrl} 
            alt="Your image" 
            className="max-w-full max-h-60 md:max-h-80 object-contain opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <span className="text-white font-medium text-sm md:text-base">{getLoadingMessage(progress)}</span>
        </div>
        
        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-center text-sm text-gray-400">{progress}% complete</p>

        {!modelLoaded && progress < 70 && (
          <p className="text-center text-xs text-gray-500">
            {isTouchDevice 
              ? 'First time? Model will be cached for next time.'
              : 'First time? The AI model (~176MB) will be cached for faster use next time.'
            }
          </p>
        )}
      </div>
    </div>
  )
}
