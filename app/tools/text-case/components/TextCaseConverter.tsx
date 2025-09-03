'use client'

import { useState, useRef } from 'react'
import { Type, Copy, Check, RefreshCw, Download, Upload, Sparkles } from 'lucide-react'

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [selectedCase, setSelectedCase] = useState('uppercase')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Case conversion functions
  const convertCase = (text: string, caseType: string) => {
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      case 'sentence':
        return text.replace(/(^\w|\.\s+\w)/gm, (letter) => letter.toUpperCase())
      case 'camelCase':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '')
      case 'PascalCase':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '')
      case 'snake_case':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_')
      case 'kebab-case':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-')
      case 'alternating':
        return text
          .split('')
          .map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join('')
      case 'inverse':
        return text
          .split('')
          .map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase())
          .join('')
      default:
        return text
    }
  }

  // Handle text input and conversion
  const handleTextChange = (text: string) => {
    setInputText(text)
    const converted = convertCase(text, selectedCase)
    setOutputText(converted)
    
    // Update stats
    setStats({
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text ? text.split('\n').length : 0
    })
  }

  // Handle case type change
  const handleCaseChange = (caseType: string) => {
    setSelectedCase(caseType)
    const converted = convertCase(inputText, caseType)
    setOutputText(converted)
  }

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Clear all
  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setStats({ chars: 0, words: 0, lines: 0 })
  }

  // Download as text file
  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${selectedCase}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Upload text file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        handleTextChange(text)
      }
      reader.readAsText(file)
    }
  }

  const caseOptions = [
    { value: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
    { value: 'lowercase', label: 'lowercase', example: 'hello world' },
    { value: 'title', label: 'Title Case', example: 'Hello World' },
    { value: 'sentence', label: 'Sentence case', example: 'Hello world.' },
    { value: 'camelCase', label: 'camelCase', example: 'helloWorld' },
    { value: 'PascalCase', label: 'PascalCase', example: 'HelloWorld' },
    { value: 'snake_case', label: 'snake_case', example: 'hello_world' },
    { value: 'kebab-case', label: 'kebab-case', example: 'hello-world' },
    { value: 'alternating', label: 'aLtErNaTiNg', example: 'hElLo WoRlD' },
    { value: 'inverse', label: 'iNVERSE', example: 'hELLO wORLD' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Stats */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Type className="w-10 h-10 text-cyan-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Text Case Converter
              </h1>
              <p className="text-gray-400 mt-1">Convert text between different cases instantly</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{stats.chars}</p>
              <p className="text-xs text-gray-500">Characters</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-400">{stats.words}</p>
              <p className="text-xs text-gray-500">Words</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-pink-400">{stats.lines}</p>
              <p className="text-xs text-gray-500">Lines</p>
            </div>
          </div>
        </div>
             {/* Case options */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Select Case Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleCaseChange(option.value)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedCase === option.value
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs opacity-70 mt-1">{option.example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </button>
          
          <button
            onClick={handleCopy}
            disabled={!outputText}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!outputText}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        {/* Text areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Input Text</h3>
            <textarea
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter or paste your text here..."
              className="w-full h-80 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Converted Text</h3>
            <textarea
              value={outputText}
              readOnly
              placeholder="Converted text will appear here..."
              className="w-full h-80 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Mobile stats */}
        <div className="sm:hidden mt-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xl font-bold text-cyan-400">{stats.chars}</p>
                <p className="text-xs text-gray-500">Chars</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-400">{stats.words}</p>
                <p className="text-xs text-gray-500">Words</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-pink-400">{stats.lines}</p>
                <p className="text-xs text-gray-500">Lines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl">
            <Type className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">10 Case Types</h3>
            <p className="text-gray-400 text-sm">From simple to programming cases</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 p-6 rounded-xl">
            <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">Instant Conversion</h3>
            <p className="text-gray-400 text-sm">Real-time as you type</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-600/10 to-pink-600/5 backdrop-blur-sm border border-pink-500/20 p-6 rounded-xl">
            <Download className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="text-white font-semibold mb-2">Export Ready</h3>
            <p className="text-gray-400 text-sm">Download as text file</p>
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