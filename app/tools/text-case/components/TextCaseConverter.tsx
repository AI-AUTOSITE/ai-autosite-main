'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { 
  Type, Copy, Check, RefreshCw, Download, Upload, 
  LayoutGrid, Columns, ChevronDown, ChevronUp,
  Code, FileText, Zap
} from 'lucide-react'

// ============================================
// Case Conversion Functions
// ============================================
const caseConverters = {
  uppercase: (text: string) => text.toUpperCase(),
  lowercase: (text: string) => text.toLowerCase(),
  title: (text: string) => 
    text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  sentence: (text: string) => {
    const lower = text.toLowerCase()
    return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())
  },
  camelCase: (text: string) => {
    const words = text.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
    return words.map((word, i) => 
      i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')
  },
  PascalCase: (text: string) => {
    const words = text.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')
  },
  snake_case: (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.toLowerCase())
      .join('_')
  },
  'kebab-case': (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.toLowerCase())
      .join('-')
  },
  CONSTANT_CASE: (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.toUpperCase())
      .join('_')
  },
  'dot.case': (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.toLowerCase())
      .join('.')
  },
  'Train-Case': (text: string) => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-')
  },
  alternating: (text: string) => 
    text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''),
  inverse: (text: string) => 
    text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
}

type CaseType = keyof typeof caseConverters

