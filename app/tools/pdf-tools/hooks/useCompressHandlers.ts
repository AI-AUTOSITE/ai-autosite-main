import { useState, useCallback } from 'react'
import { CompressHandler, CompressionLevel, CompressionResult } from '../features/compress/CompressHandler'

interface UseCompressHandlersProps {
  file: File | null
  setIsProcessing: (processing: boolean) => void
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

export function useCompressHandlers({
  file,
  setIsProcessing
}: UseCompressHandlersProps) {
  const [showCompressUI, setShowCompressUI] = useState(false)
  const [lastResult, setLastResult] = useState<CompressionResult | null>(null)

  /**
   * Handle compression by level or target size
   */
  const handleCompress = useCallback(async (
    levelOrTarget: CompressionLevel | 'target',
    targetSizeMB?: number
  ) => {
    if (!file) return

    setIsProcessing(true)

    try {
      let result: CompressionResult

      if (levelOrTarget === 'target' && targetSizeMB) {
        // Compress to target size
        const { result: r, achievedLevel } = await CompressHandler.compressToTargetSize(
          file,
          targetSizeMB
        )
        result = r
        console.log(`Achieved compression level: ${achievedLevel}`)
      } else {
        // Compress by level
        result = await CompressHandler.compress(file, {
          level: levelOrTarget as CompressionLevel
        })
      }

      setLastResult(result)

      // Download compressed file
      const blob = uint8ArrayToBlob(result.data)
      const baseName = file.name.replace(/\.pdf$/i, '')
      const filename = `${baseName}_compressed.pdf`
      downloadBlob(blob, filename)

      // Log compression stats
      const savings = CompressHandler.calculateSavings(result.originalSize, result.compressedSize)
      console.log(`Compression complete:`)
      console.log(`  Original: ${CompressHandler.formatFileSize(result.originalSize)}`)
      console.log(`  Compressed: ${CompressHandler.formatFileSize(result.compressedSize)}`)
      console.log(`  Saved: ${savings.formattedSaved} (${savings.savedPercentage.toFixed(1)}%)`)

      setShowCompressUI(false)

    } catch (error) {
      console.error('Compression error:', error)
      alert(error instanceof Error ? error.message : 'Failed to compress PDF')
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Open Compress UI
   */
  const openCompressUI = useCallback(() => {
    setShowCompressUI(true)
  }, [])

  /**
   * Close Compress UI
   */
  const closeCompressUI = useCallback(() => {
    setShowCompressUI(false)
  }, [])

  return {
    showCompressUI,
    lastResult,
    handleCompress,
    openCompressUI,
    closeCompressUI
  }
}

export default useCompressHandlers
