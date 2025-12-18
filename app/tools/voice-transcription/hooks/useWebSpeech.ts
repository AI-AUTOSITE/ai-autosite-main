// app/tools/voice-transcription/hooks/useWebSpeech.ts
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// Web Speech API Type Declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface WebSpeechResult {
  text: string
  isFinal: boolean
  timestamp: number
}

interface UseWebSpeechOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (result: WebSpeechResult) => void
  onError?: (error: string) => void
}

interface WebSpeechState {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  results: WebSpeechResult[]
  error: string | null
}

export function useWebSpeech(options: UseWebSpeechOptions = {}) {
  const {
    language = 'ja-JP',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
  } = options

  const [state, setState] = useState<WebSpeechState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    results: [],
    error: null,
  })

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const resultsRef = useRef<WebSpeechResult[]>([])

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const isSupported = !!SpeechRecognition
    setState(prev => ({ ...prev, isSupported }))
  }, [])

  // Start listening
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      const error = 'Web Speech API is not supported in this browser'
      setState(prev => ({ ...prev, error }))
      onError?.(error)
      return
    }

    try {
      // Stop existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.lang = language
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log('Web Speech started')
        setState(prev => ({
          ...prev,
          isListening: true,
          error: null,
        }))
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result[0].transcript

          if (result.isFinal) {
            finalTranscript += text
            const newResult: WebSpeechResult = {
              text,
              isFinal: true,
              timestamp: Date.now(),
            }
            resultsRef.current.push(newResult)
            onResult?.(newResult)
          } else {
            interimTranscript += text
          }
        }

        setState(prev => ({
          ...prev,
          transcript: prev.transcript + finalTranscript,
          interimTranscript,
          results: [...resultsRef.current],
        }))
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Web Speech error:', event.error)
        let errorMessage = 'Speech recognition error'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak into the microphone.'
            break
          case 'audio-capture':
            errorMessage = 'No microphone found.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your connection.'
            break
          case 'aborted':
            // User aborted, not an error
            return
          default:
            errorMessage = `Error: ${event.error}`
        }

        setState(prev => ({ ...prev, error: errorMessage }))
        onError?.(errorMessage)
      }

      recognition.onend = () => {
        console.log('Web Speech ended')
        // Auto-restart if still supposed to be listening
        if (state.isListening && continuous) {
          try {
            recognition.start()
          } catch (e) {
            setState(prev => ({ ...prev, isListening: false }))
          }
        } else {
          setState(prev => ({ ...prev, isListening: false }))
        }
      }

      recognition.start()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start speech recognition'
      setState(prev => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage)
    }
  }, [language, continuous, interimResults, onResult, onError, state.isListening])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setState(prev => ({
      ...prev,
      isListening: false,
      interimTranscript: '',
    }))
  }, [])

  // Reset transcript
  const reset = useCallback(() => {
    resultsRef.current = []
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      results: [],
      error: null,
    }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    reset,
  }
}

export default useWebSpeech
