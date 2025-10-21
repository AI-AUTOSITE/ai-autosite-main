// app/tools/network-checker/guide.tsx
'use client'

import { X, Network, Search, Wrench } from 'lucide-react'

export default function NetworkCheckerGuide({ onClose }: { onClose?: () => void }) {
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
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-cyan-400 font-bold">1</span>
          </div>
          <div>
            <p className="text-white font-medium">Add devices</p>
            <p className="text-gray-400 text-sm">Enter device names and IP addresses</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold">2</span>
          </div>
          <div>
            <p className="text-white font-medium">Check connection</p>
            <p className="text-gray-400 text-sm">Click the button to diagnose</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Follow fix steps</p>
            <p className="text-gray-400 text-sm">Simple solutions to connect</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mt-6 space-y-2">
        <p className="text-sm text-gray-300">
          <span className="text-cyan-400">💡</span> Find IP: Settings → Network
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-green-400">✓</span> Works offline
        </p>
        <p className="text-sm text-gray-300">
          <span className="text-blue-400">🔒</span> 100% private
        </p>
      </div>
    </div>
  )
}