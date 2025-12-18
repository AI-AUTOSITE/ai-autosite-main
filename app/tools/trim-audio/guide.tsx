// app/tools/trim-audio/guide.tsx

import React from 'react'
import { X, Zap, Scissors, Shield, Clock } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function TrimAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Scissors className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Trim Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">Cut Audio Files Precisely</p>
              <p>Remove unwanted parts from audio files. Keep only what you need.</p>
              <p className="mt-2">Visual timeline • Preview selection • WAV/MP3 output</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Use Cases</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Remove silence from beginning/end</li>
            <li>• Extract a specific portion of audio</li>
            <li>• Create short clips from longer recordings</li>
            <li>• Remove unwanted sections</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Trim</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your audio file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Set Start & End Points</p>
                <p className="text-sm text-gray-400 mt-1">Use sliders to select the portion you want to keep</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Preview & Download</p>
                <p className="text-sm text-gray-400 mt-1">Listen to your selection and download</p>
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
  title: 'Trim Audio Guide',
  icon: '✂️',
  available: true,
}
