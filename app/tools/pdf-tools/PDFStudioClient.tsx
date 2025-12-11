'use client'

import './styles/pdf-tools.css'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import { Menu, ChevronLeft, HelpCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic import of Guide component
const Guide = dynamic(() => import('./guide'), {
  ssr: false,
})

// Hooks
import { usePDFLoader } from './hooks/usePDFLoader'
import { usePageSelection } from './hooks/usePageSelection'
import { usePDFEditor } from './hooks/usePDFEditor'
import { usePDFToolHandlers } from './hooks/usePDFToolHandlers'

// Components
import { ToolPanel } from './components/ToolPanel'
import { Toolbar } from './components/Toolbar'
import { PDFViewer } from './components/PDFViewer'
import { ConfirmDialog } from './components/ConfirmDialog'

// Features
import { WatermarkUI } from './features/watermark/WatermarkUI'
import { SignatureUI } from './features/signature/SignatureUI'
import { ConvertUI } from './features/convert/ConvertUI'
import { AnnotateUI } from './features/annotate/AnnotateUI'
import { MergeUI } from './features/merge/MergeUI'

// Constants
import { availableTools } from './constants/tools'
import { Tool } from './types'

// Helpers
import { uint8ArrayToBlob } from './utils/pdfHelpers'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const MAX_PAGES = 100

export default function PDFStudioClient() {
  // Core PDF hooks
  const {
    file,
    pages: initialPages,
    setPages: setInitialPages,
    isProcessing,
    setIsProcessing,
    loadPDF,
    setFile,
  } = usePDFLoader()

  const { selectedPages, handlePageSelect, clearSelection } = usePageSelection()

  const { pages, updatePages, undo, redo, canUndo, canRedo, clearHistory } =
    usePDFEditor(initialPages)

  // UI States
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [draggedPage, setDraggedPage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [convertFormat, setConvertFormat] = useState<'word' | 'excel'>('word')
  const [isSelectingTool, setIsSelectingTool] = useState<number | null>(null)
  const [keepSelection, setKeepSelection] = useState(true)
  const [showGuide, setShowGuide] = useState(false)

  // Tool slots initialization - All 6 slots available
  const [activeToolSlots, setActiveToolSlots] = useState<(Tool | null)[]>(() => {
    const defaultSlots = Array(6).fill(null)
    defaultSlots[0] = availableTools.find((t) => t.id === 'rotate') || null
    defaultSlots[1] = availableTools.find((t) => t.id === 'merge') || null
    defaultSlots[2] = availableTools.find((t) => t.id === 'split') || null
    return defaultSlots
  })

  // Helper functions
  const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
    // Create a new ArrayBuffer to avoid TypeScript type issues
    const buffer = new ArrayBuffer(pdfBytes.length)
    new Uint8Array(buffer).set(pdfBytes)
    const blob = new Blob([buffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleProcessComplete = (blob: Blob) => {
    // Process completion handler (for future use)
  }

  // Load merged PDF into editor
  const loadMergedPDF = useCallback(async (pdfBytes: Uint8Array) => {
    // Create a new ArrayBuffer to avoid TypeScript type issues
    const buffer = new ArrayBuffer(pdfBytes.length)
    new Uint8Array(buffer).set(pdfBytes)
    const mergedBlob = new Blob([buffer], { type: 'application/pdf' })
    const mergedFile = new File([mergedBlob], file?.name ? `merged_${file.name}` : 'merged.pdf', { 
      type: 'application/pdf' 
    })
    
    setFile(mergedFile)
    clearSelection()
    clearHistory()

    try {
      const newPages = await loadPDF(mergedFile, isMobile)
      if (newPages.length > MAX_PAGES) {
        alert(`Merged PDF has ${newPages.length} pages. Maximum allowed is ${MAX_PAGES} pages.`)
        setFile(null)
        setInitialPages([])
        return
      }
      updatePages(newPages)
    } catch (error) {
      console.error('Failed to load merged PDF:', error)
      alert('Failed to load merged PDF into editor')
    }
  }, [file, setFile, clearSelection, clearHistory, loadPDF, isMobile, setInitialPages, updatePages])

  const {
    showWatermarkUI,
    setShowWatermarkUI,
    showSignatureUI,
    setShowSignatureUI,
    showConvertUI,
    setShowConvertUI,
    showAnnotateUI,
    setShowAnnotateUI,
    showMergeUI,
    setShowMergeUI,
    closeAllToolUIs,
    activeToolUI,
    confirmDialog,
    handleConfirmCancel,
    handleRotateSelected,
    handleDeleteSelected,
    handleSplit,
    handleMerge,
    handleApplyMerge,
    handleApplyMergeAndEdit,
    handleApplyMergeWithCustomOrder,
    handleApplyMergeWithCustomOrderAndEdit,
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
  } = usePDFToolHandlers({
    file,
    pages,
    selectedPages,
    updatePages,
    clearSelection,
    setIsProcessing,
    downloadPDF,
    handleProcessComplete,
    keepSelection,
    loadMergedPDF,
  })

  // Sync pages
  useEffect(() => {
    if (initialPages.length > 0 && pages.length === 0) {
      updatePages(initialPages)
    }
  }, [initialPages, pages.length, updatePages])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (file && pages.length > 0) {
        const message = 'Your edits will be lost. Are you sure you want to leave?'
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [file, pages])

  // Common file processing logic
  const processFile = useCallback(async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return false
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      alert(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit. Please upload a smaller file.`)
      return false
    }

    setFile(uploadedFile)
    clearSelection()
    clearHistory()

    try {
      const newPages = await loadPDF(uploadedFile, isMobile)
      if (newPages.length > MAX_PAGES) {
        alert(`PDF has ${newPages.length} pages. Maximum allowed is ${MAX_PAGES} pages.`)
        setFile(null)
        setInitialPages([])
        return false
      }

      updatePages(newPages)
      return true
    } catch (error) {
      alert('Failed to load PDF. Please try again.')
      setFile(null)
      return false
    }
  }, [setFile, clearSelection, clearHistory, loadPDF, isMobile, setInitialPages, updatePages])

  // Handle file input change
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    const success = await processFile(uploadedFile)
    if (!success && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle file dropped via drag & drop
  const handleFileDropped = useCallback(async (droppedFile: File) => {
    // If there's an existing file, confirm replacement
    if (file && pages.length > 0) {
      const confirmed = confirm('Replace current PDF? All changes will be lost.')
      if (!confirmed) return
    }

    await processFile(droppedFile)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [file, pages.length, processFile])

  const handleClearFile = () => {
    if (confirm('Are you sure you want to clear the current file? All changes will be lost.')) {
      setFile(null)
      setInitialPages([])
      updatePages([])
      clearSelection()
      clearHistory()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUndo = () => {
    if (canUndo) {
      undo()
      if (!keepSelection) {
        clearSelection()
      }
    }
  }

  const handleRedo = () => {
    if (canRedo) {
      redo()
      if (!keepSelection) {
        clearSelection()
      }
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  // Tool selection
  const handleToolSelect = (tool: Tool) => {
    if (isSelectingTool !== null) {
      const newSlots = [...activeToolSlots]
      newSlots[isSelectingTool] = tool
      setActiveToolSlots(newSlots)
      setIsSelectingTool(null)
    }
  }

  const handleSlotClick = (index: number) => {
    const tool = activeToolSlots[index]
    if (tool) {
      switch (tool.id) {
        case 'rotate':
          handleRotateSelected()
          break
        case 'merge':
          handleMerge()
          break
        case 'split':
          handleSplit()
          break
        case 'delete':
          handleDeleteSelected()
          break
        case 'compress':
          handleCompress()
          break
        case 'pageNumbers':
          handleAddPageNumbers()
          break
        case 'blankPage':
          handleInsertBlankPage()
          break
        case 'duplicate':
          handleDuplicatePages()
          break
        case 'ocr':
          handleOCR()
          break
        case 'annotate':
          handleAnnotate()
          break
        case 'watermark':
          handleWatermark()
          break
        case 'signature':
          handleSignature()
          break
        case 'toWord':
          setConvertFormat('word')
          handleToWord()
          break
        case 'toExcel':
          setConvertFormat('excel')
          handleToExcel()
          break
      }
    } else {
      setIsSelectingTool(index)
    }
  }

  const createPDFFromPages = async (): Promise<Uint8Array> => {
    if (!file) throw new Error('No file loaded')

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const newPdfDoc = await PDFDocument.create()

    for (const page of pages) {
      const pageIndex = page.pageNumber - 1
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex])

      if (page.rotation !== 0) {
        copiedPage.setRotation(degrees(page.rotation))
      }

      newPdfDoc.addPage(copiedPage)
    }

    return await newPdfDoc.save()
  }

  const handleDownload = async () => {
    if (!file || pages.length === 0) {
      alert('No file to download')
      return
    }

    setIsProcessing(true)
    try {
      const pdfBytes = await createPDFFromPages()
      downloadPDF(pdfBytes, `edited_${file.name}`)
      handleProcessComplete(uint8ArrayToBlob(pdfBytes))
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to prepare download')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrint = async () => {
    if (!file || pages.length === 0) {
      alert('No file to print')
      return
    }

    try {
      const pdfBytes = await createPDFFromPages()
      const blob = uint8ArrayToBlob(pdfBytes)
      const fileURL = URL.createObjectURL(blob)

      const printWindow = window.open(fileURL)
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
          setTimeout(() => URL.revokeObjectURL(fileURL), 1000)
        }
      }
    } catch (error) {
      console.error('Print error:', error)
      alert('Failed to prepare print')
    }
  }

  const handleTouchStart = (pageId: string) => {
    setDraggedPage(pageId)
  }

  const handleTouchEnd = (e: React.TouchEvent, targetPageId: string) => {
    if (!draggedPage || draggedPage === targetPageId) return

    const draggedIndex = pages.findIndex((p) => p.id === draggedPage)
    const targetIndex = pages.findIndex((p) => p.id === targetPageId)

    const newPages = [...pages]
    const [removed] = newPages.splice(draggedIndex, 1)
    newPages.splice(targetIndex, 0, removed)

    updatePages(
      newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))
    )
    setDraggedPage(null)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Helper to convert selectedPages to page numbers array
  const getSelectedPageNumbers = (): number[] => {
    return Array.from(selectedPages)
      .map(pageId => {
        const page = pages.find(p => p.id === pageId)
        return page ? page.pageNumber : null
      })
      .filter((num): num is number => num !== null)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tool Panel */}
        <ToolPanel
          isMobile={isMobile}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          activeToolSlots={activeToolSlots}
          handleSlotClick={handleSlotClick}
          isSelectingTool={isSelectingTool}
          setIsSelectingTool={setIsSelectingTool}
          availableTools={availableTools}
          handleToolSelect={handleToolSelect}
        />

        {/* Right Panel - Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar
            file={file}
            pages={pages}
            selectedPages={selectedPages}
            isMobile={isMobile}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handlePrint={handlePrint}
            handleDownload={handleDownload}
            toggleFullscreen={toggleFullscreen}
            isProcessing={isProcessing}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            handleClearFile={handleClearFile}
          />

          {/* Keep Selection Toggle */}
          {file && pages.length > 0 && (
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-4">
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  setKeepSelection(!keepSelection)
                }}
                className={`text-sm px-3 py-2 rounded-lg transition min-h-[44px] ${
                  keepSelection 
                    ? 'text-cyan-400 bg-cyan-500/10' 
                    : 'text-gray-400 bg-gray-700/50'
                }`}
              >
                {keepSelection ? 'Keep Selection' : 'Auto Clear'}
              </button>
            </div>
          )}

          <PDFViewer
            file={file}
            pages={pages}
            selectedPages={selectedPages}
            handlePageSelect={handlePageSelect}
            isMobile={isMobile}
            showThumbnails={showThumbnails}
            fileInputRef={fileInputRef}
            isProcessing={isProcessing}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            onPagesReorder={updatePages}
            onFileDropped={handleFileDropped}
          />
        </div>
      </div>

      {/* Feature Modals */}
      {showWatermarkUI && (
        <WatermarkUI onApply={handleApplyWatermark} onCancel={() => closeAllToolUIs()} />
      )}

      {showSignatureUI && (
        <SignatureUI
          onApply={handleApplySignature}
          onCancel={() => closeAllToolUIs()}
          totalPages={pages.length}
        />
      )}

      {showConvertUI && (
        <ConvertUI
          file={file}
          totalPages={pages.length}
          onClose={() => closeAllToolUIs()}
        />
      )}

      {showAnnotateUI && (
        <AnnotateUI
          totalPages={pages.length}
          selectedPages={getSelectedPageNumbers()}
          onApply={handleApplyAnnotation}
          onCancel={() => closeAllToolUIs()}
        />
      )}

      {/* Enhanced Merge UI with Real-time Preview */}
      {showMergeUI && file && (
        <MergeUI
          currentFile={file}
          currentFileName={file.name}
          currentPages={pages.map(p => ({
            id: p.id,
            thumbnail: p.thumbnail,
            pageNumber: p.pageNumber,
          }))}
          totalPages={pages.length}
          onMerge={handleApplyMerge}
          onMergeAndEdit={handleApplyMergeAndEdit}
          onMergeWithCustomOrder={handleApplyMergeWithCustomOrder}
          onMergeWithCustomOrderAndEdit={handleApplyMergeWithCustomOrderAndEdit}
          onCancel={() => setShowMergeUI(false)}
        />
      )}

      {/* Guide Modal */}
      {showGuide && <Guide onClose={() => setShowGuide(false)} />}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleConfirmCancel}
      />
    </div>
  )
}