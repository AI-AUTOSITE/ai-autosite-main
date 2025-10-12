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
} from 'lucide-react'

type ConversionMode = 'json-to-csv' | 'csv-to-json'

interface ConversionResult {
  output: string
  preview: string[][]
  error?: string
}

export default function JsonCsvClient() {
  const [mode, setMode] = useState<ConversionMode>('json-to-csv')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [copied, setCopied] = useState(false)

  // JSON to CSV conversion
  const jsonToCsv = useCallback((jsonString: string): ConversionResult => {
    try {
      const data = JSON.parse(jsonString)

      // Handle single object
      if (!Array.isArray(data)) {
        return jsonToCsv(JSON.stringify([data]))
      }

      // Empty array check
      if (data.length === 0) {
        return {
          output: '',
          preview: [],
          error: 'Empty data',
        }
      }

      // Flatten nested objects
      const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
          const value = obj[key]
          const newKey = prefix ? `${prefix}.${key}` : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, newKey))
          } else if (Array.isArray(value)) {
            acc[newKey] = JSON.stringify(value)
          } else {
            acc[newKey] = value
          }

          return acc
        }, {})
      }

      // Flatten all objects
      const flatData = data.map((item) => flattenObject(item))

      // Get all unique headers
      const headers = Array.from(new Set(flatData.flatMap((item) => Object.keys(item))))

      // Create CSV
      const csvRows: string[][] = []

      // Add headers
      csvRows.push(headers)

      // Add data rows
      flatData.forEach((item) => {
        const row = headers.map((header) => {
          const value = item[header]
          if (value === null || value === undefined) return ''

          // Escape quotes and wrap in quotes if contains comma or newline
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvRows.push(row)
      })

      // Convert to CSV string
      const csvString = csvRows.map((row) => row.join(',')).join('\n')

      return {
        output: csvString,
        preview: csvRows.slice(0, 6), // Show first 5 rows + header
      }
    } catch (error) {
      return {
        output: '',
        preview: [],
        error: error instanceof Error ? error.message : 'Invalid JSON',
      }
    }
  }, [])

  // CSV to JSON conversion
  const csvToJson = useCallback((csvString: string): ConversionResult => {
    try {
      const lines = csvString.trim().split('\n')

      if (lines.length < 2) {
        return {
          output: '',
          preview: [],
          error: 'Need at least header and one row',
        }
      }

      // Parse CSV (simple parser, handles quoted fields)
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
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }

        result.push(current.trim())
        return result
      }

      // Parse all lines
      const headers = parseCSVLine(lines[0])
      const rows = lines.slice(1).map((line) => parseCSVLine(line))

      // Convert to JSON objects
      const jsonData = rows.map((row) => {
        const obj: any = {}
        headers.forEach((header, index) => {
          const value = row[index] || ''

          // Try to parse numbers
          if (value && !isNaN(Number(value))) {
            obj[header] = Number(value)
          }
          // Try to parse booleans
          else if (value.toLowerCase() === 'true') {
            obj[header] = true
          } else if (value.toLowerCase() === 'false') {
            obj[header] = false
          }
          // Try to parse arrays
          else if (value.startsWith('[') && value.endsWith(']')) {
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

      // Create preview table
      const previewData = [headers, ...rows.slice(0, 5)]

      return {
        output: JSON.stringify(jsonData, null, 2),
        preview: previewData,
      }
    } catch (error) {
      return {
        output: '',
        preview: [],
        error: error instanceof Error ? error.message : 'Invalid CSV',
      }
    }
  }, [])

  // Handle conversion
  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setResult({
        output: '',
        preview: [],
        error: 'Input is empty',
      })
      return
    }

    const conversionResult = mode === 'json-to-csv' ? jsonToCsv(input) : csvToJson(input)
    setResult(conversionResult)
  }, [input, mode, jsonToCsv, csvToJson])

  // Handle file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setResult({
          output: '',
          preview: [],
          error: 'File too large (max 5MB)',
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setInput(text)
      }
      reader.readAsText(file)
    },
    []
  )

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!result?.output) return

    await navigator.clipboard.writeText(result.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  // Download file
  const handleDownload = useCallback(() => {
    if (!result?.output) return

    const extension = mode === 'json-to-csv' ? 'csv' : 'json'
    const mimeType = mode === 'json-to-csv' ? 'text/csv' : 'application/json'

    const blob = new Blob([result.output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${Date.now()}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }, [result, mode])

  // Clear all
  const handleClear = useCallback(() => {
    setInput('')
    setResult(null)
    setCopied(false)
  }, [])

  // Switch mode
  const handleSwitchMode = useCallback(() => {
    setMode((prev) => (prev === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv'))
    setInput('')
    setResult(null)
    setCopied(false)
  }, [])

  // Sample data
  const loadSample = useCallback(() => {
    if (mode === 'json-to-csv') {
      const sample = [
        { id: 1, name: 'John', age: 30, city: 'New York' },
        { id: 2, name: 'Jane', age: 25, city: 'Los Angeles' },
        { id: 3, name: 'Bob', age: 35, city: 'Chicago' },
      ]
      setInput(JSON.stringify(sample, null, 2))
    } else {
      const sample = `id,name,age,city
1,John,30,New York
2,Jane,25,Los Angeles
3,Bob,35,Chicago`
      setInput(sample)
    }
  }, [mode])

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Mode Switcher */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10">
          <button
            onClick={() => {
              if (mode !== 'json-to-csv') handleSwitchMode()
            }}
            className={`min-h-[44px] px-4 sm:px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              mode === 'json-to-csv'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span className="text-sm font-medium">JSON to CSV</span>
          </button>

          <ArrowRightLeft className="w-4 h-4 text-gray-400" />

          <button
            onClick={() => {
              if (mode !== 'csv-to-json') handleSwitchMode()
            }}
            className={`min-h-[44px] px-4 sm:px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              mode === 'csv-to-json'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm font-medium">CSV to JSON</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {mode === 'json-to-csv' ? (
                <>
                  <FileJson className="w-5 h-5" />
                  JSON Input
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-5 h-5" />
                  CSV Input
                </>
              )}
            </h2>

            <div className="flex gap-2">
              <label className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                <Upload className="w-4 h-4 text-gray-400" />
                <input
                  type="file"
                  accept={mode === 'json-to-csv' ? '.json' : '.csv'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {input && (
                <button
                  onClick={handleClear}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                  aria-label="Clear"
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
              className="flex-1 min-h-[48px] px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                <>
                  <FileSpreadsheet className="w-5 h-5" />
                  CSV Output
                </>
              ) : (
                <>
                  <FileJson className="w-5 h-5" />
                  JSON Output
                </>
              )}
            </h2>

            {result?.output && !result.error && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`min-h-[44px] px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">Copy</span>
                    </>
                  )}
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
              </div>
            </div>
          ) : result?.output ? (
            <div className="space-y-4">
              {/* Preview Table */}
              {result.preview.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Preview</p>
                  <div className="bg-black/30 rounded-xl p-3 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          {result.preview[0].map((header, i) => (
                            <th
                              key={i}
                              className="text-left text-gray-400 font-medium pb-2 pr-4 whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.preview.slice(1).map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {row.map((cell, j) => (
                              <td key={j} className="text-gray-300 py-2 pr-4 whitespace-nowrap">
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
                    {result.output}
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

      {/* Info */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>All processing happens in your browser. No data is uploaded.</p>
      </div>
    </div>
  )
}