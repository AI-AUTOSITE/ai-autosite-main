'use client'

import { X } from 'lucide-react'

export default function QRCodeGuide({ onClose }: { onClose?: () => void }) {
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

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold">1</span>
          </div>
          <div>
            <p className="text-white font-medium">Type or paste</p>
            <p className="text-gray-400 text-sm">Enter any text or URL</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-bold">2</span>
          </div>
          <div>
            <p className="text-white font-medium">Choose size</p>
            <p className="text-gray-400 text-sm">Small, Medium, or Large</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Download</p>
            <p className="text-gray-400 text-sm">Save as PNG image</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mt-6 space-y-2">
        <p className="text-sm text-gray-300">
          <span className="text-yellow-400">⚡</span> Works instantly
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-green-400">✓</span> No signup needed
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-blue-400">🔒</span> 100% private
        </p>
      </div>
    </div>
  )
}
