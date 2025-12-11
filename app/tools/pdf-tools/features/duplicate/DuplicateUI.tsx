// app/tools/pdf-tools/features/duplicate/DuplicateUI.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Info, ArrowRight, Layers } from 'lucide-react'
import { DuplicateOptions, DuplicateMode, DuplicateHandler } from './DuplicateHandler'

interface DuplicateUIProps {
  selectedCount: number
  totalPages: number
  onApply: (options: DuplicateOptions) => void
  onCancel: () => void
}

export function DuplicateUI({
  selectedCount,
  totalPages,
  onApply,
  onCancel,
}: DuplicateUIProps) {
  const [copyCount, setCopyCount] = useState(1)
  const [mode, setMode] = useState<DuplicateMode>('afterOriginal')
  const [interleavePattern, setInterleavePattern] = useState<'consecutive' | 'alternating'>('consecutive')

  // Calculate resulting page count
  const resultingPages = DuplicateHandler.calculateResultingPageCount(
    totalPages,
    selectedCount,
    { copyCount, mode, interleavePattern }
  )

  const handleApply = () => {
    onApply({
      copyCount,
      mode,
      interleavePattern,
    })
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      } else if (e.key === 'Enter' && !e.shiftKey) {
        handleApply()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [copyCount, mode, interleavePattern])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Copy className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Duplicate Pages</h2>
              <p className="text-sm text-gray-400">
                {selectedCount} page{selectedCount > 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Copy Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Copies
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={copyCount}
                onChange={(e) => setCopyCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={copyCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val >= 1 && val <= 99) {
                      setCopyCount(val)
                    }
                  }}
                  className="w-16 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-gray-400 text-sm">copies</span>
              </div>
            </div>
            {copyCount > 10 && (
              <p className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Large copy count may increase processing time
              </p>
            )}
          </div>

          {/* Insertion Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Insertion Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition group">
                <input
                  type="radio"
                  name="mode"
                  value="afterOriginal"
                  checked={mode === 'afterOriginal'}
                  onChange={() => setMode('afterOriginal')}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-800"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">After Original</div>
                  <div className="text-xs text-gray-400">
                    Insert copies right after each selected page
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  1→1,1,1
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition group">
                <input
                  type="radio"
                  name="mode"
                  value="atEnd"
                  checked={mode === 'atEnd'}
                  onChange={() => setMode('atEnd')}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-800"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">At End</div>
                  <div className="text-xs text-gray-400">
                    Append all copies at the end of document
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  1,2→1,2,1,1
                </div>
              </label>
            </div>
          </div>

          {/* Interleave Pattern (only show when atEnd is selected and multiple pages) */}
          {mode === 'atEnd' && selectedCount > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Copy Pattern
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInterleavePattern('consecutive')}
                  className={`p-3 rounded-lg border-2 transition ${
                    interleavePattern === 'consecutive'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm mb-1">Consecutive</div>
                  <div className="text-xs text-gray-400 font-mono">A,A,B,B</div>
                </button>
                <button
                  onClick={() => setInterleavePattern('alternating')}
                  className={`p-3 rounded-lg border-2 transition ${
                    interleavePattern === 'alternating'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-medium text-sm mb-1">Alternating</div>
                  <div className="text-xs text-gray-400 font-mono">A,B,A,B</div>
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Result Preview</span>
              <Layers className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalPages}</div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{resultingPages}</div>
                <div className="text-xs text-gray-500">After</div>
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm text-green-400">
                  +{resultingPages - totalPages} pages
                </span>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-xs text-gray-500 mb-2">Page sequence example:</div>
              <div className="flex flex-wrap gap-1">
                {generatePreviewSequence(selectedCount, copyCount, mode, interleavePattern).map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-xs font-mono ${
                      item.isCopy
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
                {resultingPages > 8 && (
                  <span className="px-2 py-0.5 text-xs text-gray-500">...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-900/50 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate preview sequence
function generatePreviewSequence(
  selectedCount: number,
  copyCount: number,
  mode: DuplicateMode,
  pattern: 'consecutive' | 'alternating'
): Array<{ label: string; isCopy: boolean }> {
  const result: Array<{ label: string; isCopy: boolean }> = []
  const maxItems = 8

  // For simplicity, assume pages 1 and 2 are selected if selectedCount >= 2
  const selectedPages = Array.from({ length: Math.min(selectedCount, 2) }, (_, i) => i + 1)

  if (mode === 'afterOriginal') {
    for (const page of selectedPages) {
      result.push({ label: `P${page}`, isCopy: false })
      for (let c = 0; c < Math.min(copyCount, 2); c++) {
        result.push({ label: `P${page}'`, isCopy: true })
      }
      if (result.length >= maxItems) break
    }
  } else if (mode === 'atEnd') {
    // Original pages
    for (const page of selectedPages) {
      result.push({ label: `P${page}`, isCopy: false })
    }

    // Copies
    if (pattern === 'consecutive') {
      for (const page of selectedPages) {
        for (let c = 0; c < Math.min(copyCount, 2); c++) {
          if (result.length >= maxItems) break
          result.push({ label: `P${page}'`, isCopy: true })
        }
        if (result.length >= maxItems) break
      }
    } else {
      for (let c = 0; c < Math.min(copyCount, 2); c++) {
        for (const page of selectedPages) {
          if (result.length >= maxItems) break
          result.push({ label: `P${page}'`, isCopy: true })
        }
        if (result.length >= maxItems) break
      }
    }
  }

  return result.slice(0, maxItems)
}

export default DuplicateUI
