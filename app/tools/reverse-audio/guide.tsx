// app/tools/reverse-audio/guide.tsx

import React from 'react'
import { X, Zap, RotateCcw, Shield, Music } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function ReverseAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <RotateCcw className="w-8 h-8 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white">Reverse Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-1">Play Audio Backwards</p>
              <p>Reverse any audio file for creative effects or analysis.</p>
              <p className="mt-2">Instant reversal • Side-by-side comparison • Lossless quality</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Use Cases</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Sound Design:</strong> Create unique effects</li>
            <li>• <strong>Music Production:</strong> Reversed vocals and instruments</li>
            <li>• <strong>Analysis:</strong> Study hidden messages (backmasking)</li>
            <li>• <strong>Fun:</strong> Hear what things sound like backwards</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Compare</p>
                <p className="text-sm text-gray-400 mt-1">Listen to original and reversed side-by-side</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Get your reversed audio as WAV or MP3</p>
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
  title: 'Reverse Audio Guide',
  icon: '🔄',
  available: true,
}
