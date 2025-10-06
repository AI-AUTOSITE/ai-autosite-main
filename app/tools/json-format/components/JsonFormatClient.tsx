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
          setSuccess('✓ Valid JSON')
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
      setError('Cannot copy')
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
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mode buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('beautify')
                processJson(inputJson, 'beautify')
              }}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                mode === 'beautify'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Pretty</span>
            </button>
            <button
              onClick={() => {
                setMode('minify')
                processJson(inputJson, 'minify')
              }}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                mode === 'minify'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Minimize2 className="w-4 h-4" />
              <span>Small</span>
            </button>
          </div>

          {/* Indent for beautify */}
          {mode === 'beautify' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Spaces:</span>
              {INDENT_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setIndentSize(size)
                    processJson(inputJson, 'beautify', size)
                  }}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    indentSize === size
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleInputChange(JSON.stringify(SAMPLE_JSON))}
              className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              Try Sample
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
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

      {/* Messages - Compact */}
      {(error || success) && (
        <div className="mb-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Your JSON</h3>
            <button
              onClick={() => {
                setInputJson('')
                setOutputJson('')
                setError('')
                setSuccess('')
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-96 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Result</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputJson}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputJson}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={outputJson}
            readOnly
            placeholder="Your formatted JSON will appear here..."
            className="w-full h-96 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats - Inline when output exists */}
      {outputJson && (
        <div className="mt-4 flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 px-6 py-2 flex items-center space-x-6">
            <div className="text-center">
              <span className="text-green-400 font-bold">{stats.keys}</span>
              <span className="text-gray-400 text-xs ml-1">keys</span>
            </div>
            <div className="text-center">
              <span className="text-emerald-400 font-bold">{stats.arrays}</span>
              <span className="text-gray-400 text-xs ml-1">arrays</span>
            </div>
            <div className="text-center">
              <span className="text-cyan-400 font-bold">{stats.objects}</span>
              <span className="text-gray-400 text-xs ml-1">objects</span>
            </div>
            <div className="text-center">
              <span className="text-blue-400 font-bold">
                {stats.size > 1024 ? `${(stats.size / 1024).toFixed(1)}KB` : `${stats.size}B`}
              </span>
              <span className="text-gray-400 text-xs ml-1">size</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
