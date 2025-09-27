'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, Upload, Check, Image as ImageIcon, FileText, ArrowRight, ArrowLeft } from 'lucide-react'

type Mode = 'encode' | 'decode'

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    return base64.startsWith('data:image/') || 
           (isBase64(base64) && base64.length > 100)
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
        // Check if it's a data URL
        if (input.startsWith('data:')) {
          const base64Part = input.split(',')[1]
          const decoded = decodeText(base64Part)
          setOutput(decoded)
          
          // If it's an image, show preview
          if (input.startsWith('data:image/')) {
            setImagePreview(input)
          }
        } else {
          const decoded = decodeText(input)
          setOutput(decoded)
          
          // Try to create image preview if it looks like image data
          if (isBase64Image(input)) {
            try {
              const formats = ['jpeg', 'png', 'gif', 'webp']
              for (const format of formats) {
                const dataUrl = `data:image/${format};base64,${input}`
                setImagePreview(dataUrl)
                break
              }
            } catch {
              // Not an image, ignore
            }
          }
        }
      }
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Processing failed')
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

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)')
      return
    }

    setError('')
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
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
      }

      if (mode === 'encode') {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    } catch (err) {
      setError('Failed to read file')
    }

    e.target.value = ''
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy')
    }
  }

  // Clear all
  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setFileInfo(null)
    setImagePreview(null)
  }

  // Sample texts for quick testing
  const sampleTexts = {
    encode: 'Hello, World!',
    decode: 'SGVsbG8sIFdvcmxkIQ=='
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Mode Selector - Simplified */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => {
                setMode('encode')
                handleClear()
              }}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                mode === 'encode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Text <ArrowRight className="w-4 h-4" /> Base64
            </button>
            <button
              onClick={() => {
                setMode('decode')
                handleClear()
              }}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                mode === 'decode'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Base64 <ArrowRight className="w-4 h-4" /> Text
            </button>
          </div>
        </div>

        {/* Input/Output Grid - Simplified for mobile */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-medium text-sm">
                {mode === 'encode' ? 'Input' : 'Base64'}
              </label>
              <div className="flex gap-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept={mode === 'encode' ? '*' : '.txt'}
                  />
                  <div className="px-2 py-1 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                    <Upload className="w-3 h-3 inline mr-1" />
                    File
                  </div>
                </label>
                {input && (
                  <button
                    onClick={() => setInput(sampleTexts[mode])}
                    className="px-2 py-1 text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
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
                <span className="text-xs text-gray-300 truncate">
                  {fileInfo.name}
                </span>
                <span className="text-xs text-gray-500">
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
              placeholder={mode === 'encode' 
                ? 'Enter text or upload file...\n\nExample: Hello, World!' 
                : 'Enter Base64 string...\n\nExample: SGVsbG8sIFdvcmxkIQ=='}
              className="w-full h-48 p-3 bg-white/10 border border-white/20 rounded-xl text-white 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-400 
                         transition-colors resize-none font-mono text-sm hover:bg-white/15"
              spellCheck={false}
              autoFocus
            />

            {/* Quick sample button */}
            {!input && (
              <button
                onClick={() => setInput(sampleTexts[mode])}
                className="mt-2 text-xs text-gray-500 hover:text-white transition-all"
              >
                Try with sample →
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
                  className={`px-2 py-1 text-xs rounded transition-all flex items-center gap-1 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-48 p-3 bg-black/30 border border-white/10 rounded-xl text-white 
                         placeholder-gray-500 resize-none font-mono text-sm cursor-text"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Clear button */}
        {(input || output) && (
          <div className="flex justify-center">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                       hover:text-white transition-all text-sm"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeIn">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Image Preview - Simplified */}
        {imagePreview && (
          <div className="mt-4 p-4 bg-black/30 rounded-xl animate-fadeIn">
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

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Base64 is encoding, not encryption • Output ~33% larger than input
      </p>
    </div>
  )
}