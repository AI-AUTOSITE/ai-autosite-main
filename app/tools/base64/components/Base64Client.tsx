'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Copy,
  Upload,
  Check,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Lock,
  Link,
  Hash,
  Download,
} from 'lucide-react'

type Mode = 'encode' | 'decode'
type Base64Type = 'standard' | 'urlsafe'

const vibrate = (duration: number) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>('encode')
  const [base64Type, setBase64Type] = useState<Base64Type>('standard')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedDataUri, setCopiedDataUri] = useState(false)
  const [error, setError] = useState('')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dataUri, setDataUri] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Convert standard Base64 to URL-safe
  const toUrlSafe = (base64: string): string => {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  // Convert URL-safe Base64 to standard
  const fromUrlSafe = (urlSafe: string): string => {
    let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4
    if (padding) {
      base64 += '='.repeat(4 - padding)
    }
    return base64
  }

  // Encode text to Base64
  const encodeText = useCallback((text: string, type: Base64Type): string => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)))
      return type === 'urlsafe' ? toUrlSafe(encoded) : encoded
    } catch {
      throw new Error('Failed to encode')
    }
  }, [])

  // Decode Base64 to text
  const decodeText = useCallback((base64: string, type: Base64Type): string => {
    try {
      const cleaned = base64.replace(/\s/g, '')
      const standard = type === 'urlsafe' ? fromUrlSafe(cleaned) : cleaned
      return decodeURIComponent(escape(atob(standard)))
    } catch {
      throw new Error('Invalid Base64 string')
    }
  }, [])

  // Check if Base64 is an image
  const isBase64Image = (base64: string): boolean => {
    return base64.startsWith('data:image/') || base64.length > 100
  }

  // Process input
  const processInput = useCallback(() => {
    setError('')
    setImagePreview(null)
    setDataUri(null)

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeText(input, base64Type)
        setOutput(encoded)
      } else {
        if (input.startsWith('data:')) {
          const base64Part = input.split(',')[1]
          const decoded = decodeText(base64Part, base64Type)
          setOutput(decoded)

          if (input.startsWith('data:image/')) {
            setImagePreview(input)
          }
        } else {
          const decoded = decodeText(input, base64Type)
          setOutput(decoded)

          if (isBase64Image(input)) {
            const formats = ['png', 'jpeg', 'gif', 'webp']
            for (const format of formats) {
              const testDataUrl = `data:image/${format};base64,${input}`
              setImagePreview(testDataUrl)
              setDataUri(testDataUrl)
              break
            }
          }
        }
      }
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Processing failed')
      vibrate(50)
    }
  }, [input, mode, base64Type, encodeText, decodeText])

  // Process on input or mode change
  useEffect(() => {
    const timer = setTimeout(processInput, 100)
    return () => clearTimeout(timer)
  }, [processInput])

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)')
      vibrate(50)
      return
    }

    setError('')
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    })

    try {
      const reader = new FileReader()

      reader.onload = (event) => {
        const result = event.target?.result

        if (mode === 'encode') {
          if (typeof result === 'string') {
            const base64Part = result.split(',')[1] || ''
            const processedBase64 = base64Type === 'urlsafe' ? toUrlSafe(base64Part) : base64Part
            setInput(result)
            setOutput(processedBase64)
            setDataUri(result)

            if (file.type.startsWith('image/')) {
              setImagePreview(result)
            }
          }
        } else {
          if (typeof result === 'string') {
            setInput(result)
          }
        }
        vibrate(30)
      }

      if (mode === 'encode') {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    } catch {
      setError('Failed to read file')
      vibrate(50)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    } else {
      const text = e.dataTransfer.getData('text')
      if (text) {
        setInput(text)
        setFileInfo(null)
      }
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy')
      vibrate(50)
    }
  }

  // Copy Data URI
  const handleCopyDataUri = async () => {
    if (!dataUri) return

    try {
      await navigator.clipboard.writeText(dataUri)
      setCopiedDataUri(true)
      vibrate(30)
      setTimeout(() => setCopiedDataUri(false), 2000)
    } catch {
      setError('Failed to copy')
    }
  }

  // Download decoded content
  const handleDownload = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'decoded.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Clear all
  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setFileInfo(null)
    setImagePreview(null)
    setDataUri(null)
    vibrate(30)
  }

  // Calculate statistics
  const stats = {
    inputChars: input.length,
    inputBytes: new Blob([input]).size,
    outputChars: output.length,
    outputBytes: new Blob([output]).size,
    ratio: input.length ? ((output.length / input.length) * 100).toFixed(0) : 0,
  }

  const sampleTexts = {
    encode: 'Hello, World! 🌍',
    decode: 'SGVsbG8sIFdvcmxkISDwn4yN',
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All processing done locally in your browser
        </p>
      </div>

      {/* Main Card */}
      <div 
        className={`bg-white/5 backdrop-blur-xl rounded-2xl border transition-all p-4 sm:p-6 ${
          isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
      >
        {/* Mode Selector */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Encode/Decode Toggle */}
          <div className="flex-1 flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => { setMode('encode'); handleClear() }}
              className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'encode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Text</span>
              <ArrowRight className="w-4 h-4" />
              <span>B64</span>
            </button>
            <button
              onClick={() => { setMode('decode'); handleClear() }}
              className={`flex-1 min-h-[48px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'decode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>B64</span>
              <ArrowRight className="w-4 h-4" />
              <span>Text</span>
            </button>
          </div>

          {/* Base64 Type Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setBase64Type('standard')}
              className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                base64Type === 'standard'
                  ? 'bg-cyan-500/30 text-cyan-300'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Standard Base64 (RFC 4648)"
            >
              <Hash className="w-3 h-3" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => setBase64Type('urlsafe')}
              className={`min-h-[48px] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                base64Type === 'urlsafe'
                  ? 'bg-cyan-500/30 text-cyan-300'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="URL-safe Base64 (- and _ instead of + and /)"
            >
              <Link className="w-3 h-3" />
              <span>URL-safe</span>
            </button>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-medium text-sm">
                {mode === 'encode' ? 'Input Text' : 'Base64 Input'}
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="min-h-[32px] px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </div>
              </label>
            </div>

            {fileInfo && (
              <div className="mb-2 p-2 bg-white/5 rounded-lg flex items-center gap-2">
                {fileInfo.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-300 truncate flex-1">{fileInfo.name}</span>
                <span className="text-xs text-gray-500">({(fileInfo.size / 1024).toFixed(1)}KB)</span>
              </div>
            )}

            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setFileInfo(null) }}
              placeholder={mode === 'encode' 
                ? 'Enter text, paste, or drop a file...' 
                : 'Enter Base64 string...'}
              className="w-full h-40 sm:h-48 p-3 bg-white/10 border border-white/20 rounded-xl text-white 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-400 
                         transition-colors resize-none font-mono text-sm"
              spellCheck={false}
            />

            {!input && (
              <button
                onClick={() => setInput(sampleTexts[mode])}
                className="mt-2 text-xs text-gray-500 hover:text-white transition-all"
              >
                Try with sample
              </button>
            )}
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-medium text-sm">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </label>
              <div className="flex gap-2">
                {mode === 'decode' && output && (
                  <button
                    onClick={handleDownload}
                    className="min-h-[32px] px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                )}
                {output && (
                  <button
                    onClick={handleCopy}
                    className={`min-h-[32px] px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
                      copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-40 sm:h-48 p-3 bg-black/30 border border-white/10 rounded-xl text-white 
                         placeholder-gray-500 resize-none font-mono text-sm cursor-text"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Statistics */}
        {(input || output) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{stats.inputChars.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Input chars</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{stats.outputChars.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Output chars</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{(stats.inputBytes / 1024).toFixed(1)}</p>
              <p className="text-xs text-gray-400">Input KB</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-cyan-400">{stats.ratio}%</p>
              <p className="text-xs text-gray-400">Size ratio</p>
            </div>
          </div>
        )}

        {/* Data URI Section */}
        {dataUri && mode === 'encode' && (
          <div className="mb-4 p-4 bg-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium text-sm">Data URI</span>
              <button
                onClick={handleCopyDataUri}
                className={`min-h-[32px] px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
                  copiedDataUri ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {copiedDataUri ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDataUri ? 'Copied!' : 'Copy URI'}</span>
              </button>
            </div>
            <code className="text-xs text-gray-400 break-all block bg-black/30 p-2 rounded">
              {dataUri.slice(0, 100)}...
            </code>
          </div>
        )}

        {/* Clear button */}
        {(input || output) && (
          <div className="flex justify-center">
            <button
              onClick={handleClear}
              className="min-h-[48px] px-6 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                       hover:text-white transition-all text-sm"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 p-4 bg-black/30 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">Image Preview</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-64 rounded-lg mx-auto"
              onError={() => setImagePreview(null)}
            />
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Base64 encoding increases size by ~33% • URL-safe variant uses - and _ instead of + and /
        </p>
      </div>
    </div>
  )
}