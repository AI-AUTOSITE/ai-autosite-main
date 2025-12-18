// app/tools/fade-audio/guide.tsx

import React from 'react'
import { X, Zap, TrendingUp, TrendingDown, Shield } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function FadeAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <h3 className="text-2xl font-bold text-white">Fade Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-emerald-300">
              <p className="font-semibold mb-1">Add Professional Fade Effects</p>
              <p>Create smooth fade in and fade out transitions for your audio.</p>
              <p className="mt-2">Adjustable duration • Preview before download • Preset options</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-semibold text-white">Fade Types</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="font-medium text-white">Fade In</span>
              </div>
              <p className="text-xs text-gray-400">Gradually increases volume from silence at the start</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-white">Fade Out</span>
              </div>
              <p className="text-xs text-gray-400">Gradually decreases volume to silence at the end</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Recommended Durations</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Quick (0.5s):</strong> Subtle, barely noticeable</li>
            <li>• <strong>Normal (1-2s):</strong> Standard for most audio</li>
            <li>• <strong>Smooth (3-5s):</strong> Dramatic effect for music</li>
            <li>• <strong>Long (5s+):</strong> Cinematic fade for intros/outros</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Set Fade Duration</p>
                <p className="text-sm text-gray-400 mt-1">Adjust sliders for fade in and fade out</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Apply effects and download</p>
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
  title: 'Fade Audio Guide',
  icon: '📈',
  available: true,
}
