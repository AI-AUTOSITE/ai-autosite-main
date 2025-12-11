'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  FileOutput,
  X,
  Download,
  Copy,
  FileText,
  Image,
  Code,
  FileCode,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  Settings,
  Sliders,
  Zap,
  Archive
} from 'lucide-react'
import { 
  ConvertHandler, 
  OutputFormat, 
  ConvertProgress,
  PageImage 
} from './ConvertHandler'

interface ConvertUIProps {
  file: File | null
  totalPages: number
  onClose: () => void
}

// Format configuration
const FORMAT_CONFIG = {
  text: {
    icon: FileText,
    name: 'Plain Text',
    description: 'Extract all text content',
    quality: '⭐⭐⭐⭐⭐',
    qualityLabel: 'Excellent',
    extension: '.txt',
    color: 'cyan'
  },
  png: {
    icon: Image,
    name: 'PNG Images',
    description: 'High quality, lossless',
    quality: '⭐⭐⭐⭐⭐',
    qualityLabel: 'Excellent',
    extension: '.png',
    color: 'green'
  },
  jpeg: {
    icon: Image,
    name: 'JPEG Images',
    description: 'Smaller file size',
    quality: '⭐⭐⭐⭐',
    qualityLabel: 'Very Good',
    extension: '.jpg',
    color: 'yellow'
  },
  webp: {
    icon: Image,
    name: 'WebP Images',
    description: 'Modern format, best compression',
    quality: '⭐⭐⭐⭐',
    qualityLabel: 'Very Good',
    extension: '.webp',
    color: 'purple'
  },
  html: {
    icon: Code,
    name: 'HTML Document',
    description: 'Web-ready format',
    quality: '⭐⭐⭐',
    qualityLabel: 'Good',
    extension: '.html',
    color: 'orange'
  },
  markdown: {
    icon: FileCode,
    name: 'Markdown',
    description: 'For documentation',
    quality: '⭐⭐⭐',
    qualityLabel: 'Good',
    extension: '.md',
    color: 'pink'
  }
}

const COLOR_CLASSES = {
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-400', text: 'text-green-400' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-400' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-400', text: 'text-pink-400' }
}

