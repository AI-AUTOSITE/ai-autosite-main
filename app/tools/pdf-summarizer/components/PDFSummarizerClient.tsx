'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Sparkles, Download, Copy, Check, Loader2, AlertCircle, HelpCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

const ToolGuide = dynamic(() => import('../guide'), { ssr: false })

type SummaryLength = 'short' | 'medium' | 'long'
type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export default function PDFSummarizerClient() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [stage, setStage] = useState<ProcessingStage>('idle')
  const [progress, setProgress] = useState(0)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium')
  const [copied, setCopied] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const handleFileSelect = (selectedFile: File) => {
    // Reset states
    setSummary('')
    setStage('idle')
    setErrorMessage('')
    setProgress(0)

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please select a PDF file')
      return
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage(`File too large. Maximum size is 10MB, your file is ${(selectedFile.size / 1024 / 1024).toFixed(1)}MB`)
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
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

const handleSummarize = async () => {
  if (!file) return

  setStage('uploading')
  setProgress(0)  // 明確に0からスタート
  setErrorMessage('')

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('summaryLength', summaryLength)

    // アップロード進捗を0から段階的に
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
      }, 100)  // 100msごとに5%ずつ = 600msで30%に到達
    })

    // API処理開始
    setStage('processing')
    
    const response = await fetch('/api/summarize', {
      method: 'POST',
      body: formData,
    })

    // 処理進捗を30%から90%まで
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

    if (!response.ok) {
      throw new Error('Summarization failed')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    // 最後の10%
    setProgress(100)
    setSummary(data.summary)
    setStage('done')
    
  } catch (error) {
    console.error('Error:', error)
    setErrorMessage(error instanceof Error ? error.message : 'Failed to summarize PDF')
    setStage('error')
    setProgress(0)
  }
}

  const generateDemoSummary = (length: SummaryLength): string => {
    const summaries = {
      short: `# Key Points
- Main finding: Significant correlation between variables
- Method: Quantitative analysis with 500 participants
- Result: 78% improvement in measured outcomes
- Conclusion: Further research recommended`,
      
      medium: `# Executive Summary

This document presents a comprehensive analysis of the research findings.

## Key Findings
- **Primary Discovery**: The study reveals significant patterns in data trends
- **Methodology**: Mixed-methods approach with quantitative and qualitative analysis
- **Sample Size**: 500 participants across diverse demographics

## Results
The analysis demonstrates:
1. 78% improvement in primary metrics
2. Strong correlation between key variables
3. Consistent patterns across all test groups

## Recommendations
- Implement proposed framework immediately
- Monitor progress quarterly
- Expand research scope for validation`,
      
      long: `# Comprehensive Document Summary

## Introduction
This document provides an in-depth analysis of the research conducted over a 12-month period, focusing on key performance indicators and their correlation with proposed methodologies.

## Methodology
The study employed a mixed-methods approach:
- **Quantitative Analysis**: Statistical modeling of 500+ data points
- **Qualitative Research**: In-depth interviews with 50 participants
- **Longitudinal Study**: 12-month observation period

## Key Findings

### Primary Discoveries
1. **Correlation Analysis**: Strong positive correlation (r=0.85) between implementation and outcomes
2. **Performance Metrics**: 78% improvement in efficiency metrics
3. **User Satisfaction**: 92% positive feedback from participants

### Secondary Observations
- Unexpected benefits in adjacent areas
- Potential for scalability confirmed
- Cost-effectiveness validated

## Detailed Results
The comprehensive analysis reveals multiple layers of insight:
- Time-series data shows consistent improvement
- Cross-sectional analysis confirms broad applicability
- Regression models predict continued positive trends

## Implications
These findings have significant implications for:
- Industry best practices
- Policy recommendations
- Future research directions

## Recommendations
Based on the analysis:
1. Immediate implementation of core strategies
2. Quarterly review cycles for optimization
3. Extended pilot programs in new sectors
4. Investment in supporting infrastructure

## Conclusion
The research conclusively demonstrates the viability and effectiveness of the proposed approach, with strong evidence supporting widespread adoption.`
    }
    
    return summaries[length]
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
    a.download = `summary-${Date.now()}.md`
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
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Upload PDF</h2>
          </div>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              file ? 'border-green-500/50 bg-green-500/5' : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={stage !== 'idle' && stage !== 'done'}
            />
            <label
              htmlFor="pdf-upload"
              className={`cursor-pointer ${stage === 'processing' || stage === 'uploading' ? 'pointer-events-none' : ''}`}
            >
              {!file ? (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">Drop PDF here or click to upload</p>
                  <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{errorMessage}</p>
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
                  disabled={stage === 'processing' || stage === 'uploading'}
                  className={`py-2 rounded-lg capitalize transition-all ${
                    summaryLength === length
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  } ${stage === 'processing' || stage === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {(stage === 'uploading' || stage === 'processing') && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">
                  {stage === 'uploading' ? 'Uploading...' : 'Processing...'}
                </span>
                <span className="text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleSummarize}
              disabled={!file || stage === 'processing' || stage === 'uploading'}
              className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                file && stage !== 'processing' && stage !== 'uploading'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {stage === 'processing' || stage === 'uploading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Summarize
                </>
              )}
            </button>
            
            <button
              onClick={handleClear}
              disabled={stage === 'processing' || stage === 'uploading'}
              className="py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
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
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>

          {!summary ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Your summary will appear here</p>
              </div>
            </div>
          ) : (
            <div className="bg-black/30 rounded-xl p-6 max-h-[400px] overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300 text-sm">
                  {summary}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}