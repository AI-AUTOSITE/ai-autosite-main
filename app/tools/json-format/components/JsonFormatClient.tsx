'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Minimize2,
  Maximize2,
} from 'lucide-react'

type ProcessMode = 'beautify' | 'minify'

interface JsonStats {
  keys: number
  arrays: number
  objects: number
  size: number
}

const SAMPLE_JSON = {
  name: 'AI AutoSite',
  version: '1.0.0',
  features: ['JSON Format', 'Text Tools'],
  settings: {
    theme: 'dark',
    indentSize: 2,
  },
}

const INDENT_OPTIONS = [2, 4, 8] as const

const processJsonData = (text: string, mode: ProcessMode, indentSize: number) => {
  if (!text.trim()) return { success: true, output: '' }

  try {
    const parsed = JSON.parse(text)
    const output =
      mode === 'beautify' ? JSON.stringify(parsed, null, indentSize) : JSON.stringify(parsed)
    return { success: true, output }
  } catch (err) {
    return {
      success: false,
      output: '',
      error: err instanceof Error ? err.message : 'Invalid JSON',
    }
  }
}

const calculateStats = (jsonString: string): JsonStats => {
  try {
    if (!jsonString) return { keys: 0, arrays: 0, objects: 0, size: 0 }

    const parsed = JSON.parse(jsonString)
    const stringified = JSON.stringify(parsed, null, 0)
    const keys = stringified.match(/"[^"]+"\s*:/g) || []
    const arrays = stringified.match(/\[/g) || []
    const objects = stringified.match(/\{/g) || []
    const size = new Blob([jsonString]).size

    return {
      keys: keys.length,
      arrays: arrays.length,
      objects: objects.length,
      size,
    }
  } catch {
    return { keys: 0, arrays: 0, objects: 0, size: 0 }
  }
}

export default function JsonFormatClient() {
  const [inputJson, setInputJson] = useState('')
  const [outputJson, setOutputJson] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState<2 | 4 | 8>(2)
  const [mode, setMode] = useState<ProcessMode>('beautify')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const stats = useMemo(() => calculateStats(outputJson), [outputJson])

  const processJson = useCallback(
    (text: string, currentMode: ProcessMode = mode, currentIndent: number = indentSize) => {
      setError('')
      setSuccess('')

      const result = processJsonData(text, currentMode, currentIndent)

      if (result.success) {
        setOutputJson(result.output)
        if (result.output) {
          setSuccess('Valid JSON')
          setTimeout(() => setSuccess(''), 2000)
        }
      } else {
        setOutputJson('')
        setError(result.error || '')
      }
    },
    [mode, indentSize]
  )

  const handleInputChange = useCallback(
    (text: string) => {
      setInputJson(text)
      processJson(text)
    },
    [processJson]
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(outputJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed')
    }
  }, [outputJson])

  const handleDownload = useCallback(() => {
    const blob = new Blob([outputJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [outputJson])

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const text = event.target?.result as string
          handleInputChange(text)
        }
        reader.readAsText(file)
      }
    },
    [handleInputChange]
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Control Panel */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <div className="flex flex-col gap-3">
          {/* Mode buttons - Always horizontal */}
          <div className="flex flex-row gap-2">
            <button
              onClick={() => {
                setMode('beautify')
                processJson(inputJson, 'beautify')
              }}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all min-h-[48px] ${
                mode === 'beautify'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Maximize2 className="w-5 h-5" />
              <span className="font-medium">Pretty</span>
            </button>
            <button
              onClick={() => {
                setMode('minify')
                processJson(inputJson, 'minify')
              }}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all min-h-[48px] ${
                mode === 'minify'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Minimize2 className="w-5 h-5" />
              <span className="font-medium">Small</span>
            </button>
          </div>

          {/* Indent and Actions - Separate row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Indent for beautify */}
            {mode === 'beautify' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Spaces:</span>
                <div className="flex gap-2">
                  {INDENT_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setIndentSize(size)
                        processJson(inputJson, 'beautify', size)
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-all min-h-[44px] min-w-[44px] ${
                        indentSize === size
                          ? 'bg-cyan-500 text-white font-medium'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleInputChange(JSON.stringify(SAMPLE_JSON))}
                className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-sm min-h-[44px]"
              >
                Example
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center space-x-2 min-h-[44px]"
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Compact */}
      {(error || success) && (
        <div className="mb-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Input</h3>
            <button
              onClick={() => {
                setInputJson('')
                setOutputJson('')
                setError('')
                setSuccess('')
              }}
              className="text-gray-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 sm:h-80 lg:h-96 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Output</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputJson}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Copy"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputJson}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <textarea
            value={outputJson}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-64 sm:h-80 lg:h-96 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats - Mobile friendly */}
      {outputJson && (
        <div className="mt-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.keys}</div>
                <div className="text-xs text-gray-400 mt-1">Keys</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {stats.arrays}
                </div>
                <div className="text-xs text-gray-400 mt-1">Arrays</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">{stats.objects}</div>
                <div className="text-xs text-gray-400 mt-1">Objects</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {stats.size > 1024 ? `${(stats.size / 1024).toFixed(1)}KB` : `${stats.size}B`}
                </div>
                <div className="text-xs text-gray-400 mt-1">Size</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}