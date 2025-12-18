// app/tools/volume-booster/guide.tsx

import React from 'react'
import {
  X,
  Zap,
  Volume2,
  Shield,
  AlertTriangle,
  Sliders,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function VolumeBoosterGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
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
          <Volume2 className="w-8 h-8 text-orange-400" />
          <h3 className="text-2xl font-bold text-white">Volume Booster Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-300">
              <p className="font-semibold mb-1">Make Your Audio Louder</p>
              <p>Boost volume up to +20dB or reduce by -60dB. Auto-normalize available.</p>
              <p className="mt-2">Real-time preview • Clipping protection • WAV/MP3 output</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Features</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Volume Adjustment:</strong> -60dB to +20dB range</li>
            <li>• <strong>Auto Normalize:</strong> Maximize volume without clipping</li>
            <li>• <strong>Preview:</strong> Hear changes before downloading</li>
            <li>• <strong>Peak Meter:</strong> Visual feedback to prevent distortion</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">3 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Audio</p>
                <p className="text-sm text-gray-400 mt-1">Drop your audio file or click to browse</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Adjust Volume</p>
                <p className="text-sm text-gray-400 mt-1">Use slider or click "Auto Normalize" for best results</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Download</p>
                <p className="text-sm text-gray-400 mt-1">Choose WAV or MP3 format and download</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-1">Avoid Clipping</p>
              <p className="text-gray-300">If the peak meter shows red, reduce volume to prevent distortion. Use Auto Normalize for safe maximum volume.</p>
            </div>
          </div>
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
  title: 'Volume Booster Guide',
  icon: '🔊',
  available: true,
}
