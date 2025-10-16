import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle } from 'lucide-react'

interface AnnotationOptions {
  text: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  fontSize: number
  color: string
  backgroundColor?: 'yellow' | 'pink' | 'blue' | 'none'
  pageRange: 'all' | 'selected'
  selectedPages?: number[]
}

interface AnnotateUIProps {
  selectedPages: number[]
  totalPages: number
  onApply: (options: AnnotationOptions) => void
  onCancel: () => void
}

export const AnnotateUI: React.FC<AnnotateUIProps> = ({
  selectedPages,
  totalPages,
  onApply,
  onCancel,
}) => {
  const [text, setText] = useState('')
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('top-right')
  const [fontSize, setFontSize] = useState(12)
  const [color, setColor] = useState('#FF0000') // Default red
  const [backgroundColor, setBackgroundColor] = useState<'yellow' | 'pink' | 'blue' | 'none'>('none')
  const [pageRange, setPageRange] = useState<'all' | 'selected'>('selected')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel])

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' },
  ]

  const backgroundColors = [
    { value: 'none', label: 'None' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'pink', label: 'Pink' },
    { value: 'blue', label: 'Blue' },
  ]

  const handleApply = () => {
    // Validate
    if (!text.trim()) {
      alert('Please enter annotation text')
      return
    }

    if (pageRange === 'selected' && selectedPages.length === 0) {
      alert('Please select at least one page')
      return
    }

    // Create proper AnnotationOptions object
    const options: AnnotationOptions = {
      text: text.trim(),
      position,
      fontSize,
      color, // hex color code
      backgroundColor: backgroundColor === 'none' ? undefined : backgroundColor,
      pageRange,
      selectedPages: pageRange === 'selected' ? selectedPages : undefined,
    }

    onApply(options)
  }

  if (!mounted) return null

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 100000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add Annotation</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Page Range Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Apply To
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPageRange('all')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  pageRange === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Pages ({totalPages})
              </button>
              <button
                onClick={() => setPageRange('selected')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  pageRange === 'selected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Selected ({selectedPages.length})
              </button>
            </div>
          </div>

          {/* Selected Pages Info */}
          {pageRange === 'selected' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Selected Pages
                  </p>
                  <p className="text-sm text-gray-700 break-words">
                    {selectedPages.length === 0 ? (
                      'No pages selected'
                    ) : (
                      <>
                        {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''}: {' '}
                        <span className="font-mono text-xs">
                          {selectedPages.slice(0, 10).join(', ')}
                          {selectedPages.length > 10 && ` ... (+${selectedPages.length - 10} more)`}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Annotation Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your annotation text..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500">
              Maximum 200 characters
            </p>
          </div>

          {/* Position Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Position
            </label>
            <div className="grid grid-cols-2 gap-3">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value as any)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    position === pos.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900">
                Font Size
              </label>
              <span className="text-sm font-semibold text-gray-900">
                {fontSize}pt
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Small (8pt)</span>
              <span>Large (24pt)</span>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Text Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#FF0000"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Background Color
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundColors.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => setBackgroundColor(bg.value as any)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    backgroundColor === bg.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-5 bg-gray-50 h-32 relative">
                <div
                  className="absolute text-sm font-medium"
                  style={{
                    color: color,
                    fontSize: `${fontSize}px`,
                    padding: backgroundColor !== 'none' ? '4px 8px' : '0',
                    backgroundColor: 
                      backgroundColor === 'yellow' ? 'rgba(255, 255, 179, 0.7)' :
                      backgroundColor === 'pink' ? 'rgba(255, 204, 230, 0.7)' :
                      backgroundColor === 'blue' ? 'rgba(204, 230, 255, 0.7)' :
                      'transparent',
                    borderRadius: backgroundColor !== 'none' ? '4px' : '0',
                    ...(position === 'top-left' && { top: '1rem', left: '1rem' }),
                    ...(position === 'top-right' && { top: '1rem', right: '1rem' }),
                    ...(position === 'bottom-left' && { bottom: '1rem', left: '1rem' }),
                    ...(position === 'bottom-right' && { bottom: '1rem', right: '1rem' }),
                    ...(position === 'center' && { 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)' 
                    }),
                  }}
                >
                  {text}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!text.trim() || (pageRange === 'selected' && selectedPages.length === 0)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium min-h-[44px]"
          >
            Apply Annotation
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )

  return createPortal(modalContent, document.body)
}