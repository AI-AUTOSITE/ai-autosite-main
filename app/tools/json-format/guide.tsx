'use client'

import { X, FileText, Zap, Download } from 'lucide-react'

export default function JsonFormatGuide({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      <h3 className="text-xl font-bold text-white mb-4">Quick Guide</h3>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">1</span>
          </div>
          <div>
            <p className="text-white font-medium">Paste your JSON</p>
            <p className="text-gray-400 text-sm">Or upload a .json file</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-400 font-bold">2</span>
          </div>
          <div>
            <p className="text-white font-medium">Choose format style</p>
            <p className="text-gray-400 text-sm">Beautify or minify</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-cyan-400 font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Copy or download</p>
            <p className="text-gray-400 text-sm">Get your formatted JSON</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white/5 rounded-xl p-4 space-y-2">
        <p className="text-sm text-gray-300">
          <span className="text-yellow-400">💡</span> Max file size: 10MB
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-green-400">✓</span> Works offline
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-cyan-400">🔒</span> 100% private
        </p>
      </div>
    </div>
  )
}
