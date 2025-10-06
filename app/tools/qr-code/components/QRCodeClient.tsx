'use client'

import { useState, useEffect } from 'react'
import { Download, QrCode, AlertCircle, FileText, Link2, Wifi } from 'lucide-react'
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
    label: 'URL',
    icon: <Link2 className="w-4 h-4" />,
    placeholder: 'Enter website URL...',
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
        return 'Medium'
      case 1024:
        return 'Large'
    }
  }

  const currentPlaceholder =
    QUICK_ACTIONS.find((a) => a.type === qrType)?.placeholder || 'Enter text...'

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Input Section - Tool First */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Type Selection */}
        <div className="flex gap-2 mb-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.type}
              onClick={() => setQrType(action.type)}
              className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                qrType === action.type
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Text Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white 
                   placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                   transition-colors resize-none font-mono text-sm"
          maxLength={2000}
          spellCheck={false}
        />

        {/* Character count & Actions */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">{input.length}/2000 characters</span>
          <div className="flex gap-2">
            <button
              onClick={loadExample}
              className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-sm
                       hover:bg-white/10 transition-all"
            >
              Try Example
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg text-sm
                       hover:bg-white/10 transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
          <span className="text-sm text-gray-400">Size:</span>
          <div className="flex gap-2">
            {([256, 512, 1024] as QRSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  size === s
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {getSizeLabel(s)} ({s}px)
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
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col items-center">
            {/* QR Code Container */}
            <div className="bg-white p-6 rounded-xl mb-6">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="max-w-full h-auto block"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                       rounded-xl font-medium hover:opacity-90 transition-all 
                       flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>

            {/* Info */}
            <p className="text-xs text-gray-400 mt-3">
              Right-click to save image • {size}x{size}px
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
          <QrCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Your QR code will appear here</p>
          <p className="text-gray-500 text-sm mt-1">Start typing above to generate</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-2 text-sm">Quick Tips</h3>
        <div className="space-y-1 text-xs text-gray-400">
          <div>• QR codes work best with short text</div>
          <div>• Use URL type for websites</div>
          <div>• WiFi format: WIFI:T:WPA;S:Name;P:Pass;;</div>
          <div>• Test your code before printing</div>
        </div>
      </div>
    </div>
  )
}
