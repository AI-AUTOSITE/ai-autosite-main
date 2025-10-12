'use client'

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import {
  Zap,
  Upload,
  Copy,
  Check,
  Download,
  X,
  Trash2,
  AlertTriangle,
  Shield,
  Loader2,
  FileText,
  TrendingDown,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  ChevronDown,
  Info,
} from 'lucide-react'

// Type definitions
interface ProcessedFile {
  id: string
  name: string
  type: string
  size: number
  content: string
  compressedContent?: string
  originalTokens?: number
  compressedTokens?: number
  compressionLevel?: 'light' | 'standard' | 'aggressive' | 'extreme'
}

interface SecurityIssue {
  type: 'api_key' | 'email' | 'phone' | 'private_key'
  severity: 'high' | 'medium' | 'low'
  count: number
}

interface ModelTokens {
  gpt4: number
  gpt35: number
  claude: number
  gemini: number
}

type OutputFormat = 'clipboard' | 'markdown' | 'json' | 'zip'
type CompressionLevel = 'light' | 'standard' | 'aggressive' | 'extreme'

// AI Model configurations
const AI_MODELS = {
  gpt4: { name: 'GPT-4', ratio: 4, color: 'text-green-400' },
  gpt35: { name: 'GPT-3.5', ratio: 4, color: 'text-blue-400' },
  claude: { name: 'Claude', ratio: 3.5, color: 'text-purple-400' },
  gemini: { name: 'Gemini', ratio: 4, color: 'text-orange-400' },
}

// Compression levels with descriptions - NO EMOJI
const COMPRESSION_LEVELS: Record<
  CompressionLevel,
  { name: string; description: string }
> = {
  light: { name: 'Light', description: 'Keep readability' },
  standard: { name: 'Standard', description: 'Balanced' },
  aggressive: { name: 'Aggressive', description: 'Max compression' },
  extreme: { name: 'Extreme', description: 'AI only' },
}

// Enhanced compression function
function compressText(text: string, level: CompressionLevel = 'standard'): string {
  let compressed = text

  if (level === 'light') {
    // Light: Only remove comments and excess whitespace
    compressed = compressed
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim()
  } else if (level === 'standard') {
    // Standard: Remove comments, normalize whitespace
    compressed = compressed
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/#.*$/gm, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+/gm, '')
      .replace(/\s+$/gm, '')
      .trim()
  } else if (level === 'aggressive') {
    // Aggressive: Remove all unnecessary characters
    compressed = compressed
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/#.*$/gm, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n+/g, ' ')
      .replace(/\s*([{}()\[\];,:])\s*/g, '$1')
      .replace(/\s*([=+\-*/&|<>!?])\s*/g, '$1')
      .replace(/;\s*/g, ';')
      .replace(/,\s*/g, ',')
      .trim()
  } else if (level === 'extreme') {
    // Extreme: Single line, minimal spacing
    compressed = compressed
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}()\[\];,:=+\-*/&|<>!?])\s*/g, '$1')
      .replace(/[^\x20-\x7E]+/g, '') // Remove non-printable
      .replace(/\s+/g, ' ')
      .trim()

    // Additional extreme optimizations
    if (compressed.length > 1000) {
      // Remove all unnecessary quotes in JSON-like structures
      compressed = compressed.replace(/"([^"]+)":/g, '$1:')
    }
  }

  return compressed
}

// Calculate tokens for different models
function calculateModelTokens(text: string): ModelTokens {
  return {
    gpt4: Math.ceil(text.length / AI_MODELS.gpt4.ratio),
    gpt35: Math.ceil(text.length / AI_MODELS.gpt35.ratio),
    claude: Math.ceil(text.length / AI_MODELS.claude.ratio),
    gemini: Math.ceil(text.length / AI_MODELS.gemini.ratio),
  }
}

