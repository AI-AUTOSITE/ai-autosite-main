'use client'

import { useState, memo, useEffect } from 'react'
import { Youtube, Download, Copy, Check, Loader2, Smartphone } from 'lucide-react'
import { useYoutubeThumbnail } from '../hooks/useYoutubeThumbnail'

interface ThumbnailCardProps {
  thumbnail: {
    quality: string
    url: string
    width: number
    height: number
    label: string
  }
  onDownload: () => Promise<boolean>
  onCopy: () => Promise<boolean>
}

const ThumbnailCard = memo(({ thumbnail, onDownload, onCopy }: ThumbnailCardProps) => {
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleCopy = async () => {
    const success = await onCopy()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-video bg-black/20">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Not available</p>
          </div>
        ) : (
          <img
            src={thumbnail.url}
            alt={thumbnail.label}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>

      {/* Actions - 48px minimum height */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium text-sm sm:text-base">{thumbnail.label}</span>
          <span className="text-gray-400 text-xs">
            {thumbnail.width} x {thumbnail.height}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 min-h-[48px] py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 active:scale-95 ${
              copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            disabled={imageError}
            className="flex-1 min-h-[48px] py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
                     font-medium hover:opacity-90 transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
        </div>
      </div>
    </div>
  )
})

ThumbnailCard.displayName = 'ThumbnailCard'

export default function YoutubeThumbnailClient() {
  const [isMobile, setIsMobile] = useState(false)
  const {
    url,
    setUrl,
    videoId,
    thumbnails,
    error,
    loading,
    getThumbnails,
    downloadThumbnail,
    copyUrl,
  } = useYoutubeThumbnail()

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      getThumbnails()
    }
  }

  // Quick examples - prevent focus loss
  const setExample = (exampleUrl: string, e: React.MouseEvent) => {
    e.preventDefault()
    setUrl(exampleUrl)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-300 font-medium text-sm">Mobile Optimized</p>
            <p className="text-red-400/70 text-xs mt-1 leading-relaxed">
              Download HD thumbnails - All sizes - Works offline
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-4 py-3 sm:py-3.5 bg-black/30 border border-white/10 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-red-400 
                       transition-colors text-base"
              autoFocus={!isMobile}
            />
            <button
              type="submit"
              disabled={!url.trim() || loading}
              className="min-h-[48px] px-8 bg-gradient-to-r from-red-500 to-red-600 text-white 
                       rounded-lg font-medium hover:opacity-90 transition-all 
                       disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
                       flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get'}
            </button>
          </div>

          {/* Quick Examples */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500">Try:</span>
            <button
              type="button"
              onMouseDown={(e) => setExample('https://youtu.be/dQw4w9WgXcQ', e)}
              className="text-gray-400 hover:text-white transition-colors min-h-[32px] px-2"
            >
              youtu.be
            </button>
            <span className="text-gray-600">-</span>
            <button
              type="button"
              onMouseDown={(e) => setExample('https://youtube.com/watch?v=dQw4w9WgXcQ', e)}
              className="text-gray-400 hover:text-white transition-colors min-h-[32px] px-2"
            >
              youtube.com
            </button>
            <span className="text-gray-600">-</span>
            <button
              type="button"
              onMouseDown={(e) => setExample('https://youtube.com/shorts/dQw4w9WgXcQ', e)}
              className="text-gray-400 hover:text-white transition-colors min-h-[32px] px-2"
            >
              shorts
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {thumbnails.length > 0 && (
        <div className="space-y-4">
          {/* Video ID */}
          {videoId && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">Video ID:</span>
              <code className="text-white bg-black/30 px-2 py-1 rounded break-all">{videoId}</code>
            </div>
          )}

          {/* Thumbnails Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {thumbnails.map((thumbnail, index) => (
              <ThumbnailCard
                key={`${videoId}-${index}`}
                thumbnail={thumbnail}
                onDownload={() => downloadThumbnail(thumbnail)}
                onCopy={async () => await copyUrl(thumbnail.url)}
              />
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-xs leading-relaxed">
              <strong className="font-semibold">Legal Notice:</strong> Thumbnails are copyrighted by their respective owners. 
              This tool is for personal reference only. Commercial use or redistribution 
              may require permission from the content creator.
            </p>
          </div>
        </div>
      )}

      {/* Mobile tip */}
      {isMobile && thumbnails.length > 0 && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-xs text-center leading-relaxed">
            All processing happens on your device - No data sent anywhere
          </p>
        </div>
      )}
    </div>
  )
}