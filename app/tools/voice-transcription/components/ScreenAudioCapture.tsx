// app/tools/voice-transcription/components/ScreenAudioCapture.tsx
'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Monitor, 
  Square, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  Trash2,
  Brain,
  Loader2,
} from 'lucide-react'
import { formatTime } from '../lib/audio-utils'
import { useRealtimeWhisper } from '../hooks/useRealtimeWhisper'
import { SUPPORTED_LANGUAGES } from '../lib/types'

interface ScreenAudioCaptureProps {
  onCaptureComplete: (blob: Blob) => void
  disabled?: boolean
  maxDuration?: number
}

type RealtimeMode = 'off' | 'whisper'

export default function ScreenAudioCapture({
  onCaptureComplete,
  disabled = false,
  maxDuration = 600,
}: ScreenAudioCaptureProps) {
  // Basic capture state
  const [isCapturing, setIsCapturing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  // Realtime transcription state
  const [realtimeMode, setRealtimeMode] = useState<RealtimeMode>('off')
  const [language, setLanguage] = useState('ja')
  const [copied, setCopied] = useState(false)

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Whisper hook (for accurate mode)
  const whisper = useRealtimeWhisper({
    modelId: 'Xenova/whisper-tiny',
    language: language,
    chunkDuration: 5,
  })

  // Get current transcript
  const currentTranscript = realtimeMode === 'whisper' ? whisper.transcript : ''

  // Load Whisper model when mode changes
  useEffect(() => {
    if (realtimeMode === 'whisper' && !whisper.isModelLoaded) {
      whisper.loadModel()
    }
  }, [realtimeMode, whisper.isModelLoaded])

  // Check browser support
  useEffect(() => {
    const supported = typeof navigator !== 'undefined' && 
      typeof navigator.mediaDevices !== 'undefined' &&
      typeof navigator.mediaDevices.getDisplayMedia !== 'undefined'
    setIsSupported(supported)
  }, [])

  // Cleanup
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Start capturing
  const startCapture = useCallback(async () => {
    try {
      setError(null)
      cleanup()
      chunksRef.current = []

      // Request screen sharing with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      })

      // Check if audio track exists
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        stream.getTracks().forEach(track => track.stop())
        setError('No audio track found. Please check "Share system audio" when selecting the screen.')
        return
      }

      // Stop video track (we only need audio)
      stream.getVideoTracks().forEach(track => track.stop())

      // Create audio-only stream
      const audioStream = new MediaStream(audioTracks)
      streamRef.current = audioStream

      // Start realtime transcription if enabled
      if (realtimeMode === 'whisper' && whisper.isModelLoaded) {
        whisper.startProcessing(audioStream)
      }

      // Determine supported format
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', '']
      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (mimeType === '' || MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      const recorderOptions: MediaRecorderOptions = {}
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType
      }

      const mediaRecorder = new MediaRecorder(audioStream, recorderOptions)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: actualMimeType })
        const url = URL.createObjectURL(blob)

        setAudioBlob(blob)
        setAudioUrl(url)
        setIsCapturing(false)
        onCaptureComplete(blob)

        // Stop realtime transcription
        if (realtimeMode === 'whisper') {
          whisper.stopProcessing()
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.onerror = () => {
        setError('Recording error occurred')
        setIsCapturing(false)
      }

      // Handle stream end
      audioTracks[0].onended = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop()
        }
      }

      // Start recording
      mediaRecorder.start(500)
      startTimeRef.current = Date.now()
      setIsCapturing(true)
      setDuration(0)

      // Timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(elapsed)

        if (elapsed >= maxDuration) {
          stopCapture()
        }
      }, 100)

    } catch (err) {
      console.error('Screen capture error:', err)
      
      let errorMessage = 'Failed to capture screen audio'
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Screen sharing was cancelled or denied.'
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'Screen audio capture is not supported in this browser.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    }
  }, [cleanup, maxDuration, onCaptureComplete, realtimeMode, whisper])

  // Stop capturing
  const stopCapture = useCallback(() => {
    if (mediaRecorderRef.current && isCapturing) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      mediaRecorderRef.current.stop()
    }
  }, [isCapturing])

  // Reset
  const reset = useCallback(() => {
    cleanup()
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setError(null)
    chunksRef.current = []
    
    // Reset transcription
    if (realtimeMode === 'whisper') {
      whisper.reset()
    }
  }, [cleanup, audioUrl, realtimeMode, whisper])

  // Copy transcript
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentTranscript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [currentTranscript])

  // Download transcript
  const handleDownload = useCallback(() => {
    const blob = new Blob([currentTranscript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `screen-transcript-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [currentTranscript])

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
        <Monitor className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-yellow-400 text-sm">
          Screen audio capture is not supported in this browser.
          <br />
          Please use Chrome or Edge.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Realtime Mode Selection */}
      <div className="p-4 bg-gray-800/50 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">🎯 Real-time Transcription</span>
          <div className="flex gap-2">
            <button
              onClick={() => setRealtimeMode('off')}
              disabled={isCapturing}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all
                ${realtimeMode === 'off'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              Off
            </button>
            <button
              onClick={() => setRealtimeMode('whisper')}
              disabled={isCapturing}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all
                ${realtimeMode === 'whisper'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Brain className="w-3 h-3" />
              Whisper AI
            </button>
          </div>
        </div>

        {/* Whisper model loading status */}
        {realtimeMode === 'whisper' && !whisper.isModelLoaded && (
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            Loading Whisper model... {whisper.modelLoadProgress}%
          </div>
        )}

        {realtimeMode === 'whisper' && whisper.isModelLoaded && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Check className="w-3 h-3" />
            Model ready! Transcription will appear in real-time (5s delay)
          </div>
        )}

        {/* Language selection for realtime */}
        {realtimeMode !== 'off' && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isCapturing}
              className="flex-1 p-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs
                       focus:border-purple-500 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SUPPORTED_LANGUAGES.slice(0, 15).map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">How to capture system audio:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-300/80 text-xs">
              <li>Click "Start Capture" below</li>
              <li>Select a Chrome tab or window with audio</li>
              <li><strong>Check "Share system audio"</strong> (important!)</li>
              <li>Click "Share" to start capturing</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Capture Status */}
      {isCapturing && (
        <div className="flex items-center justify-center gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-mono text-2xl">
            {formatTime(duration)}
          </span>
          <span className="text-gray-400 text-sm">
            / {formatTime(maxDuration)}
          </span>
          {realtimeMode === 'whisper' && (
            <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-1 rounded">
              🎯 Real-time ON
            </span>
          )}
        </div>
      )}

      {/* Real-time Transcript Display */}
      {realtimeMode !== 'off' && (isCapturing || currentTranscript) && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">📝 Live Transcript</span>
            {currentTranscript && (
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            )}
          </div>
          <div className="min-h-[150px] max-h-[300px] p-4 bg-gray-900/50 rounded-xl overflow-y-auto border border-gray-700">
            {currentTranscript ? (
              <p className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                {currentTranscript}
              </p>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                {isCapturing 
                  ? '🎧 Listening... Text will appear every 5 seconds' 
                  : 'Start capturing to see real-time transcript'
                }
              </p>
            )}
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {audioUrl && !isCapturing && (
        <div className="p-4 bg-gray-700/50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">🎵 Captured Audio</span>
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
          <audio src={audioUrl} controls className="w-full h-10" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {!isCapturing && !audioBlob && (
          <button
            onClick={startCapture}
            disabled={disabled || (realtimeMode === 'whisper' && !whisper.isModelLoaded)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 
                     text-white rounded-xl font-medium transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {realtimeMode === 'whisper' && !whisper.isModelLoaded ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Model...
              </>
            ) : (
              <>
                <Monitor className="w-5 h-5" />
                Start Capture
              </>
            )}
          </button>
        )}

        {isCapturing && (
          <button
            onClick={stopCapture}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 
                     text-white rounded-xl font-medium transition-all"
          >
            <Square className="w-5 h-5" />
            Stop Capture
          </button>
        )}

        {audioBlob && !isCapturing && (
          <>
            <button
              onClick={reset}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-500 
                       text-white rounded-xl font-medium transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Discard
            </button>
            <button
              onClick={() => {
                reset()
                setTimeout(startCapture, 100)
              }}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 
                       text-white rounded-xl font-medium transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Monitor className="w-5 h-5" />
              New Capture
            </button>
          </>
        )}
      </div>

      {/* Help Text */}
      {!isCapturing && !audioBlob && (
        <p className="text-gray-400 text-xs text-center">
          📺 Capture audio from YouTube, live streams, or any browser tab.
          {realtimeMode === 'whisper' && (
            <span className="text-purple-400 block mt-1">
              🎯 Real-time transcription enabled - text appears every 5 seconds!
            </span>
          )}
        </p>
      )}

      {/* Stats */}
      {currentTranscript && (
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <span>📊 {currentTranscript.split(/\s+/).filter(Boolean).length} words</span>
          <span>{currentTranscript.length} characters</span>
        </div>
      )}
    </div>
  )
}
