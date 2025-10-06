'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Copy, Check } from 'lucide-react'
import JSZip from 'jszip'

interface FaviconSize {
  size: number
  name: string
  dataUrl?: string
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
]

export default function FaviconGeneratorClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [favicons, setFavicons] = useState<FaviconSize[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateFavicons = (imageSrc: string) => {
    setIsProcessing(true)
    const img = new Image()
    img.onload = () => {
      const generatedFavicons = FAVICON_SIZES.map((faviconSize) => {
        const canvas = document.createElement('canvas')
        canvas.width = faviconSize.size
        canvas.height = faviconSize.size
        const ctx = canvas.getContext('2d')!

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, faviconSize.size, faviconSize.size)

        return {
          ...faviconSize,
          dataUrl: canvas.toDataURL('image/png'),
        }
      })

      setFavicons(generatedFavicons)
      setIsProcessing(false)
    }
    img.src = imageSrc
  }

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalImage(result)
      generateFavicons(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const downloadAll = async () => {
    const zip = new JSZip()

    // Add each favicon to ZIP
    for (const favicon of favicons) {
      if (favicon.dataUrl) {
        const base64 = favicon.dataUrl.split(',')[1]
        zip.file(favicon.name, base64, { base64: true })
      }
    }

    // Add HTML code
    const htmlCode = `<!-- Favicon HTML -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">`
    zip.file('favicon.html', htmlCode)

    // Generate and download ZIP
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'favicons.zip'
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyHtmlCode = async () => {
    const code = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setOriginalImage(null)
    setFavicons([])
    setIsProcessing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        {!favicons.length ? (
          /* Upload Area */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                      ${
                        isDragging
                          ? 'border-blue-400 bg-blue-400/10 scale-[1.02]'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                      }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />

            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Drop image here or click to upload</p>
            <p className="text-gray-400 text-xs">
              PNG, JPG, SVG • Square images work best • Max 5MB
            </p>

            {isProcessing && (
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 text-cyan-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent" />
                  Generating favicons...
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results */
          <>
            {/* Preview Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Generated Favicons</h3>
                <button
                  onClick={reset}
                  className="text-xs text-gray-400 hover:text-white transition-all"
                >
                  Upload new
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {favicons.map((favicon, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="bg-white rounded p-2 mb-2 inline-block">
                      <img
                        src={favicon.dataUrl}
                        alt={favicon.name}
                        style={{
                          width: Math.min(favicon.size, 48),
                          height: Math.min(favicon.size, 48),
                        }}
                        className="pixelated"
                      />
                    </div>
                    <p className="text-white text-xs font-medium">
                      {favicon.size}×{favicon.size}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={downloadAll}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                         rounded-xl font-medium hover:opacity-90 transition-all 
                         flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download ZIP
              </button>

              <button
                onClick={copyHtmlCode}
                className={`px-6 py-3 rounded-xl font-medium transition-all 
                          flex items-center justify-center gap-2 ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    HTML
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Minimal tip */}
      {!favicons.length && (
        <p className="text-center text-xs text-gray-500 mt-4">
          💡 Use 512×512px or larger for best quality • Simple designs work better as icons
        </p>
      )}
    </div>
  )
}
