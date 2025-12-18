// app/tools/merge-audio/guide.tsx

import React from 'react'
import { X, Zap, Link2, Shield, Plus, ChevronUp, ChevronDown } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function MergeAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Link2 className="w-8 h-8 text-emerald-400" />
          <h3 className="text-2xl font-bold text-white">Merge Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-emerald-300">
              <p className="font-semibold mb-1">Combine Multiple Audio Files</p>
              <p>Join multiple audio files into one with optional crossfade transitions.</p>
              <p className="mt-2">Drag to reorder • Crossfade option • Unlimited files</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Features</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Multiple Files:</strong> Add as many files as you need</li>
            <li>• <strong>Reorder:</strong> Drag files to change order</li>
            <li>• <strong>Preview:</strong> Listen before merging</li>
            <li>• <strong>Crossfade:</strong> Smooth transitions between tracks</li>
          </ul>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-300 mb-2">Reordering Files</h4>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Use</span>
            <ChevronUp className="w-4 h-4 text-gray-400" />
            <span>and</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <span>arrows to change the order of files</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Add Files</p>
                <p className="text-sm text-gray-400 mt-1">Click to add multiple audio files</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Arrange Order</p>
                <p className="text-sm text-gray-400 mt-1">Use arrows to reorder tracks</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Merge & Download</p>
                <p className="text-sm text-gray-400 mt-1">Set crossfade and download merged audio</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">100% Private</p>
              <p className="text-gray-300">All processing happens in your browser. Files never leave your device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Merge Audio Guide',
  icon: '🔗',
  available: true,
}
