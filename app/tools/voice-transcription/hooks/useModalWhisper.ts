// app/tools/voice-transcription/hooks/useModalWhisper.ts
// Modal Whisper API Hook (GPU High-Precision Mode)
'use client'

import { useState, useCallback } from 'react'
import {
  transcribeAudioGPU,
  validateFileSizeGPU,
  validateAudioDurationGPU,
  GPU_LIMITS,
  WhisperResult,
  WhisperSegment,
} from '../lib/modal-api'

// ============================================
// Type Definitions
// ============================================
export interface UseModalWhisperOptions {
  language?: string
  onProgress?: (progress: number, message: string) => void
  onComplete?: (result: WhisperResult) => void
  onError?: (error: string) => void
}

export interface UseModalWhisperReturn {
  // State
  isProcessing: boolean
  progress: number
  progressMessage: string
  result: WhisperResult | null
  error: string | null
  
  // Methods
  transcribe: (file: File) => Promise<WhisperResult | null>
  reset: () => void
  
  // Limit info
  limits: typeof GPU_LIMITS
}

// ============================================
// Hook Implementation
// ============================================
export function useModalWhisper(
  options: UseModalWhisperOptions = {}
): UseModalWhisperReturn {
  const { language = "auto", onProgress, onComplete, onError } = options

  // State
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")
  const [result, setResult] = useState<WhisperResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Progress update helper
  const updateProgress = useCallback((value: number, message: string) => {
    setProgress(value)
    setProgressMessage(message)
    onProgress?.(value, message)
  }, [onProgress])

  // Transcribe audio
  const transcribe = useCallback(async (file: File): Promise<WhisperResult | null> => {
    setIsProcessing(true)
    setError(null)
    setResult(null)
    updateProgress(0, "Validating...")

    try {
      // Step 1: File size check
      updateProgress(10, "Checking file size...")
      const sizeCheck = validateFileSizeGPU(file)
      if (!sizeCheck.valid) {
        throw new Error(sizeCheck.error)
      }

      // Step 2: Audio duration check
      updateProgress(20, "Checking audio duration...")
      const durationCheck = await validateAudioDurationGPU(file)
      if (!durationCheck.valid) {
        throw new Error(durationCheck.error)
      }

      // Step 3: Send to API
      updateProgress(30, "Uploading to server...")

      // Step 4: Transcription (server-side)
      updateProgress(50, "AI is transcribing... (may take a few seconds)")
      
      const response = await transcribeAudioGPU(file, { language })

      // Step 5: Process result
      updateProgress(90, "Processing result...")

      if (response.success) {
        updateProgress(100, "Complete!")
        setResult(response)
        onComplete?.(response)
        return response
      } else {
        throw new Error(response.error || "Transcription failed")
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      onError?.(errorMessage)
      updateProgress(0, "")
      return null

    } finally {
      setIsProcessing(false)
    }
  }, [language, onComplete, onError, updateProgress])

  // Reset
  const reset = useCallback(() => {
    setIsProcessing(false)
    setProgress(0)
    setProgressMessage("")
    setResult(null)
    setError(null)
  }, [])

  return {
    // State
    isProcessing,
    progress,
    progressMessage,
    result,
    error,
    
    // Methods
    transcribe,
    reset,
    
    // Limit info
    limits: GPU_LIMITS,
  }
}

// ============================================
// Exports
// ============================================
export type { WhisperResult, WhisperSegment }
export { GPU_LIMITS }
