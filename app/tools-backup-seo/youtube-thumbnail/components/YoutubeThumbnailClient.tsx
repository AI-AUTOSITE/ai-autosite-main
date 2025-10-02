'use client'

import { useState, memo } from 'react'
import { Youtube, Download, Copy, Check, Loader2 } from 'lucide-react'
import { useYoutubeThumbnail } from '../hooks/useYoutubeThumbnail'

// Memoized thumbnail card component
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

const ThumbnailCard = memo(({ 
  thumbnail, 
  onDownload, 
  onCopy 
}: ThumbnailCardProps) => {
  const [copied, setCopied] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleCopy = async () => {
    const success = await onCopy()  // これで型エラーが解消
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

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">{thumbnail.label}</span>
          <span className="text-gray-400 text-xs">{thumbnail.width}×{thumbnail.height}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
          
          <button
            onClick={onDownload}
            disabled={imageError}
            className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
                     font-medium hover:opacity-90 transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    </div>
  )
})

ThumbnailCard.displayName = 'ThumbnailCard'

export default function YoutubeThumbnailClient() {
  const {
    url,
    setUrl,
    videoId,
    thumbnails,
    error,
    loading,
    getThumbnails,
    downloadThumbnail,
    copyUrl
  } = useYoutubeThumbnail()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      getThumbnails()
    }
  }

  // Quick examples
  const setExample = (exampleUrl: string) => {
    setUrl(exampleUrl)
    // Auto-fetch after setting example
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      if (input) {
        input.focus()
      }
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Input Section - Super Simple */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-red-400 
                       transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!url.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white 
                       rounded-lg font-medium hover:opacity-90 transition-all 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Get'
              )}
            </button>
          </div>

          {/* Quick Examples - Inline */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-gray-500">Try:</span>
            <button
              type="button"
              onClick={() => setExample('https://youtu.be/dQw4w9WgXcQ')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              youtu.be
            </button>
            <span className="text-gray-600">•</span>
            <button
              type="button"
              onClick={() => setExample('https://youtube.com/watch?v=dQw4w9WgXcQ')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              youtube.com
            </button>
            <span className="text-gray-600">•</span>
            <button
              type="button"
              onClick={() => setExample('https://youtube.com/shorts/dQw4w9WgXcQ')}
              className="text-gray-400 hover:text-white transition-colors"
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

      {/* Results - Clean Grid */}
      {thumbnails.length > 0 && (
        <div className="space-y-4">
          {/* Video Link */}
          {videoId && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">Video ID:</span>
              <code className="text-white bg-black/30 px-2 py-1 rounded">{videoId}</code>
            </div>
          )}

          {/* Thumbnails Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {thumbnails.map((thumbnail, index) => (
            <ThumbnailCard
  key={`${videoId}-${index}`}
  thumbnail={thumbnail}
  onDownload={() => downloadThumbnail(thumbnail)}
  onCopy={async () => await copyUrl(thumbnail.url)}
/>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}