// ============================================
// Floating Mini Preview Component (FAB Style)
// ============================================

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Download, X, ChevronUp } from 'lucide-react'
import { OutputFormat } from '../lib/types'

interface FloatingPreviewProps {
  isGenerated: boolean
  backgroundColor: string
  outputFormat: OutputFormat
  onDownload: () => void
  qrRef: React.RefObject<HTMLDivElement | null>
}

export function FloatingPreview({
  isGenerated,
  backgroundColor,
  outputFormat,
  onDownload,
  qrRef,
}: FloatingPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const floatingQrRef = useRef<HTMLDivElement>(null)
  const expandedQrRef = useRef<HTMLDivElement>(null)

  // Show floating preview when scrolled past the main preview
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 350)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clone QR code SVG function
  const cloneQRCode = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    // Clone to FAB button
    if (floatingQrRef.current) {
      const clonedSvg = svg.cloneNode(true) as SVGElement
      clonedSvg.style.width = '100%'
      clonedSvg.style.height = '100%'
      floatingQrRef.current.innerHTML = ''
      floatingQrRef.current.appendChild(clonedSvg)
    }

    // Clone to expanded view
    if (expandedQrRef.current) {
      const clonedSvg = svg.cloneNode(true) as SVGElement
      clonedSvg.style.width = '100%'
      clonedSvg.style.height = '100%'
      expandedQrRef.current.innerHTML = ''
      expandedQrRef.current.appendChild(clonedSvg)
    }
  }, [qrRef])

  // Update QR code clone periodically when visible
  useEffect(() => {
    if (!isVisible || !isGenerated) return

    // Initial clone
    cloneQRCode()

    // Set up interval to sync changes (every 200ms)
    const interval = setInterval(cloneQRCode, 200)

    return () => clearInterval(interval)
  }, [isVisible, isGenerated, cloneQRCode])

  // Also update when expanded state changes
  useEffect(() => {
    if (isExpanded && isGenerated) {
      cloneQRCode()
    }
  }, [isExpanded, isGenerated, cloneQRCode])

  // Don't render if not generated or not visible
  if (!isGenerated || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded View */}
      {isExpanded ? (
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>

          {/* QR Preview */}
          <div
            className="w-32 h-32 rounded-lg overflow-hidden mb-2 p-1"
            style={{ backgroundColor }}
          >
            <div 
              ref={expandedQrRef}
              className="w-full h-full [&>svg]:max-w-full [&>svg]:max-h-full"
            />
          </div>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="w-full px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                     rounded-lg text-xs font-medium hover:opacity-90 transition-all 
                     flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/30"
          >
            <Download className="w-3 h-3" />
            <span>{outputFormat.toUpperCase()}</span>
          </button>
        </div>
      ) : (
        /* Collapsed FAB Button */
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full 
                   shadow-lg shadow-cyan-600/40 hover:shadow-xl hover:shadow-cyan-600/50 
                   transition-all hover:scale-105 flex items-center justify-center"
        >
          {/* Mini QR Preview inside FAB */}
          <div
            className="w-10 h-10 rounded-lg overflow-hidden p-0.5"
            style={{ backgroundColor }}
          >
            <div 
              ref={floatingQrRef}
              className="w-full h-full [&>svg]:max-w-full [&>svg]:max-h-full"
            />
          </div>
          
          {/* Hover tooltip */}
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded 
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            View QR Code
          </span>
        </button>
      )}

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -left-12 bottom-0 w-10 h-10 bg-white/10 backdrop-blur rounded-full 
                 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        title="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}
