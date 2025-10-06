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
import { PasswordHandler } from '../features/password/PasswordHandler'
import { WatermarkHandler } from '../features/watermark/WatermarkHandler'
import { SignatureHandler } from '../features/signature/SignatureHandler'
import { ConvertHandler } from '../features/convert/ConvertHandler'

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
  // Method 1: Create a new ArrayBuffer and copy data to ensure compatibility
  const newBuffer = new ArrayBuffer(uint8Array.length)
  const view = new Uint8Array(newBuffer)
  view.set(uint8Array)
  return new Blob([newBuffer], { type: mimeType })
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
  const [showPasswordUI, setShowPasswordUI] = useState(false)
  const [showWatermarkUI, setShowWatermarkUI] = useState(false)
  const [showSignatureUI, setShowSignatureUI] = useState(false)
  const [showConvertUI, setShowConvertUI] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const KEEP_SELECTION_ACTIONS = new Set(['rotate', 'duplicate'])
  const CLEAR_SELECTION_ACTIONS = new Set(['delete', 'split', 'extract'])

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

      // 抽出後は設定に応じて選択をクリア
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

            // マージ後は設定に応じて選択をクリア
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

      // 圧縮後は設定に応じて選択をクリア
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

      // ページ番号追加後は設定に応じて選択をクリア
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

      // 挿入後は設定に応じて選択をクリア
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

    // 複製後は選択を維持（設定に応じて）
    if (!keepSelection && !KEEP_SELECTION_ACTIONS.has('duplicate')) {
      clearSelection()
    }
  }

  // Password Handler
  const handlePassword = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }
    setShowPasswordUI(true)
  }

  const handleAddPassword = async (options: any) => {
    if (!file) return

    setIsProcessing(true)
    try {
      const protectedPdf = await PasswordHandler.addPassword(file, options)
      downloadPDF(protectedPdf, `protected_${file.name}`)
      // Convert Uint8Array to Blob properly
      handleProcessComplete(uint8ArrayToBlob(protectedPdf))
      alert('Password protection added successfully!')
      setShowPasswordUI(false)
    } catch (error) {
      console.error('Password protection error:', error)
      alert('Failed to add password protection')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemovePassword = async (password: string) => {
    if (!file) return

    setIsProcessing(true)
    try {
      const unprotectedPdf = await PasswordHandler.removePassword(file, password)
      downloadPDF(unprotectedPdf, `unlocked_${file.name}`)
      // Convert Uint8Array to Blob properly
      handleProcessComplete(uint8ArrayToBlob(unprotectedPdf))
      alert('Password protection removed successfully!')
      setShowPasswordUI(false)
      setIsPasswordProtected(false)
    } catch (error) {
      console.error('Password removal error:', error)
      alert('Failed to remove password. Please check the password and try again.')
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
      // Convert Uint8Array to Blob properly
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

      // Convert Uint8Array to Blob properly
      handleProcessComplete(uint8ArrayToBlob(result!))
      setShowSignatureUI(false)
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
    setShowConvertUI(true)
  }

  const handleToExcel = async () => {
    if (!file) {
      alert('Please upload a PDF file first')
      return
    }
    setShowConvertUI(true)
  }

  const handleConvert = async (format: string, options: any) => {
    if (!file) return

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
        // Convert Uint8Array to Blob properly
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
    showPasswordUI,
    setShowPasswordUI,
    showWatermarkUI,
    setShowWatermarkUI,
    showSignatureUI,
    setShowSignatureUI,
    showConvertUI,
    setShowConvertUI,
    isPasswordProtected,
    setIsPasswordProtected,

    // Tool Handlers
    handleRotateSelected,
    handleDeleteSelected,
    handleSplit,
    handleMerge,
    handleCompress,
    handleAddPageNumbers,
    handleInsertBlankPage,
    handleDuplicatePages,
    handlePassword,
    handleAddPassword,
    handleRemovePassword,
    handleWatermark,
    handleApplyWatermark,
    handleSignature,
    handleApplySignature,
    handleToWord,
    handleToExcel,
    handleConvert,
    handleOCR,
  }
}
