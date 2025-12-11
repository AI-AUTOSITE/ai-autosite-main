import { useState, useCallback } from 'react'
import { EnhancedSplitHandler as SplitHandler, SplitResult } from '../features/split/EnhancedSplitHandler'

interface UseSplitHandlersProps {
  file: File | null
  selectedPages: Set<string>
  setIsProcessing: (processing: boolean) => void
  clearSelection: () => void
}

// Helper function to convert Uint8Array to Blob safely
function uint8ArrayToBlob(uint8Array: Uint8Array, mimeType: string = 'application/pdf'): Blob {
  const newBuffer = new ArrayBuffer(uint8Array.length)
  const view = new Uint8Array(newBuffer)
  view.set(uint8Array)
  return new Blob([newBuffer], { type: mimeType })
}

// Download helper
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function useSplitHandlers({
  file,
  selectedPages,
  setIsProcessing,
  clearSelection
}: UseSplitHandlersProps) {
  const [showSplitUI, setShowSplitUI] = useState(false)
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])

  /**
   * Handle split operation based on mode
   */
  const handleSplit = useCallback(async (
    mode: string,
    options?: {
      range?: string
      everyN?: number
      bookmarkLevel?: number
      targetSizeMB?: number
      skipBlank?: boolean
    }
  ) => {
    if (!file) return

    setIsProcessing(true)
    
    try {
      let results: SplitResult[] = []
      const baseName = file.name.replace(/\.pdf$/i, '')

      switch (mode) {
        case 'extract': {
          // Extract selected pages
          const pageNumbers = Array.from(selectedPages)
            .map(id => parseInt(id.split('-')[1]))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b)

          if (pageNumbers.length === 0) {
            throw new Error('No pages selected')
          }

          let data: Uint8Array
          
          if (options?.skipBlank) {
            const result = await SplitHandler.extractNonBlankPages(file, pageNumbers)
            data = result.data
            if (result.skippedBlankPages.length > 0) {
              console.log(`Skipped blank pages: ${result.skippedBlankPages.join(', ')}`)
            }
          } else {
            data = await SplitHandler.extractPages(file, pageNumbers)
          }

          results = [{
            name: `${baseName}_extracted.pdf`,
            data,
            pageCount: pageNumbers.length,
            startPage: Math.min(...pageNumbers),
            endPage: Math.max(...pageNumbers)
          }]
          break
        }

        case 'range': {
          // Split by ranges
          if (!options?.range) {
            throw new Error('No range specified')
          }
          results = await SplitHandler.splitByRanges(file, options.range)
          break
        }

        case 'every': {
          // Split every N pages
          const n = options?.everyN || 5
          results = await SplitHandler.splitEveryNPages(file, n)
          break
        }

        case 'single': {
          // Split into single pages
          results = await SplitHandler.splitIntoSingle(file)
          break
        }

        case 'bookmark': {
          // Split by bookmarks
          const level = options?.bookmarkLevel ?? 0
          results = await SplitHandler.splitByBookmarks(file, level)
          break
        }

        case 'even': {
          // Extract even pages
          const data = await SplitHandler.extractEvenPages(file)
          const totalPages = await SplitHandler.getPageCount(file)
          results = [{
            name: `${baseName}_even_pages.pdf`,
            data,
            pageCount: Math.floor(totalPages / 2),
            startPage: 2,
            endPage: totalPages
          }]
          break
        }

        case 'odd': {
          // Extract odd pages
          const data = await SplitHandler.extractOddPages(file)
          const totalPages = await SplitHandler.getPageCount(file)
          results = [{
            name: `${baseName}_odd_pages.pdf`,
            data,
            pageCount: Math.ceil(totalPages / 2),
            startPage: 1,
            endPage: totalPages
          }]
          break
        }

        case 'blank': {
          // Remove blank pages
          const { data, removedPages } = await SplitHandler.removeBlankPages(file)
          results = [{
            name: `${baseName}_no_blanks.pdf`,
            data,
            pageCount: (await SplitHandler.getPageCount(file)) - removedPages.length,
            startPage: 1,
            endPage: await SplitHandler.getPageCount(file)
          }]
          
          if (removedPages.length > 0) {
            console.log(`Removed blank pages: ${removedPages.join(', ')}`)
          }
          break
        }

        case 'size': {
          // Split by file size
          const targetMB = options?.targetSizeMB || 10
          results = await SplitHandler.splitByFileSize(file, targetMB)
          break
        }

        default:
          throw new Error(`Unknown split mode: ${mode}`)
      }

      // Download results
      if (results.length === 1) {
        // Single file - direct download
        const blob = uint8ArrayToBlob(results[0].data)
        downloadBlob(blob, results[0].name)
      } else if (results.length > 1) {
        // Multiple files - create ZIP
        const zipBlob = await SplitHandler.createZipArchive(results)
        downloadBlob(zipBlob, `${baseName}_split.zip`)
      }

      setSplitResults(results)
      clearSelection()
      setShowSplitUI(false)

    } catch (error) {
      console.error('Split error:', error)
      alert(error instanceof Error ? error.message : 'Failed to split PDF')
    } finally {
      setIsProcessing(false)
    }
  }, [file, selectedPages, setIsProcessing, clearSelection])

  /**
   * Open Split UI
   */
  const openSplitUI = useCallback(() => {
    setShowSplitUI(true)
  }, [])

  /**
   * Close Split UI
   */
  const closeSplitUI = useCallback(() => {
    setShowSplitUI(false)
  }, [])

  /**
   * Download split results
   */
  const downloadResults = useCallback(async (results: SplitResult[]) => {
    if (!file) return

    const baseName = file.name.replace(/\.pdf$/i, '')

    if (results.length === 1) {
      const blob = uint8ArrayToBlob(results[0].data)
      downloadBlob(blob, results[0].name)
    } else {
      const zipBlob = await SplitHandler.createZipArchive(results)
      downloadBlob(zipBlob, `${baseName}_split.zip`)
    }
  }, [file])

  return {
    showSplitUI,
    splitResults,
    handleSplit,
    openSplitUI,
    closeSplitUI,
    downloadResults
  }
}

export default useSplitHandlers
