// app/tools/pomodoro-timer/guide.tsx
'use client'

import { X } from 'lucide-react'

export default function PomodoroGuide({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md shadow-2xl">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      <h3 className="text-xl font-bold text-white mb-4">Quick Guide</h3>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-red-400 font-bold">1</span>
          </div>
          <div>
            <p className="text-white font-medium">Set your timer</p>
            <p className="text-gray-400 text-sm">25 min work, 5 min break</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 font-bold">2</span>
          </div>
          <div>
            <p className="text-white font-medium">Focus completely</p>
            <p className="text-gray-400 text-sm">No distractions allowed</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Take breaks</p>
            <p className="text-gray-400 text-sm">Rest after each session</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/60 rounded-xl p-4 mt-6 space-y-2 border border-white/10">
        <p className="text-sm text-gray-300">
          <span className="text-red-400">🍅</span> Proven since 1980s
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-green-400">✓</span> 40% productivity boost
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-cyan-400">🔒</span> No signup needed
        </p>
      </div>
    </div>
  )
}