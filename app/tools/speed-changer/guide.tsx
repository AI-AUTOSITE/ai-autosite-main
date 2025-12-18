// app/tools/speed-changer/guide.tsx

import React from 'react'
import { X, Zap, Gauge, Shield, FastForward } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function SpeedChangerGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Gauge className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">Speed Changer Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Change Audio Playback Speed</p>
              <p>Speed up or slow down audio from 0.25x to 4x speed.</p>
              <p className="mt-2">Real-time preview • Preset buttons • Duration display</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FastForward className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Speed Presets</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-cyan-400 font-bold">0.5x</p>
              <p className="text-gray-400 text-xs">Slow</p>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-green-400 font-bold">1.0x</p>
              <p className="text-gray-400 text-xs">Normal</p>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-orange-400 font-bold">2.0x</p>
              <p className="text-gray-400 text-xs">Fast</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Use Cases</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Podcasts:</strong> Speed up to 1.5x for faster listening</li>
            <li>• <strong>Language Learning:</strong> Slow down to 0.75x for clarity</li>
            <li>• <strong>Music Practice:</strong> Slow down difficult passages</li>
            <li>• <strong>Transcription:</strong> Slow audio for easier typing</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Adjust Speed</p>
                <p className="text-sm text-gray-400 mt-1">Use slider or preset buttons</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Get your speed-adjusted audio</p>
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
  title: 'Speed Changer Guide',
  icon: '⏩',
  available: true,
}
