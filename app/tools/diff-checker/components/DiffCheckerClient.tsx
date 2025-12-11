'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  Copy, Check, GitCompare, Plus, Minus, Equal,
  Lock, ChevronDown, ChevronUp, Settings, Trash2, Download
} from 'lucide-react'

// ===== TYPES =====
interface DiffLine {
  type: 'add' | 'remove' | 'unchanged'
  content: string
  lineNumber: { left?: number; right?: number }
}

interface DiffStats {
  additions: number
  deletions: number
  unchanged: number
}

// ===== DIFF ALGORITHM =====
function computeDiff(text1: string, text2: string, ignoreWhitespace: boolean, ignoreCase: boolean): DiffLine[] {
  let lines1 = text1.split('\n')
  let lines2 = text2.split('\n')
  
  // Preprocessing based on options
  const preprocess = (line: string) => {
    let result = line
    if (ignoreWhitespace) result = result.replace(/\s+/g, ' ').trim()
    if (ignoreCase) result = result.toLowerCase()
    return result
  }
  
  const processedLines1 = lines1.map(preprocess)
  const processedLines2 = lines2.map(preprocess)
  
  // LCS-based diff using Myers algorithm (simplified)
  const m = lines1.length
  const n = lines2.length
  
  // Build LCS table
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (processedLines1[i - 1] === processedLines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // Backtrack to build diff
  const diff: DiffLine[] = []
  let i = m, j = n
  const tempDiff: DiffLine[] = []
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && processedLines1[i - 1] === processedLines2[j - 1]) {
      tempDiff.push({
        type: 'unchanged',
        content: lines1[i - 1],
        lineNumber: { left: i, right: j }
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempDiff.push({
        type: 'add',
        content: lines2[j - 1],
        lineNumber: { right: j }
      })
      j--
    } else {
      tempDiff.push({
        type: 'remove',
        content: lines1[i - 1],
        lineNumber: { left: i }
      })
      i--
    }
  }
  
  return tempDiff.reverse()
}

function computeStats(diff: DiffLine[]): DiffStats {
  return {
    additions: diff.filter(d => d.type === 'add').length,
    deletions: diff.filter(d => d.type === 'remove').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length
  }
}

// ===== MAIN COMPONENT =====
export default function DiffCheckerClient() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  
  // Compute diff
  const diff = useMemo(() => {
    if (!text1 && !text2) return []
    return computeDiff(text1, text2, ignoreWhitespace, ignoreCase)
  }, [text1, text2, ignoreWhitespace, ignoreCase])
  
  // Statistics
  const stats = useMemo(() => computeStats(diff), [diff])
  
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
  
  // Clear all
  const clearAll = useCallback(() => {
    setText1('')
    setText2('')
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])
  
  // Swap texts
  const swapTexts = useCallback(() => {
    const temp = text1
    setText1(text2)
    setText2(temp)
    if (navigator.vibrate) navigator.vibrate(30)
  }, [text1, text2])
  
  // Export diff as text
  const exportDiff = useCallback(() => {
    const output = diff.map(line => {
      const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '
      return `${prefix} ${line.content}`
    }).join('\n')
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diff.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [diff])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All comparison done locally in your browser
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="inline-flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'split' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'unified' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Unified
            </button>
          </div>
          
          {/* Options Toggle */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-lg border transition-colors ${
              showOptions ? 'bg-violet-500/20 border-violet-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Stats */}
            {diff.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <Plus className="w-4 h-4" />{stats.additions}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <Minus className="w-4 h-4" />{stats.deletions}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Equal className="w-4 h-4" />{stats.unchanged}
                </span>
              </div>
            )}
            
            <button
              onClick={swapTexts}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-sm transition-colors"
            >
              Swap
            </button>
            <button
              onClick={clearAll}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {diff.length > 0 && (
              <button
                onClick={exportDiff}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                title="Export diff"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Options Panel */}
        {showOptions && (
          <div className="mb-6 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-300">Ignore whitespace</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-300">Ignore case</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Input Areas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-sm font-medium text-gray-300">Original Text</span>
              <span className="text-xs text-gray-500">{text1.split('\n').length} lines</span>
            </div>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-48 bg-transparent px-4 py-3 outline-none resize-none font-mono text-sm"
              spellCheck={false}
            />
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-sm font-medium text-gray-300">Modified Text</span>
              <span className="text-xs text-gray-500">{text2.split('\n').length} lines</span>
            </div>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full h-48 bg-transparent px-4 py-3 outline-none resize-none font-mono text-sm"
              spellCheck={false}
            />
          </div>
        </div>
        
        {/* Diff Output */}
        {diff.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-sm font-medium text-gray-300">Differences</span>
              <span className="text-xs text-gray-500">{diff.length} lines compared</span>
            </div>
            
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              {viewMode === 'split' ? (
                <table className="w-full">
                  <tbody>
                    {diff.map((line, index) => (
                      <tr key={index} className={`border-b border-white/5 ${
                        line.type === 'add' ? 'bg-green-500/10' :
                        line.type === 'remove' ? 'bg-red-500/10' : ''
                      }`}>
                        <td className="px-2 py-1 text-xs text-gray-500 w-12 text-right border-r border-white/10">
                          {line.lineNumber.left || ''}
                        </td>
                        <td className={`px-3 py-1 font-mono text-sm whitespace-pre w-1/2 ${
                          line.type === 'remove' ? 'text-red-400' : 'text-gray-300'
                        }`}>
                          {line.type === 'remove' || line.type === 'unchanged' ? line.content : ''}
                        </td>
                        <td className="px-2 py-1 text-xs text-gray-500 w-12 text-right border-l border-r border-white/10">
                          {line.lineNumber.right || ''}
                        </td>
                        <td className={`px-3 py-1 font-mono text-sm whitespace-pre w-1/2 ${
                          line.type === 'add' ? 'text-green-400' : 'text-gray-300'
                        }`}>
                          {line.type === 'add' || line.type === 'unchanged' ? line.content : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="font-mono text-sm">
                  {diff.map((line, index) => (
                    <div
                      key={index}
                      className={`px-4 py-1 border-b border-white/5 flex ${
                        line.type === 'add' ? 'bg-green-500/10' :
                        line.type === 'remove' ? 'bg-red-500/10' : ''
                      }`}
                    >
                      <span className={`w-6 flex-shrink-0 ${
                        line.type === 'add' ? 'text-green-400' :
                        line.type === 'remove' ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                      </span>
                      <span className={`whitespace-pre ${
                        line.type === 'add' ? 'text-green-400' :
                        line.type === 'remove' ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {line.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {diff.length === 0 && (text1 || text2) && (
          <div className="text-center py-12 text-gray-500">
            <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Enter text in both fields to see differences</p>
          </div>
        )}
        
        {/* No Changes */}
        {diff.length > 0 && stats.additions === 0 && stats.deletions === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400">No differences found — texts are identical</span>
            </div>
          </div>
        )}
      </div>
  )
}