// ============================================
// Case Options Configuration
// ============================================
const basicCases: { value: CaseType; label: string; example: string; category: 'basic' }[] = [
  { value: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD', category: 'basic' },
  { value: 'lowercase', label: 'lowercase', example: 'hello world', category: 'basic' },
  { value: 'title', label: 'Title Case', example: 'Hello World', category: 'basic' },
  { value: 'sentence', label: 'Sentence case', example: 'Hello world.', category: 'basic' },
]

const developerCases: { value: CaseType; label: string; example: string; category: 'developer' }[] = [
  { value: 'camelCase', label: 'camelCase', example: 'helloWorld', category: 'developer' },
  { value: 'PascalCase', label: 'PascalCase', example: 'HelloWorld', category: 'developer' },
  { value: 'snake_case', label: 'snake_case', example: 'hello_world', category: 'developer' },
  { value: 'kebab-case', label: 'kebab-case', example: 'hello-world', category: 'developer' },
  { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE', example: 'HELLO_WORLD', category: 'developer' },
  { value: 'dot.case', label: 'dot.case', example: 'hello.world', category: 'developer' },
  { value: 'Train-Case', label: 'Train-Case', example: 'Hello-World', category: 'developer' },
]

const funCases: { value: CaseType; label: string; example: string; category: 'fun' }[] = [
  { value: 'alternating', label: 'aLtErNaTiNg', example: 'hElLo WoRlD', category: 'fun' },
  { value: 'inverse', label: 'iNVERSE', example: 'hELLO wORLD', category: 'fun' },
]

const allCaseOptions = [...basicCases, ...developerCases, ...funCases]

// ============================================
// Main Component
// ============================================
export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('')
  const [viewMode, setViewMode] = useState<'dashboard' | 'single'>('dashboard')
  const [selectedCase, setSelectedCase] = useState<CaseType>('uppercase')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showDevCases, setShowDevCases] = useState(true)
  const [showFunCases, setShowFunCases] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate all conversions at once (memoized for performance)
  const allConversions = useMemo(() => {
    if (!inputText.trim()) return {}
    const result: Record<CaseType, string> = {} as Record<CaseType, string>
    for (const key of Object.keys(caseConverters) as CaseType[]) {
      result[key] = caseConverters[key](inputText)
    }
    return result
  }, [inputText])

  // Get single conversion for single mode
  const singleOutput = useMemo(() => {
    if (!inputText.trim()) return ''
    return caseConverters[selectedCase](inputText)
  }, [inputText, selectedCase])

  // Copy to clipboard
  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  // Clear all
  const handleClear = () => {
    setInputText('')
  }

  // Download as text file
  const handleDownload = (text: string, caseType: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${caseType}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Download all conversions as JSON
  const handleDownloadAll = () => {
    const blob = new Blob([JSON.stringify(allConversions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-conversions.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Upload text file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setInputText(text)
      }
      reader.readAsText(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get stats
  const stats = useMemo(() => {
    const chars = inputText.length
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
    const lines = inputText ? inputText.split('\n').length : 0
    return { chars, words, lines }
  }, [inputText])

  // Render conversion result card
  const ConversionCard = ({ caseType, label, converted }: { caseType: CaseType; label: string; converted: string }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyan-400 font-medium text-sm">{label}</span>
        <button
          onClick={() => handleCopy(converted, caseType)}
          disabled={!converted}
          className={`p-2 rounded-lg transition-all ${
            copiedKey === caseType
              ? 'bg-green-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Copy"
        >
          {copiedKey === caseType ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-gray-300 font-mono text-sm break-all line-clamp-3 min-h-[3.75rem]">
        {converted || <span className="text-gray-600 italic">Enter text to convert</span>}
      </p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Mode Toggle & Privacy Badge */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 'dashboard'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">All-in-One</span>
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 'single'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden sm:inline">Single</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Your Text
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <span>{stats.chars.toLocaleString()} chars</span>
            <span>{stats.words.toLocaleString()} words</span>
            <span>{stats.lines.toLocaleString()} lines</span>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste your text here to see all conversions instantly..."
          className="w-full h-40 p-4 bg-black/20 border border-white/10 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                   transition-colors resize-none font-mono text-sm"
          spellCheck={false}
        />

        {/* Input Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg 
                     hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            <span>Upload .txt</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={handleClear}
            disabled={!inputText}
            className="px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg 
                     hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          {viewMode === 'dashboard' && inputText && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2.5 bg-cyan-600/20 text-cyan-400 rounded-lg 
                       hover:bg-cyan-600/30 transition-all flex items-center gap-2 text-sm font-medium ml-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download All (JSON)</span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard View - All Conversions */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Basic Cases */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-cyan-400" />
              Basic Text Cases
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {basicCases.map((opt) => (
                <ConversionCard
                  key={opt.value}
                  caseType={opt.value}
                  label={opt.label}
                  converted={allConversions[opt.value] || ''}
                />
              ))}
            </div>
          </div>

          {/* Developer Cases */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <button
              onClick={() => setShowDevCases(!showDevCases)}
              className="w-full flex justify-between items-center text-white font-medium mb-4"
            >
              <span className="flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Developer Cases
                <span className="text-xs text-gray-500 font-normal">(for coding)</span>
              </span>
              {showDevCases ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showDevCases && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {developerCases.map((opt) => (
                  <ConversionCard
                    key={opt.value}
                    caseType={opt.value}
                    label={opt.label}
                    converted={allConversions[opt.value] || ''}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Fun Cases */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <button
              onClick={() => setShowFunCases(!showFunCases)}
              className="w-full flex justify-between items-center text-white font-medium mb-4"
            >
              <span className="flex items-center gap-2">
                <span className="text-cyan-400">🎨</span>
                Fun Cases
                <span className="text-xs text-gray-500 font-normal">(for social media)</span>
              </span>
              {showFunCases ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showFunCases && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {funCases.map((opt) => (
                  <ConversionCard
                    key={opt.value}
                    caseType={opt.value}
                    label={opt.label}
                    converted={allConversions[opt.value] || ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single View - Original Style */}
      {viewMode === 'single' && (
        <>
          {/* Case Selection Grid */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
            <h3 className="text-white font-medium mb-4">Select Case Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {allCaseOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedCase(option.value)}
                  className={`p-3 rounded-lg border transition-all min-h-[70px] flex flex-col justify-center items-center ${
                    selectedCase === option.value
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium text-xs text-center">{option.label}</p>
                  <p className="text-[10px] opacity-70 mt-1 hidden sm:block text-center">{option.example}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h3 className="text-white font-medium">
                Result: <span className="text-cyan-400">{allCaseOptions.find(o => o.value === selectedCase)?.label}</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(singleOutput, 'single')}
                  disabled={!singleOutput}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all 
                            flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                              copiedKey === 'single'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                >
                  {copiedKey === 'single' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'single' ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownload(singleOutput, selectedCase)}
                  disabled={!singleOutput}
                  className="px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg font-medium text-sm
                           hover:bg-white/10 transition-all flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <textarea
              value={singleOutput}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-48 p-4 bg-black/20 border border-white/10 rounded-xl 
                       text-gray-300 placeholder-gray-500 resize-none font-mono text-sm"
            />
          </div>
        </>
      )}

      {/* Features Info */}
      <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">✨ Why Use This Tool?</h3>
        <div className="grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-200 font-medium">All-in-One View</p>
            </div>
            <p className="text-gray-400">See all 13 case conversions at once. No more clicking buttons one by one.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-200 font-medium">Developer Ready</p>
            </div>
            <p className="text-gray-400">camelCase, PascalCase, snake_case, CONSTANT_CASE, dot.case and more.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-200 font-medium">100% Private</p>
            </div>
            <p className="text-gray-400">All processing happens in your browser. Your text never leaves your device.</p>
          </div>
        </div>
      </div>
    </div>
  )
}