// Security check
function checkSecurity(content: string): SecurityIssue[] {
  const issues: SecurityIssue[] = []

  // API Keys
  if (/(?:api[_\-]?key|apikey|token)[\s:=]+["']?[a-zA-Z0-9\-_]{20,}/gi.test(content)) {
    issues.push({ type: 'api_key', severity: 'high', count: 1 })
  }

  // Emails
  const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  if (emails?.length) {
    issues.push({ type: 'email', severity: 'medium', count: emails.length })
  }

  // Phone numbers
  const phones = content.match(/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g)
  if (phones?.length) {
    issues.push({ type: 'phone', severity: 'medium', count: phones.length })
  }

  // Private keys
  if (/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(content)) {
    issues.push({ type: 'private_key', severity: 'high', count: 1 })
  }

  return issues
}

// Remove sensitive data
function removeSensitiveData(content: string): string {
  return content
    .replace(/(?:api[_\-]?key|apikey|token)[\s:=]+["']?[a-zA-Z0-9\-_]{20,}/gi, '[REDACTED_KEY]')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    .replace(/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[PHONE]')
    .replace(/-----BEGIN[\s\S]*?-----END[\s\S]*?-----/g, '[PRIVATE_KEY]')
}

export default function TokenCompressor() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('gpt4')
  const [copied, setCopied] = useState(false)
  const [showModelDetails, setShowModelDetails] = useState(false)
  const [autoCompress, setAutoCompress] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate totals
  const totals = useMemo(() => {
    const original = files.reduce((sum, f) => sum + (f.originalTokens || 0), 0)
    const compressed = files.reduce((sum, f) => sum + (f.compressedTokens || 0), 0)
    const saved = original - compressed
    const rate = original > 0 ? Math.round((saved / original) * 100) : 0

    return { original, compressed, saved, rate }
  }, [files])

  // Process files
  const processFiles = useCallback(
    async (uploadedFiles: File[]) => {
      setIsProcessing(true)

      try {
        const processed: ProcessedFile[] = []

        for (const file of uploadedFiles) {
          const content = await file.text()
          const id = `${Date.now()}-${Math.random()}`

          // Check security
          const issues = checkSecurity(content)
          if (issues.length > 0) {
            setSecurityIssues((prev) => [...prev, ...issues])
          }

          // Calculate tokens
          const originalTokens = Math.ceil(content.length / AI_MODELS[selectedModel].ratio)
          const compressedContent = compressText(content, compressionLevel)
          const compressedTokens = Math.ceil(
            compressedContent.length / AI_MODELS[selectedModel].ratio
          )

          processed.push({
            id,
            name: file.name,
            type: file.type || 'text/plain',
            size: file.size,
            content,
            compressedContent,
            originalTokens,
            compressedTokens,
            compressionLevel,
          })
        }

        setFiles((prev) => [...prev, ...processed])
      } catch (error) {
        console.error('Processing error:', error)
      } finally {
        setIsProcessing(false)
      }
    },
    [compressionLevel, selectedModel]
  )

  // Handle file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        processFiles(Array.from(files))
      }
    },
    [processFiles]
  )

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles]
  )

  // Recompress all files when level changes
  useEffect(() => {
    if (autoCompress && files.length > 0) {
      const recompressed = files.map((file) => {
        const compressedContent = compressText(file.content, compressionLevel)
        const compressedTokens = Math.ceil(
          compressedContent.length / AI_MODELS[selectedModel].ratio
        )

        return {
          ...file,
          compressedContent,
          compressedTokens,
          compressionLevel,
        }
      })

      setFiles(recompressed)
    }
  }, [compressionLevel, selectedModel, autoCompress])

  // Copy to clipboard
  const handleCopy = async () => {
    const output = files
      .map((f) => `### ${f.name}\n${f.compressedContent || f.content}`)
      .join('\n\n')

    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate download
  const handleDownload = () => {
    const output = files
      .map((f) => `### ${f.name}\n${f.compressedContent || f.content}`)
      .join('\n\n---\n\n')

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Remove file
  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // Clear all
  const handleClear = () => {
    setFiles([])
    setSecurityIssues([])
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Main Stats - Tool First */}
      <div className="text-center mb-8">
        {files.length === 0 ? (
          <></>
        ) : (
          <div className="space-y-4">
            {/* Big Numbers */}
            <div className="flex justify-center items-baseline gap-4 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {totals.compressed.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Compressed</div>
              </div>
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400">
                  {totals.rate}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Saved</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{totals.original.toLocaleString()} original</span>
                <span>{totals.saved.toLocaleString()} saved</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-500"
                  style={{ width: `${totals.rate}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compression Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/10">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Compression Level */}
          <div>
            <div className="flex items-center gap-2 h-6 mb-3 sm:mb-4">
              <Sliders className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Level</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(COMPRESSION_LEVELS) as [CompressionLevel, any][]).map(
                ([level, info]) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level)}
                    className={`min-h-[48px] sm:min-h-[56px] px-3 sm:px-4 py-3 rounded-lg transition-all ${
                      compressionLevel === level
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    title={info.description}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{info.name}</div>
                      <div className="text-xs opacity-70 hidden sm:block">{info.description}</div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* AI Model Selection */}
          <div>
            <div className="flex items-center gap-2 h-6 mb-3 sm:mb-4">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">AI Model</span>
              {files.length > 0 && (
                <button
                  onClick={() => setShowModelDetails(!showModelDetails)}
                  className="ml-auto min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors"
                  title="Compare models"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showModelDetails ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(AI_MODELS) as [keyof typeof AI_MODELS, any][]).map(
                ([model, info]) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`min-h-[48px] sm:min-h-[56px] px-3 sm:px-4 py-3 rounded-lg transition-all flex flex-col justify-center ${
                      selectedModel === model
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`font-medium text-sm ${selectedModel === model ? 'text-white' : info.color}`}
                    >
                      {info.name}
                    </div>
                    <div className="text-xs mt-1 opacity-70 hidden sm:block">
                      1 token = {info.ratio} chars
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Model Details (collapsible) */}
        {showModelDetails && files.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-3">Token comparison</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(AI_MODELS) as [keyof typeof AI_MODELS, any][]).map(
                ([model, info]) => {
                  const modelTokens = files.reduce((sum, f) => {
                    return sum + Math.ceil((f.compressedContent || f.content).length / info.ratio)
                  }, 0)

                  return (
                    <div
                      key={model}
                      className={`text-center p-3 rounded-lg ${
                        selectedModel === model ? 'bg-white/10' : 'bg-black/20'
                      }`}
                    >
                      <div className={`text-lg font-bold ${info.color}`}>
                        {modelTokens.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{info.name}</div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]'
            : files.length > 0
              ? 'border-white/20 bg-white/5'
              : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept="*"
        />

        {files.length === 0 ? (
          <div className="text-center">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2 text-sm sm:text-base">Drop files here</p>
            <p className="text-gray-400 text-sm mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="min-h-[48px] px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin inline" size={16} />
              ) : (
                'Choose Files'
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4">Auto compress with security scan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* File List */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-white font-medium truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        {file.originalTokens?.toLocaleString()} to{' '}
                        {file.compressedTokens?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-400 transition-all flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[48px] py-2.5 border border-dashed border-white/20 rounded-lg text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all"
            >
              + Add More
            </button>
          </div>
        )}
      </div>

      {/* Security Issues */}
      {securityIssues.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 font-medium mb-2 text-sm sm:text-base">
                Security Alert
              </p>
              <div className="flex flex-wrap gap-2">
                {securityIssues.map((issue, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full"
                  >
                    {issue.count} {issue.type.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  const cleaned = files.map((f) => ({
                    ...f,
                    content: removeSensitiveData(f.content),
                    compressedContent: removeSensitiveData(f.compressedContent || ''),
                  }))
                  setFiles(cleaned)
                  setSecurityIssues([])
                }}
                className="mt-3 min-h-[44px] px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition-all"
              >
                Remove Sensitive Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClear}
            className="min-h-[48px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg font-medium hover:bg-white/10 transition-all order-1 sm:order-1"
          >
            <Trash2 className="inline mr-2" size={16} />
            Clear
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="min-h-[48px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg font-medium hover:bg-white/10 transition-all order-2 sm:order-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="inline mr-2" size={16} />
                Hide
              </>
            ) : (
              <>
                <Eye className="inline mr-2" size={16} />
                Preview
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 min-h-[48px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg font-medium hover:bg-white/10 transition-all order-3 sm:order-3"
          >
            {copied ? (
              <>
                <Check className="inline mr-2" size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy className="inline mr-2" size={16} />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 min-h-[48px] px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all order-4 sm:order-4"
          >
            <Download className="inline mr-2" size={16} />
            Download
          </button>
        </div>
      )}

      {/* Preview */}
      {showPreview && files.length > 0 && (
        <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Preview</h3>
          <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
            {files
              .slice(0, 2)
              .map(
                (f) =>
                  `### ${f.name}\n${(f.compressedContent || f.content).substring(0, 500)}${
                    (f.compressedContent || f.content).length > 500 ? '...' : ''
                  }`
              )
              .join('\n\n')}
            {files.length > 2 && `\n\n... and ${files.length - 2} more files`}
          </pre>
        </div>
      )}
    </div>
  )
}