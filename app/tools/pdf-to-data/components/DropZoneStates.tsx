'use client'

import { FileText, Sparkles, CheckCircle, Download } from 'lucide-react'

// Initial State Component
export function InitialState() {
  return (
    <div className="text-center px-4">
      <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4 mx-auto" />
      <p className="text-xl sm:text-2xl font-semibold text-gray-300">Drop PDF here</p>
      <p className="text-sm text-gray-500 mt-3">or tap to browse</p>
      <p className="text-xs text-gray-600 mt-6 sm:mt-8">Max 10MB • AI Powered</p>
    </div>
  )
}

// Processing State Component
export function ProcessingState() {
  return (
    <div className="text-center px-4">
      <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 mb-4 animate-pulse mx-auto" />
      <p className="text-xl sm:text-2xl font-semibold text-white">Extracting...</p>
      <p className="text-sm text-gray-400 mt-2">Please wait</p>
      <div className="mt-6 w-40 sm:w-48 mx-auto">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          />
        </div>
      </div>
    </div>
  )
}

// Success State Component with mobile-friendly buttons
interface SuccessStateProps {
  fileName: string
  csvUrl: string
  excelUrl: string
  onReset: () => void
}

export function SuccessState({ fileName, csvUrl, excelUrl, onReset }: SuccessStateProps) {
  return (
    <div className="text-center px-4">
      <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mb-4 mx-auto" />
      <p className="text-xl sm:text-2xl font-semibold text-white mb-2">Ready!</p>
      <p className="text-sm text-gray-400 mb-6 sm:mb-8 max-w-xs mx-auto truncate">{fileName}</p>

      {/* Download Buttons - Vertical on mobile, horizontal on tablet/desktop */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
        {csvUrl && (
          <a
            href={csvUrl}
            download={fileName.replace('.pdf', '.csv')}
            className="px-6 py-3 min-h-[48px] bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl 
                     font-medium transition-all hover:scale-105 hover:shadow-lg
                     flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="sm:hidden">CSV</span>
            <span className="hidden sm:inline">Download CSV</span>
          </a>
        )}
        {excelUrl && (
          <a
            href={excelUrl}
            download={fileName.replace('.pdf', '.xlsx')}
            className="px-6 py-3 min-h-[48px] bg-gradient-to-r from-green-500 to-emerald-500 
                     hover:from-green-600 hover:to-emerald-600 text-white rounded-xl 
                     font-medium transition-all hover:scale-105 hover:shadow-lg
                     flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="sm:hidden">Excel</span>
            <span className="hidden sm:inline">Download Excel</span>
          </a>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="text-sm text-gray-400 hover:text-white transition-colors underline p-2"
      >
        Process another PDF
      </button>
    </div>
  )
}