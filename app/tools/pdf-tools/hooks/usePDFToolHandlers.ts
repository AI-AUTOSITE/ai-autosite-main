import { useState } from 'react'
import { PageData } from '../types'
import { RotateHandler } from '../features/rotate/RotateHandler'
import { SplitHandler } from '../features/split/SplitHandler'
import { MergeHandler } from '../features/merge/MergeHandler'
import { CompressHandler } from '../features/compress/CompressHandler'
import { PageNumberHandler } from '../features/pageNumber/PageNumberHandler'
import { BlankPageHandler } from '../features/blankPage/BlankPageHandler'
import { DuplicateHandler } from '../features/duplicate/DuplicateHandler'
import { OCRHandler } from '../features/ocr/OCRHandler'
import { WatermarkHandler } from '../features/watermark/WatermarkHandler'
import { SignatureHandler } from '../features/signature/SignatureHandler'
import { ConvertHandler } from '../features/convert/ConvertHandler'
import { AnnotateHandler } from '../features/annotate/AnnotateHandler'
import type { AnnotationOptions } from '../features/annotate/AnnotateHandler'

interface UsePDFToolHandlersProps {
  file: File | null
  pages: PageData[]
  selectedPages: Set<string>
  updatePages: (pages: PageData[]) => void
  clearSelection: () => void
  setIsProcessing: (processing: boolean) => void
  downloadPDF: (pdfBytes: Uint8Array, filename: string) => void
  handleProcessComplete: (blob: Blob) => void
  keepSelection?: boolean
}

// Helper function to convert Uint8Array to Blob safely
function uint8ArrayToBlob(uint8Array: Uint8Array, mimeType: string = 'application/pdf'): Blob {
  const newBuffer = new ArrayBuffer(uint8Array.length)
  const view = new Uint8Array(newBuffer)
  view.set(uint8Array)
  return new Blob([newBuffer], { type: mimeType })
}

// Mobile detection helper
const isMobileDevice = () => {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// Tool names mapping (English)
const TOOL_NAMES: { [key: string]: string } = {
  annotate: 'Annotate',
  watermark: 'Watermark',
  signature: 'Signature',
  convert: 'Convert',
}

// Confirm dialog state
interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  pendingTool: string | null
}

