// app/tools/pdf-tools/features/merge/MergeUI.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, FileText, ArrowUp, ArrowDown, Plus, Trash2, 
  GripVertical, Download, Edit3, Eye, ChevronDown, ChevronUp,
  Zap, AlertCircle, Check, Loader2
} from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// PDF.js worker setup
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

// Color palette for source file identification
const FILE_COLORS = [
  { bg: 'bg-orange-500/20', border: 'border-orange-400', text: 'text-orange-400', dot: 'bg-orange-400' },
  { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-400', dot: 'bg-blue-400' },
  { bg: 'bg-green-500/20', border: 'border-green-400', text: 'text-green-400', dot: 'bg-green-400' },
  { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-400', dot: 'bg-purple-400' },
  { bg: 'bg-pink-500/20', border: 'border-pink-400', text: 'text-pink-400', dot: 'bg-pink-400' },
  { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  { bg: 'bg-red-500/20', border: 'border-red-400', text: 'text-red-400', dot: 'bg-red-400' },
]

interface PagePreview {
  id: string
  thumbnail: string
  pageNumber: number
  sourceFileIndex: number  // -1 for current file, 0+ for added files
  sourceFileName: string
  originalPageNumber: number
}

interface AddedFile {
  file: File
  pages: PagePreview[]
  pageCount: number
  colorIndex: number
}

interface MergeUIProps {
  currentFile: File  // Add current file reference
  currentFileName: string
  currentPages: { id: string; thumbnail: string; pageNumber: number }[]
  totalPages: number
  onMerge: (files: File[], position: 'before' | 'after' | number) => void
  onMergeAndEdit: (files: File[], position: 'before' | 'after' | number) => void
  onMergeWithCustomOrder?: (currentFile: File, addedFiles: File[], pageOrder: PageOrder[]) => void
  onMergeWithCustomOrderAndEdit?: (currentFile: File, addedFiles: File[], pageOrder: PageOrder[]) => void
  onCancel: () => void
}

// Export PageOrder type for use in handlers
export interface PageOrder {
  sourceFileIndex: number
  originalPageNumber: number
}

export function MergeUI({ 
  currentFile,
  currentFileName, 
  currentPages,
  totalPages,
  onMerge, 
  onMergeAndEdit,
  onMergeWithCustomOrder,
  onMergeWithCustomOrderAndEdit,
  onCancel 
}: MergeUIProps) {
  // Position state: 'before' | 'after' | number (page number)
  const [positionType, setPositionType] = useState<'before' | 'after' | 'page'>('after')
  const [insertAfterPage, setInsertAfterPage] = useState(1)
  
  // Added files with their page previews
  const [addedFiles, setAddedFiles] = useState<AddedFile[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  
  // Preview state
  const [showPreview, setShowPreview] = useState(true)
  const [previewPages, setPreviewPages] = useState<PagePreview[]>([])
  
  // Drag state for file reordering
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null)
  const [dragOverFileIndex, setDragOverFileIndex] = useState<number | null>(null)
  
  // Drag state for preview page reordering
  const [draggedPreviewIndex, setDraggedPreviewIndex] = useState<number | null>(null)
  const [dragOverPreviewIndex, setDragOverPreviewIndex] = useState<number | null>(null)
  const [customPageOrder, setCustomPageOrder] = useState<PagePreview[] | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate thumbnails for a PDF file
  const generateThumbnails = async (file: File, colorIndex: number): Promise<PagePreview[]> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages: PagePreview[] = []
    
    // Limit thumbnails for performance (max 20 pages shown)
    const maxPages = Math.min(pdf.numPages, 20)
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 0.3 })
      
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      
      const context = canvas.getContext('2d')
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise
        pages.push({
          id: `added-${colorIndex}-${i}`,
          thumbnail: canvas.toDataURL('image/jpeg', 0.6),
          pageNumber: i,
          sourceFileIndex: colorIndex,
          sourceFileName: file.name,
          originalPageNumber: i,
        })
      }
    }
    
    return pages
  }

  // Handle file addition
  const handleAddFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(f => f.type === 'application/pdf')
    
    if (pdfFiles.length === 0) return
    
    setIsLoadingFiles(true)
    
    try {
      const newFiles: AddedFile[] = []
      
      for (const file of pdfFiles) {
        const colorIndex = (addedFiles.length + newFiles.length) % FILE_COLORS.length
        const pages = await generateThumbnails(file, addedFiles.length + newFiles.length)
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        
        newFiles.push({
          file,
          pages,
          pageCount: pdf.numPages,
          colorIndex,
        })
      }
      
      setAddedFiles(prev => [...prev, ...newFiles])
    } catch (error) {
      console.error('Failed to load PDF files:', error)
      alert('Failed to load one or more PDF files')
    } finally {
      setIsLoadingFiles(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Remove a file
  const handleRemoveFile = (index: number) => {
    setAddedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Drag and drop for file reordering
  const handleDragStart = (index: number) => {
    setDraggedFileIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedFileIndex !== null && draggedFileIndex !== index) {
      setDragOverFileIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedFileIndex === null || draggedFileIndex === targetIndex) {
      setDraggedFileIndex(null)
      setDragOverFileIndex(null)
      return
    }
    
    const newFiles = [...addedFiles]
    const [movedFile] = newFiles.splice(draggedFileIndex, 1)
    newFiles.splice(targetIndex, 0, movedFile)
    
    // Update color indices
    const updatedFiles = newFiles.map((f, i) => ({
      ...f,
      colorIndex: i % FILE_COLORS.length,
      pages: f.pages.map(p => ({
        ...p,
        sourceFileIndex: i,
      }))
    }))
    
    setAddedFiles(updatedFiles)
    setDraggedFileIndex(null)
    setDragOverFileIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedFileIndex(null)
    setDragOverFileIndex(null)
  }

  // ============================================
  // Preview Page Drag & Drop Handlers
  // ============================================
  const handlePreviewDragStart = (index: number) => {
    setDraggedPreviewIndex(index)
  }

  const handlePreviewDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedPreviewIndex !== null && draggedPreviewIndex !== index) {
      setDragOverPreviewIndex(index)
    }
  }

  const handlePreviewDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedPreviewIndex === null || draggedPreviewIndex === targetIndex) {
      setDraggedPreviewIndex(null)
      setDragOverPreviewIndex(null)
      return
    }
    
    // Use customPageOrder if exists, otherwise use previewPages
    const currentOrder = customPageOrder || previewPages
    const newOrder = [...currentOrder]
    const [movedPage] = newOrder.splice(draggedPreviewIndex, 1)
    newOrder.splice(targetIndex, 0, movedPage)
    
    // Renumber pages
    const renumberedOrder = newOrder.map((p, i) => ({
      ...p,
      pageNumber: i + 1,
    }))
    
    setCustomPageOrder(renumberedOrder)
    setDraggedPreviewIndex(null)
    setDragOverPreviewIndex(null)
  }

  const handlePreviewDragEnd = () => {
    setDraggedPreviewIndex(null)
    setDragOverPreviewIndex(null)
  }

  // Reset custom order when files or position changes
  const resetCustomOrder = () => {
    setCustomPageOrder(null)
  }

  // Move file up/down
  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === addedFiles.length - 1)
    ) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newFiles = [...addedFiles]
    ;[newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
    
    // Update color indices
    const updatedFiles = newFiles.map((f, i) => ({
      ...f,
      colorIndex: i % FILE_COLORS.length,
    }))
    
    setAddedFiles(updatedFiles)
  }

  // Generate preview of merged result
  useEffect(() => {
    const generatePreview = () => {
      // Current file pages
      const currentFilePages: PagePreview[] = currentPages.map(p => ({
        id: `current-${p.pageNumber}`,
        thumbnail: p.thumbnail,
        pageNumber: p.pageNumber,
        sourceFileIndex: -1,
        sourceFileName: currentFileName,
        originalPageNumber: p.pageNumber,
      }))
      
      // Added files pages (flattened)
      const addedFilesPages: PagePreview[] = addedFiles.flatMap((f, fileIdx) => 
        f.pages.map(p => ({
          ...p,
          sourceFileIndex: fileIdx,
        }))
      )
      
      let merged: PagePreview[] = []
      
      if (positionType === 'before') {
        merged = [...addedFilesPages, ...currentFilePages]
      } else if (positionType === 'after') {
        merged = [...currentFilePages, ...addedFilesPages]
      } else {
        // Insert after specific page
        const insertAt = Math.min(insertAfterPage, totalPages)
        merged = [
          ...currentFilePages.slice(0, insertAt),
          ...addedFilesPages,
          ...currentFilePages.slice(insertAt),
        ]
      }
      
      // Renumber pages
      merged = merged.map((p, i) => ({
        ...p,
        pageNumber: i + 1,
      }))
      
      setPreviewPages(merged)
      // Reset custom order when base data changes
      setCustomPageOrder(null)
    }
    
    generatePreview()
  }, [currentPages, addedFiles, positionType, insertAfterPage, currentFileName, totalPages])

  // Get position for API
  const getPosition = (): 'before' | 'after' | number => {
    if (positionType === 'before') return 'before'
    if (positionType === 'after') return 'after'
    return insertAfterPage
  }

  // Get files in order
  const getOrderedFiles = (): File[] => {
    return addedFiles.map(f => f.file)
  }

  const handleMergeAndDownload = () => {
    if (addedFiles.length === 0) {
      alert('Please add at least one PDF file to merge')
      return
    }
    
    // If custom order is set and handler is provided, use custom order merge
    if (customPageOrder && onMergeWithCustomOrder) {
      const pageOrder: PageOrder[] = customPageOrder.map(p => ({
        sourceFileIndex: p.sourceFileIndex,
        originalPageNumber: p.originalPageNumber,
      }))
      onMergeWithCustomOrder(currentFile, getOrderedFiles(), pageOrder)
    } else {
      onMerge(getOrderedFiles(), getPosition())
    }
  }

  const handleMergeAndLoadToEditor = () => {
    if (addedFiles.length === 0) {
      alert('Please add at least one PDF file to merge')
      return
    }
    
    // If custom order is set and handler is provided, use custom order merge
    if (customPageOrder && onMergeWithCustomOrderAndEdit) {
      const pageOrder: PageOrder[] = customPageOrder.map(p => ({
        sourceFileIndex: p.sourceFileIndex,
        originalPageNumber: p.originalPageNumber,
      }))
      onMergeWithCustomOrderAndEdit(currentFile, getOrderedFiles(), pageOrder)
    } else {
      onMergeAndEdit(getOrderedFiles(), getPosition())
    }
  }

  // Calculate total pages
  const totalAddedPages = addedFiles.reduce((sum, f) => sum + f.pageCount, 0)
  const totalMergedPages = totalPages + totalAddedPages

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Merge PDFs</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
              <Zap className="w-3 h-3 text-green-400" />
              Browser-based
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
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Current File Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border-2 border-orange-400/50">
            <div className={`w-3 h-3 rounded-full ${FILE_COLORS[0].dot}`} />
            <FileText className="w-5 h-5 text-orange-400" />
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium truncate block">{currentFileName}</span>
              <span className="text-xs text-gray-400">{totalPages} pages (current)</span>
            </div>
          </div>

          {/* Insert Position Selection */}
          <div className="space-y-3">
            <label className="text-sm text-gray-400 block">Insert Position</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPositionType('before')}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  positionType === 'before'
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
                    : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-sm font-medium">Before</span>
              </button>
              <button
                onClick={() => setPositionType('after')}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  positionType === 'after'
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
                    : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <ArrowDown className="w-5 h-5" />
                <span className="text-sm font-medium">After</span>
              </button>
              <button
                onClick={() => setPositionType('page')}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  positionType === 'page'
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
                    : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">After Page</span>
              </button>
            </div>
            
            {/* Page number input */}
            {positionType === 'page' && (
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <span className="text-sm text-gray-300">Insert after page</span>
                <input
                  type="number"
                  min={0}
                  max={totalPages}
                  value={insertAfterPage}
                  onChange={(e) => setInsertAfterPage(Math.max(0, Math.min(totalPages, parseInt(e.target.value) || 0)))}
                  className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-sm text-gray-400">of {totalPages}</span>
              </div>
            )}
          </div>

          {/* Files to Add */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">
                Files to Merge ({addedFiles.length} files, {totalAddedPages} pages)
              </label>
            </div>
            
            {/* File List with Drag & Drop */}
            {addedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {addedFiles.map((addedFile, index) => {
                  const color = FILE_COLORS[index % FILE_COLORS.length]
                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                        dragOverFileIndex === index
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : `${color.border} ${color.bg}`
                      } ${draggedFileIndex === index ? 'opacity-50' : ''}`}
                    >
                      <GripVertical className="w-4 h-4 text-gray-500 cursor-move flex-shrink-0" />
                      <div className={`w-3 h-3 rounded-full ${color.dot} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white truncate block">{addedFile.file.name}</span>
                        <span className="text-xs text-gray-400">{addedFile.pageCount} pages</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-600 rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === addedFiles.length - 1}
                          className="p-1 hover:bg-gray-600 rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add Files Button */}
            <button
              onClick={handleAddFiles}
              disabled={isLoadingFiles}
              className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoadingFiles ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add PDF Files
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Real-time Preview */}
          {addedFiles.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Result ({totalMergedPages} pages)</span>
                {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showPreview && (
                <div className="bg-gray-900/50 rounded-lg p-3">
                  {/* Color Legend */}
                  <div className="flex flex-wrap gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${FILE_COLORS[0].dot}`} />
                      <span className="text-gray-400 truncate max-w-[100px]">{currentFileName}</span>
                    </div>
                    {addedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${FILE_COLORS[(i + 1) % FILE_COLORS.length].dot}`} />
                        <span className="text-gray-400 truncate max-w-[100px]">{f.file.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Drag hint */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <GripVertical className="w-3 h-3" />
                    <span>Drag pages to reorder</span>
                    {customPageOrder && (
                      <button
                        onClick={resetCustomOrder}
                        className="ml-auto text-cyan-400 hover:text-cyan-300"
                      >
                        Reset Order
                      </button>
                    )}
                  </div>
                  
                  {/* Page Thumbnails with Drag & Drop */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {(customPageOrder || previewPages).slice(0, 30).map((page, index) => {
                      const colorIndex = page.sourceFileIndex === -1 ? 0 : (page.sourceFileIndex + 1) % FILE_COLORS.length
                      const color = FILE_COLORS[colorIndex]
                      const isDragging = draggedPreviewIndex === index
                      const isDragOver = dragOverPreviewIndex === index
                      
                      return (
                        <div
                          key={`${page.id}-${index}`}
                          draggable
                          onDragStart={() => handlePreviewDragStart(index)}
                          onDragOver={(e) => handlePreviewDragOver(e, index)}
                          onDrop={(e) => handlePreviewDrop(e, index)}
                          onDragEnd={handlePreviewDragEnd}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                            isDragOver 
                              ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/30' 
                              : color.border
                          } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                        >
                          <div className="relative">
                            <img
                              src={page.thumbnail}
                              alt={`Page ${page.pageNumber}`}
                              className="w-16 h-20 object-cover bg-white pointer-events-none"
                              draggable={false}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-0.5">
                              <span className="text-[10px] text-white">{page.pageNumber}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {(customPageOrder || previewPages).length > 30 && (
                      <div className="flex-shrink-0 w-16 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">+{(customPageOrder || previewPages).length - 30}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMergeAndDownload}
              disabled={addedFiles.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Merge & Download
            </button>
            <button
              onClick={handleMergeAndLoadToEditor}
              disabled={addedFiles.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Merge & Edit
            </button>
          </div>
          
          {addedFiles.length > 0 && (
            <div className="mt-3 text-center text-xs text-gray-500">
              Result: {totalMergedPages} pages 
              {positionType === 'page' && ` (inserted after page ${insertAfterPage})`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}