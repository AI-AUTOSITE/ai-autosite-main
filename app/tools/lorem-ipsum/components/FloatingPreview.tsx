'use client'

import { useState } from 'react'
import { Copy, Check, Download, ChevronUp, ChevronDown, FileText, Type, X } from 'lucide-react'
import { downloadFile, type DownloadFormat } from '../lib/download'

interface FloatingPreviewProps {
  generatedText: string
  wordCount: number
  charCount: number
  onCopy: () => Promise<void>
  copied: boolean
}

export function FloatingPreview({
  generatedText,
  wordCount,
  charCount,
  onCopy,
  copied,
}: FloatingPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  // Handle download
  const handleDownload = (format: DownloadFormat) => {
    downloadFile(generatedText, format)
    setDownloaded(true)
    setShowDownloadMenu(false)
    setTimeout(() => setDownloaded(false), 2000)
  }

  // Handle minimize
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
    setIsExpanded(false)
  }

  // Handle restore from minimized
  const handleRestore = () => {
    setIsMinimized(false)
  }

  // Don't render if no text generated
  if (!generatedText) return null

  // Get preview text (first 80 chars)
  const previewText = generatedText.slice(0, 80) + (generatedText.length > 80 ? '...' : '')

  // Minimized state - small pill button
  if (isMinimized) {
    return (
      <button
        onClick={handleRestore}
        className="fixed bottom-4 right-4 z-50 h-10 px-3 bg-gradient-to-r from-purple-600 to-purple-800 
                   rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 
                   transition-all duration-200 group"
      >
        <FileText className="w-4 h-4 text-white" />
        <span className="text-xs text-white font-medium">{wordCount}</span>
        
        {/* Tooltip */}
        <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded 
                       opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Show Preview
        </span>
      </button>
    )
  }

  // Normal state - full panel
  return (
    <>
      {/* Bottom Peek - slides up from bottom edge ニョキッ！ */}
      <div 
        className={`fixed bottom-0 right-4 z-50 transition-transform duration-300 ease-out ${
          isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-44px)]'
        }`}
      >
        <div className="flex flex-col items-stretch">
          {/* Tab Handle - always visible at top */}
          <div className="flex items-stretch">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-purple-800 rounded-tl-xl flex items-center justify-center gap-3 px-4 shadow-lg hover:from-purple-500 hover:to-purple-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-white" />
              ) : (
                <ChevronUp className="w-4 h-4 text-white" />
              )}
              <FileText className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white font-medium">Preview</span>
              <span className="text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-full">
                {wordCount} words
              </span>
            </button>
            
            {/* Minimize button */}
            <button
              onClick={handleMinimize}
              className="w-11 h-11 bg-gradient-to-r from-purple-800 to-purple-900 rounded-tr-xl flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-colors group"
              title="Minimize"
            >
              <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Expanded Panel */}
          <div className="w-80 bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-xl border-x border-t border-white/20 shadow-2xl">
            {/* Stats Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Generated Text</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                  {wordCount} words
                </span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                  {charCount} chars
                </span>
              </div>
            </div>

            {/* Text Preview */}
            <div className="px-4 py-3">
              <div className="bg-black/30 rounded-lg p-3 mb-3 max-h-28 overflow-y-auto">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {previewText}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onCopy}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>

                {/* Download dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      downloaded
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </button>

                  {showDownloadMenu && (
                    <>
                      <div 
                        className="fixed inset-0" 
                        onClick={() => setShowDownloadMenu(false)} 
                      />
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        {(['txt', 'html', 'md', 'json'] as DownloadFormat[]).map((format) => (
                          <button
                            key={format}
                            onClick={() => handleDownload(format)}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/10 transition-colors whitespace-nowrap"
                          >
                            .{format}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}