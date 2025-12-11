'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Download, Copy, Check, Type, Smile, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react'
import JSZip from 'jszip'

type GeneratorMode = 'image' | 'text' | 'emoji'

interface FaviconSize {
  size: number
  name: string
  purpose: string
  dataUrl?: string
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png', purpose: 'Browser tab (small)' },
  { size: 32, name: 'favicon-32x32.png', purpose: 'Browser tab (standard)' },
  { size: 48, name: 'favicon-48x48.png', purpose: 'Windows site icon' },
  { size: 180, name: 'apple-touch-icon.png', purpose: 'iOS home screen' },
  { size: 192, name: 'android-chrome-192x192.png', purpose: 'Android home screen' },
  { size: 512, name: 'android-chrome-512x512.png', purpose: 'PWA splash screen' },
]

const POPULAR_EMOJIS = ['🚀', '⭐', '💡', '🎯', '🔥', '💎', '🎨', '📱', '💻', '🌟', '⚡', '🎮', '📊', '🔧', '🌈', '❤️', '✨', '🎉', '📝', '🔔']

const FONT_OPTIONS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Arial Bold', value: 'Arial Black, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier', value: 'Courier New, monospace' },
  { name: 'Impact', value: 'Impact, sans-serif' },
]

const COLOR_PRESETS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#000000', '#ffffff', '#6b7280',
]

