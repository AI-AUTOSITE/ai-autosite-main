// app/tools/voice-transcription/hooks/useTranscription.ts
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { TranscriptResult, TranscriptionProgress, WorkerResponse } from '../lib/types'

interface UseTranscriptionOptions {
  onProgress?: (progress: TranscriptionProgress) => void
  onComplete?: (result: TranscriptResult) => void
  onError?: (error: string) => void
}

export function useTranscription(options: UseTranscriptionOptions = {}) {
  const { onProgress, onComplete, onError } = options

  const [progress, setProgress] = useState<TranscriptionProgress>({
    status: 'idle',
    progress: 0,
  })
  const [result, setResult] = useState<TranscriptResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [currentModel, setCurrentModel] = useState<string | null>(null)

  const workerRef = useRef<Worker | null>(null)

  // Initialize worker
  useEffect(() => {
    const workerCode = `
      let pipeline = null;
      let transcriber = null;
      let currentModelId = null;

      self.onmessage = async (event) => {
        const { type, modelId, audio, language } = event.data;

        if (type === 'load_model') {
          try {
            // Skip if same model already loaded
            if (currentModelId === modelId && transcriber) {
              self.postMessage({ type: 'model_ready', data: { modelId } });
              return;
            }

            self.postMessage({ type: 'model_loading', data: { progress: 0, message: 'Loading AI model...' } });
            
            const { pipeline: pipelineFn, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0');
            
            env.allowLocalModels = false;
            env.useBrowserCache = true;
            
            transcriber = await pipelineFn(
              'automatic-speech-recognition',
              modelId,
              {
                progress_callback: (progress) => {
                  if (progress.status === 'downloading' || progress.status === 'progress') {
                    const percent = progress.progress ? Math.round(progress.progress) : 0;
                    self.postMessage({ 
                      type: 'model_loading', 
                      data: { 
                        progress: percent, 
                        message: 'Downloading model: ' + percent + '%',
                        file: progress.file || ''
                      } 
                    });
                  }
                }
              }
            );
            
            currentModelId = modelId;
            self.postMessage({ type: 'model_ready', data: { modelId } });
            
          } catch (error) {
            self.postMessage({ 
              type: 'error', 
              data: { message: 'Failed to load model: ' + (error.message || 'Unknown error') } 
            });
          }
        }

        if (type === 'transcribe') {
          try {
            if (!transcriber) {
              throw new Error('Model not loaded');
            }

            self.postMessage({ type: 'transcription_start', data: {} });

            const options = {
              chunk_length_s: 30,
              stride_length_s: 5,
              return_timestamps: true,
              task: 'transcribe',
            };

            if (language && language !== 'auto') {
              options.language = language;
            }

            const result = await transcriber(audio, options);
            
            self.postMessage({ type: 'transcription_complete', data: result });
            
          } catch (error) {
            self.postMessage({ 
              type: 'error', 
              data: { message: 'Transcription failed: ' + (error.message || 'Unknown error') } 
            });
          }
        }
      };
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    const worker = new Worker(workerUrl, { type: 'module' })

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data

      if (message.type === 'model_loading') {
        const loadingProgress: TranscriptionProgress = {
          status: 'loading_model',
          progress: message.data.progress || 0,
          message: message.data.message,
        }
        setProgress(loadingProgress)
        onProgress?.(loadingProgress)
      }
      
      else if (message.type === 'model_ready') {
        setIsModelLoaded(true)
        setCurrentModel(message.data.modelId)
        const readyProgress: TranscriptionProgress = {
          status: 'idle',
          progress: 100,
          message: 'Model ready',
        }
        setProgress(readyProgress)
        onProgress?.(readyProgress)
      }
      
      else if (message.type === 'transcription_start') {
        const startProgress: TranscriptionProgress = {
          status: 'transcribing',
          progress: 0,
          message: 'Transcribing audio...',
        }
        setProgress(startProgress)
        onProgress?.(startProgress)
      }
      
      else if (message.type === 'transcription_complete') {
        const transcriptResult: TranscriptResult = {
          text: message.data.text || '',
          chunks: message.data.chunks || [],
          language: message.data.language,
        }
        setResult(transcriptResult)
        const completeProgress: TranscriptionProgress = {
          status: 'complete',
          progress: 100,
          message: 'Transcription complete',
        }
        setProgress(completeProgress)
        onProgress?.(completeProgress)
        onComplete?.(transcriptResult)
      }
      
      else if (message.type === 'error') {
        const errorMsg = message.data.message || 'An error occurred'
        setError(errorMsg)
        const errorProgress: TranscriptionProgress = {
          status: 'error',
          progress: 0,
          message: errorMsg,
        }
        setProgress(errorProgress)
        onError?.(errorMsg)
      }
    }

    worker.onerror = (error) => {
      const errorMsg = error.message || 'Worker error occurred'
      setError(errorMsg)
      onError?.(errorMsg)
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
    }
  }, [onProgress, onComplete, onError])

  // Load model
  const loadModel = useCallback((modelId: string) => {
    if (workerRef.current) {
      setError(null)
      setProgress({
        status: 'loading_model',
        progress: 0,
        message: 'Initializing...',
      })
      workerRef.current.postMessage({ type: 'load_model', modelId })
    }
  }, [])

  // Transcribe audio
  const transcribe = useCallback(async (
    audioData: Float32Array,
    language: string = 'auto'
  ) => {
    if (!workerRef.current) {
      const errorMsg = 'Worker not initialized'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    if (!isModelLoaded) {
      const errorMsg = 'Model not loaded'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setError(null)
    setResult(null)
    setProgress({
      status: 'transcribing',
      progress: 0,
      message: 'Starting transcription...',
    })

    workerRef.current.postMessage({
      type: 'transcribe',
      audio: audioData,
      language,
    })
  }, [isModelLoaded, onError])

  // Reset state
  const reset = useCallback(() => {
    setProgress({ status: 'idle', progress: 0 })
    setResult(null)
    setError(null)
  }, [])

  return {
    progress,
    result,
    error,
    isModelLoaded,
    currentModel,
    loadModel,
    transcribe,
    reset,
  }
}

export default useTranscription
