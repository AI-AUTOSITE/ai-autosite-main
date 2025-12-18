// app/tools/record-voice/guide.tsx

import React from 'react'
import {
  X,
  Zap,
  Mic,
  Shield,
  Play,
  Pause,
  Square,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function RecordVoiceGuide({ onClose }: GuideProps) {
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
          <Mic className="w-8 h-8 text-red-400" />
          <h3 className="text-2xl font-bold text-white">Voice Recorder Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-300">
              <p className="font-semibold mb-1">Record Audio From Your Microphone</p>
              <p>Capture voice, music, or any sound. Download as WAV or MP3.</p>
              <p className="mt-2">One-click recording • Pause/Resume • Real-time duration</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Recording Controls</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
              <p>Record</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Pause className="w-4 h-4 text-yellow-500" />
              </div>
              <p>Pause</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-500/20 flex items-center justify-center">
                <Square className="w-4 h-4 text-gray-400" />
              </div>
              <p>Stop</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Record</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Allow Microphone Access</p>
                <p className="text-sm text-gray-400 mt-1">Click "Allow" when your browser asks for permission</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Start Recording</p>
                <p className="text-sm text-gray-400 mt-1">Click the record button. Use pause/resume as needed.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Preview & Download</p>
                <p className="text-sm text-gray-400 mt-1">Listen to your recording and download as WAV or MP3</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">100% Private Recording</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Audio is never uploaded to any server</li>
                <li>• Recording stays in your browser</li>
                <li>• No account needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Voice Recorder Guide',
  icon: '🎙️',
  available: true,
}
