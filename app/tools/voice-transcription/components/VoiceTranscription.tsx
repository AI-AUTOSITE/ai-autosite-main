// app/tools/voice-transcription/components/VoiceTranscription.tsx
'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Loader2,
  RefreshCw,
  Shield,
  Zap,
  FileAudio,
  Mic,
  Monitor,
  Radio,
  Play,
  Pause,
  Server,
} from 'lucide-react'

// Hooks
import { useTranscription } from '../hooks/useTranscription'
import { useModalWhisper } from '../hooks/useModalWhisper'

// Components
import AudioRecorder from './AudioRecorder'
import FileUploader from './FileUploader'
import ScreenAudioCapture from './ScreenAudioCapture'
import LiveTranscription from './LiveTranscription'
import TranscriptDisplay from './TranscriptDisplay'
import DeviceWarning from './DeviceWarning'
import ModelSettings from './ModelSettings'
import GPUModeToggle from './GPUModeToggle'

// Utils
import { detectDevice, getRecommendedModel } from '../lib/device-detection'
import type { DeviceInfo } from '../lib/device-detection'

type InputMode = 'file' | 'record' | 'screen' | 'live'

export default function VoiceTranscription() {
  // Device detection
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [showDeviceWarning, setShowDeviceWarning] = useState(true)

  // Input mode
  const [inputMode, setInputMode] = useState<InputMode>('file')

  // GPU Mode (file upload only)
  const [isGPUMode, setIsGPUMode] = useState(false)

  // File state
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  // Settings
  const [language, setLanguage] = useState('auto')
  const [modelId, setModelId] = useState('Xenova/whisper-base')
  const [showTimestamps, setShowTimestamps] = useState(true)

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Browser transcription hook
  const {
    progress: browserProgress,
    result: browserTranscript,
    error: browserError,
    isModelLoaded,
    loadModel,
    transcribe: browserTranscribe,
    reset: resetBrowserTranscription,
  } = useTranscription()

  // GPU transcription hook
  const {
    isProcessing: gpuIsProcessing,
    progress: gpuProgress,
    progressMessage: gpuProgressMessage,
    result: gpuResult,
    error: gpuError,
    transcribe: gpuTranscribe,
    reset: resetGPUTranscription,
    limits: gpuLimits,
  } = useModalWhisper({ language })

  // Combined state
  const progress = isGPUMode 
    ? { status: gpuIsProcessing ? 'transcribing' : 'idle', progress: gpuProgress, message: gpuProgressMessage }
    : browserProgress
  const transcript = isGPUMode 
    ? (gpuResult?.success ? { text: gpuResult.text || '', chunks: gpuResult.segments?.map(s => ({ text: s.text, timestamp: [s.start, s.end] as [number, number] })) } : null)
    : browserTranscript
  const error = isGPUMode ? gpuError : browserError

  // Detect device on mount
  useEffect(() => {
    const info = detectDevice()
    setDeviceInfo(info)
    
    // Set recommended model for device
    const recommendedModel = getRecommendedModel(info)
    setModelId(recommendedModel)
  }, [])

  // Load model when modelId changes (browser mode only)
  useEffect(() => {
    if (modelId && !isGPUMode) {
      loadModel(modelId)
    }
  }, [modelId, loadModel, isGPUMode])

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile: File) => {
    // Cleanup previous
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    
    setFile(selectedFile)
    setRecordedBlob(null)
    const url = URL.createObjectURL(selectedFile)
    setAudioUrl(url)
    resetBrowserTranscription()
    resetGPUTranscription()
  }, [audioUrl, resetBrowserTranscription, resetGPUTranscription])

  // Handle recording complete
  const handleRecordingComplete = useCallback((blob: Blob) => {
    // Cleanup previous
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    
    setRecordedBlob(blob)
    setFile(null)
    const url = URL.createObjectURL(blob)
    setAudioUrl(url)
    resetBrowserTranscription()
    resetGPUTranscription()
  }, [audioUrl, resetBrowserTranscription, resetGPUTranscription])

  // Clear audio
  const handleClearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setFile(null)
    setRecordedBlob(null)
    setAudioUrl('')
    resetBrowserTranscription()
    resetGPUTranscription()
  }, [audioUrl, resetBrowserTranscription, resetGPUTranscription])

  // Start transcription (GPU mode)
  const handleGPUTranscribe = useCallback(async () => {
    if (!file) return
    await gpuTranscribe(file)
  }, [file, gpuTranscribe])

  // Start transcription (Browser mode)
  const handleBrowserTranscribe = useCallback(async () => {
    if (!audioUrl) return

    try {
      console.log('Starting transcription process...')
      
      // Fetch audio data
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      console.log('Audio buffer size:', arrayBuffer.byteLength)

      // Decode audio using default sample rate (better compatibility)
      const audioContext = new AudioContext()
      console.log('AudioContext sample rate:', audioContext.sampleRate)
      
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      console.log('Decoded audio:', {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        length: audioBuffer.length
      })

      // Resample to 16kHz using OfflineAudioContext
      const targetSampleRate = 16000
      const targetLength = Math.ceil(audioBuffer.duration * targetSampleRate)
      
      const offlineContext = new OfflineAudioContext(
        1, // mono
        targetLength,
        targetSampleRate
      )

      // Create buffer source
      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(offlineContext.destination)
      source.start(0)

      // Render to get resampled audio
      const resampledBuffer = await offlineContext.startRendering()
      const audioData = resampledBuffer.getChannelData(0)
      
      console.log('Resampled audio:', {
        sampleRate: resampledBuffer.sampleRate,
        length: audioData.length,
        duration: audioData.length / targetSampleRate
      })

      // Start transcription
      await browserTranscribe(audioData, language)

      audioContext.close()
    } catch (err) {
      console.error('Transcription error:', err)
    }
  }, [audioUrl, language, browserTranscribe])

  // Handle transcribe button
  const handleTranscribe = useCallback(async () => {
    if (isGPUMode) {
      await handleGPUTranscribe()
    } else {
      await handleBrowserTranscribe()
    }
  }, [isGPUMode, handleGPUTranscribe, handleBrowserTranscribe])

  // Audio player controls
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Reset everything
  const handleReset = useCallback(() => {
    handleClearAudio()
    setInputMode('file')
  }, [handleClearAudio])

  // Handle GPU mode toggle
  const handleGPUModeToggle = useCallback((enabled: boolean) => {
    setIsGPUMode(enabled)
    // Reset transcription when switching modes
    resetBrowserTranscription()
    resetGPUTranscription()
    
    // Load browser model if switching to browser mode
    if (!enabled && modelId) {
      loadModel(modelId)
    }
  }, [modelId, loadModel, resetBrowserTranscription, resetGPUTranscription])

  // Determine if transcription is in progress
  const isProcessing = isGPUMode 
    ? gpuIsProcessing 
    : (browserProgress.status === 'loading_model' || browserProgress.status === 'transcribing')
  const hasAudio = !!audioUrl
  const canTranscribe = isGPUMode 
    ? (hasAudio && file && !isProcessing)
    : (hasAudio && isModelLoaded && !isProcessing)

  return (
    <div className="space-y-6">
      {/* Device Warning */}
      {deviceInfo && showDeviceWarning && (
        <DeviceWarning
          deviceInfo={deviceInfo}
          onDismiss={() => setShowDeviceWarning(false)}
        />
      )}

      {/* Features Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-300">100% Private</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300">AI Powered</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
          <FileAudio className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-gray-300">99+ Languages</span>
        </div>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex flex-wrap border-b border-gray-700">
        <button
          onClick={() => setInputMode('file')}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
            ${inputMode === 'file'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <FileAudio className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span> File
        </button>
        <button
          onClick={() => setInputMode('record')}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
            ${inputMode === 'record'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">Record</span> Mic
        </button>
        {/* Screen Audio - Desktop only */}
        {!deviceInfo?.isMobile && (
          <button
            onClick={() => setInputMode('screen')}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${inputMode === 'screen'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Screen</span> Audio
          </button>
        )}
        {/* Live Transcription */}
        <button
          onClick={() => setInputMode('live')}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
            ${inputMode === 'live'
              ? 'border-green-500 text-green-400'
              : 'border-transparent text-gray-400 hover:text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Radio className="w-4 h-4" />
          <span className="hidden sm:inline">Live</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {inputMode === 'file' && (
          <FileUploader
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onClear={handleClearAudio}
            disabled={isProcessing}
            isMobile={deviceInfo?.isMobile}
            isTablet={deviceInfo?.isTablet}
            isModelLoading={!isGPUMode && browserProgress.status === 'loading_model'}
            modelLoadingProgress={!isGPUMode ? browserProgress.progress : 0}
          />
        )}
        {inputMode === 'record' && (
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            disabled={isProcessing}
            maxDuration={deviceInfo?.isMobile ? 120 : deviceInfo?.isTablet ? 180 : 300}
          />
        )}
        {inputMode === 'screen' && (
          <ScreenAudioCapture
            onCaptureComplete={handleRecordingComplete}
            disabled={isProcessing}
            maxDuration={600}
          />
        )}
        {inputMode === 'live' && (
          <LiveTranscription
            isMobile={deviceInfo?.isMobile}
          />
        )}
      </div>

      {/* Audio Preview - Not shown in live mode */}
      {audioUrl && inputMode !== 'live' && (
        <div className="p-4 bg-gray-800/50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Audio Preview</span>
            <button
              onClick={togglePlayPause}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="w-full"
            controls
          />
        </div>
      )}

      {/* GPU Mode Toggle - File upload only */}
      {inputMode === 'file' && (
        <GPUModeToggle
          isGPUMode={isGPUMode}
          onToggle={handleGPUModeToggle}
          disabled={isProcessing}
          limits={gpuLimits}
        />
      )}

      {/* Settings - Not shown in live mode, hidden in GPU mode */}
      {inputMode !== 'live' && !isGPUMode && (
        <ModelSettings
          language={language}
          modelId={modelId}
          onLanguageChange={setLanguage}
          onModelChange={setModelId}
          disabled={isProcessing}
          isMobile={deviceInfo?.isMobile}
        />
      )}

      {/* Language Selection for GPU Mode */}
      {inputMode === 'file' && isGPUMode && (
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <label className="block text-sm text-gray-400 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isProcessing}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg
                     text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     disabled:opacity-50"
          >
            <option value="auto">Auto-detect</option>
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
            <option value="ko">Korean</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      )}

      {/* Transcribe Button - Not shown in live mode */}
      {inputMode !== 'live' && (
        <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTranscribe}
          disabled={!canTranscribe}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 
                   ${isGPUMode 
                     ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                     : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                   }
                   text-white font-semibold rounded-xl transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isGPUMode ? gpuProgressMessage : (browserProgress.status === 'loading_model' ? 'Loading Model...' : 'Transcribing...')}
            </>
          ) : (
            <>
              {isGPUMode ? <Server className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              {isGPUMode ? 'Transcribe (GPU)' : 'Transcribe'}
            </>
          )}
        </button>

        {hasAudio && (
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>
      )}

      {/* Progress - Not shown in live mode */}
      {isProcessing && inputMode !== 'live' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{isGPUMode ? gpuProgressMessage : browserProgress.message}</span>
            <span className={isGPUMode ? 'text-purple-400' : 'text-cyan-400'}>
              {isGPUMode ? gpuProgress : browserProgress.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isGPUMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${isGPUMode ? gpuProgress : browserProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error - Not shown in live mode */}
      {error && inputMode !== 'live' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results - Not shown in live mode */}
      {transcript && inputMode !== 'live' && (
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <TranscriptDisplay
            transcript={transcript}
            showTimestamps={showTimestamps}
            onTimestampToggle={setShowTimestamps}
          />
        </div>
      )}

      {/* Privacy Notice */}
      <div className="text-center text-gray-500 text-xs space-y-1">
        {isGPUMode ? (
          <>
            <p className="flex items-center justify-center gap-1">
              <Server className="w-3 h-3" />
              GPU mode: Audio is processed on our secure server and deleted immediately.
            </p>
            <p>Powered by OpenAI Whisper large-v3.</p>
          </>
        ) : (
          <>
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              All processing happens in your browser. No data is uploaded.
            </p>
            <p>Powered by OpenAI Whisper running locally via WebAssembly.</p>
          </>
        )}
      </div>
    </div>
  )
}
