'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Copy,
  Upload,
  Check,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Smartphone,
} from 'lucide-react'

type Mode = 'encode' | 'decode'

// Vibration helper
const vibrate = (duration: number) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function Base64Client() {
  const [isMobile, setIsMobile] = useState(false)
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(
    null
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Encode text to Base64
  const encodeText = useCallback((text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch (err) {
      throw new Error('Failed to encode')
    }
  }, [])

  // Decode Base64 to text
  const decodeText = useCallback((base64: string): string => {
    try {
      const cleaned = base64.replace(/\s/g, '')
      return decodeURIComponent(escape(atob(cleaned)))
    } catch (err) {
      throw new Error('Invalid Base64')
    }
  }, [])

  // Check if string is valid Base64
  const isBase64 = (str: string): boolean => {
    if (str === '') return false
    try {
      const cleaned = str.replace(/\s/g, '')
      return btoa(atob(cleaned)) === cleaned
    } catch {
      return false
    }
  }

  // Check if Base64 is an image
  const isBase64Image = (base64: string): boolean => {
    return base64.startsWith('data:image/') || (isBase64(base64) && base64.length > 100)
  }

  // Process input
  const processInput = useCallback(() => {
    setError('')
    setImagePreview(null)

    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeText(input)
        setOutput(encoded)
      } else {
        if (input.startsWith('data:')) {
          const base64Part = input.split(',')[1]
          const decoded = decodeText(base64Part)
          setOutput(decoded)

          if (input.startsWith('data:image/')) {
            setImagePreview(input)
          }
        } else {
          const decoded = decodeText(input)
          setOutput(decoded)

          if (isBase64Image(input)) {
            try {
              const formats = ['jpeg', 'png', 'gif', 'webp']
              for (const format of formats) {
                const dataUrl = `data:image/${format};base64,${input}`
                setImagePreview(dataUrl)
                break
              }
            } catch {
              // Not an image
            }
          }
        }
      }
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Processing failed')
      vibrate(50)
    }
  }, [input, mode, encodeText, decodeText])

  // Process on input or mode change
  useEffect(() => {
    processInput()
  }, [processInput])

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)')
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
            setInput(result)
            setOutput(result.split(',')[1] || '')

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
    } catch (err) {
      setError('Failed to read file')
      vibrate(50)
    }

    e.target.value = ''
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy')
      vibrate(50)
    }
  }

  // Clear all
  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setFileInfo(null)
    setImagePreview(null)
    vibrate(30)
  }

  // Sample texts
  const sampleTexts = {
    encode: 'Hello, World!',
    decode: 'SGVsbG8sIFdvcmxkIQ==',
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-indigo-300 font-medium text-sm">Mobile Optimized</p>
            <p className="text-indigo-400/70 text-xs mt-1 leading-relaxed">
              Encode and decode Base64 - Works offline - Max 5MB files
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Mode Selector - Mobile friendly */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/10 rounded-xl p-1 w-full sm:w-auto">
            <button
              onClick={() => {
                setMode('encode')
                handleClear()
              }}
              className={`flex-1 sm:flex-none min-h-[48px] px-4 sm:px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 ${
                mode === 'encode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xs sm:text-base">Text</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-base">B64</span>
            </button>
            <button
              onClick={() => {
                setMode('decode')
                handleClear()
              }}
              className={`flex-1 sm:flex-none min-h-[48px] px-4 sm:px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 ${
                mode === 'decode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xs sm:text-base">B64</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-base">Text</span>
            </button>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-medium text-sm">
                {mode === 'encode' ? 'Input' : 'Base64'}
              </label>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept={mode === 'encode' ? '*' : '.txt'}
                  />
                  <div className="min-h-[32px] px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>File</span>
                  </div>
                </label>
                {input && (
                  <button
                    onClick={() => setInput(sampleTexts[mode])}
                    className="min-h-[32px] px-3 py-1.5 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                  >
                    Sample
                  </button>
                )}
              </div>
            </div>

            {fileInfo && (
              <div className="mb-2 p-2 bg-white/5 rounded-lg flex items-center gap-2">
                {fileInfo.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-300 truncate flex-1">{fileInfo.name}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  ({(fileInfo.size / 1024).toFixed(1)}KB)
                </span>
              </div>
            )}

            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setFileInfo(null)
              }}
              placeholder={
                mode === 'encode'
                  ? 'Enter text or upload file...\n\nExample: Hello, World!'
                  : 'Enter Base64 string...\n\nExample: SGVsbG8sIFdvcmxkIQ=='
              }
              className="w-full h-40 sm:h-48 p-3 bg-white/10 border border-white/20 rounded-xl text-white 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-400 
                         transition-colors resize-none font-mono text-sm hover:bg-white/15"
              spellCheck={false}
              autoFocus={!isMobile}
            />

            {/* Quick sample button */}
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
                {mode === 'encode' ? 'Base64' : 'Output'}
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className={`min-h-[32px] px-3 py-1.5 text-xs rounded transition-all flex items-center gap-1 active:scale-95 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
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

        {/* Clear button - 48px minimum */}
        {(input || output) && (
          <div className="flex justify-center">
            <button
              onClick={handleClear}
              className="min-h-[48px] px-6 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                       hover:text-white transition-all text-sm active:scale-95"
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

      {/* Mobile tip */}
      {isMobile && (
        <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-indigo-300 text-xs text-center leading-relaxed">
            All processing happens on your device - No data sent anywhere
          </p>
        </div>
      )}

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        Base64 is encoding, not encryption - Output about 33% larger than input
      </p>
    </div>
  )
}