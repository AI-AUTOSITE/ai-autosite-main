'use client'

import { useState, useRef } from 'react'
import { Type, Copy, Check, RefreshCw, Download, Upload } from 'lucide-react'

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [selectedCase, setSelectedCase] = useState('uppercase')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Case conversion functions
  const convertCase = (text: string, caseType: string) => {
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'title':
        return text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
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
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '')
      case 'snake_case':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join('_')
      case 'kebab-case':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join('-')
      case 'alternating':
        return text
          .split('')
          .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join('')
      case 'inverse':
        return text
          .split('')
          .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
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

  // Get stats
  const getStats = () => {
    const chars = inputText.length
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
    const lines = inputText ? inputText.split('\n').length : 0
    return { chars, words, lines }
  }

  const stats = getStats()

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
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Case Selection Grid - Tool First */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <h3 className="text-white font-medium mb-4">Select Case Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {caseOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCaseChange(option.value)}
              className={`p-3 rounded-lg border transition-all ${
                selectedCase === option.value
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <p className="font-medium text-sm">{option.label}</p>
              <p className="text-xs opacity-70 mt-1">{option.example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Input Text</h3>
            <div className="flex gap-3 text-sm text-gray-400">
              <span>{stats.chars} chars</span>
              <span>{stats.words} words</span>
              <span>{stats.lines} lines</span>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                     transition-colors resize-none font-mono text-sm"
            spellCheck={false}
          />

          {/* Input Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg 
                       hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
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
              className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg 
                       hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Converted Text</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all 
                          flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputText}
                className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-sm
                         hover:bg-white/10 transition-all flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <textarea
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            className="w-full h-64 p-4 bg-black/20 border border-white/10 rounded-xl 
                     text-gray-300 placeholder-gray-500 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {/* Info */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-3">Features</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <Type className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-gray-300 font-medium">10 Case Types</p>
            <p className="text-gray-400 text-xs mt-1">Programming & text formats</p>
          </div>

          <div>
            <Copy className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-gray-300 font-medium">Instant Conversion</p>
            <p className="text-gray-400 text-xs mt-1">Real-time as you type</p>
          </div>

          <div>
            <Download className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-gray-300 font-medium">Export Options</p>
            <p className="text-gray-400 text-xs mt-1">Copy or download as .txt</p>
          </div>
        </div>
      </div>
    </div>
  )
}
