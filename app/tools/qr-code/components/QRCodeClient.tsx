'use client'

import { useState, useEffect } from 'react'
import { Download, QrCode, AlertCircle, FileText, Link2, Wifi, Smartphone } from 'lucide-react'
import QRCode from 'qrcode'

type QRSize = 256 | 512 | 1024
type QRType = 'text' | 'url' | 'wifi'

interface QuickAction {
  type: QRType
  label: string
  icon: React.ReactNode
  placeholder: string
  example: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    type: 'text',
    label: 'Text',
    icon: <FileText className="w-4 h-4" />,
    placeholder: 'Enter any text...',
    example: 'Hello World!',
  },
  {
    type: 'url',
    label: 'Link',
    icon: <Link2 className="w-4 h-4" />,
    placeholder: 'Enter website link...',
    example: 'https://example.com',
  },
  {
    type: 'wifi',
    label: 'WiFi',
    icon: <Wifi className="w-4 h-4" />,
    placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
    example: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;',
  },
]

export default function QRCodeClient() {
  const [input, setInput] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [size, setSize] = useState<QRSize>(512)
  const [qrType, setQrType] = useState<QRType>('text')
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
      
      // Auto-adjust size for mobile on first load
      if ((mobile || smallScreen) && size === 512) {
        setSize(512) // Keep medium size for mobile - good balance
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Generate QR code
  useEffect(() => {
    if (!input.trim()) {
      setQrDataUrl('')
      return
    }

    if (input.length > 2000) {
      setError('Text too long (max 2000 characters)')
      setQrDataUrl('')
      return
    }

    setError('')

    // Generate QR code
    QRCode.toDataURL(input, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrDataUrl(url)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not create QR code')
      })
  }, [input, size])

  const handleDownload = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrDataUrl
    link.click()
  }

  const handleClear = () => {
    setInput('')
    setQrDataUrl('')
    setError('')
  }

  const loadExample = () => {
    const currentAction = QUICK_ACTIONS.find((a) => a.type === qrType)
    if (currentAction) {
      setInput(currentAction.example)
    }
  }

  const getSizeLabel = (s: QRSize) => {
    switch (s) {
      case 256:
        return 'Small'
      case 512:
        return 'Med'
      case 1024:
        return 'Large'
    }
  }

  const currentPlaceholder =
    QUICK_ACTIONS.find((a) => a.type === qrType)?.placeholder || 'Enter text...'

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
          <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Mobile Ready</p>
            <p className="text-blue-400/70 text-xs mt-1">
              Long press to save • Works offline
            </p>
          </div>
        </div>
      )}

      {/* Input Section - Tool First */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        {/* Type Selection */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.type}
              onClick={() => setQrType(action.type)}
              className={`flex-1 min-w-[90px] py-3 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                qrType === action.type
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Text Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full h-32 sm:h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white 
                   placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                   transition-colors resize-none font-mono text-sm"
          maxLength={2000}
          spellCheck={false}
        />

        {/* Character count & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3">
          <span className="text-xs text-gray-400">{input.length}/2000 characters</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={loadExample}
              className="flex-1 sm:flex-none px-4 py-3 bg-white/5 text-gray-300 rounded-lg text-sm
                       hover:bg-white/10 transition-all font-medium"
            >
              Example
            </button>
            <button
              onClick={handleClear}
              className="flex-1 sm:flex-none px-4 py-3 bg-white/5 text-gray-300 rounded-lg text-sm
                       hover:bg-white/10 transition-all font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-white/10">
          <span className="text-sm text-gray-400 font-medium">Size:</span>
          <div className="flex gap-2 flex-wrap">
            {([256, 512, 1024] as QRSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg transition-all font-medium ${
                  size === s
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Mobile: Show only number */}
                <span className="sm:hidden text-base">{s}</span>
                {/* Desktop: Show label + size */}
                <span className="hidden sm:inline text-sm">{getSizeLabel(s)} ({s}px)</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* QR Code Display */}
      {qrDataUrl ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
          <div className="flex flex-col items-center">
            {/* QR Code Container */}
            <div className="bg-white p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 w-full max-w-md">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-full h-auto block"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                       rounded-xl font-medium hover:opacity-90 transition-all 
                       flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <Download className="w-5 h-5" />
              <span className="text-base">Save Image</span>
            </button>

            {/* Info */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              {isMobile ? (
                <>Long press to save • {size}×{size}px</>
              ) : (
                <>Right-click to save • {size}×{size}px</>
              )}
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
          <QrCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Your QR code will appear here</p>
          <p className="text-gray-500 text-sm mt-1">Start typing to create</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3 text-sm flex items-center gap-2">
          💡 Quick Tips
        </h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Keep text short (under 300 chars) for best results</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Use "Link" type for websites</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>WiFi format: WIFI:T:WPA;S:NetworkName;P:Password;;</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Always test before printing or sharing</span>
          </div>
          {isMobile && (
            <div className="flex items-start gap-2 pt-2 border-t border-white/10">
              <span className="text-blue-400 flex-shrink-0">📱</span>
              <span className="text-blue-400">
                Works 100% offline on your device
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}