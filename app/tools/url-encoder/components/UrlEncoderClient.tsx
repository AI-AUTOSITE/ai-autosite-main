'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  Copy, Check, Link2, ArrowLeftRight, AlertTriangle, 
  Lock, ChevronDown, ChevronUp, Plus, Trash2, Info, Zap
} from 'lucide-react'

// ===== TYPES =====
interface QueryParam {
  key: string
  value: string
  id: string
}

interface UrlParts {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  valid: boolean
  error?: string
}

// ===== HELPER FUNCTIONS =====
function parseUrl(urlString: string): UrlParts {
  try {
    const url = new URL(urlString)
    return {
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      valid: true
    }
  } catch (e) {
    return {
      protocol: '',
      username: '',
      password: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      valid: false,
      error: 'Invalid URL format'
    }
  }
}

function parseQueryParams(search: string): QueryParam[] {
  if (!search || search === '?') return []
  
  const params = new URLSearchParams(search)
  const result: QueryParam[] = []
  let id = 0
  
  params.forEach((value, key) => {
    result.push({ key, value, id: `param-${id++}` })
  })
  
  return result
}

function detectDoubleEncoding(str: string): { detected: boolean; instances: string[] } {
  const matches = str.match(/%25[0-9A-Fa-f]{2}/g)
  return {
    detected: !!matches && matches.length > 0,
    instances: matches || []
  }
}

