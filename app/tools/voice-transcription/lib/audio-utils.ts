// app/tools/voice-transcription/lib/audio-utils.ts

/**
 * Supported audio formats for transcription
 */
export const SUPPORTED_FORMATS = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/flac',
  'audio/m4a',
  'audio/x-m4a',
  'video/mp4',
  'video/webm',
]

/**
 * File size limits
 */
export const MAX_FILE_SIZE_DESKTOP = 500 * 1024 * 1024 // 500MB
export const MAX_FILE_SIZE_TABLET = 100 * 1024 * 1024 // 100MB for tablet
export const MAX_FILE_SIZE_MOBILE = 50 * 1024 * 1024 // 50MB for mobile

/**
 * Validate audio file
 * @param isMobileOrTablet - true if mobile or tablet device
 */
export function validateAudioFile(file: File, isMobileOrTablet: boolean): string | null {
  // Use smaller limit for mobile/tablet devices
  const maxSize = isMobileOrTablet ? MAX_FILE_SIZE_TABLET : MAX_FILE_SIZE_DESKTOP
  
  const isSupported = SUPPORTED_FORMATS.some(format => 
    file.type.includes(format.split('/')[1])
  )
  
  if (!isSupported) {
    return 'Unsupported format. Please use MP3, WAV, M4A, MP4, or WebM.'
  }
  
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024))
    return `File too large. Maximum size is ${maxMB}MB${isMobileOrTablet ? ' on this device' : ''}.`
  }
  
  return null
}

/**
 * Convert AudioBuffer to mono 16kHz Float32Array for Whisper
 */
export function convertToMono16kHz(audioBuffer: AudioBuffer): Float32Array {
  const targetSampleRate = 16000
  const numChannels = audioBuffer.numberOfChannels
  const duration = audioBuffer.duration
  const targetLength = Math.ceil(duration * targetSampleRate)
  const result = new Float32Array(targetLength)

  for (let i = 0; i < targetLength; i++) {
    const sourceIndex = (i / targetSampleRate) * audioBuffer.sampleRate
    let sum = 0
    for (let ch = 0; ch < numChannels; ch++) {
      const channelData = audioBuffer.getChannelData(ch)
      const idx = Math.floor(sourceIndex)
      sum += channelData[idx] || 0
    }
    result[i] = sum / numChannels
  }

  return result
}

/**
 * Format seconds to time string (MM:SS or HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Format SRT timestamp
 */
export function formatSRTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
