import React from 'react'
import { X, FileText, Upload, Sparkles, Download, AlertCircle } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function PDFSummarizerGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">How to Use</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
        {/* Quick Overview */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-green-300">
              <p className="font-semibold mb-1">AI Summary</p>
              <p>Extract key points in seconds.</p>
              <p className="mt-2">100% private - no uploads.</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">4 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white text-sm">Upload PDF</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click or tap (max 10MB)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white text-sm">Choose Length</p>
                <p className="text-xs text-gray-400 mt-1">
                  Short / Medium / Long
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white text-sm">Click Summarize</p>
                <p className="text-xs text-gray-400 mt-1">
                  AI processes (10-30 sec)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white text-sm">Get Summary</p>
                <p className="text-xs text-gray-400 mt-1">
                  Copy or save as file
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Summary Lengths */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">Summary Options</h4>
          <div className="space-y-2">
            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-semibold text-xs sm:text-sm">Short:</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Key points only</p>
                  <p className="text-xs text-gray-500 mt-1">
                    100-200 words
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-teal-400 font-semibold text-xs sm:text-sm">Medium:</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Executive summary</p>
                  <p className="text-xs text-gray-500 mt-1">300-500 words</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-semibold text-xs sm:text-sm">Long:</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Full analysis</p>
                  <p className="text-xs text-gray-500 mt-1">800+ words</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features - Mobile responsive grid */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-green-400" />
                <span className="text-xs sm:text-sm font-semibold text-green-400">Easy Upload</span>
              </div>
              <p className="text-xs text-gray-300">Drop or tap</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold text-cyan-400">Export</span>
              </div>
              <p className="text-xs text-gray-300">Copy or save</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 sm:p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-amber-300">
              <p className="font-semibold mb-1">Tips</p>
              <ul className="space-y-1 text-xs">
                <li>- Use clear text PDFs (not scanned)</li>
                <li>- Larger files take longer</li>
                <li>- Try Medium for balance</li>
                <li>- Files stay on your device</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'PDF Summarizer Guide',
  icon: 'PDF',
  available: true,
}