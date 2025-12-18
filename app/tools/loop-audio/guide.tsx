// app/tools/loop-audio/guide.tsx

import React from 'react'
import { X, Zap, Repeat, Shield, Music } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function LoopAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Repeat className="w-8 h-8 text-emerald-400" />
          <h3 className="text-2xl font-bold text-white">Loop Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-emerald-300">
              <p className="font-semibold mb-1">Create Seamless Audio Loops</p>
              <p>Repeat audio files multiple times with optional crossfade transitions.</p>
              <p className="mt-2">2-20x loop count • Crossfade option • Perfect for music</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Use Cases</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Background Music:</strong> Extend short clips</li>
            <li>• <strong>Music Production:</strong> Create longer samples</li>
            <li>• <strong>Meditation:</strong> Loop ambient sounds</li>
            <li>• <strong>Gaming:</strong> Create looping sound effects</li>
          </ul>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-300 mb-2">What is Crossfade?</h4>
          <p className="text-sm text-gray-300">
            Crossfade creates smooth transitions between loop iterations by gradually fading out 
            the end of one loop while fading in the next. This prevents clicks or pops at loop points.
          </p>
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
                <p className="font-medium text-white">Set Loop Count & Crossfade</p>
                <p className="text-sm text-gray-400 mt-1">Choose how many times to repeat (2-20x)</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Get your looped audio as WAV or MP3</p>
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
  title: 'Loop Audio Guide',
  icon: '🔁',
  available: true,
}
