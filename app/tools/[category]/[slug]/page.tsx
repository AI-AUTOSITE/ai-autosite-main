// app/tools/[category]/[slug]/page.tsx
// Individual Tool Page - Dynamic routing with category and slug

'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import UnifiedToolLayout from '@/components/common/UnifiedToolLayout'
import { AlertCircle } from 'lucide-react'
import { TOOLS } from '@/lib/categories'

// ========================================
// Props interface for Next.js 14 App Router
// ========================================
interface PageProps {
  params: {
    category: string
    slug: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// ========================================
// Main Tool Page Component
// ========================================
export default function ToolPage({ params, searchParams = {} }: PageProps) {
  const { category, slug } = params
  const [isLoading, setIsLoading] = useState(true)

  // Find tool by matching URL pattern: /tools/[category]/[slug]
  const tool = TOOLS.find((t) => {
    const urlPattern = `/tools/${category}/${slug}`
    return t.url === urlPattern
  })

  useEffect(() => {
    setIsLoading(false)
    
    // Show 404 if tool not found
    if (!tool) {
      console.warn(`Tool not found: /tools/${category}/${slug}`)
      notFound()
    }
  }, [category, slug, tool])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!tool) {
    return null // notFound() handles this
  }

  // Tool component mapping
  const getToolComponent = () => {
    const toolKey = `${category}/${slug}`
    
    switch (toolKey) {
      // ========================================
      // Quick Tools
      // ========================================
      case 'quick-tools/text-counter':
        return <TextCounterTool />
      
      case 'quick-tools/password-generator':
        return <PasswordGeneratorTool />
      
      // ========================================
      // Developer Tools
      // ========================================
      case 'dev-tools/json-formatter':
        return <JsonFormatterTool />
      
      case 'dev-tools/base64-encoder':
        return <Base64EncoderTool />
      
      // ========================================
      // Business Tools
      // ========================================
      case 'business/invoice-generator':
        return <InvoiceGeneratorTool />
      
      // ========================================
      // Add more tools here as you create them
      // ========================================
      
      default:
        return <ToolNotImplemented toolName={tool.name} category={category} slug={slug} />
    }
  }

  return (
    <UnifiedToolLayout
      toolId={slug}
      showSidebar={true}
      showCrossSell={true}
      containerWidth="xl"
    >
      {getToolComponent()}
    </UnifiedToolLayout>
  )
}

// ========================================
// Tool Components (Placeholders)
// Replace these with your actual implementations
// ========================================

function TextCounterTool() {
  const [text, setText] = useState('')

  const stats = {
    characters: text.length,
    words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    lines: text.split('\n').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Characters" value={stats.characters} color="cyan" />
        <StatCard label="Words" value={stats.words} color="purple" />
        <StatCard label="Lines" value={stats.lines} color="pink" />
        <StatCard label="Sentences" value={stats.sentences} color="green" />
      </div>
    </div>
  )
}

function PasswordGeneratorTool() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={generatePassword}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition-all"
      >
        Generate Password
      </button>

      {password && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <code className="text-lg text-white font-mono break-all">{password}</code>
            <button
              onClick={() => navigator.clipboard.writeText(password)}
              className="ml-4 text-sm text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function JsonFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "example", "value": 123}'
          className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none font-mono text-sm"
        />
      </div>

      <button
        onClick={formatJson}
        disabled={!input}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Format JSON
      </button>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Formatted JSON</label>
          <pre className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}

function Base64EncoderTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'Invalid input'}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mode === 'encode'
              ? 'bg-cyan-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mode === 'decode'
              ? 'bg-cyan-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
        />
      </div>

      <button
        onClick={process}
        disabled={!input}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Output</label>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <pre className="text-white whitespace-pre-wrap break-all text-sm">{output}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

function InvoiceGeneratorTool() {
  return <ToolNotImplemented toolName="Invoice Generator" category="business" slug="invoice-generator" />
}

// ========================================
// Helper Components
// ========================================

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    green: 'text-green-400',
  }

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function ToolNotImplemented({ toolName, category, slug }: { toolName: string; category: string; slug: string }) {
  return (
    <div className="flex items-start gap-3 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-lg font-medium text-yellow-400 mb-2">Tool Coming Soon</p>
        <p className="text-sm text-yellow-300 mb-1">
          <strong>{toolName}</strong> is registered but not yet implemented.
        </p>
        <p className="text-xs text-gray-400 mt-3">
          <strong>Tool ID:</strong> {category}/{slug}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Add the component implementation in the switch statement in page.tsx
        </p>
      </div>
    </div>
  )
}