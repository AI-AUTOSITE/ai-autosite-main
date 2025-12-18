// app/tools/extract-audio/guide.tsx

import React from 'react'
import { X, Zap, Film, Music, Shield } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function ExtractAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Film className="w-8 h-8 text-pink-400" />
          <h3 className="text-2xl font-bold text-white">Extract Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-pink-300">
              <p className="font-semibold mb-1">Extract Audio From Videos</p>
              <p>Get the audio track from any video file. Perfect for music ripping.</p>
              <p className="mt-2">Supports MP4, WebM, MOV • WAV or MP3 output • Original quality</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Film className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Supported Video Formats</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-green-400 font-bold">MP4</p>
              <p className="text-gray-400 text-xs">Best support</p>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-green-400 font-bold">WebM</p>
              <p className="text-gray-400 text-xs">Great support</p>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <p className="text-yellow-400 font-bold">MOV</p>
              <p className="text-gray-400 text-xs">May vary</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Use Cases</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Music Videos:</strong> Extract songs from YouTube downloads</li>
            <li>• <strong>Podcasts:</strong> Get audio from video podcasts</li>
            <li>• <strong>Lectures:</strong> Audio-only version for listening</li>
            <li>• <strong>Sound Effects:</strong> Extract sounds from clips</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Video</p>
                <p className="text-sm text-gray-400 mt-1">Drop your video file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Extract Audio</p>
                <p className="text-sm text-gray-400 mt-1">Click the extract button to process</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Choose WAV or MP3 format</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">100% Private</p>
              <p className="text-gray-300">All processing happens in your browser. Videos never leave your device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Extract Audio Guide',
  icon: '🎬',
  available: true,
}
