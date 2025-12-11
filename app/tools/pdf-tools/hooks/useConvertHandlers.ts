import { useState, useCallback } from 'react'
import { ConvertHandler, OutputFormat, ConvertProgress, PageImage } from '../features/convert/ConvertHandler'

interface UseConvertHandlersProps {
  file: File | null
  setIsProcessing: (processing: boolean) => void
}

export function useConvertHandlers({
  file,
  setIsProcessing
}: UseConvertHandlersProps) {
  const [showConvertUI, setShowConvertUI] = useState(false)
  const [convertProgress, setConvertProgress] = useState<ConvertProgress | null>(null)
  const [textResult, setTextResult] = useState<string | null>(null)
  const [imageResults, setImageResults] = useState<PageImage[]>([])

  /**
   * Convert PDF to text
   */
  const convertToText = useCallback(async (pageRange?: number[]) => {
    if (!file) return null

    setIsProcessing(true)
    setConvertProgress(null)

    try {
      const text = await ConvertHandler.toText(file, { pageRange }, setConvertProgress)
      setTextResult(text)
      return text
    } catch (error) {
      console.error('Convert error:', error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Convert PDF to images
   */
  const convertToImages = useCallback(async (
    format: 'png' | 'jpeg' | 'webp' = 'png',
    dpi: number = 150,
    quality: number = 0.92,
    pageRange?: number[]
  ) => {
    if (!file) return null

    setIsProcessing(true)
    setConvertProgress(null)

    try {
      const images = await ConvertHandler.toImages(
        file,
        { format, dpi, quality, pageRange },
        setConvertProgress
      )
      setImageResults(images)
      return images
    } catch (error) {
      console.error('Convert error:', error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Convert PDF to HTML
   */
  const convertToHTML = useCallback(async (
    includeImages: boolean = false,
    pageRange?: number[]
  ) => {
    if (!file) return null

    setIsProcessing(true)
    setConvertProgress(null)

    try {
      const html = await ConvertHandler.toHTML(
        file,
        { includeImages, pageRange },
        setConvertProgress
      )
      
      // Auto-download
      const baseName = file.name.replace(/\.pdf$/i, '')
      ConvertHandler.downloadHTML(html, `${baseName}.html`)
      
      return html
    } catch (error) {
      console.error('Convert error:', error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Convert PDF to Markdown
   */
  const convertToMarkdown = useCallback(async (pageRange?: number[]) => {
    if (!file) return null

    setIsProcessing(true)
    setConvertProgress(null)

    try {
      const md = await ConvertHandler.toMarkdown(file, { pageRange }, setConvertProgress)
      setTextResult(md)
      
      // Auto-download
      const baseName = file.name.replace(/\.pdf$/i, '')
      ConvertHandler.downloadMarkdown(md, `${baseName}.md`)
      
      return md
    } catch (error) {
      console.error('Convert error:', error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [file, setIsProcessing])

  /**
   * Download text result
   */
  const downloadText = useCallback((filename?: string) => {
    if (!textResult || !file) return
    const name = filename || file.name.replace(/\.pdf$/i, '.txt')
    ConvertHandler.downloadText(textResult, name)
  }, [textResult, file])

  /**
   * Download images as ZIP
   */
  const downloadImagesAsZip = useCallback(async (
    format: 'png' | 'jpeg' | 'webp' = 'png'
  ) => {
    if (!file || imageResults.length === 0) return
    const baseName = file.name.replace(/\.pdf$/i, '')
    await ConvertHandler.downloadImagesAsZip(imageResults, baseName, format)
  }, [file, imageResults])

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    if (!textResult) return false
    return await ConvertHandler.copyToClipboard(textResult)
  }, [textResult])

  /**
   * Open Convert UI
   */
  const openConvertUI = useCallback(() => {
    setShowConvertUI(true)
  }, [])

  /**
   * Close Convert UI
   */
  const closeConvertUI = useCallback(() => {
    setShowConvertUI(false)
  }, [])

  /**
   * Clear results
   */
  const clearResults = useCallback(() => {
    setTextResult(null)
    setImageResults([])
    setConvertProgress(null)
  }, [])

  return {
    showConvertUI,
    convertProgress,
    textResult,
    imageResults,
    convertToText,
    convertToImages,
    convertToHTML,
    convertToMarkdown,
    downloadText,
    downloadImagesAsZip,
    copyToClipboard,
    openConvertUI,
    closeConvertUI,
    clearResults
  }
}

export default useConvertHandlers
