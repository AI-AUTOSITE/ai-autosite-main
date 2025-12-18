// app/tools/voice-transcription/components/LiveTranscription.tsx
'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Play, 
  Square, 
  Monitor, 
  Mic, 
  Zap, 
  Brain, 
  Copy, 
  Check, 
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { useWebSpeech } from '../hooks/useWebSpeech'
import { useRealtimeWhisper } from '../hooks/useRealtimeWhisper'
import { SUPPORTED_LANGUAGES } from '../lib/types'

type TranscriptionMode = 'webspeech' | 'whisper'
type InputSource = 'microphone' | 'screen'

interface LiveTranscriptionProps {
  isMobile?: boolean
}

export default function LiveTranscription({ isMobile = false }: LiveTranscriptionProps) {
  // Mode and source selection
  const [mode, setMode] = useState<TranscriptionMode>('webspeech')
  const [inputSource, setInputSource] = useState<InputSource>('microphone')
  const [language, setLanguage] = useState('ja-JP')
  const [isActive, setIsActive] = useState(false)
  const [copied, setCopied] = useState(false)

  // Stream ref for screen capture
  const streamRef = useRef<MediaStream | null>(null)

  // Web Speech hook
  const webSpeech = useWebSpeech({
    language,
    continuous: true,
    interimResults: true,
  })

  // Whisper hook
  const whisper = useRealtimeWhisper({
    modelId: 'Xenova/whisper-tiny', // Use tiny for real-time
    language: language.split('-')[0], // Convert 'ja-JP' to 'ja'
    chunkDuration: 5,
  })

  // Get current transcript based on mode
  const currentTranscript = mode === 'webspeech' 
    ? webSpeech.transcript 
    : whisper.transcript

  const interimText = mode === 'webspeech' ? webSpeech.interimTranscript : ''

  // Load Whisper model on mount if needed
  useEffect(() => {
    if (mode === 'whisper' && !whisper.isModelLoaded) {
      whisper.loadModel()
    }
  }, [mode, whisper.isModelLoaded])

  // Get microphone stream
  const getMicrophoneStream = useCallback(async () => {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    })
  }, [])

  // Get screen audio stream
  const getScreenStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      }
    })

    // Check for audio
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) {
      stream.getTracks().forEach(track => track.stop())
      throw new Error('No audio track. Please check "Share system audio".')
    }

    // Stop video tracks
    stream.getVideoTracks().forEach(track => track.stop())

    return new MediaStream(audioTracks)
  }, [])

  // Start transcription
  const start = useCallback(async () => {
    try {
      if (mode === 'webspeech') {
        // Web Speech API only works with microphone
        if (inputSource === 'screen') {
          alert('Web Speech mode only works with microphone input. Switching to microphone.')
          setInputSource('microphone')
        }
        webSpeech.startListening()
      } else {
        // Whisper mode
        const stream = inputSource === 'screen' 
          ? await getScreenStream()
          : await getMicrophoneStream()
        
        streamRef.current = stream
        whisper.startProcessing(stream)
      }
      setIsActive(true)
    } catch (error) {
      console.error('Failed to start:', error)
      alert(error instanceof Error ? error.message : 'Failed to start transcription')
    }
  }, [mode, inputSource, webSpeech, whisper, getScreenStream, getMicrophoneStream])

  // Stop transcription
  const stop = useCallback(() => {
    if (mode === 'webspeech') {
      webSpeech.stopListening()
    } else {
      whisper.stopProcessing()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
    setIsActive(false)
  }, [mode, webSpeech, whisper])

  // Reset
  const reset = useCallback(() => {
    stop()
    if (mode === 'webspeech') {
      webSpeech.reset()
    } else {
      whisper.reset()
    }
  }, [mode, stop, webSpeech, whisper])

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
    a.download = `live-transcript-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [currentTranscript])

  // Check support
  const isWebSpeechSupported = webSpeech.isSupported
  const isWhisperReady = whisper.isModelLoaded

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('webspeech')}
          disabled={isActive}
          className={`p-4 rounded-xl border-2 transition-all text-left
            ${mode === 'webspeech'
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-700 hover:border-gray-600'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-5 h-5 ${mode === 'webspeech' ? 'text-green-400' : 'text-gray-400'}`} />
            <span className={`font-medium ${mode === 'webspeech' ? 'text-green-400' : 'text-white'}`}>
              Fast Mode
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Web Speech API • Instant • Online
          </p>
          {!isWebSpeechSupported && (
            <p className="text-xs text-red-400 mt-1">Not supported in this browser</p>
          )}
        </button>

        <button
          onClick={() => setMode('whisper')}
          disabled={isActive}
          className={`p-4 rounded-xl border-2 transition-all text-left
            ${mode === 'whisper'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-gray-600'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className={`w-5 h-5 ${mode === 'whisper' ? 'text-purple-400' : 'text-gray-400'}`} />
            <span className={`font-medium ${mode === 'whisper' ? 'text-purple-400' : 'text-white'}`}>
              Accurate Mode
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Whisper AI • 5s delay • Offline
          </p>
          {mode === 'whisper' && !isWhisperReady && (
            <p className="text-xs text-yellow-400 mt-1">
              Loading model... {whisper.modelLoadProgress}%
            </p>
          )}
        </button>
      </div>

      {/* Input Source Selection (Whisper mode only, desktop only) */}
      {mode === 'whisper' && !isMobile && (
        <div className="flex gap-3">
          <button
            onClick={() => setInputSource('microphone')}
            disabled={isActive}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
              ${inputSource === 'microphone'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Mic className="w-4 h-4" />
            Microphone
          </button>
          <button
            onClick={() => setInputSource('screen')}
            disabled={isActive}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
              ${inputSource === 'screen'
                ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Monitor className="w-4 h-4" />
            Screen Audio
          </button>
        </div>
      )}

      {/* Web Speech: Microphone only notice */}
      {mode === 'webspeech' && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex gap-2 text-sm text-blue-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Fast Mode uses browser's speech recognition (microphone only, requires internet)</span>
          </div>
        </div>
      )}

      {/* Language Selection */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isActive}
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
                   focus:border-cyan-500 focus:outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'webspeech' ? (
            // Web Speech uses BCP 47 language tags
            <>
              <option value="ja-JP">Japanese (日本語)</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="zh-TW">Chinese (Traditional)</option>
              <option value="ko-KR">Korean</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </>
          ) : (
            // Whisper uses simple language codes
            SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isActive ? (
          <button
            onClick={start}
            disabled={
              (mode === 'webspeech' && !isWebSpeechSupported) ||
              (mode === 'whisper' && !isWhisperReady)
            }
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-medium transition-all
              ${mode === 'webspeech' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-purple-500 hover:bg-purple-600'
              }
              text-white disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {mode === 'whisper' && !isWhisperReady ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Model...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Live Transcription
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex-1 flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600 
                     text-white rounded-xl font-medium transition-all"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        )}
      </div>

      {/* Live Status */}
      {isActive && (
        <div className="flex items-center justify-center gap-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-medium">Live</span>
          {mode === 'whisper' && (
            <span className="text-gray-400 text-sm">
              (Processing every 5 seconds)
            </span>
          )}
        </div>
      )}

      {/* Transcript Display */}
      <div className="relative">
        <div className="min-h-[200px] max-h-[400px] p-4 bg-gray-900/50 rounded-xl overflow-y-auto">
          {currentTranscript || interimText ? (
            <div className="space-y-1">
              <p className="text-white whitespace-pre-wrap">
                {currentTranscript}
                {interimText && (
                  <span className="text-gray-400 italic"> {interimText}</span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              {isActive 
                ? 'Listening... Start speaking!' 
                : 'Transcript will appear here'
              }
            </p>
          )}
        </div>

        {/* Transcript Actions */}
        {currentTranscript && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={reset}
              disabled={isActive}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear"
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      {currentTranscript && (
        <div className="flex gap-4 text-sm text-gray-400">
          <span>{currentTranscript.split(/\s+/).filter(Boolean).length} words</span>
          <span>{currentTranscript.length} characters</span>
        </div>
      )}

      {/* Error Display */}
      {(webSpeech.error || whisper.error) && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">
            {webSpeech.error || whisper.error}
          </p>
        </div>
      )}
    </div>
  )
}
