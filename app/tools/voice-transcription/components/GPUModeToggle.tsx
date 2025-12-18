// app/tools/voice-transcription/components/GPUModeToggle.tsx
'use client'

import React from 'react'
import { Cpu, Zap, AlertTriangle } from 'lucide-react'

interface GPUModeToggleProps {
  isGPUMode: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
  limits: {
    maxFileSizeMB: number
    maxDurationMinutes: number
  }
}

export default function GPUModeToggle({
  isGPUMode,
  onToggle,
  disabled = false,
  limits,
}: GPUModeToggleProps) {
  return (
    <div className="space-y-3">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg flex-shrink-0 ${isGPUMode ? 'bg-purple-500/20' : 'bg-gray-700'}`}>
            {isGPUMode ? (
              <Zap className="w-5 h-5 text-purple-400" />
            ) : (
              <Cpu className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {isGPUMode ? 'GPU High-Precision Mode' : 'Browser Mode'}
            </p>
            <p className="text-gray-400 text-sm truncate">
              {isGPUMode 
                ? 'Whisper large-v3 • Best accuracy' 
                : 'Runs locally • 100% private'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onToggle(!isGPUMode)}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors
            ${isGPUMode ? 'bg-purple-500' : 'bg-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          role="switch"
          aria-checked={isGPUMode}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isGPUMode ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* GPU Mode Info */}
      {isGPUMode && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="text-purple-300 font-medium">GPU Mode Limitations</p>
              <ul className="text-gray-400 space-y-1">
                <li>• File size: max {limits.maxFileSizeMB}MB</li>
                <li>• Audio duration: max {limits.maxDurationMinutes} minutes</li>
                <li>• Audio is processed on our secure server</li>
                <li>• Data is deleted immediately after processing</li>
              </ul>
              <p className="text-gray-500 text-xs pt-1">
                ⚠️ This feature may be modified or discontinued without notice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Browser Mode Info */}
      {!isGPUMode && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
          <div className="flex items-start gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-cyan-300 font-medium">Browser Mode</p>
              <p className="text-gray-400">
                All processing happens in your browser. 
                No data is uploaded to any server. 100% private.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
