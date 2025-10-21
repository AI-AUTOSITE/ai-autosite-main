'use client'

import { X, BookOpen, Brain, Clock, CheckCircle } from 'lucide-react'

export default function CornellNoteGuide({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-white/20 max-w-lg shadow-2xl">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-cyan-400" />
        Cornell Method Quick Guide
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-medium">Why Cornell?</p>
            <p className="text-gray-300 text-sm mt-1">
              Developed at Cornell University in the 1950s. Proven by 70+ years of research.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-white font-medium">What's Different?</p>
            <p className="text-gray-300 text-sm mt-1">
              Forces you to think, not just copy. The layout makes review super efficient.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium">Time Saver</p>
            <p className="text-gray-300 text-sm mt-1">
              Review in half the time. Test yourself without re-reading everything.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mt-6 space-y-2 border border-white/10">
        <p className="text-sm text-gray-200">
          <span className="text-green-400">✓</span> Used at top universities worldwide
        </p>
        <p className="text-sm text-gray-200">
          <span className="text-cyan-400">✓</span> Works for any subject
        </p>
        <p className="text-sm text-gray-200">
          <span className="text-yellow-400">✓</span> Simple to learn, powerful results
        </p>
      </div>
    </div>
  )
}