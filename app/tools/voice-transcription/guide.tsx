import React from 'react'
import {
  X,
  Mic,
  Upload,
  Download,
  Shield,
  Zap,
  Info,
  Languages,
  Clock,
  FileAudio,
  Volume2,
  Globe,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function VoiceTranscriptionGuide({ onClose }: GuideProps) {
  const supportedFormats = ['MP3', 'WAV', 'M4A', 'MP4', 'WebM', 'OGG', 'FLAC']
  
  const useCases = [
    'Meeting recordings → searchable notes',
    'Podcast episodes → show notes & transcripts',
    'Interview recordings → written documentation',
    'Lecture recordings → study materials',
    'YouTube videos → subtitles & captions',
    'Voice memos → text notes',
  ]

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Header */}
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
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Voice Transcription Guide</h3>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Main feature highlight */}
        <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">AI-Powered Local Transcription</p>
              <p>Convert speech to text using OpenAI Whisper - entirely in your browser.</p>
              <p className="mt-2">No uploads • No limits • 99+ languages • 100% private</p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Upload Audio File</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Upload className="inline w-3 h-3 mr-1" />
                  Drag & drop or click to select (max 500MB)
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Select Language (Optional)</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Languages className="inline w-3 h-3 mr-1" />
                  Auto-detect works for most cases, or select manually
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Start Transcription</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Mic className="inline w-3 h-3 mr-1" />
                  AI model downloads once, then processes locally
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Export Results</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Download className="inline w-3 h-3 mr-1" />
                  Download as TXT, SRT subtitles, or JSON
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Key Features
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-white">100% Private</p>
                <p className="text-xs text-gray-400">Audio never leaves your device</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Globe className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-white">99+ Languages</p>
                <p className="text-xs text-gray-400">Auto-detect or manual selection</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-white">Timestamps</p>
                <p className="text-xs text-gray-400">Word-level timing for subtitles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white">No Limits</p>
                <p className="text-xs text-gray-400">Unlimited transcription, forever free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-blue-400" />
            Supported Formats
          </h4>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex gap-2 flex-wrap">
              {supportedFormats.map((format, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
                >
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Maximum file size: 500MB</p>
          </div>
        </div>

        {/* Model Options */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            AI Model Options
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">Tiny</span>
                <span className="text-xs text-gray-400">~75MB</span>
              </div>
              <p className="text-xs text-gray-400">Fastest, good for quick transcription</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">Base (Recommended)</span>
                <span className="text-xs text-gray-400">~145MB</span>
              </div>
              <p className="text-xs text-gray-400">Best balance of speed and accuracy</p>
            </div>
          </div>
        </div>

        {/* Perfect For */}
        <div>
          <h4 className="font-semibold text-white mb-3">Perfect For</h4>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <ul className="space-y-2">
              {useCases.map((useCase, index) => (
                <li key={index} className="text-sm text-gray-300">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-2">Pro Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Clear audio = better accuracy</li>
                <li>• English-only model is more accurate for English</li>
                <li>• First load downloads the model (cached after)</li>
                <li>• Works offline after model is cached</li>
                <li>• Use SRT export for video subtitles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Complete Privacy</p>
              <p className="text-gray-300">
                Your audio files are processed entirely in your browser using WebAssembly.
                Nothing is uploaded to any server. The AI model runs locally on your device.
                Perfect for confidential meetings, sensitive recordings, and private content.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-300 mb-2">Technical Details</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Powered by OpenAI Whisper (via Transformers.js)</li>
                <li>• Runs in Web Worker for smooth UI</li>
                <li>• Audio converted to 16kHz mono for processing</li>
                <li>• Model cached in browser for future use</li>
                <li>• Requires modern browser (Chrome/Edge/Firefox)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Voice Transcription Guide',
  icon: '🎤',
  available: true,
}
