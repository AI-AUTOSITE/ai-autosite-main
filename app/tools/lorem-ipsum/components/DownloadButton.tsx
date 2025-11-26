'use client'

import { Download, Check } from 'lucide-react'
import { useState } from 'react'
import { downloadFile, getFormatDisplayName, type DownloadFormat } from '../lib/download'

interface DownloadButtonProps {
  content: string
  disabled?: boolean
  onDownload?: () => void
}

const FORMATS: DownloadFormat[] = ['txt', 'html', 'md', 'json']

export function DownloadButton({ content, disabled = false, onDownload }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = (format: DownloadFormat) => {
    downloadFile(content, format)
    setDownloaded(true)
    setIsOpen(false)
    onDownload?.()

    // Reset downloaded state after 2 seconds
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div className="relative flex-1 sm:flex-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`min-h-[44px] w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
          downloaded
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Done!</span>
            <span className="sm:hidden">✓</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Menu - positioned above on mobile if needed */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-20 overflow-hidden">
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">Download as:</div>
              {FORMATS.map((format) => (
                <button
                  key={format}
                  onClick={() => handleDownload(format)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between group"
                >
                  <span>{getFormatDisplayName(format)}</span>
                  <Download className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}