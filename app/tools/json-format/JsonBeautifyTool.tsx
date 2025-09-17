'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { 
  Braces, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Minimize2, 
  Maximize2 
} from 'lucide-react'

// ========== Type Definitions ==========
type ProcessMode = 'beautify' | 'minify'

interface JsonStats {
  keys: number
  arrays: number
  objects: number
  size: number
}

interface ProcessResult {
  success: boolean
  output: string
  error?: string
}

// ========== Constants ==========
const SAMPLE_JSON = {
  name: "AI AutoSite",
  version: "1.0.0",
  description: "Instant tools for developers",
  features: [
    "JSON Beautify",
    "Text Case Converter",
    "Code Analysis"
  ],
  settings: {
    theme: "dark",
    autoSave: true,
    indentSize: 2
  },
  metadata: {
    created: "2024-01-01",
    updated: "2024-12-31",
    author: {
      name: "Developer",
      email: "dev@example.com"
    }
  }
}

const INDENT_OPTIONS = [2, 4, 8] as const
const MESSAGE_TIMEOUT = 2000

// ========== Utility Functions ==========
const processJsonData = (
  text: string, 
  mode: ProcessMode, 
  indentSize: number
): ProcessResult => {
  if (!text.trim()) {
    return { success: true, output: '' }
  }

  try {
    const parsed = JSON.parse(text)
    const output = mode === 'beautify' 
      ? JSON.stringify(parsed, null, indentSize)
      : JSON.stringify(parsed)
    
    return { 
      success: true, 
      output 
    }
  } catch (err) {
    return { 
      success: false, 
      output: '',
      error: `Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  }
}

const calculateJsonStats = (jsonString: string): JsonStats => {
  try {
    if (!jsonString) {
      return { keys: 0, arrays: 0, objects: 0, size: 0 }
    }

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
      size
    }
  } catch {
    return { keys: 0, arrays: 0, objects: 0, size: 0 }
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`
  }
  return `${bytes}B`
}

// ========== Sub Components ==========
interface MessageDisplayProps {
  error?: string
  success?: string
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ error, success }) => {
  if (!error && !success) return <div className="h-12 mb-4" />
  
  return (
    <div className="h-12 mb-4">
      {error && (
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-3 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}
    </div>
  )
}

interface StatsDisplayProps {
  stats: JsonStats
  className?: string
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, className = "" }) => (
  <div className={className}>
    <div className="text-center">
      <p className="text-xl font-bold text-green-400">{stats.keys}</p>
      <p className="text-xs text-gray-500">Keys</p>
    </div>
    <div className="text-center">
      <p className="text-xl font-bold text-emerald-400">{stats.arrays}</p>
      <p className="text-xs text-gray-500">Arrays</p>
    </div>
    <div className="text-center">
      <p className="text-xl font-bold text-cyan-400">{stats.objects}</p>
      <p className="text-xs text-gray-500">Objects</p>
    </div>
    <div className="text-center">
      <p className="text-xl font-bold text-blue-400">
        {formatFileSize(stats.size)}
      </p>
      <p className="text-xs text-gray-500">Size</p>
    </div>
  </div>
)

