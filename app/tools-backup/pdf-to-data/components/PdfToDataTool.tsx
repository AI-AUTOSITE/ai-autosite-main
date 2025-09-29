'use client'

import { useState, useRef } from 'react'
import { FileText, Download, Sparkles, Database, CheckCircle } from 'lucide-react'

export default function PdfToDataTool() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState<string>('')
  const [excelUrl, setExcelUrl] = useState<string>('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      await processFile(droppedFile)
    } else {
      setError('Please use PDF files only')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      await processFile(selectedFile)
    }
  }

  const processFile = async (pdfFile: File) => {
    if (pdfFile.size > 10 * 1024 * 1024) {
      setError('File too big. Max 10MB')
      setTimeout(() => setError(''), 3000)
      return
    }

    setFile(pdfFile)
    setIsProcessing(true)
    setError('')
    
    // Reset previous URLs
    if (csvUrl) URL.revokeObjectURL(csvUrl)
    if (excelUrl) URL.revokeObjectURL(excelUrl)
    setCsvUrl('')
    setExcelUrl('')
    
    try {
      // Process both formats simultaneously
      const [csvBlob, excelBlob] = await Promise.all([
        extractData(pdfFile, 'csv'),
        extractData(pdfFile, 'excel')
      ])
      
      if (csvBlob) {
        const url = URL.createObjectURL(csvBlob)
        setCsvUrl(url)
      }
      
      if (excelBlob) {
        const url = URL.createObjectURL(excelBlob)
        setExcelUrl(url)
      }
      
      if (!csvBlob && !excelBlob) {
        setError('Failed to extract data. Please try another PDF.')
        setTimeout(() => setError(''), 5000)
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const extractData = async (pdfFile: File, format: 'csv' | 'excel'): Promise<Blob | null> => {
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('format', format)

    try {
      const response = await fetch('/api/pdf-to-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return await response.blob()
      }
      return null
    } catch {
      return null
    }
  }

  const handleReset = () => {
    // Clean up URLs
    if (csvUrl) URL.revokeObjectURL(csvUrl)
    if (excelUrl) URL.revokeObjectURL(excelUrl)
    
    setFile(null)
    setCsvUrl('')
    setExcelUrl('')
    setError('')
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Drop Zone */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div
            onClick={() => !file && !isProcessing && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              if (!isProcessing) setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              relative min-h-[400px] rounded-2xl border-2 border-dashed
              flex flex-col items-center justify-center
              transition-all duration-300 bg-white/5 backdrop-blur-sm
              ${isDragging 
                ? 'border-cyan-400 bg-cyan-400/10 scale-102' 
                : file
                  ? 'border-green-400 bg-green-400/5'
                  : 'border-gray-600 hover:border-cyan-400 hover:bg-white/10 cursor-pointer'
              }
              ${isProcessing ? 'cursor-wait' : ''}
            `}
          >
            {/* Initial State */}
            {!file && !isProcessing && (
              <div className="text-center">
                <FileText className="w-20 h-20 text-gray-400 mb-4 mx-auto" />
                <p className="text-2xl font-semibold text-gray-300">Drop PDF here</p>
                <p className="text-sm text-gray-500 mt-3">or click to browse</p>
                <p className="text-xs text-gray-600 mt-8">Maximum 10MB • Powered by Claude AI</p>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center">
                <Sparkles className="w-20 h-20 text-cyan-400 mb-4 animate-pulse mx-auto" />
                <p className="text-2xl font-semibold text-white">Extracting data...</p>
                <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                <div className="mt-6 w-48 mx-auto">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" 
                         style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {file && !isProcessing && (csvUrl || excelUrl) && (
              <div className="text-center">
                <CheckCircle className="w-20 h-20 text-green-400 mb-4 mx-auto" />
                <p className="text-2xl font-semibold text-white mb-2">Ready!</p>
                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto truncate">
                  {file.name}
                </p>
                
                {/* Download Buttons */}
                <div className="flex gap-4 justify-center mb-8 flex-wrap">
                  {csvUrl && (
                    
                      <a href={csvUrl}
                      download={file.name.replace('.pdf', '.csv')}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
                               hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl 
                               font-medium transition-all hover:scale-105 hover:shadow-lg
                               flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download CSV
                    </a>
                  )}
                  {excelUrl && (
                    
                      <a href={excelUrl}
                      download={file.name.replace('.pdf', '.xlsx')}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
                               hover:from-green-600 hover:to-emerald-600 text-white rounded-xl 
                               font-medium transition-all hover:scale-105 hover:shadow-lg
                               flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Excel
                    </a>
                  )}
                </div>
                
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Process another PDF
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 
                          bg-red-500/90 text-white rounded-lg text-sm 
                          animate-fadeIn shadow-lg z-10">
              {error}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-green-400 font-semibold">100% Secure & Private</p>
              <p className="text-xs text-gray-400 mt-1">
                Your files are processed in real-time and never stored. 
                All data is deleted immediately after processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}