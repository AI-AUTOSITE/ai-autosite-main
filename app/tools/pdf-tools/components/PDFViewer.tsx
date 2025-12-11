// app/tools/pdf-tools/components/PDFViewer.tsx
'use client'

import { RefObject, useState, DragEvent, useCallback } from 'react'
import { 
  Upload, GripVertical, CheckCircle, X, ZoomIn, 
  ChevronLeft, ChevronRight, Maximize2, RotateCw,
  FileText, Zap
} from 'lucide-react'
import { PageData } from '../types'

interface PDFViewerProps {
  file: File | null
  pages: PageData[]
  selectedPages: Set<string>
  handlePageSelect: (pageId: string, e?: React.MouseEvent | React.TouchEvent) => void
  isMobile: boolean
  showThumbnails: boolean
  fileInputRef: RefObject<HTMLInputElement>
  isProcessing: boolean
  handleTouchStart: (pageId: string) => void
  handleTouchEnd: (e: React.TouchEvent, targetPageId: string) => void
  onPagesReorder: (newPages: PageData[]) => void
  onFileDropped?: (file: File) => void
}

export function PDFViewer({
  file,
  pages,
  selectedPages,
  handlePageSelect,
  isMobile,
  showThumbnails,
  fileInputRef,
  isProcessing,
  handleTouchStart,
  handleTouchEnd,
  onPagesReorder,
  onFileDropped,
}: PDFViewerProps) {
  // Drag and drop states for page reordering
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null)
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null)
  
  // File drop zone state
  const [isFileDragOver, setIsFileDragOver] = useState(false)
  
  // Preview modal state
  const [previewPage, setPreviewPage] = useState<PageData | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1)

  // ============================================
  // File Drag & Drop Handlers
  // ============================================
  const handleFileDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // ページ並び替え中はファイルドロップモードにしない
    if (draggedPageId) {
      e.dataTransfer.dropEffect = 'move'
      return
    }
    
    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy'
      setIsFileDragOver(true)
    }
  }, [draggedPageId])

  const handleFileDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // ページ並び替え中はすでにfalseなのでそのまま
    if (!draggedPageId) {
      setIsFileDragOver(false)
    }
  }, [draggedPageId])

  const handleFileDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFileDragOver(false)
    
    // ページ並び替え中はファイルドロップ処理をスキップ
    if (draggedPageId) {
      return
    }
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const droppedFile = files[0]
      
      if (droppedFile.type === 'application/pdf') {
        if (onFileDropped) {
          onFileDropped(droppedFile)
        }
      } else {
        alert('Please drop a PDF file')
      }
    }
  }, [onFileDropped, draggedPageId])

  // ============================================
  // Page Drag & Drop Handlers (Reordering)
  // ============================================
  const handleDragStart = (e: DragEvent<HTMLDivElement>, pageId: string) => {
    setDraggedPageId(pageId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', pageId)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (pageId: string) => {
    if (draggedPageId && draggedPageId !== pageId) {
      setDragOverPageId(pageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverPageId(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetPageId: string) => {
    e.preventDefault()

    if (!draggedPageId || draggedPageId === targetPageId) {
      setDraggedPageId(null)
      setDragOverPageId(null)
      return
    }

    const draggedIndex = pages.findIndex((p) => p.id === draggedPageId)
    const targetIndex = pages.findIndex((p) => p.id === targetPageId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedPageId(null)
      setDragOverPageId(null)
      return
    }

    const newPages = [...pages]
    const [movedPage] = newPages.splice(draggedIndex, 1)
    newPages.splice(targetIndex, 0, movedPage)

    const updatedPages = newPages.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))

    onPagesReorder(updatedPages)
    setDraggedPageId(null)
    setDragOverPageId(null)
  }

  const handleDragEnd = () => {
    setDraggedPageId(null)
    setDragOverPageId(null)
  }

  // ============================================
  // Preview Modal Handlers
  // ============================================
  const openPreview = (page: PageData) => {
    setPreviewPage(page)
    setPreviewZoom(1)
  }

  const closePreview = () => {
    setPreviewPage(null)
    setPreviewZoom(1)
  }

  const navigatePreview = (direction: 'prev' | 'next') => {
    if (!previewPage) return
    
    const currentIndex = pages.findIndex(p => p.id === previewPage.id)
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(pages.length - 1, currentIndex + 1)
    
    setPreviewPage(pages[newIndex])
  }

  const handleZoom = (delta: number) => {
    setPreviewZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const handlePreviewKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!previewPage) return
    
    switch (e.key) {
      case 'ArrowLeft':
        navigatePreview('prev')
        break
      case 'ArrowRight':
        navigatePreview('next')
        break
      case 'Escape':
        closePreview()
        break
      case '+':
      case '=':
        handleZoom(0.25)
        break
      case '-':
        handleZoom(-0.25)
        break
    }
  }, [previewPage, pages])

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails sidebar */}
        {file && (
          <div
            className={`${isMobile ? (showThumbnails ? 'w-24' : 'hidden') : 'w-48'} bg-gray-800 border-r border-gray-700 overflow-y-auto p-2`}
          >
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  draggable={!isMobile}
                  onDragStart={(e) => handleDragStart(e, page.id)}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(page.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, page.id)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={() => handleTouchStart(page.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, page.id)}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePageSelect(page.id, e)
                  }}
                  className={`relative cursor-pointer rounded-lg p-2 transition-all duration-200 ${
                    selectedPages.has(page.id)
                      ? 'bg-cyan-500/20 ring-2 ring-cyan-400'
                      : 'hover:bg-gray-700'
                  } ${
                    dragOverPageId === page.id
                      ? 'bg-cyan-500/10 border-2 border-cyan-400 border-dashed scale-105'
                      : ''
                  } ${draggedPageId === page.id ? 'opacity-50 scale-95' : ''}`}
                >
                  {!isMobile ? (
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-3 h-3 text-gray-500 cursor-move flex-shrink-0" />
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="relative group">
                          <img
                            src={page.thumbnail}
                            alt={`Page ${page.pageNumber}`}
                            className="w-16 h-20 object-cover rounded bg-white pointer-events-none"
                            style={{ transform: `rotate(${page.rotation}deg)` }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openPreview(page)
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                          >
                            <ZoomIn className="w-5 h-5 text-white" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-300 text-center leading-tight">
                          Page {page.pageNumber}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.pageNumber}`}
                        className="w-16 h-20 object-cover rounded bg-white pointer-events-none"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                      <span className="text-xs text-gray-300 text-center leading-tight">
                        Page {page.pageNumber}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main view */}
        <div 
          className={`flex-1 bg-gray-900 p-4 md:p-8 overflow-auto transition-all duration-200 ${
            isFileDragOver ? 'bg-cyan-500/10 ring-4 ring-inset ring-cyan-400/50' : ''
          }`}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onDrop={handleFileDrop}
        >
          {!file ? (
            <div className="h-full flex items-center justify-center">
              <div 
                className={`text-center p-8 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                  isFileDragOver 
                    ? 'border-cyan-400 bg-cyan-500/10 scale-105' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className={`transition-transform duration-200 ${isFileDragOver ? 'scale-110' : ''}`}>
                  {isFileDragOver ? (
                    <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
                  ) : (
                    <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  )}
                </div>
                <p className={`text-lg font-medium mb-2 ${isFileDragOver ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {isFileDragOver ? 'Drop PDF here!' : 'Drag & Drop PDF here'}
                </p>
                <p className="text-gray-500 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-medium"
                >
                  Choose File
                </button>
                <p className="text-xs text-gray-500 mt-4">Max file size: 20MB • Max pages: 100</p>
                
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800/50 px-3 py-2 rounded-lg">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span>100% Browser-based • No Upload to Server</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isProcessing && (
                <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                  </div>
                </div>
              )}

              {isFileDragOver && (
                <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-8 bg-gray-800/90 rounded-2xl border-2 border-dashed border-cyan-400">
                    <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
                    <p className="text-cyan-400 text-lg font-medium">Drop to replace PDF</p>
                    <p className="text-gray-400 text-sm mt-2">Current file will be replaced</p>
                  </div>
                </div>
              )}

              <div
                className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'} gap-4`}
              >
                {pages.map((page) => (
                  <div
                    key={page.id}
                    draggable={!isMobile}
                    onDragStart={(e) => handleDragStart(e, page.id)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(page.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, page.id)}
                    onDragEnd={handleDragEnd}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-200 bg-gray-800 ${
                      isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
                    } ${
                      selectedPages.has(page.id)
                        ? 'ring-2 ring-cyan-400 transform scale-105 shadow-lg shadow-cyan-500/20'
                        : 'hover:ring-2 hover:ring-gray-600 hover:shadow-lg'
                    } ${dragOverPageId === page.id ? 'ring-2 ring-cyan-400 ring-opacity-50 scale-105' : ''} ${
                      draggedPageId === page.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    {/* Portrait aspect ratio container (A4 ratio ~1:1.414) */}
                    <div
                      className="relative w-full bg-gray-700"
                      style={{ paddingBottom: '141.4%' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePageSelect(page.id, e)
                      }}
                    >
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.pageNumber}`}
                        className="absolute inset-0 w-full h-full object-contain bg-white pointer-events-none"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                        draggable={false}
                      />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white">Page {page.pageNumber}</span>
                        {!isMobile && (
                          <div className="flex items-center gap-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPages.has(page.id) && (
                      <div className="absolute top-2 right-2 bg-cyan-400 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openPreview(page)
                      }}
                      className="absolute top-2 left-2 p-2 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>

                    {page.rotation !== 0 && (
                      <div className="absolute bottom-2 right-2 p-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        {page.rotation}°
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal - FIXED: Much larger image */}
      {previewPage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={closePreview}
          onKeyDown={handlePreviewKeyDown}
          tabIndex={0}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 bg-gray-900/80">
            <div className="text-white font-medium">
              Page {previewPage.pageNumber} of {pages.length}
            </div>
            <button
              onClick={closePreview}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Main preview area - takes most of screen */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
            {/* Navigation arrows */}
            {pages.findIndex(p => p.id === previewPage.id) > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePreview('prev')
                }}
                className="absolute left-4 z-10 p-4 bg-gray-800/80 rounded-full hover:bg-gray-700 transition"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {pages.findIndex(p => p.id === previewPage.id) < pages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePreview('next')
                }}
                className="absolute right-4 z-10 p-4 bg-gray-800/80 rounded-full hover:bg-gray-700 transition"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Image - fills available space */}
            <div 
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewPage.thumbnail}
                alt={`Page ${previewPage.pageNumber}`}
                className="bg-white rounded-lg shadow-2xl"
                style={{ 
                  maxWidth: `${90 * previewZoom}%`,
                  maxHeight: `${90 * previewZoom}%`,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: `rotate(${previewPage.rotation}deg)`,
                }}
              />
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className="p-4 bg-gray-900/80 flex items-center justify-center gap-6">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoom(-0.25)
              }}
              className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              disabled={previewZoom <= 0.5}
            >
              <span className="text-white text-xl font-bold">−</span>
            </button>
            <span className="text-white text-lg font-medium min-w-[5rem] text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoom(0.25)
              }}
              className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
              disabled={previewZoom >= 3}
            >
              <span className="text-white text-xl font-bold">+</span>
            </button>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-20 right-4 text-xs text-gray-500">
            ← → Navigate • + − Zoom • Esc Close
          </div>
        </div>
      )}
    </>
  )
}