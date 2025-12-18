// app/tools/wav-to-mp3/guide.tsx

import React from 'react'
import {
  X,
  Music,
  Zap,
  FileAudio,
  Shield,
  HardDrive,
  Settings,
  TrendingDown,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function WavToMp3Guide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <FileAudio className="w-8 h-8 text-green-400" />
          <h3 className="text-2xl font-bold text-white">WAV to MP3 Converter Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Compress WAV to MP3 Instantly</p>
              <p>Reduce file size by up to 90% while maintaining great audio quality.</p>
              <p className="mt-2">No upload required • Multiple bitrate options • Fast conversion</p>
            </div>
          </div>
        </div>

        {/* Why Convert */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Why Convert WAV to MP3?</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Smaller Files:</strong> MP3 is 10x smaller than WAV</li>
            <li>• <strong>Easy Sharing:</strong> Better for email and messaging</li>
            <li>• <strong>Universal Support:</strong> Plays on all devices</li>
            <li>• <strong>Streaming:</strong> Ideal for web and podcasts</li>
          </ul>
        </div>

        {/* Step-by-Step Guide */}
        <div>
          <h4 className="font-semibold text-white mb-3">3 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Upload WAV File</p>
                <p className="text-sm text-gray-400 mt-1">
                  Drag & drop or click to select your WAV file
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Choose Bitrate</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select quality: 128, 192, 256, or 320 kbps
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Download MP3</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click convert and get your compressed MP3 file
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Bitrate Guide */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-purple-300 mb-2">Bitrate Options</p>
              <ul className="space-y-1 text-gray-300">
                <li>• <strong>128 kbps:</strong> Smallest file, good for voice</li>
                <li>• <strong>192 kbps:</strong> Balanced quality and size</li>
                <li>• <strong>256 kbps:</strong> High quality</li>
                <li>• <strong>320 kbps:</strong> Best quality, largest file</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">100% Private & Secure</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Files never leave your device</li>
                <li>• All processing happens in your browser</li>
                <li>• No server uploads, no data collection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'WAV to MP3 Converter Guide',
  icon: '🎧',
  available: true,
}
