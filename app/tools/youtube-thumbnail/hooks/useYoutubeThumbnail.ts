import { useState, useCallback } from 'react'

interface ThumbnailOption {
  quality: string
  url: string
  width: number
  height: number
  label: string
}

// Vibration helper
const vibrate = (duration: number) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^#&?]*).*/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1] && match[1].length === 11) {
      return match[1]
    }
  }

  try {
    const urlObj = new URL(url)
    const videoId = urlObj.searchParams.get('v')
    if (videoId && videoId.length === 11) {
      return videoId
    }
  } catch {
    // Invalid URL format
  }

  return null
}

// Generate thumbnail URLs
const getThumbnailOptions = (videoId: string): ThumbnailOption[] => [
  {
    quality: 'maxresdefault',
    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    width: 1280,
    height: 720,
    label: 'HD (1280 x 720)',
  },
  {
    quality: 'sddefault',
    url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    width: 640,
    height: 480,
    label: 'SD (640 x 480)',
  },
  {
    quality: 'mqdefault',
    url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    width: 320,
    height: 180,
    label: 'Medium (320 x 180)',
  },
]

export function useYoutubeThumbnail() {
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<ThumbnailOption[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getThumbnails = useCallback(() => {
    setError('')
    setLoading(true)

    const id = extractVideoId(url.trim())
    if (!id) {
      setError('Please enter a valid YouTube URL')
      setVideoId(null)
      setThumbnails([])
      setLoading(false)
      vibrate(50)
      return
    }

    setVideoId(id)
    const options = getThumbnailOptions(id)
    setThumbnails(options)
    setLoading(false)
    vibrate(30)
  }, [url])

  const downloadThumbnail = useCallback(async (thumbnail: ThumbnailOption) => {
    try {
      const response = await fetch(thumbnail.url)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `youtube-thumbnail-${thumbnail.quality}.jpg`
      link.click()

      URL.revokeObjectURL(blobUrl)
      vibrate(30)
      return true
    } catch {
      setError('Download failed. Try right-click > Save Image')
      vibrate(50)
      return false
    }
  }, [])

  const copyUrl = useCallback(async (urlToCopy: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(urlToCopy)
      vibrate(30)
      return true
    } catch {
      setError('Could not copy URL')
      vibrate(50)
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setUrl('')
    setVideoId(null)
    setThumbnails([])
    setError('')
    setLoading(false)
  }, [])

  return {
    url,
    setUrl,
    videoId,
    thumbnails,
    error,
    loading,
    getThumbnails,
    downloadThumbnail,
    copyUrl,
    reset,
  }
}