export default function FaviconGeneratorClient() {
  const [mode, setMode] = useState<GeneratorMode>('image')
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [favicons, setFavicons] = useState<FaviconSize[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Text mode state
  const [text, setText] = useState('AB')
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#3b82f6')
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif')
  const [borderRadius, setBorderRadius] = useState(20)
  
  // Emoji mode state
  const [selectedEmoji, setSelectedEmoji] = useState('🚀')
  const [emojiBgColor, setEmojiBgColor] = useState('#3b82f6')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // High-quality stepdown resize
  const stepdownResize = useCallback((img: HTMLImageElement, targetSize: number): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    let currentWidth = img.width
    let currentHeight = img.height
    let currentCanvas = document.createElement('canvas')
    currentCanvas.width = img.width
    currentCanvas.height = img.height
    const currentCtx = currentCanvas.getContext('2d')!
    currentCtx.drawImage(img, 0, 0)
    
    // Step down by 50% until close to target
    while (currentWidth > targetSize * 2 && currentHeight > targetSize * 2) {
      const halfWidth = currentWidth / 2
      const halfHeight = currentHeight / 2
      
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = halfWidth
      tempCanvas.height = halfHeight
      const tempCtx = tempCanvas.getContext('2d')!
      
      tempCtx.imageSmoothingEnabled = true
      tempCtx.imageSmoothingQuality = 'high'
      tempCtx.drawImage(currentCanvas, 0, 0, halfWidth, halfHeight)
      
      currentCanvas = tempCanvas
      currentWidth = halfWidth
      currentHeight = halfHeight
    }
    
    // Final resize to target
    canvas.width = targetSize
    canvas.height = targetSize
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(currentCanvas, 0, 0, targetSize, targetSize)
    
    return canvas.toDataURL('image/png')
  }, [])

  // Generate favicons from image
  const generateFromImage = useCallback((imageSrc: string) => {
    setIsProcessing(true)
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const generatedFavicons = FAVICON_SIZES.map((faviconSize) => ({
        ...faviconSize,
        dataUrl: stepdownResize(img, faviconSize.size),
      }))
      setFavicons(generatedFavicons)
      setOriginalImage(imageSrc)
      setIsProcessing(false)
    }
    img.onerror = () => setIsProcessing(false)
    img.src = imageSrc
  }, [stepdownResize])

  // Generate favicons from text
  const generateFromText = useCallback(() => {
    setIsProcessing(true)
    
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Background with rounded corners
    ctx.fillStyle = bgColor
    if (borderRadius > 0) {
      const r = (borderRadius / 100) * 256
      ctx.beginPath()
      ctx.moveTo(r, 0)
      ctx.lineTo(512 - r, 0)
      ctx.quadraticCurveTo(512, 0, 512, r)
      ctx.lineTo(512, 512 - r)
      ctx.quadraticCurveTo(512, 512, 512 - r, 512)
      ctx.lineTo(r, 512)
      ctx.quadraticCurveTo(0, 512, 0, 512 - r)
      ctx.lineTo(0, r)
      ctx.quadraticCurveTo(0, 0, r, 0)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, 512, 512)
    }
    
    // Text
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Auto-size font based on text length
    const fontSize = text.length <= 2 ? 280 : text.length <= 4 ? 180 : 120
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    ctx.fillText(text.slice(0, 4), 256, 270)
    
    const imageSrc = canvas.toDataURL('image/png')
    generateFromImage(imageSrc)
  }, [text, textColor, bgColor, fontFamily, borderRadius, generateFromImage])

  // Generate favicons from emoji
  const generateFromEmoji = useCallback(() => {
    setIsProcessing(true)
    
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Background
    ctx.fillStyle = emojiBgColor
    ctx.beginPath()
    ctx.arc(256, 256, 256, 0, Math.PI * 2)
    ctx.fill()
    
    // Emoji
    ctx.font = '350px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(selectedEmoji, 256, 280)
    
    const imageSrc = canvas.toDataURL('image/png')
    generateFromImage(imageSrc)
  }, [selectedEmoji, emojiBgColor, generateFromImage])

  // Generate preview on settings change
  useEffect(() => {
    if (mode === 'text' && text) {
      const timer = setTimeout(generateFromText, 300)
      return () => clearTimeout(timer)
    }
  }, [mode, text, textColor, bgColor, fontFamily, borderRadius, generateFromText])

  useEffect(() => {
    if (mode === 'emoji') {
      const timer = setTimeout(generateFromEmoji, 300)
      return () => clearTimeout(timer)
    }
  }, [mode, selectedEmoji, emojiBgColor, generateFromEmoji])

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      generateFromImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  // Generate manifest.json content
  const generateManifest = () => {
    return JSON.stringify({
      name: 'My App',
      short_name: 'App',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: bgColor || '#3b82f6',
      background_color: bgColor || '#3b82f6',
      display: 'standalone',
    }, null, 2)
  }

  // Generate browserconfig.xml content
  const generateBrowserConfig = () => {
    return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>${bgColor || '#3b82f6'}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`
  }

  const downloadAll = async () => {
    const zip = new JSZip()

    // Add PNG favicons
    for (const favicon of favicons) {
      if (favicon.dataUrl) {
        const base64 = favicon.dataUrl.split(',')[1]
        zip.file(favicon.name, base64, { base64: true })
      }
    }

    // Add favicon.ico (using 32x32)
    const favicon32 = favicons.find(f => f.size === 32)
    if (favicon32?.dataUrl) {
      zip.file('favicon.ico', favicon32.dataUrl.split(',')[1], { base64: true })
    }

    // Add manifest.json
    zip.file('site.webmanifest', generateManifest())
    
    // Add browserconfig.xml
    zip.file('browserconfig.xml', generateBrowserConfig())

    // Add HTML code
    const htmlCode = `<!-- Favicon HTML - Add to <head> -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${bgColor || '#3b82f6'}">
<meta name="theme-color" content="${bgColor || '#3b82f6'}">`
    zip.file('favicon-html.txt', htmlCode)

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
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setOriginalImage(null)
    setFavicons([])
    setIsProcessing(false)
  }

  const favicon32 = favicons.find(f => f.size === 32)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Mode Selector */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 mb-6">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setMode('image'); reset() }}
            className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'image'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Image</span>
          </button>
          <button
            onClick={() => setMode('text')}
            className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'text'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button
            onClick={() => setMode('emoji')}
            className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'emoji'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span className="hidden sm:inline">Emoji</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Image Mode */}
        {mode === 'image' && !favicons.length && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                      ${isDragging
                        ? 'border-blue-400 bg-blue-400/10 scale-[1.02]'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
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
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drop image or click</p>
            <p className="text-gray-400 text-sm">PNG, JPG, SVG • Square images work best</p>
          </div>
        )}

        {/* Text Mode */}
        {mode === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="text-white font-medium mb-2 block">Text (1-4 characters)</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 4))}
                maxLength={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-2xl text-center
                         focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="AB"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        textColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Background</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        bgColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white
                         focus:outline-none focus:border-purple-400"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value} className="bg-gray-900">
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Corner Radius: {borderRadius}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Emoji Mode */}
        {mode === 'emoji' && (
          <div className="space-y-4">
            <div>
              <label className="text-white font-medium mb-2 block">Select Emoji</label>
              <div className="grid grid-cols-10 gap-2">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-white/20 scale-110'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEmojiBgColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      emojiBgColor === color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {favicons.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            {/* Browser Tab Preview */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">Browser Tab Preview</span>
              </div>
              <div className="bg-gray-800 rounded-t-xl p-2">
                <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 max-w-xs">
                  {favicon32?.dataUrl && (
                    <img src={favicon32.dataUrl} alt="favicon" className="w-4 h-4" />
                  )}
                  <span className="text-gray-300 text-sm truncate">My Website - Home</span>
                </div>
              </div>
              <div className="bg-white h-16 rounded-b-xl"></div>
            </div>

            {/* Generated Icons Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Generated Icons</h3>
                {mode !== 'image' && (
                  <button
                    onClick={() => mode === 'text' ? generateFromText() : generateFromEmoji()}
                    className="text-sm text-gray-400 hover:text-white transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                )}
                {mode === 'image' && (
                  <button onClick={reset} className="text-sm text-gray-400 hover:text-white">
                    New Image
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {favicons.map((favicon, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-2 text-center">
                    <div className="bg-white rounded p-1 mb-1 inline-block">
                      <img
                        src={favicon.dataUrl}
                        alt={favicon.name}
                        style={{
                          width: Math.min(favicon.size, 32),
                          height: Math.min(favicon.size, 32),
                        }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">{favicon.size}px</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadAll}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                         rounded-xl font-medium hover:opacity-90 transition-all 
                         flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download All</span>
              </button>

              <button
                onClick={copyHtmlCode}
                className={`sm:flex-none px-6 py-3 rounded-xl font-medium transition-all 
                          flex items-center justify-center gap-2 ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-cyan-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent" />
              <span className="text-sm">Generating icons...</span>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Download includes: PNG icons, manifest.json, browserconfig.xml, and HTML code
        </p>
      </div>
    </div>
  )
}