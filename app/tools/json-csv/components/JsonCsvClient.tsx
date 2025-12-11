'use client'

import { useState, useCallback } from 'react'
import {
  ArrowRightLeft,
  Download,
  Copy,
  Check,
  Upload,
  Trash2,
  FileJson,
  FileSpreadsheet,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Settings2,
} from 'lucide-react'

type ConversionMode = 'json-to-csv' | 'csv-to-json'
type FlattenStyle = 'dot' | 'underscore' | 'bracket'
type Delimiter = ',' | ';' | '\t' | '|'

interface ConversionResult {
  output: string
  preview: string[][]
  error?: string
  errorLine?: number
  stats?: {
    rows: number
    columns: number
  }
}

const DELIMITERS: { value: Delimiter; label: string }[] = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' },
]

const FLATTEN_STYLES: { value: FlattenStyle; label: string; example: string }[] = [
  { value: 'dot', label: 'Dot Notation', example: 'user.address.city' },
  { value: 'underscore', label: 'Underscore', example: 'user_address_city' },
  { value: 'bracket', label: 'Bracket', example: 'user[address][city]' },
]

const vibrate = (duration: number = 30) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function JsonCsvClient() {
  const [mode, setMode] = useState<ConversionMode>('json-to-csv')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  
  // Options
  const [delimiter, setDelimiter] = useState<Delimiter>(',')
  const [flattenStyle, setFlattenStyle] = useState<FlattenStyle>('dot')
  const [addBom, setAddBom] = useState(false)
  const [unwindArrays, setUnwindArrays] = useState(false)

  // Flatten nested objects with selected style
  const flattenObject = useCallback((obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const value = obj[key]
      let newKey: string
      
      switch (flattenStyle) {
        case 'underscore':
          newKey = prefix ? `${prefix}_${key}` : key
          break
        case 'bracket':
          newKey = prefix ? `${prefix}[${key}]` : key
          break
        default: // dot
          newKey = prefix ? `${prefix}.${key}` : key
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, newKey))
      } else if (Array.isArray(value)) {
        if (unwindArrays && value.length > 0 && typeof value[0] !== 'object') {
          // Simple array: stringify
          acc[newKey] = JSON.stringify(value)
        } else {
          acc[newKey] = JSON.stringify(value)
        }
      } else {
        acc[newKey] = value
      }

      return acc
    }, {})
  }, [flattenStyle, unwindArrays])

  // JSON to CSV conversion
  const jsonToCsv = useCallback((jsonString: string): ConversionResult => {
    try {
      let data: any
      try {
        data = JSON.parse(jsonString)
      } catch (e: any) {
        // Try to find the error position
        const match = e.message.match(/position (\d+)/)
        const position = match ? parseInt(match[1]) : 0
        const lines = jsonString.substring(0, position).split('\n')
        const errorLine = lines.length
        
        return {
          output: '',
          preview: [],
          error: `JSON syntax error: ${e.message}`,
          errorLine,
        }
      }

      // Handle single object
      if (!Array.isArray(data)) {
        data = [data]
      }

      if (data.length === 0) {
        return {
          output: '',
          preview: [],
          error: 'Empty data array',
        }
      }

      // Flatten all objects
      const flatData = data.map((item: any) => flattenObject(item))

      // Get all unique headers
      const headers = Array.from(new Set(flatData.flatMap((item: any) => Object.keys(item)))) as string[]

      // Create CSV rows
      const csvRows: string[][] = []
      csvRows.push(headers)

      flatData.forEach((item: any) => {
        const row = headers.map((header) => {
          const value = item[header]
          if (value === null || value === undefined) return ''

          const stringValue = String(value)
          // Escape quotes and wrap in quotes if contains delimiter or newline
          if (stringValue.includes(delimiter) || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvRows.push(row)
      })

      // Convert to CSV string
      let csvString = csvRows.map((row) => row.join(delimiter)).join('\n')
      
      // Add BOM for Excel compatibility
      if (addBom) {
        csvString = '\ufeff' + csvString
      }

      return {
        output: csvString,
        preview: csvRows.slice(0, 6),
        stats: {
          rows: csvRows.length - 1,
          columns: headers.length,
        },
      }
    } catch (error) {
      return {
        output: '',
        preview: [],
        error: error instanceof Error ? error.message : 'Invalid JSON',
      }
    }
  }, [delimiter, addBom, flattenObject])

  // CSV to JSON conversion
  const csvToJson = useCallback((csvString: string): ConversionResult => {
    try {
      const lines = csvString.trim().split('\n')

      if (lines.length < 2) {
        return {
          output: '',
          preview: [],
          error: 'Need at least header row and one data row',
        }
      }

      // Parse CSV line (handles quoted fields)
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]

          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"'
              i++
            } else {
              inQuotes = !inQuotes
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }

        result.push(current.trim())
        return result
      }

      const headers = parseCSVLine(lines[0])
      const rows = lines.slice(1).map((line) => parseCSVLine(line))

      // Convert to JSON objects
      const jsonData = rows.map((row) => {
        const obj: any = {}
        headers.forEach((header, index) => {
          const value = row[index] || ''

          // Try to parse numbers
          if (value && !isNaN(Number(value)) && value.trim() !== '') {
            obj[header] = Number(value)
          }
          // Try to parse booleans
          else if (value.toLowerCase() === 'true') {
            obj[header] = true
          } else if (value.toLowerCase() === 'false') {
            obj[header] = false
          }
          // Try to parse null
          else if (value.toLowerCase() === 'null') {
            obj[header] = null
          }
          // Try to parse arrays/objects
          else if ((value.startsWith('[') && value.endsWith(']')) || 
                   (value.startsWith('{') && value.endsWith('}'))) {
            try {
              obj[header] = JSON.parse(value)
            } catch {
              obj[header] = value
            }
          }
          // String value
          else {
            obj[header] = value
          }
        })
        return obj
      })

      const previewData = [headers, ...rows.slice(0, 5)]

      return {
        output: JSON.stringify(jsonData, null, 2),
        preview: previewData,
        stats: {
          rows: jsonData.length,
          columns: headers.length,
        },
      }
    } catch (error) {
      return {
        output: '',
        preview: [],
        error: error instanceof Error ? error.message : 'Invalid CSV',
      }
    }
  }, [delimiter])

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setResult({
        output: '',
        preview: [],
        error: 'Input is empty',
      })
      return
    }

    vibrate(30)
    const conversionResult = mode === 'json-to-csv' ? jsonToCsv(input) : csvToJson(input)
    setResult(conversionResult)
  }, [input, mode, jsonToCsv, csvToJson])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setResult({
        output: '',
        preview: [],
        error: 'File too large (max 10MB)',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setInput(text)
      vibrate(30)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const handleCopy = useCallback(async () => {
    if (result?.output) {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  const handleDownload = useCallback(() => {
    if (result?.output) {
      const ext = mode === 'json-to-csv' ? 'csv' : 'json'
      const mimeType = mode === 'json-to-csv' ? 'text/csv' : 'application/json'
      
      const blob = new Blob([result.output], { type: `${mimeType};charset=utf-8` })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `converted-${Date.now()}.${ext}`
      link.click()
      URL.revokeObjectURL(url)
      vibrate(30)
    }
  }, [result, mode])

  const handleClear = useCallback(() => {
    setInput('')
    setResult(null)
    vibrate(30)
  }, [])

  const handleSwitchMode = useCallback(() => {
    setMode((prev) => (prev === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv'))
    setInput('')
    setResult(null)
    vibrate(30)
  }, [])

  const loadSample = useCallback(() => {
    vibrate(30)
    if (mode === 'json-to-csv') {
      const sample = [
        { id: 1, name: 'John Doe', email: 'john@example.com', address: { city: 'New York', zip: '10001' } },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: { city: 'Los Angeles', zip: '90001' } },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', address: { city: 'Chicago', zip: '60601' } },
      ]
      setInput(JSON.stringify(sample, null, 2))
    } else {
      const sample = `id,name,email,city
1,John Doe,john@example.com,New York
2,Jane Smith,jane@example.com,Los Angeles
3,Bob Johnson,bob@example.com,Chicago`
      setInput(sample)
    }
  }, [mode])

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All conversion happens locally in your browser. No data uploaded.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10">
          <button
            onClick={() => { if (mode !== 'json-to-csv') handleSwitchMode() }}
            className={`min-h-[44px] px-4 sm:px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              mode === 'json-to-csv'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span className="text-sm font-medium">JSON → CSV</span>
          </button>

          <ArrowRightLeft className="w-4 h-4 text-gray-400" />

          <button
            onClick={() => { if (mode !== 'csv-to-json') handleSwitchMode() }}
            className={`min-h-[44px] px-4 sm:px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              mode === 'csv-to-json'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm font-medium">CSV → JSON</span>
          </button>
        </div>
      </div>

      {/* Options Panel */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 mb-4">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full p-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm font-medium">Conversion Options</span>
          </div>
          {showOptions ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        
        {showOptions && (
          <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Delimiter */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">Delimiter</label>
                <div className="grid grid-cols-4 gap-1">
                  {DELIMITERS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDelimiter(d.value)}
                      className={`px-2 py-2 rounded text-xs transition-all ${
                        delimiter === d.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flatten Style (JSON to CSV only) */}
              {mode === 'json-to-csv' && (
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Nested Object Style</label>
                  <div className="grid grid-cols-3 gap-1">
                    {FLATTEN_STYLES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setFlattenStyle(s.value)}
                        className={`px-2 py-2 rounded text-xs transition-all ${
                          flattenStyle === s.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                        title={s.example}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            {mode === 'json-to-csv' && (
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBom}
                    onChange={(e) => setAddBom(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Add BOM for Excel</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {mode === 'json-to-csv' ? (
                <><FileJson className="w-5 h-5" /> JSON Input</>
              ) : (
                <><FileSpreadsheet className="w-5 h-5" /> CSV Input</>
              )}
            </h2>

            <div className="flex gap-2">
              <label className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                <Upload className="w-4 h-4 text-gray-400" />
                <input
                  type="file"
                  accept={mode === 'json-to-csv' ? '.json' : '.csv,.txt'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {input && (
                <button
                  onClick={handleClear}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'json-to-csv'
                ? 'Paste JSON here...\n\nExample:\n[{"name":"John","age":30}]'
                : 'Paste CSV here...\n\nExample:\nname,age\nJohn,30'
            }
            className="w-full h-64 sm:h-80 bg-black/30 border border-white/10 rounded-xl p-4 text-gray-300 text-sm font-mono resize-none focus:outline-none focus:border-purple-400 transition-colors"
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className="flex-1 min-h-[48px] px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Convert
            </button>

            <button
              onClick={loadSample}
              className="min-h-[48px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg font-medium hover:bg-white/10 transition-all"
            >
              Sample
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {mode === 'json-to-csv' ? (
                <><FileSpreadsheet className="w-5 h-5" /> CSV Output</>
              ) : (
                <><FileJson className="w-5 h-5" /> JSON Output</>
              )}
            </h2>

            {result?.output && !result.error && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`min-h-[44px] px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="min-h-[44px] px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Download</span>
                </button>
              </div>
            )}
          </div>

          {result?.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">Error</p>
                <p className="text-red-300 text-sm mt-1">{result.error}</p>
                {result.errorLine && (
                  <p className="text-red-400/70 text-xs mt-1">Near line {result.errorLine}</p>
                )}
              </div>
            </div>
          ) : result?.output ? (
            <div className="space-y-4">
              {/* Stats */}
              {result.stats && (
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{result.stats.rows} rows</span>
                  <span>{result.stats.columns} columns</span>
                </div>
              )}

              {/* Preview Table */}
              {result.preview.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Preview</p>
                  <div className="bg-black/30 rounded-xl p-3 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          {result.preview[0].map((header, i) => (
                            <th key={i} className="text-left text-gray-400 font-medium pb-2 pr-4 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.preview.slice(1).map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {row.map((cell, j) => (
                              <td key={j} className="text-gray-300 py-2 pr-4 whitespace-nowrap max-w-[150px] truncate">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Full Output */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Full Output</p>
                <div className="bg-black/30 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
                    {result.output.slice(0, 5000)}
                    {result.output.length > 5000 && '\n... (truncated)'}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500 text-sm">
              Output will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}