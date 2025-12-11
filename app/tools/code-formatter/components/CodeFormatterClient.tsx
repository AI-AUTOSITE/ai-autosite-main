'use client'

import { useState, useCallback, useMemo } from 'react'
import { Copy, Check, Lock, Code2, Minimize2, Maximize2, Trash2 } from 'lucide-react'

// ===== TYPES =====
type Language = 'json' | 'html' | 'css' | 'javascript' | 'xml'

interface FormatOptions {
  indentSize: number
  useTabs: boolean
}

// ===== FORMATTERS =====
function formatJSON(code: string, indent: number): string {
  try {
    const parsed = JSON.parse(code)
    return JSON.stringify(parsed, null, indent)
  } catch (e) {
    throw new Error('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'))
  }
}

function minifyJSON(code: string): string {
  try {
    const parsed = JSON.parse(code)
    return JSON.stringify(parsed)
  } catch (e) {
    throw new Error('Invalid JSON')
  }
}

function formatHTML(code: string, indent: number): string {
  const indentStr = ' '.repeat(indent)
  let formatted = ''
  let indentLevel = 0
  
  const lines = code.replace(/>\s*</g, '>\n<').split('\n')
  
  for (let line of lines) {
    line = line.trim()
    if (!line) continue
    
    if (line.match(/^<\//) || line.match(/^<[^>]+\/>/)) {
      if (line.match(/^<\//)) indentLevel = Math.max(0, indentLevel - 1)
    }
    
    formatted += indentStr.repeat(indentLevel) + line + '\n'
    
    if (line.match(/^<[^\/!][^>]*[^\/]>$/) && !line.match(/<(br|hr|img|input|meta|link)/i)) {
      indentLevel++
    }
  }
  
  return formatted.trim()
}

function formatCSS(code: string, indent: number): string {
  const indentStr = ' '.repeat(indent)
  
  let formatted = code
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/;\s*/g, ';\n')
    .replace(/,\s*/g, ',\n')
  
  const lines = formatted.split('\n')
  let result = ''
  let inBlock = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    if (trimmed === '}') {
      inBlock = false
      result += trimmed + '\n\n'
    } else if (trimmed.endsWith('{')) {
      result += trimmed + '\n'
      inBlock = true
    } else if (inBlock) {
      result += indentStr + trimmed + '\n'
    } else {
      result += trimmed + '\n'
    }
  }
  
  return result.trim()
}

function minifyCSS(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>+~])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim()
}

function formatJS(code: string, indent: number): string {
  const indentStr = ' '.repeat(indent)
  let formatted = ''
  let indentLevel = 0
  let inString = false
  let stringChar = ''
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i]
    const prev = code[i - 1]
    
    if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
      }
    }
    
    if (inString) {
      formatted += char
      continue
    }
    
    if (char === '{' || char === '[') {
      formatted += char + '\n' + indentStr.repeat(++indentLevel)
    } else if (char === '}' || char === ']') {
      formatted += '\n' + indentStr.repeat(--indentLevel) + char
    } else if (char === ';') {
      formatted += ';\n' + indentStr.repeat(indentLevel)
    } else if (char === ',') {
      formatted += ',\n' + indentStr.repeat(indentLevel)
    } else if (char === '\n' || char === '\r') {
      // Skip
    } else {
      formatted += char
    }
  }
  
  return formatted.replace(/\n\s*\n/g, '\n').trim()
}

// ===== MAIN COMPONENT =====
export default function CodeFormatterClient() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<Language>('json')
  const [indentSize, setIndentSize] = useState(2)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formatCode = useCallback(() => {
    setError(null)
    try {
      let formatted = ''
      switch (language) {
        case 'json':
          formatted = formatJSON(code, indentSize)
          break
        case 'html':
        case 'xml':
          formatted = formatHTML(code, indentSize)
          break
        case 'css':
          formatted = formatCSS(code, indentSize)
          break
        case 'javascript':
          formatted = formatJS(code, indentSize)
          break
      }
      setCode(formatted)
      if (navigator.vibrate) navigator.vibrate(30)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Format error')
    }
  }, [code, language, indentSize])
  
  const minifyCode = useCallback(() => {
    setError(null)
    try {
      let minified = ''
      switch (language) {
        case 'json':
          minified = minifyJSON(code)
          break
        case 'css':
          minified = minifyCSS(code)
          break
        default:
          minified = code.replace(/\s+/g, ' ').trim()
      }
      setCode(minified)
      if (navigator.vibrate) navigator.vibrate(30)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Minify error')
    }
  }, [code, language])
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [code])
  
  const clearCode = useCallback(() => {
    setCode('')
    setError(null)
  }, [])
  
  const stats = useMemo(() => ({
    lines: code.split('\n').length,
    chars: code.length,
    size: new Blob([code]).size,
  }), [code])

  const languages: { value: Language; label: string }[] = [
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'xml', label: 'XML' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All formatting done locally in your browser
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-sky-500/50"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-sky-500/50"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        
        <div className="flex-1" />
        
        <button
          onClick={formatCode}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
        >
          <Maximize2 className="w-4 h-4" /> Format
        </button>
        <button
          onClick={minifyCode}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
        >
          <Minimize2 className="w-4 h-4" /> Minify
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!code}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={clearCode}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {/* Editor */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-sm text-gray-400">{language.toUpperCase()}</span>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{stats.lines} lines</span>
            <span>{stats.chars.toLocaleString()} chars</span>
            <span>{(stats.size / 1024).toFixed(2)} KB</span>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(null) }}
          placeholder={`Paste your ${language.toUpperCase()} code here...`}
          className="w-full h-[500px] bg-transparent px-4 py-4 outline-none resize-none font-mono text-sm"
          spellCheck={false}
        />
      </div>
      
      {/* Tips */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-sky-500/10 rounded-xl border border-sky-500/20">
          <h3 className="font-medium text-sky-400 mb-2">💡 Format Tips</h3>
          <p className="text-sm text-gray-400">Format adds proper indentation and line breaks to make code readable.</p>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <h3 className="font-medium text-purple-400 mb-2">📦 Minify Tips</h3>
          <p className="text-sm text-gray-400">Minify removes whitespace to reduce file size for production use.</p>
        </div>
      </div>
    </div>
  )
}