// ========== Main Component ==========
export default function JsonBeautify() {
  // State management
  const [inputJson, setInputJson] = useState('')
  const [outputJson, setOutputJson] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState<2 | 4 | 8>(2)
  const [mode, setMode] = useState<ProcessMode>('beautify')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimeoutRef = useRef<NodeJS.Timeout>()
  const copiedTimeoutRef = useRef<NodeJS.Timeout>()

  // Memoized calculations
  const stats = useMemo(() => calculateJsonStats(outputJson), [outputJson])

  // Clear timeouts on unmount
  const clearTimeouts = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current)
    }
  }, [])

  // Process JSON with proper cleanup
  const processJson = useCallback((
    text: string, 
    currentMode: ProcessMode = mode, 
    currentIndent: number = indentSize
  ) => {
    clearTimeouts()
    setError('')
    setSuccess('')
    
    const result = processJsonData(text, currentMode, currentIndent)
    
    if (result.success) {
      setOutputJson(result.output)
      if (result.output) {
        setSuccess('JSON is valid!')
        successTimeoutRef.current = setTimeout(() => setSuccess(''), MESSAGE_TIMEOUT)
      }
    } else {
      setOutputJson('')
      setError(result.error || '')
    }
  }, [mode, indentSize, clearTimeouts])

  // Event handlers
  const handleInputChange = useCallback((text: string) => {
    setInputJson(text)
    processJson(text)
  }, [processJson])

  const handleModeChange = useCallback((newMode: ProcessMode) => {
    setMode(newMode)
    processJson(inputJson, newMode)
  }, [inputJson, processJson])

  const handleIndentChange = useCallback((size: 2 | 4 | 8) => {
    setIndentSize(size)
    if (mode === 'beautify') {
      processJson(inputJson, mode, size)
    }
  }, [inputJson, mode, processJson])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(outputJson)
      setCopied(true)
      
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), MESSAGE_TIMEOUT)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }, [outputJson])

  const handleClear = useCallback(() => {
    clearTimeouts()
    setInputJson('')
    setOutputJson('')
    setError('')
    setSuccess('')
  }, [clearTimeouts])

  const handleDownload = useCallback(() => {
    const blob = new Blob([outputJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-${mode === 'beautify' ? 'beautified' : 'minified'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [outputJson, mode])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        handleInputChange(text)
      }
      reader.onerror = () => {
        setError('Failed to read file')
      }
      reader.readAsText(file)
    }
  }, [handleInputChange])

  const loadSample = useCallback(() => {
    handleInputChange(JSON.stringify(SAMPLE_JSON))
  }, [handleInputChange])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Braces className="w-10 h-10 text-green-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                JSON Beautify
              </h1>
              <p className="text-gray-400 mt-1">Format, validate, and minify JSON instantly</p>
            </div>
          </div>
          
          {/* Desktop Stats */}
          {outputJson && (
            <StatsDisplay 
              stats={stats} 
              className="hidden sm:flex items-center space-x-4" 
            />
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mode selection */}
            <div className="flex gap-2">
              <button
                onClick={() => handleModeChange('beautify')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  mode === 'beautify'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
                <span>Beautify</span>
              </button>
              <button
                onClick={() => handleModeChange('minify')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  mode === 'minify'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Minimize2 className="w-4 h-4" />
                <span>Minify</span>
              </button>
            </div>

            {/* Indent size */}
            {mode === 'beautify' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Indent:</span>
                <div className="flex gap-1">
                  {INDENT_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleIndentChange(size)}
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
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={loadSample}
                className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                Load Sample
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
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

        {/* Messages */}
        <MessageDisplay error={error} success={success} />

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Editor */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">Input JSON</h3>
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Clear all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={inputJson}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-96 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors resize-none font-mono text-sm"
              spellCheck={false}
              aria-label="JSON input"
            />
          </div>

          {/* Output Editor */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">
                {mode === 'beautify' ? 'Beautified' : 'Minified'} JSON
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!outputJson}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!outputJson}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Download JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={outputJson}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-96 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none font-mono text-sm"
              spellCheck={false}
              aria-label="JSON output"
            />
          </div>
        </div>

        {/* Mobile Stats */}
        {outputJson && (
          <div className="sm:hidden mt-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <StatsDisplay 
                stats={stats} 
                className="grid grid-cols-4 gap-2" 
              />
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 p-6 rounded-xl">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">JSON Validation</h3>
            <p className="text-gray-400 text-sm">Instant syntax checking</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 backdrop-blur-sm border border-emerald-500/20 p-6 rounded-xl">
            <Braces className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">Smart Formatting</h3>
            <p className="text-gray-400 text-sm">Beautify or minify instantly</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl">
            <Download className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">Export Ready</h3>
            <p className="text-gray-400 text-sm">Download formatted JSON</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            100% Private • No Data Stored • Works Offline
          </p>
        </div>
      </footer>
    </div>
  )
}