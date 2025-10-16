import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC key to close dialog
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  if (!mounted || !isOpen) return null

  const dialogContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 100000 }}
      onClick={(e) => {
        // Close dialog when clicking backdrop
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon - パディング増加 */}
        <div className="flex items-start gap-5 p-8">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-amber-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        {/* Helper Text */}
        <div className="px-8 pb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">ESC</kbd> to cancel
            </p>
          </div>
        </div>

        {/* Footer with Actions - パディング増加 */}
        <div className="flex gap-4 px-8 pb-8">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        kbd {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )

  // Render to document.body using createPortal
  return createPortal(dialogContent, document.body)
}