'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Scissors,
  X,
  Download,
  FileText,
  BookOpen,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileArchive,
  Split,
  Hash,
  Layers,
  Filter
} from 'lucide-react'
import { EnhancedSplitHandler as SplitHandler, Bookmark, SplitResult, BlankPageInfo } from './EnhancedSplitHandler'

// Split modes
type SplitMode = 
  | 'extract'      // Extract selected pages
  | 'range'        // Split by range (1-3, 5, 7-10)
  | 'every'        // Split every N pages
  | 'single'       // Split into single pages
  | 'bookmark'     // Split by bookmarks/TOC
  | 'even'         // Extract even pages
  | 'odd'          // Extract odd pages
  | 'size'         // Split by file size
  | 'blank'        // Remove blank pages

interface SplitUIProps {
  totalPages: number
  selectedPages: Set<string>
  currentPages: Array<{ id: string; pageNumber: number; thumbnail: string }>
  onClose: () => void
  onSplit: (
    mode: SplitMode,
    options?: {
      range?: string
      everyN?: number
      bookmarkLevel?: number
      targetSizeMB?: number
      skipBlank?: boolean
    }
  ) => Promise<void>
  onDownloadResults: (results: SplitResult[]) => void
  file: File | null
}

// Color palette for visual feedback
const MODE_COLORS = {
  extract: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-400' },
  range: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-400' },
  every: { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-400' },
  single: { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-400' },
  bookmark: { bg: 'bg-green-500/20', border: 'border-green-400', text: 'text-green-400' },
  even: { bg: 'bg-pink-500/20', border: 'border-pink-400', text: 'text-pink-400' },
  odd: { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-400' },
  size: { bg: 'bg-red-500/20', border: 'border-red-400', text: 'text-red-400' },
  blank: { bg: 'bg-gray-500/20', border: 'border-gray-400', text: 'text-gray-400' },
}

export function SplitUI({
  totalPages,
  selectedPages,
  currentPages,
  onClose,
  onSplit,
  onDownloadResults,
  file
}: SplitUIProps) {
  // State
  const [mode, setMode] = useState<SplitMode>('extract')
  const [rangeInput, setRangeInput] = useState('')
  const [everyNInput, setEveryNInput] = useState(5)
  const [targetSizeMB, setTargetSizeMB] = useState(10)
  const [bookmarkLevel, setBookmarkLevel] = useState(0)
  const [skipBlankPages, setSkipBlankPages] = useState(false)
  
  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(false)
  const [bookmarkError, setBookmarkError] = useState<string | null>(null)
  
  // Blank pages state
  const [blankPages, setBlankPages] = useState<BlankPageInfo[]>([])
  const [loadingBlankPages, setLoadingBlankPages] = useState(false)
  const [blankPageThreshold, setBlankPageThreshold] = useState(98)
  
  // Preview state
  const [showPreview, setShowPreview] = useState(true)
  const [previewResults, setPreviewResults] = useState<{
    files: number
    pages: number[][]
    names: string[]
  } | null>(null)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Load bookmarks when mode changes to bookmark
  useEffect(() => {
    if (mode === 'bookmark' && file && bookmarks.length === 0) {
      loadBookmarks()
    }
  }, [mode, file])

  // Load blank page detection when mode changes to blank
  useEffect(() => {
    if (mode === 'blank' && file && blankPages.length === 0) {
      detectBlankPages()
    }
  }, [mode, file])

  // Update preview when relevant state changes
  useEffect(() => {
    updatePreview()
  }, [mode, rangeInput, everyNInput, selectedPages, bookmarkLevel, totalPages])

  const loadBookmarks = async () => {
    if (!file) return
    
    setLoadingBookmarks(true)
    setBookmarkError(null)
    
    try {
      const bm = await SplitHandler.getBookmarks(file)
      setBookmarks(bm)
      if (bm.length === 0) {
        setBookmarkError('No bookmarks/TOC found in this PDF')
      }
    } catch (error) {
      setBookmarkError('Failed to load bookmarks')
      console.error(error)
    } finally {
      setLoadingBookmarks(false)
    }
  }

  const detectBlankPages = async () => {
    if (!file) return
    
    setLoadingBlankPages(true)
    
    try {
      const threshold = blankPageThreshold / 100
      const info = await SplitHandler.detectBlankPages(file, threshold)
      setBlankPages(info)
    } catch (error) {
      console.error('Failed to detect blank pages:', error)
    } finally {
      setLoadingBlankPages(false)
    }
  }

  const updatePreview = useCallback(() => {
    if (!totalPages) return

    let pages: number[][] = []
    let names: string[] = []

    switch (mode) {
      case 'extract': {
        const selected = Array.from(selectedPages)
          .map(id => parseInt(id.split('-')[1]))
          .filter(n => !isNaN(n))
          .sort((a, b) => a - b)
        if (selected.length > 0) {
          pages = [selected]
          names = [`Selected_${selected.length}_pages.pdf`]
        }
        break
      }
      case 'range': {
        const ranges = SplitHandler.parseRanges(rangeInput)
        pages = ranges.map(r => r.filter(p => p >= 1 && p <= totalPages))
        names = pages.map((p, i) => `Range_${i + 1}.pdf`)
        break
      }
      case 'every': {
        for (let start = 1; start <= totalPages; start += everyNInput) {
          const end = Math.min(start + everyNInput - 1, totalPages)
          const pageArray: number[] = []
          for (let i = start; i <= end; i++) pageArray.push(i)
          pages.push(pageArray)
          names.push(`Pages_${start}-${end}.pdf`)
        }
        break
      }
      case 'single': {
        for (let i = 1; i <= totalPages; i++) {
          pages.push([i])
          names.push(`Page_${i}.pdf`)
        }
        break
      }
      case 'even': {
        const evenPages: number[] = []
        for (let i = 2; i <= totalPages; i += 2) evenPages.push(i)
        if (evenPages.length > 0) {
          pages = [evenPages]
          names = ['Even_pages.pdf']
        }
        break
      }
      case 'odd': {
        const oddPages: number[] = []
        for (let i = 1; i <= totalPages; i += 2) oddPages.push(i)
        if (oddPages.length > 0) {
          pages = [oddPages]
          names = ['Odd_pages.pdf']
        }
        break
      }
      case 'bookmark': {
        // Preview will be handled separately after bookmarks load
        if (bookmarks.length > 0) {
          const flatBookmarks = flattenBookmarksForPreview(bookmarks, bookmarkLevel)
          flatBookmarks.forEach((bm, i) => {
            const start = bm.pageNumber
            const end = i < flatBookmarks.length - 1 
              ? flatBookmarks[i + 1].pageNumber - 1 
              : totalPages
            const pageArray: number[] = []
            for (let p = start; p <= end; p++) pageArray.push(p)
            pages.push(pageArray)
            names.push(`${bm.title.substring(0, 30)}.pdf`)
          })
        }
        break
      }
      default:
        break
    }

    setPreviewResults({
      files: pages.length,
      pages,
      names
    })
  }, [mode, rangeInput, everyNInput, selectedPages, totalPages, bookmarks, bookmarkLevel])

  const flattenBookmarksForPreview = (bms: Bookmark[], level: number): Bookmark[] => {
    const result: Bookmark[] = []
    const traverse = (items: Bookmark[], currentLevel: number) => {
      for (const item of items) {
        if (currentLevel <= level) {
          result.push(item)
        }
        if (item.children && item.children.length > 0 && currentLevel < level) {
          traverse(item.children, currentLevel + 1)
        }
      }
    }
    traverse(bms, 0)
    return result.sort((a, b) => a.pageNumber - b.pageNumber)
  }

  const handleSplit = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      await onSplit(mode, {
        range: rangeInput,
        everyN: everyNInput,
        bookmarkLevel,
        targetSizeMB,
        skipBlank: skipBlankPages
      })
    } catch (error) {
      console.error('Split error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate blank pages count
  const blankPagesCount = useMemo(() => {
    return blankPages.filter(p => p.isBlank).length
  }, [blankPages])

  // Is mode valid for execution?
  const canExecute = useMemo(() => {
    switch (mode) {
      case 'extract':
        return selectedPages.size > 0
      case 'range':
        return rangeInput.trim().length > 0
      case 'every':
        return everyNInput > 0
      case 'bookmark':
        return bookmarks.length > 0
      case 'blank':
        return blankPagesCount > 0
      default:
        return true
    }
  }, [mode, selectedPages, rangeInput, everyNInput, bookmarks, blankPagesCount])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Scissors className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Split PDF</h2>
              <p className="text-sm text-gray-400">{totalPages} pages total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Browser-based
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Mode Selection Tabs */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Split Mode</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {/* Basic modes */}
              <ModeButton
                mode="extract"
                currentMode={mode}
                onClick={() => setMode('extract')}
                icon={<Layers className="w-4 h-4" />}
                label="Extract"
                description="Selected pages"
              />
              <ModeButton
                mode="range"
                currentMode={mode}
                onClick={() => setMode('range')}
                icon={<Hash className="w-4 h-4" />}
                label="Range"
                description="1-3, 5, 7-10"
              />
              <ModeButton
                mode="every"
                currentMode={mode}
                onClick={() => setMode('every')}
                icon={<Split className="w-4 h-4" />}
                label="Every N"
                description="Fixed interval"
              />
              <ModeButton
                mode="single"
                currentMode={mode}
                onClick={() => setMode('single')}
                icon={<FileText className="w-4 h-4" />}
                label="Single"
                description="Each page"
              />
              <ModeButton
                mode="bookmark"
                currentMode={mode}
                onClick={() => setMode('bookmark')}
                icon={<BookOpen className="w-4 h-4" />}
                label="Bookmark"
                description="By chapters"
                badge={bookmarks.length > 0 ? `${bookmarks.length}` : undefined}
              />
              <ModeButton
                mode="even"
                currentMode={mode}
                onClick={() => setMode('even')}
                icon={<Filter className="w-4 h-4" />}
                label="Even"
                description="2, 4, 6..."
              />
              <ModeButton
                mode="odd"
                currentMode={mode}
                onClick={() => setMode('odd')}
                icon={<Filter className="w-4 h-4" />}
                label="Odd"
                description="1, 3, 5..."
              />
              <ModeButton
                mode="blank"
                currentMode={mode}
                onClick={() => setMode('blank')}
                icon={<Trash2 className="w-4 h-4" />}
                label="Blank"
                description="Remove empty"
                badge={blankPagesCount > 0 ? `${blankPagesCount}` : undefined}
              />
              <ModeButton
                mode="size"
                currentMode={mode}
                onClick={() => setMode('size')}
                icon={<FileArchive className="w-4 h-4" />}
                label="Size"
                description="By MB"
              />
            </div>
          </div>

          {/* Mode-specific options */}
          <div className={`mb-6 p-4 rounded-lg ${MODE_COLORS[mode].bg} border ${MODE_COLORS[mode].border}`}>
            {mode === 'extract' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Extract Selected Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Click pages in the editor to select them, then extract as a new PDF.
                </p>
                {selectedPages.size > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedPages)
                      .map(id => parseInt(id.split('-')[1]))
                      .filter(n => !isNaN(n))
                      .sort((a, b) => a - b)
                      .map(page => (
                        <span key={page} className="px-2 py-1 bg-gray-700 rounded text-sm">
                          {page}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="text-amber-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No pages selected. Select pages in the editor first.
                  </p>
                )}
              </div>
            )}

            {mode === 'range' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Split by Page Range
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Enter page ranges separated by commas. Each range becomes a separate PDF.
                </p>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-10"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Format: "1-3" for range, "5" for single page, separate with commas
                </p>
              </div>
            )}

            {mode === 'every' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Split Every N Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Split the PDF into chunks of N pages each.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Every</span>
                  <input
                    type="number"
                    value={everyNInput}
                    onChange={(e) => setEveryNInput(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={totalPages}
                    className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:border-blue-400 focus:outline-none"
                  />
                  <span className="text-sm">pages</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Will create {Math.ceil(totalPages / everyNInput)} files
                </p>
              </div>
            )}

            {mode === 'single' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Split into Single Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Create {totalPages} individual PDFs, one for each page.
                </p>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-sm">
                    Output: <span className="text-orange-400">{totalPages} PDF files</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Files will be downloaded as a ZIP archive
                  </p>
                </div>
              </div>
            )}

            {mode === 'bookmark' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Split by Bookmarks/TOC
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Split PDF by chapters or sections defined in the document outline.
                </p>
                
                {loadingBookmarks ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading bookmarks...
                  </div>
                ) : bookmarkError ? (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {bookmarkError}
                    </p>
                  </div>
                ) : bookmarks.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm">Bookmark Level:</span>
                      <select
                        value={bookmarkLevel}
                        onChange={(e) => setBookmarkLevel(parseInt(e.target.value))}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value={0}>Level 1 (Top level only)</option>
                        <option value={1}>Level 1-2</option>
                        <option value={2}>Level 1-3</option>
                        <option value={3}>All levels</option>
                      </select>
                    </div>
                    <div className="max-h-48 overflow-y-auto bg-gray-800 rounded-lg p-2">
                      <BookmarkTree bookmarks={bookmarks} level={0} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={loadBookmarks}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                  >
                    Scan for Bookmarks
                  </button>
                )}
              </div>
            )}

            {mode === 'even' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Extract Even Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Extract pages 2, 4, 6, 8... from the PDF.
                </p>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-sm">
                    Will extract: <span className="text-pink-400">{Math.floor(totalPages / 2)} pages</span>
                  </p>
                </div>
              </div>
            )}

            {mode === 'odd' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Extract Odd Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Extract pages 1, 3, 5, 7... from the PDF.
                </p>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-sm">
                    Will extract: <span className="text-yellow-400">{Math.ceil(totalPages / 2)} pages</span>
                  </p>
                </div>
              </div>
            )}

            {mode === 'blank' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Remove Blank Pages
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Automatically detect and remove blank/empty pages.
                </p>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm">Threshold:</span>
                  <input
                    type="range"
                    value={blankPageThreshold}
                    onChange={(e) => {
                      setBlankPageThreshold(parseInt(e.target.value))
                      setBlankPages([]) // Reset to re-detect
                    }}
                    min={90}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{blankPageThreshold}%</span>
                </div>

                {loadingBlankPages ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning for blank pages...
                  </div>
                ) : blankPages.length > 0 ? (
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm mb-2">
                      Found <span className="text-red-400 font-medium">{blankPagesCount}</span> blank pages
                      {blankPagesCount > 0 && (
                        <span className="text-gray-400 ml-2">
                          (Pages: {blankPages.filter(p => p.isBlank).map(p => p.pageNumber).join(', ')})
                        </span>
                      )}
                    </p>
                    {blankPagesCount === 0 && (
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        No blank pages detected
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={detectBlankPages}
                    className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition"
                  >
                    Scan for Blank Pages
                  </button>
                )}
              </div>
            )}

            {mode === 'size' && (
              <div>
                <h3 className={`font-medium mb-2 ${MODE_COLORS[mode].text}`}>
                  Split by File Size
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Split PDF into chunks of approximately the target size.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Target size:</span>
                  <input
                    type="number"
                    value={targetSizeMB}
                    onChange={(e) => setTargetSizeMB(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={100}
                    className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:border-red-400 focus:outline-none"
                  />
                  <span className="text-sm">MB</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Actual sizes may vary. Useful for email attachment limits (25MB).
                </p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {previewResults && previewResults.files > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview ({previewResults.files} files)
              </button>
              
              {showPreview && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                    {previewResults.pages.slice(0, 12).map((pageGroup, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <div className="text-xs text-gray-400 mb-1 truncate">
                          {previewResults.names[idx]}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {pageGroup.slice(0, 8).map(page => (
                            <span
                              key={page}
                              className="px-1.5 py-0.5 bg-gray-600 rounded text-xs"
                            >
                              {page}
                            </span>
                          ))}
                          {pageGroup.length > 8 && (
                            <span className="px-1.5 py-0.5 text-gray-400 text-xs">
                              +{pageGroup.length - 8}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {previewResults.files > 12 && (
                      <div className="p-3 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        +{previewResults.files - 12} more files
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skip blank pages option (for applicable modes) */}
          {['extract', 'range', 'every'].includes(mode) && blankPagesCount > 0 && (
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipBlankPages}
                  onChange={(e) => setSkipBlankPages(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">
                  Skip blank pages ({blankPagesCount} detected)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={!canExecute || isProcessing}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              canExecute && !isProcessing
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Split & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Mode Button Component
function ModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
  description,
  badge
}: {
  mode: SplitMode
  currentMode: SplitMode
  onClick: () => void
  icon: React.ReactNode
  label: string
  description: string
  badge?: string
}) {
  const isActive = mode === currentMode
  const colors = MODE_COLORS[mode]

  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg border transition-all text-left ${
        isActive
          ? `${colors.bg} ${colors.border} ${colors.text}`
          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="text-xs opacity-70">{description}</div>
      {badge && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-cyan-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </button>
  )
}

// Bookmark Tree Component
function BookmarkTree({ bookmarks, level }: { bookmarks: Bookmark[]; level: number }) {
  return (
    <div className={level > 0 ? 'ml-4' : ''}>
      {bookmarks.map((bookmark, idx) => (
        <div key={idx} className="py-1">
          <div className="flex items-center gap-2 text-sm">
            {bookmark.children && bookmark.children.length > 0 ? (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            ) : (
              <span className="w-3" />
            )}
            <span className="text-gray-300">{bookmark.title}</span>
            <span className="text-gray-500 text-xs">p.{bookmark.pageNumber}</span>
          </div>
          {bookmark.children && bookmark.children.length > 0 && (
            <BookmarkTree bookmarks={bookmark.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}

export default SplitUI
