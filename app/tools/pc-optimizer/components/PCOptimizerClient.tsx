// app/tools/pc-optimizer/components/PCOptimizerClient.tsx

'use client'

import React, { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import AnalysisResult from './AnalysisResult'
import ErrorBoundary from './ErrorBoundary'
import { useFileAnalysis } from '../hooks/useFileAnalysis'

export default function PCOptimizerClient() {
  const [isDragging, setIsDragging] = useState(false)
  const { analyzedData, isAnalyzing, error, handleFileUpload, clearError } = useFileAnalysis()
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      setSelectedFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        handleFileUpload(content)
      }
      reader.readAsText(file, 'UTF-8')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.csv')) {
      setSelectedFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        handleFileUpload(content)
      }
      reader.readAsText(file, 'UTF-8')
    }
  }

  // If showing results, render results view
  if (analyzedData.length > 0) {
    return (
      <ErrorBoundary>
        <div className="container mx-auto px-4 pb-8 max-w-5xl">
          <AnalysisResult data={analyzedData} />
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-sm sm:text-base text-gray-400 hover:text-white underline min-h-[48px]"
            >
              Analyze another file
            </button>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Main upload view - Mobile optimized
  return (
    <ErrorBoundary>
      <div className="relative">
        {/* Error message - mobile friendly */}
        {error && (
          <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-3 rounded-lg text-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={clearError} 
                className="ml-3 p-1 min-w-[24px] min-h-[24px]"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main upload area */}
        <main className="flex flex-col items-center justify-center p-4 min-h-[70vh]">
          {/* Mobile-first: Large upload button for mobile */}
          <div className="w-full max-w-3xl">
            {/* Desktop: Keep drop zone */}
            <div className="hidden sm:block">
              <label className="block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isAnalyzing}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`
                    relative h-[60vh] min-h-[400px] rounded-3xl border-4 border-dashed
                    flex flex-col items-center justify-center cursor-pointer
                    transition-all duration-200
                    shadow-2xl
                    ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02] shadow-cyan-400/20'
                        : 'border-gray-500 bg-gray-800/20 hover:border-cyan-400 hover:bg-cyan-400/5 hover:shadow-cyan-400/10'
                    }
                    ${isAnalyzing ? 'cursor-wait opacity-70' : ''}
                  `}
                >
                  {isAnalyzing ? (
                    <div className="text-center px-4">
                      <div className="mx-auto w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-2xl font-medium text-white">Analyzing...</p>
                      <p className="text-sm text-gray-400 mt-2">Please wait</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-24 h-24 text-gray-500 mb-6" />
                      <h2 className="text-3xl font-medium text-gray-300 mb-2">Drop CSV here</h2>
                      <p className="text-base text-gray-400 mb-8">or click to select</p>

                      {selectedFileName && (
                        <div className="flex items-center gap-2 text-green-400 mb-4">
                          <FileText className="w-5 h-5" />
                          <span className="text-sm">{selectedFileName}</span>
                        </div>
                      )}

                      {/* Steps */}
                      <div className="absolute bottom-8 flex gap-8 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">
                            1
                          </span>
                          <span>Run script</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">
                            2
                          </span>
                          <span>Drop CSV</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center">
                            3
                          </span>
                          <span>Get results</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Mobile: Simple button interface */}
            <div className="sm:hidden">
              {isAnalyzing ? (
                <div className="text-center px-4 py-16">
                  <div className="mx-auto w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xl sm:text-2xl font-medium text-white">Analyzing...</p>
                  <p className="text-sm text-gray-400 mt-2">Please wait</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File upload button - LARGE for mobile */}
                  <label className="block">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isAnalyzing}
                    />
                    
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border-2 border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all">
                      <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-white text-center mb-2">
                        Select CSV File
                      </p>
                      <p className="text-sm text-gray-400 text-center">
                        Tap to choose file
                      </p>
                    </div>
                  </label>

                  {selectedFileName && (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm">{selectedFileName}</span>
                    </div>
                  )}

                  {/* Steps for mobile */}
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">How to use:</h3>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <span className="text-sm text-gray-400">Run PowerShell script on PC</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        2
                      </span>
                      <span className="text-sm text-gray-400">Transfer CSV to phone</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        3
                      </span>
                      <span className="text-sm text-gray-400">Upload file here</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="text-center py-2 text-xs text-gray-400">
          <span className="block sm:inline">100% Private</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span className="block sm:inline">No uploads</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span className="block sm:inline">Browser-only</span>
        </div>
      </div>
    </ErrorBoundary>
  )
}