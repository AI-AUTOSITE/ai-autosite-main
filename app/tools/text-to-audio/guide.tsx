// app/tools/text-to-audio/guide.tsx

import React from 'react'
import { X, Zap, Volume2, Shield, Settings, AlertCircle } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function TextToAudioGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10" aria-label="Close guide">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Volume2 className="w-8 h-8 text-pink-400" />
          <h3 className="text-2xl font-bold text-white">Text to Audio Guide</h3>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-pink-300">
              <p className="font-semibold mb-1">Convert Text to Natural Speech</p>
              <p>Use your browser's built-in text-to-speech with multiple voices.</p>
              <p className="mt-2">Multiple languages • Speed & pitch control • Pause/Resume</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Voice Settings</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Voice Selection:</strong> Choose from available system voices</li>
            <li>• <strong>Speed:</strong> 0.5x (slow) to 2x (fast)</li>
            <li>• <strong>Pitch:</strong> Lower or higher voice pitch</li>
            <li>• <strong>Pause/Resume:</strong> Control playback anytime</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Use Cases</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Accessibility:</strong> Screen reading assistance</li>
            <li>• <strong>Proofreading:</strong> Hear your text read aloud</li>
            <li>• <strong>Language Learning:</strong> Listen to pronunciation</li>
            <li>• <strong>Multitasking:</strong> Listen while doing other tasks</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Enter Text</p>
                <p className="text-sm text-gray-400 mt-1">Type or paste the text you want to hear</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Choose Voice & Settings</p>
                <p className="text-sm text-gray-400 mt-1">Select a voice and adjust speed/pitch</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Click Speak</p>
                <p className="text-sm text-gray-400 mt-1">Listen to your text being read aloud</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-1">Browser Limitation</p>
              <p className="text-gray-300">
                Direct audio download is not available due to Web Speech API limitations. 
                To save the speech, use screen recording software.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">100% Private</p>
              <p className="text-gray-300">Text is processed entirely by your browser. Nothing is sent to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Text to Audio Guide',
  icon: '🗣️',
  available: true,
}