export function usePDFToolHandlers({
  file,
  pages,
  selectedPages,
  updatePages,
  clearSelection,
  setIsProcessing,
  downloadPDF,
  handleProcessComplete,
  keepSelection = false,
}: UsePDFToolHandlersProps) {
  const [showWatermarkUI, setShowWatermarkUI] = useState(false)
  const [showSignatureUI, setShowSignatureUI] = useState(false)
  const [showConvertUI, setShowConvertUI] = useState(false)
  const [showAnnotateUI, setShowAnnotateUI] = useState(false)
  
  // Track currently active tool UI
  const [activeToolUI, setActiveToolUI] = useState<string | null>(null)
  
  // Custom confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    pendingTool: null,
  })
  
  const KEEP_SELECTION_ACTIONS = new Set(['rotate', 'duplicate'])
  const CLEAR_SELECTION_ACTIONS = new Set(['delete', 'split', 'extract'])

  // Page limit for mobile conversion
  const MOBILE_CONVERT_PAGE_LIMIT = 10

  // Close all tool UIs
  const closeAllToolUIs = () => {
    setShowAnnotateUI(false)
    setShowWatermarkUI(false)
    setShowSignatureUI(false)
    setShowConvertUI(false)
    setActiveToolUI(null)
  }

  // Show custom confirm dialog
  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          onConfirm()
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
          resolve(true)
        },
        pendingTool: null,
      })
    })
  }

  // Cancel confirm dialog
  const handleConfirmCancel = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false, pendingTool: null }))
  }

  // Check and open tool with custom dialog
  const checkAndOpenTool = (newTool: string): boolean => {
    // If the same tool is already open, continue
    if (activeToolUI === newTool) {
      return true
    }

    // If another tool is open, show warning
    if (activeToolUI && activeToolUI !== newTool) {
      const currentToolName = TOOL_NAMES[activeToolUI] || activeToolUI
      const newToolName = TOOL_NAMES[newTool] || newTool
      
      setConfirmDialog({
        isOpen: true,
        title: 'Unsaved Changes',
        message: `You are currently editing with "${currentToolName}".\n\nOpening "${newToolName}" will discard your current changes.\n\nDo you want to continue?`,
        onConfirm: () => {
          closeAllToolUIs()
          setActiveToolUI(newTool)
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
          
          // Open tool UI
          switch (newTool) {
            case 'annotate':
              setShowAnnotateUI(true)
              break
            case 'watermark':
              setShowWatermarkUI(true)
              break
            case 'signature':
              setShowSignatureUI(true)
              break
            case 'convert':
              setShowConvertUI(true)
              break
          }
        },
        pendingTool: newTool,
      })
      
      return false
    }
    
    // Set new tool as active
    setActiveToolUI(newTool)
    return true
  }

  // Rotate Handler
  const handleRotateSelected = async () => {
    if (selectedPages.size === 0) {
      alert('Select pages to rotate')
      return
    }

    const rotatedPages = RotateHandler.rotateInMemory(pages, selectedPages, 90)
    updatePages(rotatedPages)
    if (!keepSelection && !KEEP_SELECTION_ACTIONS.has('rotate')) {
      clearSelection()
    }
  }

  // Delete Handler
  const handleDeleteSelected = () => {
    if (selectedPages.size === 0) {
      alert('Select pages to delete')
      return
    }

    if (confirm(`Delete ${selectedPages.size} page(s)?`)) {
      const newPages = pages.filter((page) => !selectedPages.has(page.id))
      updatePages(
        newPages.map((page, index) => ({
          ...page,
          pageNumber: index + 1,
        }))
      )
      clearSelection()
    }
  }

  // Split Handler
  const handleSplit = async () => {
    if (!file || selectedPages.size === 0) {
      alert('Select pages to extract')
      return
    }

    setIsProcessing(true)
    try {
      const pageNumbers = pages.filter((p) => selectedPages.has(p.id)).map((p) => p.pageNumber)

      const extractedPdf = await SplitHandler.extractPages(file, pageNumbers)
      downloadPDF(extractedPdf, `extracted_${file.name}`)
      handleProcessComplete(uint8ArrayToBlob(extractedPdf))

      if (!keepSelection) {
        clearSelection()
      }
    } catch (error) {
      console.error('Split error:', error)
      alert('Failed to split PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  // Merge Handler
  const handleMerge = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdf'
      input.multiple = true

      input.onchange = async (e) => {
        const additionalFiles = Array.from((e.target as HTMLInputElement).files || [])
        if (additionalFiles.length > 0) {
          setIsProcessing(true)
          try {
            const mergedPdf = await MergeHandler.mergeFiles([file, ...additionalFiles])
            downloadPDF(mergedPdf, `merged_${file.name}`)
            handleProcessComplete(uint8ArrayToBlob(mergedPdf))

            if (!keepSelection) {
              clearSelection()
            }
          } catch (error) {
            console.error('Merge error:', error)
            alert('Failed to merge PDFs')
          } finally {
            setIsProcessing(false)
          }
        }
      }

      input.click()
    } catch (error) {
      console.error('Merge error:', error)
      alert('Failed to merge PDFs')
    }
  }

  // Compress Handler
  const handleCompress = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    setIsProcessing(true)
    try {
      const compressedPdf = await CompressHandler.compress(file, 'medium')
      downloadPDF(compressedPdf, `compressed_${file.name}`)
      handleProcessComplete(uint8ArrayToBlob(compressedPdf))

      if (!keepSelection) {
        clearSelection()
      }
    } catch (error) {
      console.error('Compress error:', error)
      alert('Failed to compress PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  // Page Numbers Handler
  const handleAddPageNumbers = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    setIsProcessing(true)
    try {
      const pdfWithNumbers = await PageNumberHandler.addPageNumbers(file, {
        position: 'bottom-center',
        format: 'X',
        startFrom: 1,
        fontSize: 12,
      })
      downloadPDF(pdfWithNumbers, `numbered_${file.name}`)
      handleProcessComplete(uint8ArrayToBlob(pdfWithNumbers))

      if (!keepSelection) {
        clearSelection()
      }
    } catch (error) {
      console.error('Page number error:', error)
      alert('Failed to add page numbers')
    } finally {
      setIsProcessing(false)
    }
  }

  // Blank Page Handler
  const handleInsertBlankPage = () => {
    if (pages.length === 0) {
      alert('Please upload a PDF file first')
      return
    }

    const pageNumber = prompt('Insert blank page after page number:')
    if (pageNumber) {
      const insertAfter = parseInt(pageNumber)
      if (isNaN(insertAfter) || insertAfter < 0 || insertAfter > pages.length) {
        alert('Invalid page number')
        return
      }

      const newPages = BlankPageHandler.insertBlankPagesInMemory(pages, [insertAfter])
      updatePages(newPages)

      if (!keepSelection) {
        clearSelection()
      }
    }
  }

  // Duplicate Pages Handler
  const handleDuplicatePages = () => {
    if (selectedPages.size === 0) {
      alert('Select pages to duplicate')
      return
    }

    const newPages = DuplicateHandler.duplicatePagesInMemory(pages, selectedPages, true)
    updatePages(newPages)

    if (!keepSelection && !KEEP_SELECTION_ACTIONS.has('duplicate')) {
      clearSelection()
    }
  }

  // Annotate Handler
  const handleAnnotate = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }
    
    if (!checkAndOpenTool('annotate')) {
      return
    }
    
    setShowAnnotateUI(true)
  }

  const handleApplyAnnotation = async (options: AnnotationOptions) => {
    if (!file) return

    // Validate options
    const validationError = AnnotateHandler.validateOptions(options)
    if (validationError) {
      alert(validationError)
      return
    }

    setIsProcessing(true)
    try {
      const fileBuffer = await file.arrayBuffer()
      
      // Call AnnotateHandler with proper options
      const annotatedPdf = await AnnotateHandler.addAnnotations(fileBuffer, options)
      
      downloadPDF(annotatedPdf, `annotated_${file.name}`)
      handleProcessComplete(uint8ArrayToBlob(annotatedPdf))
      alert('Annotation added successfully!')
      
      setShowAnnotateUI(false)
      setActiveToolUI(null)
      
      if (!keepSelection) {
        clearSelection()
      }
    } catch (error) {
      console.error('Annotate error:', error)
      alert(`Failed to add annotation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Watermark Handler
  const handleWatermark = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }
    
    if (!checkAndOpenTool('watermark')) {
      return
    }
    
    setShowWatermarkUI(true)
  }

  const handleApplyWatermark = async (options: any) => {
    if (!file) return

    setIsProcessing(true)
    try {
      const watermarkedPdf = await WatermarkHandler.addWatermark(file, options)
      downloadPDF(watermarkedPdf, `watermarked_${file.name}`)
      alert('Watermark added successfully!')
      
      setShowWatermarkUI(false)
      setActiveToolUI(null)
      handleProcessComplete(uint8ArrayToBlob(watermarkedPdf))
    } catch (error) {
      console.error('Watermark error:', error)
      alert('Failed to add watermark')
    } finally {
      setIsProcessing(false)
    }
  }

  // Signature Handler
  const handleSignature = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }
    
    if (!checkAndOpenTool('signature')) {
      return
    }
    
    setShowSignatureUI(true)
  }

  const handleApplySignature = async (data: any) => {
    if (!file) return

    setIsProcessing(true)
    try {
      let result: Uint8Array

      if (data.type === 'signature') {
        result = await SignatureHandler.addSignature(file, data.options)
        downloadPDF(result, `signed_${file.name}`)
        alert('Signature added successfully!')
      } else if (data.type === 'stamp') {
        result = await SignatureHandler.addStamp(file, data.options)
        downloadPDF(result, `stamped_${file.name}`)
        alert('Stamp added successfully!')
      }

      handleProcessComplete(uint8ArrayToBlob(result!))
      
      setShowSignatureUI(false)
      setActiveToolUI(null)
    } catch (error) {
      console.error('Signature/Stamp error:', error)
      alert('Failed to add signature or stamp')
    } finally {
      setIsProcessing(false)
    }
  }

  // Convert Handlers
  const handleToWord = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    // Check page limit on mobile
    if (isMobileDevice() && pages.length > MOBILE_CONVERT_PAGE_LIMIT) {
      alert(
        `Mobile devices can convert up to ${MOBILE_CONVERT_PAGE_LIMIT} pages.\n\n` +
        `Your PDF has ${pages.length} pages. Please use a desktop for larger files, ` +
        `or split your PDF into smaller parts.`
      )
      return
    }

    if (!checkAndOpenTool('convert')) {
      return
    }

    setShowConvertUI(true)
  }

  const handleToExcel = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    // Check page limit on mobile
    if (isMobileDevice() && pages.length > MOBILE_CONVERT_PAGE_LIMIT) {
      alert(
        `Mobile devices can convert up to ${MOBILE_CONVERT_PAGE_LIMIT} pages.\n\n` +
        `Your PDF has ${pages.length} pages. Please use a desktop for larger files, ` +
        `or split your PDF into smaller parts.`
      )
      return
    }

    if (!checkAndOpenTool('convert')) {
      return
    }

    setShowConvertUI(true)
  }

  const handleConvert = async (format: string, options: any) => {
    if (!file) return

    // Double-check page limit before processing
    if (isMobileDevice() && pages.length > MOBILE_CONVERT_PAGE_LIMIT) {
      alert(`Mobile conversion limited to ${MOBILE_CONVERT_PAGE_LIMIT} pages`)
      setShowConvertUI(false)
      setActiveToolUI(null)
      return
    }

    setIsProcessing(true)
    try {
      let result: Blob
      let filename: string

      switch (format) {
        case 'word':
          result = await ConvertHandler.toWord(file, options)
          filename = file.name.replace('.pdf', '.docx')
          break
        case 'excel':
          result = await ConvertHandler.toExcel(file, options)
          filename = file.name.replace('.pdf', '.xlsx')
          break
        case 'text':
          const text = await ConvertHandler.toText(file)
          result = new Blob([text], { type: 'text/plain' })
          filename = file.name.replace('.pdf', '.txt')
          break
        case 'html':
          const html = await ConvertHandler.toHTML(file, options.preserveFormatting)
          result = new Blob([html], { type: 'text/html' })
          filename = file.name.replace('.pdf', '.html')
          break
        default:
          throw new Error('Unsupported format')
      }

      const url = URL.createObjectURL(result)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      handleProcessComplete(result)
      alert(`Successfully converted to ${format.toUpperCase()}!`)
      
      setShowConvertUI(false)
      setActiveToolUI(null)
    } catch (error) {
      console.error('Conversion error:', error)
      alert(`Failed to convert to ${format}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  // OCR Handler
  const handleOCR = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }

    // Disable OCR on mobile devices
    if (isMobileDevice()) {
      alert(
        'OCR is not available on mobile devices due to high memory requirements.\n\n' +
        'Please use a desktop computer for OCR functionality.'
      )
      return
    }

    console.log('Testing OCR functionality...')

    if (file.size > 10 * 1024 * 1024) {
      if (!confirm('Large files may take longer to process. Continue?')) {
        return
      }
    }

    const outputType = confirm(
      'Choose OCR output type:\n\n' +
        'OK = Searchable PDF (keeps original layout)\n' +
        'Cancel = Text file only'
    )

    setIsProcessing(true)

    const progressModal = document.createElement('div')
    progressModal.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/50'
    progressModal.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-white text-lg font-medium mb-4">OCR Processing</h3>
        <div class="mb-4">
          <div class="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div id="ocr-progress-bar" class="bg-cyan-500 h-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
        <p id="ocr-status" class="text-gray-300 text-sm">Initializing...</p>
      </div>
    `
    document.body.appendChild(progressModal)

    try {
      if (outputType) {
        const searchablePdf = await OCRHandler.createSearchablePDF(
          file,
          'eng',
          'fast',
          (progress) => {
            const progressBar = document.getElementById('ocr-progress-bar')
            const statusText = document.getElementById('ocr-status')
            if (progressBar) progressBar.style.width = `${progress.progress}%`
            if (statusText) statusText.textContent = progress.status
          }
        )

        downloadPDF(searchablePdf, `searchable_${file.name}`)
        handleProcessComplete(uint8ArrayToBlob(searchablePdf))
        alert('Searchable PDF created successfully!')
      } else {
        const result = await OCRHandler.processPDF(
          file,
          { language: 'eng', mode: 'fast', outputFormat: 'text' },
          (progress) => {
            const progressBar = document.getElementById('ocr-progress-bar')
            const statusText = document.getElementById('ocr-status')
            if (progressBar) progressBar.style.width = `${progress.progress}%`
            if (statusText) statusText.textContent = progress.status
          }
        )

        if (typeof result === 'string') {
          const blob = new Blob([result], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.name.replace('.pdf', '')}_OCR.txt`
          a.click()
          URL.revokeObjectURL(url)

          handleProcessComplete(blob)
          alert('OCR text extraction completed!')
        }
      }
    } catch (error) {
      console.error('OCR error:', error)
      alert('OCR processing failed. Please try again with a smaller file.')
    } finally {
      setIsProcessing(false)
      document.body.removeChild(progressModal)
    }
  }

  return {
    // UI States
    showWatermarkUI,
    setShowWatermarkUI,
    showSignatureUI,
    setShowSignatureUI,
    showConvertUI,
    setShowConvertUI,
    showAnnotateUI,
    setShowAnnotateUI,
    
    // Helper functions
    closeAllToolUIs,
    activeToolUI,
    
    // Confirm dialog
    confirmDialog,
    handleConfirmCancel,

    // Tool Handlers
    handleRotateSelected,
    handleDeleteSelected,
    handleSplit,
    handleMerge,
    handleCompress,
    handleAddPageNumbers,
    handleInsertBlankPage,
    handleDuplicatePages,
    handleWatermark,
    handleApplyWatermark,
    handleSignature,
    handleApplySignature,
    handleToWord,
    handleToExcel,
    handleConvert,
    handleOCR,
    handleAnnotate,
    handleApplyAnnotation,
  }
}