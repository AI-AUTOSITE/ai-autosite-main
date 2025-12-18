// app/tools/voice-transcription/hooks/useAudioRecorder.ts
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
  audioUrl: string | null
  error: string | null
}

interface UseAudioRecorderOptions {
  maxDuration?: number // Maximum recording duration in seconds
  onRecordingComplete?: (blob: Blob) => void
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { maxDuration = 300, onRecordingComplete } = options // Default 5 minutes max

  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedDurationRef = useRef<number>(0)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
    }
  }, [state.audioUrl])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      cleanup()
      chunksRef.current = []
      pausedDurationRef.current = 0

      // Request microphone access (use browser defaults for best compatibility)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Don't specify sampleRate - let browser use default
        }
      })

      streamRef.current = stream

      // Determine best supported format (prioritize widely supported formats)
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        '', // Empty string = browser default
      ]
      
      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (mimeType === '' || MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      // Create MediaRecorder with minimal options for best compatibility
      const recorderOptions: MediaRecorderOptions = {}
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType
      }

      const mediaRecorder = new MediaRecorder(stream, recorderOptions)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Use the actual mimeType from the recorder
        const actualMimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: actualMimeType })
        const url = URL.createObjectURL(blob)
        
        console.log('Recording complete:', {
          mimeType: actualMimeType,
          size: blob.size,
          chunks: chunksRef.current.length
        })
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          audioBlob: blob,
          audioUrl: url,
        }))

        if (onRecordingComplete) {
          onRecordingComplete(blob)
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.onerror = (event: Event) => {
        const error = event as ErrorEvent
        setState(prev => ({
          ...prev,
          isRecording: false,
          error: error.message || 'Recording error occurred',
        }))
      }

      // Start recording - use timeslice for periodic data collection
      // Some browsers work better without timeslice
      console.log('Starting recording with mimeType:', mediaRecorder.mimeType)
      mediaRecorder.start(500) // Collect data every 500ms
      startTimeRef.current = Date.now()

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + pausedDurationRef.current
        
        setState(prev => ({
          ...prev,
          duration: elapsed,
        }))

        // Auto-stop at max duration
        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 100)

      setState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioBlob: null,
        audioUrl: null,
        error: null,
      })

    } catch (error) {
      let errorMessage = 'Failed to start recording'
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.'
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Recording not supported on this browser.'
        } else {
          errorMessage = error.message
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
      }))
    }
  }, [cleanup, maxDuration, onRecordingComplete])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      mediaRecorderRef.current.stop()
    }
  }, [state.isRecording])

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause()
      pausedDurationRef.current = state.duration
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      setState(prev => ({
        ...prev,
        isPaused: true,
      }))
    }
  }, [state.isRecording, state.isPaused, state.duration])

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume()
      startTimeRef.current = Date.now()
      
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + pausedDurationRef.current
        
        setState(prev => ({
          ...prev,
          duration: elapsed,
        }))

        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 100)
      
      setState(prev => ({
        ...prev,
        isPaused: false,
      }))
    }
  }, [state.isRecording, state.isPaused, maxDuration, stopRecording])

  // Reset recording
  const resetRecording = useCallback(() => {
    cleanup()
    chunksRef.current = []
    pausedDurationRef.current = 0
    
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      error: null,
    })
  }, [cleanup])

  // Check if recording is supported
  const isSupported = typeof window !== 'undefined' && 
    typeof navigator !== 'undefined' && 
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof MediaRecorder !== 'undefined'

  return {
    ...state,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  }
}

export default useAudioRecorder