export function ConvertUI({
  file,
  totalPages,
  onClose
}: ConvertUIProps) {
  // State
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('text')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Options state
  const [quality, setQuality] = useState(92)
  const [dpi, setDpi] = useState(150)
  const [pageRangeInput, setPageRangeInput] = useState('')
  const [includeImages, setIncludeImages] = useState(false)
  
  // Progress state
  const [progress, setProgress] = useState<ConvertProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Result state
  const [textResult, setTextResult] = useState<string | null>(null)
  const [imageResults, setImageResults] = useState<PageImage[]>([])
  const [htmlResult, setHtmlResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  // Preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Parse page range
  const pageRange = useMemo(() => {
    if (!pageRangeInput.trim()) return undefined
    
    const pages: number[] = []
    const parts = pageRangeInput.split(',')
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= Math.min(end, totalPages); i++) {
            if (i >= 1 && !pages.includes(i)) pages.push(i)
          }
        }
      } else {
        const page = parseInt(part.trim())
        if (!isNaN(page) && page >= 1 && page <= totalPages && !pages.includes(page)) {
          pages.push(page)
        }
      }
    }
    
    return pages.length > 0 ? pages.sort((a, b) => a - b) : undefined
  }, [pageRangeInput, totalPages])

  // Is image format?
  const isImageFormat = ['png', 'jpeg', 'webp'].includes(selectedFormat)

  // Handle conversion
  const handleConvert = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setTextResult(null)
    setImageResults([])
    setHtmlResult(null)
    setProgress(null)

    const baseName = file.name.replace(/\.pdf$/i, '')

    try {
      switch (selectedFormat) {
        case 'text': {
          const text = await ConvertHandler.toText(file, { pageRange }, setProgress)
          setTextResult(text)
          break
        }
        
        case 'png':
        case 'jpeg':
        case 'webp': {
          const images = await ConvertHandler.toImages(
            file,
            { 
              format: selectedFormat,
              quality: quality / 100,
              dpi,
              pageRange
            },
            setProgress
          )
          setImageResults(images)
          
          // Auto-download
          if (images.length === 1) {
            ConvertHandler.downloadImage(images[0], `${baseName}_page_${images[0].pageNumber}.${selectedFormat === 'jpeg' ? 'jpg' : selectedFormat}`)
          } else {
            await ConvertHandler.downloadImagesAsZip(images, baseName, selectedFormat)
          }
          break
        }
        
        case 'html': {
          const html = await ConvertHandler.toHTML(
            file,
            { pageRange, includeImages },
            setProgress
          )
          setHtmlResult(html)
          ConvertHandler.downloadHTML(html, `${baseName}.html`)
          break
        }
        
        case 'markdown': {
          const md = await ConvertHandler.toMarkdown(file, { pageRange }, setProgress)
          setTextResult(md)
          ConvertHandler.downloadMarkdown(md, `${baseName}.md`)
          break
        }
      }
    } catch (error) {
      console.error('Conversion error:', error)
      setProgress({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Conversion failed'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    const text = textResult || htmlResult
    if (!text) return
    
    const success = await ConvertHandler.copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download text result
  const handleDownloadText = () => {
    if (!textResult || !file) return
    const baseName = file.name.replace(/\.pdf$/i, '')
    const ext = selectedFormat === 'markdown' ? '.md' : '.txt'
    ConvertHandler.downloadText(textResult, `${baseName}${ext}`)
  }

  // Get format config
  const formatConfig = FORMAT_CONFIG[selectedFormat]
  const colorClasses = COLOR_CLASSES[formatConfig.color as keyof typeof COLOR_CLASSES]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileOutput className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Convert PDF</h2>
              <p className="text-sm text-gray-400">
                {file?.name} • {totalPages} pages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              100% Local
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Format Selection */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3">Output Format</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.entries(FORMAT_CONFIG) as [OutputFormat, typeof FORMAT_CONFIG.text][]).map(
                ([format, config]) => {
                  const Icon = config.icon
                  const colors = COLOR_CLASSES[config.color as keyof typeof COLOR_CLASSES]
                  const isSelected = selectedFormat === format

                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`p-3 rounded-lg border transition text-left ${
                        isSelected
                          ? `${colors.bg} ${colors.border}`
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? colors.text : 'text-gray-400'}`} />
                        <span className={`font-medium text-sm ${isSelected ? colors.text : ''}`}>
                          {config.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{config.description}</div>
                      <div className="text-xs mt-1 opacity-70">{config.quality}</div>
                    </button>
                  )
                }
              )}
            </div>
          </div>

          {/* Page Range */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Page Range (optional)</div>
            <input
              type="text"
              value={pageRangeInput}
              onChange={(e) => setPageRangeInput(e.target.value)}
              placeholder={`All pages (1-${totalPages})`}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: "1-5", "1,3,5", "1-3,7-10"
              {pageRange && ` • Selected: ${pageRange.length} pages`}
            </p>
          </div>

          {/* Advanced Options for Images */}
          {isImageFormat && (
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-2"
              >
                <Sliders className="w-4 h-4" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
              
              {showAdvanced && (
                <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">
                      Resolution: {dpi} DPI
                    </label>
                    <input
                      type="range"
                      min="72"
                      max="300"
                      step="1"
                      value={dpi}
                      onChange={(e) => setDpi(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>72 (Screen)</span>
                      <span>150 (Web)</span>
                      <span>300 (Print)</span>
                    </div>
                  </div>
                  
                  {selectedFormat !== 'png' && (
                    <div>
                      <label className="text-sm text-gray-300 mb-1 block">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="1"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HTML Include Images Option */}
          {selectedFormat === 'html' && (
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="text-sm text-gray-300">Include page images in HTML</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Embeds images for visual reference (larger file size)
              </p>
            </div>
          )}

          {/* Progress */}
          {progress && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">{progress.message}</span>
                {progress.status === 'converting' && (
                  <span className={`text-sm ${colorClasses.text}`}>{progress.progress}%</span>
                )}
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progress.status === 'error' ? 'bg-red-500' :
                    progress.status === 'complete' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.currentPage && progress.totalPages && (
                <p className="text-xs text-gray-500 mt-1">
                  Page {progress.currentPage} of {progress.totalPages}
                </p>
              )}
            </div>
          )}

          {/* Text Result */}
          {textResult && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Result</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownloadText}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={textResult}
                readOnly
                className="w-full h-48 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm resize-none font-mono"
              />
            </div>
          )}

          {/* Image Results */}
          {imageResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {imageResults.length} images created
                </span>
                {imageResults.length > 1 && (
                  <button
                    onClick={async () => {
                      const baseName = file?.name.replace(/\.pdf$/i, '') || 'pdf'
                      await ConvertHandler.downloadImagesAsZip(imageResults, baseName, selectedFormat as 'png' | 'jpeg' | 'webp')
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
                  >
                    <Archive className="w-4 h-4" />
                    Download ZIP
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {imageResults.slice(0, 8).map((img) => (
                  <div
                    key={img.pageNumber}
                    className="relative group cursor-pointer"
                    onClick={() => setPreviewImage(img.dataUrl)}
                  >
                    <img
                      src={img.dataUrl}
                      alt={`Page ${img.pageNumber}`}
                      className="w-full h-24 object-cover rounded border border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs">
                      {img.pageNumber}
                    </div>
                  </div>
                ))}
                {imageResults.length > 8 && (
                  <div className="flex items-center justify-center bg-gray-800 rounded border border-gray-700 text-gray-400 text-sm">
                    +{imageResults.length - 8} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HTML Result Notice */}
          {htmlResult && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                HTML file downloaded successfully!
              </p>
            </div>
          )}

          {/* Preview Modal */}
          {previewImage && (
            <div
              className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              100% browser-based conversion. Your files never leave your device.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={handleConvert}
            disabled={!file || isProcessing}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              file && !isProcessing
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Convert to {formatConfig.name}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConvertUI
