'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react'
import { SummaryLength, ProcessingStage, ErrorDetail } from '../types'
import { SUMMARY_CONFIGS, UI_TEXT, STAGE_MESSAGES } from '../constants'
import { validateFile, formatFileSize, parseApiError } from '../../../lib/utils/errorHandler'

export default function PDFSummarizerClient() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [stage, setStage] = useState<ProcessingStage>('idle')
  const [progress, setProgress] = useState(0)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<ErrorDetail | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    // Reset states
    setSummary('')
    setStage('idle')
    setError(null)
    setProgress(0)

    // Validate file
    const validation = validateFile(selectedFile)

    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setFile(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSummarize = async () => {
    if (!file) return

    setStage('uploading')
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('summaryLength', summaryLength)

      // Upload progress simulation
      await new Promise<void>((resolve) => {
        let currentProgress = 0
        const uploadInterval = setInterval(() => {
          currentProgress += 5
          if (currentProgress >= 30) {
            setProgress(30)
            clearInterval(uploadInterval)
            resolve()
          } else {
            setProgress(currentProgress)
          }
        }, 100)
      })

      // Start API processing
      setStage('processing')

      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      })

      // Processing progress simulation
      await new Promise<void>((resolve) => {
        let currentProgress = 30
        const processInterval = setInterval(() => {
          currentProgress += 10
          if (currentProgress >= 90) {
            setProgress(90)
            clearInterval(processInterval)
            resolve()
          } else {
            setProgress(currentProgress)
          }
        }, 200)
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw { response: data }
      }

      // Final 10%
      setProgress(100)
      setSummary(data.summary)
      setStage('done')
    } catch (err) {
      console.error('Error:', err)
      const errorDetail = parseApiError(err)
      setError(errorDetail)
      setStage('error')
      setProgress(0)
    }
  }

  const handleCopy = async () => {
    if (!summary) return

    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!summary) return

    const blob = new Blob([summary], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `summary-${file?.name.replace('.pdf', '')}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setFile(null)
    setSummary('')
    setStage('idle')
    setProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isProcessing = stage === 'processing' || stage === 'uploading'
  const config = SUMMARY_CONFIGS[summaryLength]

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Upload PDF</h2>
            {file && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white transition-colors"
                title="Clear file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-green-400 bg-green-500/10 scale-105'
                : file
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="pdf-upload"
              className={`cursor-pointer ${isProcessing ? 'pointer-events-none' : ''}`}
            >
              {!file ? (
                <>
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                      isDragging ? 'text-green-400' : 'text-gray-400'
                    }`}
                  />
                  <p className="text-white font-medium mb-1">
                    {isDragging ? UI_TEXT.uploadZone.dragActive : UI_TEXT.uploadZone.empty}
                  </p>
                  <p className="text-sm text-gray-400">{UI_TEXT.uploadZone.maxSize}</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p
                    className="text-green-400 font-medium truncate max-w-full px-4"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{formatFileSize(file.size)}</p>
                </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-medium mb-1">{error.userMessage}</p>
                  {error.technicalMessage && (
                    <p className="text-red-400/70 text-sm">{error.technicalMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary Length */}
          <div className="mt-6">
            <label className="text-white font-medium mb-3 block">Summary Length</label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'long'] as const).map((length) => (
                <button
                  key={length}
                  onClick={() => setSummaryLength(length)}
                  disabled={isProcessing}
                  className={`py-3 rounded-lg capitalize transition-all relative group ${
                    summaryLength === length
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={SUMMARY_CONFIGS[length].description}
                >
                  {length}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <div className="font-medium mb-1">{SUMMARY_CONFIGS[length].description}</div>
                    <div className="text-gray-400">~{SUMMARY_CONFIGS[length].estimatedTime}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                {config.description} • Est. {config.estimatedTime}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 font-medium">{STAGE_MESSAGES[stage]}</span>
                <span className="text-green-400 font-semibold">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleSummarize}
              disabled={!file || isProcessing}
              className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                file && !isProcessing
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:shadow-green-500/30 hover:scale-105'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {UI_TEXT.buttons.processing}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {UI_TEXT.buttons.summarize}
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={isProcessing}
              className="py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {UI_TEXT.buttons.clear}
            </button>
          </div>
        </div>

        {/* Summary Output */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Summary</h2>
            {summary && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {UI_TEXT.buttons.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {UI_TEXT.buttons.copy}
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 text-sm"
                >
                  <Download className="w-4 h-4" />
                  {UI_TEXT.buttons.download}
                </button>
              </div>
            )}
          </div>

          {!summary && !isProcessing ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{UI_TEXT.summary.placeholder}</p>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-300 text-lg font-medium">{UI_TEXT.summary.processing}</p>
                <p className="text-gray-500 text-sm mt-2">This may take {config.estimatedTime}</p>
              </div>
            </div>
          ) : (
            <div className="bg-black/30 rounded-xl p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
