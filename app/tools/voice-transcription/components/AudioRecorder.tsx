// app/tools/voice-transcription/components/AudioRecorder.tsx
'use client'

import React from 'react'
import { Mic, MicOff, Square, Pause, Play, Trash2 } from 'lucide-react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { formatTime } from '../lib/audio-utils'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  disabled?: boolean
  maxDuration?: number
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  disabled = false,
  maxDuration = 300 
}: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    error,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder({ 
    maxDuration,
    onRecordingComplete 
  })

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
        <MicOff className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-yellow-400 text-sm">
          Recording is not supported on this browser.
          <br />
          Please use Chrome, Edge, or Firefox.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-white font-mono text-2xl">
            {formatTime(duration)}
          </span>
          <span className="text-gray-400 text-sm">
            / {formatTime(maxDuration)}
          </span>
        </div>
      )}

      {/* Recorded Audio Preview */}
      {audioUrl && !isRecording && (
        <div className="p-4 bg-gray-700/50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Recording Preview</span>
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
          <audio 
            src={audioUrl} 
            controls 
            className="w-full h-10"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 
                     text-white rounded-xl font-medium transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            {/* Pause/Resume */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 
                       text-white rounded-xl font-medium transition-all"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )}
            </button>

            {/* Stop */}
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-500 
                       text-white rounded-xl font-medium transition-all"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </>
        )}

        {audioBlob && !isRecording && (
          <>
            {/* Re-record */}
            <button
              onClick={resetRecording}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-500 
                       text-white rounded-xl font-medium transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Discard
            </button>

            {/* New Recording */}
            <button
              onClick={() => {
                resetRecording()
                setTimeout(startRecording, 100)
              }}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 
                       text-white rounded-xl font-medium transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-5 h-5" />
              New Recording
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <p className="text-gray-400 text-xs text-center">
          Click "Start Recording" and speak into your microphone.
          <br />
          Maximum duration: {formatTime(maxDuration)}
        </p>
      )}
    </div>
  )
}
