import React from 'react'
import { X, FileText, Upload, Sparkles, Download, AlertCircle } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function PDFSummarizerGuide({ onClose }: GuideProps) {
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
          <FileText className="w-8 h-8 text-green-400" />
          <h3 className="text-2xl font-bold text-white">How to Summarize PDFs</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Quick Overview */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">AI-Powered Summaries</p>
              <p>Extract key points from any PDF in seconds.</p>
              <p className="mt-2">All processing happens locally - your documents stay private.</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div>
          <h4 className="font-semibold text-white mb-3">4 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Upload Your PDF</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click or drag & drop your PDF file (max 10MB)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Choose Summary Length</p>
                <p className="text-sm text-gray-400 mt-1">
                  Short (bullet points), Medium (overview), or Long (detailed)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Click Summarize</p>
                <p className="text-sm text-gray-400 mt-1">
                  AI processes your document (usually 10-30 seconds)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Get Your Summary</p>
                <p className="text-sm text-gray-400 mt-1">
                  Copy to clipboard or download as markdown file
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Summary Lengths */}
        <div>
          <h4 className="font-semibold text-white mb-3">Summary Length Options</h4>
          <div className="space-y-2">
            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-semibold">Short:</span>
                <div>
                  <p className="text-sm text-gray-300">Key bullet points only</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ~100-200 words, perfect for quick review
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-teal-400 font-semibold">Medium:</span>
                <div>
                  <p className="text-sm text-gray-300">Executive summary with main sections</p>
                  <p className="text-xs text-gray-500 mt-1">~300-500 words, balanced overview</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-semibold">Long:</span>
                <div>
                  <p className="text-sm text-gray-300">Comprehensive analysis with details</p>
                  <p className="text-xs text-gray-500 mt-1">~800+ words, thorough breakdown</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold text-white mb-3">Features</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Drag & Drop</span>
              </div>
              <p className="text-xs text-gray-300">Easy file upload</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Export Options</span>
              </div>
              <p className="text-xs text-gray-300">Copy or download</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold mb-1">Pro Tips</p>
              <ul className="space-y-1 text-xs">
                <li>• For best results, use PDFs with clear text (not scanned images)</li>
                <li>• Longer documents may take more time to process</li>
                <li>• Start with "Medium" length for balanced summaries</li>
                <li>• Your files are never uploaded to any server</li>
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
  icon: '📄',
  available: true,
}
