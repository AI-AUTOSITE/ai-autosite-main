// app/tools/pdf-tools/features/convert/ConvertUI.tsx
import React, { useState } from 'react'
import { FileText, FileSpreadsheet, Type, Code, Download } from 'lucide-react'

interface ConvertUIProps {
  onConvert: (format: string, options: any) => void
  onCancel: () => void
  isProcessing?: boolean
}

export const ConvertUI: React.FC<ConvertUIProps> = ({
  onConvert,
  onCancel,
  isProcessing = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'word' | 'excel' | 'text' | 'html'>('word')
  const [extractImages, setExtractImages] = useState(false)
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [mergePages, setMergePages] = useState(false)

  const handleConvert = () => {
    onConvert(selectedFormat, {
      format: selectedFormat,
      extractImages,
      preserveFormatting,
      mergePages,
    })
  }

  const formatInfo = {
    word: {
      icon: <FileText className="w-5 h-5" />,
      name: 'Word Document',
      extension: '.docx',
      description: 'Editable document with text and basic formatting',
      color: 'blue',
    },
    excel: {
      icon: <FileSpreadsheet className="w-5 h-5" />,
      name: 'Excel Spreadsheet',
      extension: '.xlsx',
      description: 'Structured data in rows and columns',
      color: 'green',
    },
    text: {
      icon: <Type className="w-5 h-5" />,
      name: 'Plain Text',
      extension: '.txt',
      description: 'Simple text without formatting',
      color: 'gray',
    },
    html: {
      icon: <Code className="w-5 h-5" />,
      name: 'HTML Document',
      extension: '.html',
      description: 'Web-ready document with formatting',
      color: 'orange',
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Convert PDF</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
            disabled={isProcessing}
          >
            ✕
          </button>
        </div>

        {isProcessing ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-300">Converting PDF...</p>
            <p className="mt-2 text-sm text-gray-400">This may take a few moments</p>
          </div>
        ) : (
          <>
            {/* Format Selection */}
            <div className="space-y-2 mb-6">
              {(Object.keys(formatInfo) as Array<keyof typeof formatInfo>).map((format) => {
                const info = formatInfo[format]
                const colorClasses = {
                  blue: 'border-blue-500 bg-blue-500/10',
                  green: 'border-green-500 bg-green-500/10',
                  gray: 'border-gray-500 bg-gray-500/10',
                  orange: 'border-orange-500 bg-orange-500/10',
                }

                return (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedFormat === format
                        ? colorClasses[info.color as keyof typeof colorClasses]
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          selectedFormat === format ? 'text-cyan-400' : 'text-gray-400'
                        }`}
                      >
                        {info.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{info.name}</span>
                          <span className="text-xs text-gray-500">{info.extension}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                      </div>
                      {selectedFormat === format && (
                        <div className="mt-1">
                          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Format-specific Options */}
            <div className="space-y-3 mb-6 border-t border-gray-700 pt-4">
              <h4 className="text-sm text-gray-300 font-medium">Options</h4>

              {(selectedFormat === 'word' || selectedFormat === 'html') && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={preserveFormatting}
                    onChange={(e) => setPreserveFormatting(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Preserve formatting
                </label>
              )}

              {selectedFormat === 'word' && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={extractImages}
                    onChange={(e) => setExtractImages(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Extract images (if any)
                </label>
              )}

              {selectedFormat === 'excel' && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={mergePages}
                    onChange={(e) => setMergePages(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Merge all pages into one sheet
                </label>
              )}

              {selectedFormat === 'text' && (
                <p className="text-xs text-gray-500 italic">
                  Plain text extraction with no formatting
                </p>
              )}
            </div>

            {/* Conversion Info */}
            <div className="bg-gray-700/50 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <Download className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-300">
                    Your converted file will be downloaded automatically
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Original PDF will remain unchanged</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConvert}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Convert
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
