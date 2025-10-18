// app/components/AIToolWarningModal.tsx
'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface AIToolWarningModalProps {
  isOpen: boolean
  onAgree: () => void
  onDisagree: () => void
}

export default function AIToolWarningModal({
  isOpen,
  onAgree,
  onDisagree,
}: AIToolWarningModalProps) {
  const [mounted, setMounted] = useState(false)

  // Mount/unmount handling for SSR
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDisagree()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onDisagree])

  // Prevent body scroll
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

  // Don't render until mounted or if not open
  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      style={{ zIndex: 100000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onDisagree()
        }
      }}
    >
      {/* Add top padding for better spacing */}
      <div className="w-full max-w-2xl pt-12 pb-8">
        <div
          className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500/50 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-orange-500/50 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  ⚠️ Important: AI Tool Safety Warning
                </h2>
                <p className="text-gray-300 text-sm">
                  Please read carefully before using this AI-powered tool
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* What happens */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-blue-300 font-semibold mb-2 text-sm sm:text-base">
                📤 What Happens to Your Data:
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Your input will be sent to Claude API (operated by Anthropic) for processing.
                While your data is not stored after processing, it temporarily passes through
                external servers.
              </p>
            </div>

            {/* Do NOT upload */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-red-300 font-semibold mb-3 text-sm sm:text-base">
                ❌ DO NOT Upload:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-300">
                <div>• Personal information</div>
                <div>• Medical records</div>
                <div>• Confidential business data</div>
                <div>• Legal documents</div>
                <div>• Trade secrets</div>
                <div>• Customer data</div>
                <div>• Proprietary code</div>
                <div>• Financial information</div>
              </div>
            </div>

            {/* Safe to use */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-green-300 font-semibold mb-3 text-sm sm:text-base">
                ✅ Safe to Use With:
              </h3>
              <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                <div>• Sample or dummy data</div>
                <div>• Anonymized content</div>
                <div>• Public information</div>
                <div>• Generic questions</div>
              </div>
            </div>

            {/* Your responsibility */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-yellow-300 font-semibold mb-2 text-sm sm:text-base">
                ⚖️ Your Responsibility:
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                <strong>You are solely responsible</strong> for ensuring the data you upload is
                appropriate and non-sensitive. We cannot guarantee what happens to data processed
                by third-party APIs.
              </p>
            </div>

            {/* Learn more */}
            <div className="text-center text-xs sm:text-sm">
              <Link
                href="/privacy-policy"
                className="text-cyan-400 hover:text-cyan-300 underline"
                target="_blank"
              >
                Read our Privacy Policy
              </Link>
              <span className="text-gray-500 mx-2">•</span>
              <Link
                href="/faq"
                className="text-cyan-400 hover:text-cyan-300 underline"
                target="_blank"
              >
                AI Tools Safety Guide
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 sm:p-6 bg-slate-800/95 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onDisagree}
                className="flex-1 px-4 sm:px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onAgree}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all font-semibold text-sm sm:text-base shadow-lg"
              >
                I Understand & Agree
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Your agreement will be saved locally. You won't see this message again on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // ✅ CRITICAL: Render to document.body using createPortal
  return createPortal(modalContent, document.body)
}