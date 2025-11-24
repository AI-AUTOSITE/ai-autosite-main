// ============================================
// QR Preview Component (Normal View Only)
// ============================================

import { Download, QrCode, AlertCircle } from 'lucide-react'
import { QRSize, OutputFormat, ErrorCorrectionLevel } from '../lib/types'

interface QRPreviewProps {
  qrRef: React.RefObject<HTMLDivElement | null>
  isGenerated: boolean
  error: string
  backgroundColor: string
  size: QRSize
  outputFormat: OutputFormat
  errorLevel: ErrorCorrectionLevel
  onDownload: () => void
}

export function QRPreview({
  qrRef,
  isGenerated,
  error,
  backgroundColor,
  size,
  outputFormat,
  errorLevel,
  onDownload,
}: QRPreviewProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* QR Code Container */}
      <div className="flex flex-col items-center">
        {/* QR Code Wrapper */}
        <div
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden mb-4 p-2 flex items-center justify-center"
          style={{ backgroundColor: isGenerated ? backgroundColor : 'transparent' }}
        >
          {/* QR Code Render Target */}
          <div
            ref={qrRef}
            className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
          />

          {/* Placeholder */}
          {!isGenerated && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium text-sm">Your QR code</p>
                <p className="text-gray-500 text-xs mt-1">Start typing</p>
              </div>
            </div>
          )}
        </div>

        {/* Download Button */}
        {isGenerated && (
          <>
            <button
              onClick={onDownload}
              className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                       rounded-xl font-medium hover:opacity-90 transition-all 
                       flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download {outputFormat.toUpperCase()}</span>
            </button>

            {/* Info */}
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              {size}×{size}px • {outputFormat.toUpperCase()} • {errorLevel}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
