// app/tools/audio-converter/guide.tsx

import React from 'react'
import { X, Zap, ArrowRightLeft, Shield, Settings } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function AudioConverterGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-8 h-8 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Audio Converter Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Universal Audio Format Converter</p>
              <p>Convert between audio formats with quality settings control.</p>
              <p className="mt-2">MP3, WAV, OGG, FLAC, M4A support • Bit depth & bitrate options</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Supported Formats</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Input Formats:</p>
              <div className="flex flex-wrap gap-2">
                {['MP3', 'WAV', 'OGG', 'FLAC', 'M4A', 'WebM'].map(fmt => (
                  <span key={fmt} className="px-2 py-1 bg-gray-800 rounded text-xs text-green-400">{fmt}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Output Formats:</p>
              <div className="flex flex-wrap gap-2">
                {['WAV', 'MP3'].map(fmt => (
                  <span key={fmt} className="px-2 py-1 bg-gray-800 rounded text-xs text-blue-400">{fmt}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-300 mb-2">Quality Settings</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div>
              <p className="text-purple-300 font-medium">WAV Output:</p>
              <p>Choose 16-bit (CD), 24-bit (Studio), or 32-bit (Maximum)</p>
            </div>
            <div>
              <p className="text-purple-300 font-medium">MP3 Output:</p>
              <p>Choose 128, 192, 256, or 320 kbps bitrate</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Choose Format & Quality</p>
                <p className="text-sm text-gray-400 mt-1">Select WAV or MP3 with your preferred settings</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Convert & Download</p>
                <p className="text-sm text-gray-400 mt-1">Click convert and download your file</p>
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
  title: 'Audio Converter Guide',
  icon: '🔄',
  available: true,
}
