// app/tools/pdf-tools/components/PDFViewer.tsx
import { RefObject, useState, DragEvent } from 'react'
import { Upload, GripVertical, CheckCircle } from 'lucide-react'
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
}: PDFViewerProps) {
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null)
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null)

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, pageId: string) => {
    setDraggedPageId(pageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (pageId: string) => {
    setDragOverPageId(pageId)
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

  return (
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
                className={`relative cursor-pointer rounded-lg p-2 transition-all ${
                  selectedPages.has(page.id)
                    ? 'bg-cyan-500/20 ring-2 ring-cyan-400'
                    : 'hover:bg-gray-700'
                } ${
                  dragOverPageId === page.id
                    ? 'bg-cyan-500/10 border-2 border-cyan-400 border-dashed'
                    : ''
                } ${draggedPageId === page.id ? 'opacity-50' : ''}`}
              >
                {/* Desktop: horizontal with grip */}
                {!isMobile ? (
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3 h-3 text-gray-500 cursor-move flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1 flex-1">
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
                  </div>
                ) : (
                  /* Mobile: vertical stack, centered */
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
      <div className="flex-1 bg-gray-900 p-4 md:p-8 overflow-auto">
        {!file ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Upload a PDF to start editing</p>
              <p className="text-xs text-gray-500 mb-4">Max file size: 20MB - Max pages: 100</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition"
              >
                Choose File
              </button>
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

            <div
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4`}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePageSelect(page.id, e)
                  }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedPages.has(page.id)
                      ? 'ring-2 ring-cyan-400 transform scale-105'
                      : 'hover:ring-2 hover:ring-gray-600'
                  } ${dragOverPageId === page.id ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''} ${
                    draggedPageId === page.id ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={page.thumbnail}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-auto bg-white"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-xs text-white">Page {page.pageNumber}</span>
                  </div>
                  {selectedPages.has(page.id) && (
                    <div className="absolute top-2 right-2 bg-cyan-400 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}