function generateId(): string {
  return `param-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ===== MAIN COMPONENT =====
export default function UrlEncoderClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [encodeMethod, setEncodeMethod] = useState<'component' | 'uri'>('component')
  const [copied, setCopied] = useState<string | null>(null)
  
  // URL Parser state
  const [showUrlParser, setShowUrlParser] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  
  // Query Builder state
  const [showQueryBuilder, setShowQueryBuilder] = useState(false)
  const [queryParams, setQueryParams] = useState<QueryParam[]>([])
  const [baseUrl, setBaseUrl] = useState('https://example.com/path')
  
  // Encode/Decode result
  const result = useMemo(() => {
    if (!input) return ''
    
    try {
      if (mode === 'encode') {
        return encodeMethod === 'component' 
          ? encodeURIComponent(input)
          : encodeURI(input)
      } else {
        return decodeURIComponent(input)
      }
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : 'Invalid input'}`
    }
  }, [input, mode, encodeMethod])
  
  // Double encoding detection
  const doubleEncodingWarning = useMemo(() => {
    if (mode !== 'encode') return null
    return detectDoubleEncoding(input)
  }, [input, mode])
  
  // URL parts parsing
  const urlParts = useMemo(() => {
    if (!urlInput) return null
    return parseUrl(urlInput)
  }, [urlInput])
  
  // Extract params from URL input
  const extractedParams = useMemo(() => {
    if (!urlParts?.valid) return []
    return parseQueryParams(urlParts.search)
  }, [urlParts])
  
  // Build URL from query params
  const builtUrl = useMemo(() => {
    if (queryParams.length === 0) return baseUrl
    
    const params = new URLSearchParams()
    queryParams.forEach(p => {
      if (p.key) params.append(p.key, p.value)
    })
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }, [queryParams, baseUrl])
  
  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(null), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [])
  
  // Add query param
  const addParam = useCallback(() => {
    setQueryParams(prev => [...prev, { key: '', value: '', id: generateId() }])
  }, [])
  
  // Update query param
  const updateParam = useCallback((id: string, field: 'key' | 'value', newValue: string) => {
    setQueryParams(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: newValue } : p
    ))
  }, [])
  
  // Remove query param
  const removeParam = useCallback((id: string) => {
    setQueryParams(prev => prev.filter(p => p.id !== id))
  }, [])
  
  // Load extracted params to builder
  const loadParamsToBuilder = useCallback(() => {
    setQueryParams(extractedParams.map(p => ({ ...p, id: generateId() })))
    try {
      const url = new URL(urlInput)
      setBaseUrl(`${url.protocol}//${url.host}${url.pathname}`)
    } catch {
      // Keep existing base URL
    }
    setShowQueryBuilder(true)
  }, [extractedParams, urlInput])
  
  // Swap input/output
  const swapInputOutput = useCallback(() => {
    setInput(result)
    setMode(prev => prev === 'encode' ? 'decode' : 'encode')
  }, [result])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All processing done locally in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Main Encoder/Decoder */}
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setMode('encode')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  mode === 'encode' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  mode === 'decode' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Decode
              </button>
            </div>
          </div>
            
            {/* Encoding Method (only for encode mode) */}
            {mode === 'encode' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Encoding Method</span>
                  <div className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEncodeMethod('component')}
                    className={`p-3 rounded-lg text-left transition-all ${
                      encodeMethod === 'component'
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-sm">encodeURIComponent</div>
                    <div className="text-xs text-gray-400 mt-1">For query parameter values</div>
                  </button>
                  <button
                    onClick={() => setEncodeMethod('uri')}
                    className={`p-3 rounded-lg text-left transition-all ${
                      encodeMethod === 'uri'
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-sm">encodeURI</div>
                    <div className="text-xs text-gray-400 mt-1">For complete URLs</div>
                  </button>
                </div>
                <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-blue-400">
                    {encodeMethod === 'component' 
                      ? 'Encodes all special characters including ; / ? : @ & = + $ , #'
                      : 'Preserves URL structure characters: ; / ? : @ & = + $ , #'
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                  {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
                </label>
                <button
                  onClick={() => setInput('')}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' 
                  ? 'Enter text to encode (e.g., hello world & goodbye)'
                  : 'Enter URL-encoded text (e.g., hello%20world)'
                }
                className="w-full h-32 bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 outline-none resize-none font-mono text-sm focus:border-emerald-500/50 transition-colors"
                spellCheck={false}
              />
              
              {/* Double encoding warning */}
              {doubleEncodingWarning?.detected && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-yellow-400 font-medium">Double encoding detected!</span>
                    <p className="text-xs text-yellow-400/80 mt-1">
                      Found {doubleEncodingWarning.instances.length} instance(s) of already-encoded characters. 
                      Consider decoding first.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapInputOutput}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                title="Swap input and output"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Output */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                  {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                </label>
                <button
                  onClick={() => copyToClipboard(result, 'result')}
                  className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                >
                  {copied === 'result' ? (
                    <><Check className="w-4 h-4 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </button>
              </div>
              <div className="min-h-[128px] p-4 bg-gray-800/50 rounded-xl font-mono text-sm break-all text-emerald-400">
                {result || <span className="text-gray-500">Result will appear here...</span>}
              </div>
            </div>
          </div>
          
          {/* Right Column - Tools */}
          <div className="space-y-4">
            {/* URL Parser */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowUrlParser(!showUrlParser)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">URL Structure Parser</span>
                </div>
                {showUrlParser ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showUrlParser && (
                <div className="p-4 pt-0 space-y-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste a URL to parse..."
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 outline-none font-mono text-sm focus:border-purple-500/50"
                  />
                  
                  {urlParts && urlParts.valid && (
                    <div className="space-y-2">
                      {[
                        { label: 'Protocol', value: urlParts.protocol },
                        { label: 'Hostname', value: urlParts.hostname },
                        { label: 'Port', value: urlParts.port },
                        { label: 'Pathname', value: urlParts.pathname },
                        { label: 'Query', value: urlParts.search },
                        { label: 'Hash', value: urlParts.hash },
                      ].filter(item => item.value).map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-xs text-gray-400">{item.label}</span>
                          <code className="text-xs text-purple-400 font-mono">{item.value}</code>
                        </div>
                      ))}
                      
                      {extractedParams.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Query Parameters ({extractedParams.length})</span>
                            <button
                              onClick={loadParamsToBuilder}
                              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Edit in Builder →
                            </button>
                          </div>
                          {extractedParams.map((param) => (
                            <div key={param.id} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded text-xs font-mono">
                              <span className="text-cyan-400">{param.key}</span>
                              <span className="text-gray-500">=</span>
                              <span className="text-green-400 truncate">{decodeURIComponent(param.value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {urlParts && !urlParts.valid && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <span className="text-sm text-red-400">{urlParts.error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Query Builder */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowQueryBuilder(!showQueryBuilder)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Query String Builder</span>
                </div>
                {showQueryBuilder ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showQueryBuilder && (
                <div className="p-4 pt-0 space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Base URL</label>
                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 outline-none font-mono text-sm focus:border-yellow-500/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Parameters</label>
                    {queryParams.map((param) => (
                      <div key={param.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                          placeholder="key"
                          className="flex-1 bg-gray-800/50 rounded-lg border border-white/10 px-2 py-1.5 outline-none font-mono text-xs focus:border-yellow-500/50"
                        />
                        <span className="text-gray-500">=</span>
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                          placeholder="value"
                          className="flex-1 bg-gray-800/50 rounded-lg border border-white/10 px-2 py-1.5 outline-none font-mono text-xs focus:border-yellow-500/50"
                        />
                        <button
                          onClick={() => removeParam(param.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addParam}
                      className="w-full p-2 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Parameter
                    </button>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-400">Generated URL</label>
                      <button
                        onClick={() => copyToClipboard(builtUrl, 'built-url')}
                        className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
                      >
                        {copied === 'built-url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copy
                      </button>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg font-mono text-xs text-yellow-400 break-all">
                      {builtUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Reference */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Common Encodings</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { char: 'Space', encoded: '%20 or +' },
                  { char: '!', encoded: '%21' },
                  { char: '#', encoded: '%23' },
                  { char: '$', encoded: '%24' },
                  { char: '&', encoded: '%26' },
                  { char: "'", encoded: '%27' },
                  { char: '(', encoded: '%28' },
                  { char: ')', encoded: '%29' },
                  { char: '*', encoded: '%2A' },
                  { char: '+', encoded: '%2B' },
                  { char: '/', encoded: '%2F' },
                  { char: '=', encoded: '%3D' },
                  { char: '?', encoded: '%3F' },
                  { char: '@', encoded: '%40' },
                ].map((item) => (
                  <div key={item.char} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">{item.char}</span>
                    <span className="text-emerald-400">{item.encoded}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-emerald-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-4">
              <h3 className="text-sm font-medium text-emerald-400 mb-2">💡 When to use which?</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-emerald-400">encodeURIComponent:</strong> Use for query parameter values, form data</p>
                <p><strong className="text-emerald-400">encodeURI:</strong> Use for encoding full URLs while preserving structure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
