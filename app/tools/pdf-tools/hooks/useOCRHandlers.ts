import { useState, useCallback } from 'react'
import { OCRHandler, OCRResult, OCRProgress } from '../features/ocr/OCRHandler'

interface UseOCRHandlersProps {
  file: File | null
  setIsProcessing: (processing: boolean) => void
}

export function useOCRHandlers({
  file,
  setIsProcessing
}: UseOCRHandlersProps) {
  const [showOCRUI, setShowOCRUI] = useState(false)
  const [ocrResults, setOCRResults] = useState<OCRResult[]>([])
  const [ocrProgress, setOCRProgress] = useState<OCRProgress | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState('eng')

  /**
   * Perform OCR on current PDF
   */
  const handleOCR = useCallback(async (
    language: string = 'eng',
    preprocess?: {
      grayscale?: boolean
      contrast?: number
      brightness?: number
    }
  ) => {
    if (!file) return null

    setIsProcessing(true)
    setCurrentLanguage(language)
    setOCRProgress(null)

    try {
      const results = await OCRHandler.recognizePDF(
        file,
        language,
        preprocess,
        setOCRProgress
      )

      setOCRResults(results)
      return results

    } catch (error) {
      console.error('OCR error:', error)
      setOCRProgress({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'OCR failed'
      })
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Get combined text from results
   */
  const getCombinedText = useCallback(() => {
    return OCRHandler.combineResults(ocrResults)
  }, [ocrResults])

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    const text = OCRHandler.combineResults(ocrResults)
    return await OCRHandler.copyToClipboard(text)
  }, [ocrResults])

  /**
   * Download as text file
   */
  const downloadAsText = useCallback((filename?: string) => {
    const text = OCRHandler.combineResults(ocrResults)
    const name = filename || (file?.name.replace(/\.pdf$/i, '_ocr.txt') || 'ocr_result.txt')
    OCRHandler.downloadAsText(text, name)
  }, [ocrResults, file])

  /**
   * Open OCR UI
   */
  const openOCRUI = useCallback(() => {
    setShowOCRUI(true)
  }, [])

  /**
   * Close OCR UI
   */
  const closeOCRUI = useCallback(() => {
    setShowOCRUI(false)
  }, [])

  /**
   * Clear results
   */
  const clearResults = useCallback(() => {
    setOCRResults([])
    setOCRProgress(null)
  }, [])

  /**
   * Terminate workers (cleanup)
   */
  const cleanup = useCallback(async () => {
    await OCRHandler.terminateWorkers()
    clearResults()
  }, [clearResults])

  return {
    showOCRUI,
    ocrResults,
    ocrProgress,
    currentLanguage,
    handleOCR,
    getCombinedText,
    copyToClipboard,
    downloadAsText,
    openOCRUI,
    closeOCRUI,
    clearResults,
    cleanup
  }
}

export default useOCRHandlers
