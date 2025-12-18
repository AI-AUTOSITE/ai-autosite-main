// app/tools/voice-transcription/hooks/useRealtimeWhisper.ts
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface WhisperChunk {
  text: string
  timestamp: number
  duration: number
}

interface UseRealtimeWhisperOptions {
  modelId?: string
  language?: string
  chunkDuration?: number // seconds
  onChunkResult?: (chunk: WhisperChunk) => void
  onError?: (error: string) => void
}

interface RealtimeWhisperState {
  isProcessing: boolean
  isModelLoaded: boolean
  transcript: string
  chunks: WhisperChunk[]
  currentChunkDuration: number
  error: string | null
  modelLoadProgress: number
}

export function useRealtimeWhisper(options: UseRealtimeWhisperOptions = {}) {
  const {
    modelId = 'Xenova/whisper-tiny',
    language = 'auto',
    chunkDuration = 5,
    onChunkResult,
    onError,
  } = options

  const [state, setState] = useState<RealtimeWhisperState>({
    isProcessing: false,
    isModelLoaded: false,
    transcript: '',
    chunks: [],
    currentChunkDuration: 0,
    error: null,
    modelLoadProgress: 0,
  })

  const workerRef = useRef<Worker | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const chunksRef = useRef<WhisperChunk[]>([])
  const audioBufferRef = useRef<Float32Array[]>([])
  const isProcessingChunkRef = useRef(false)
  const chunkTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize worker
  useEffect(() => {
    const workerCode = `
      let transcriber = null;
      let currentModelId = null;

      self.onmessage = async (event) => {
        const { type, modelId, audio, language } = event.data;

        if (type === 'load_model') {
          try {
            if (currentModelId === modelId && transcriber) {
              self.postMessage({ type: 'model_ready', data: { modelId } });
              return;
            }

            self.postMessage({ type: 'model_loading', data: { progress: 0 } });
            
            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0');
            
            env.allowLocalModels = false;
            env.useBrowserCache = true;
            
            transcriber = await pipeline(
              'automatic-speech-recognition',
              modelId,
              {
                progress_callback: (progress) => {
                  if (progress.status === 'downloading' || progress.status === 'progress') {
                    const percent = progress.progress ? Math.round(progress.progress) : 0;
                    self.postMessage({ type: 'model_loading', data: { progress: percent } });
                  }
                }
              }
            );
            
            currentModelId = modelId;
            self.postMessage({ type: 'model_ready', data: { modelId } });
            
          } catch (error) {
            self.postMessage({ type: 'error', data: { message: error.message } });
          }
        }

        if (type === 'transcribe_chunk') {
          try {
            if (!transcriber) {
              throw new Error('Model not loaded');
            }

            const options = {
              chunk_length_s: 30,
              stride_length_s: 5,
              return_timestamps: false,
              task: 'transcribe',
            };

            if (language && language !== 'auto') {
              options.language = language;
            }

            const result = await transcriber(audio, options);
            
            self.postMessage({ 
              type: 'chunk_complete', 
              data: { text: result.text || '' }
            });
            
          } catch (error) {
            self.postMessage({ type: 'error', data: { message: error.message } });
          }
        }
      };
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    const worker = new Worker(workerUrl, { type: 'module' })

    worker.onmessage = (event) => {
      const { type, data } = event.data

      if (type === 'model_loading') {
        setState(prev => ({
          ...prev,
          modelLoadProgress: data.progress || 0,
        }))
      }

      if (type === 'model_ready') {
        setState(prev => ({
          ...prev,
          isModelLoaded: true,
          modelLoadProgress: 100,
        }))
      }

      if (type === 'chunk_complete') {
        const text = data.text?.trim()
        if (text && text !== '[BLANK_AUDIO]' && !isRepeatingPattern(text)) {
          const chunk: WhisperChunk = {
            text,
            timestamp: Date.now(),
            duration: chunkDuration,
          }
          chunksRef.current.push(chunk)
          
          setState(prev => ({
            ...prev,
            transcript: prev.transcript + (prev.transcript ? ' ' : '') + text,
            chunks: [...chunksRef.current],
          }))

          onChunkResult?.(chunk)
        }
        isProcessingChunkRef.current = false
      }

      if (type === 'error') {
        console.error('Whisper worker error:', data.message)
        // Don't show error to user for chunk processing errors, just skip
        isProcessingChunkRef.current = false
      }
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
    }
  }, [chunkDuration, onChunkResult, onError])

  // Helper to detect repeating patterns (like "ぜひぜひぜひ")
  const isRepeatingPattern = (text: string): boolean => {
    if (text.length < 6) return false
    // Check if text is mostly repeating 2-4 character patterns
    for (let patternLen = 1; patternLen <= 4; patternLen++) {
      const pattern = text.slice(0, patternLen)
      const repeated = pattern.repeat(Math.ceil(text.length / patternLen)).slice(0, text.length)
      const similarity = [...text].filter((c, i) => c === repeated[i]).length / text.length
      if (similarity > 0.8) return true
    }
    return false
  }

  // Load model
  const loadModel = useCallback(() => {
    if (workerRef.current) {
      setState(prev => ({ ...prev, error: null, modelLoadProgress: 0 }))
      workerRef.current.postMessage({ type: 'load_model', modelId })
    }
  }, [modelId])

  // Process accumulated audio
  const processAccumulatedAudio = useCallback(() => {
    if (!workerRef.current || !state.isModelLoaded || isProcessingChunkRef.current) {
      return
    }

    if (audioBufferRef.current.length === 0) {
      return
    }

    isProcessingChunkRef.current = true

    try {
      // Combine all audio chunks
      const totalLength = audioBufferRef.current.reduce((sum, chunk) => sum + chunk.length, 0)
      const combinedAudio = new Float32Array(totalLength)
      let offset = 0
      for (const chunk of audioBufferRef.current) {
        combinedAudio.set(chunk, offset)
        offset += chunk.length
      }

      // Clear buffer
      audioBufferRef.current = []

      // Resample if needed (ScriptProcessor uses AudioContext sample rate)
      const sourceSampleRate = audioContextRef.current?.sampleRate || 48000
      const targetSampleRate = 16000

      let audioData: Float32Array
      if (sourceSampleRate !== targetSampleRate) {
        // Simple linear resampling
        const ratio = sourceSampleRate / targetSampleRate
        const newLength = Math.floor(combinedAudio.length / ratio)
        audioData = new Float32Array(newLength)
        for (let i = 0; i < newLength; i++) {
          const srcIndex = Math.floor(i * ratio)
          audioData[i] = combinedAudio[srcIndex]
        }
      } else {
        audioData = combinedAudio
      }

      console.log('Processing audio chunk:', {
        samples: audioData.length,
        duration: audioData.length / targetSampleRate
      })

      workerRef.current.postMessage({
        type: 'transcribe_chunk',
        audio: audioData,
        language,
      })

    } catch (error) {
      console.error('Error processing audio:', error)
      isProcessingChunkRef.current = false
    }
  }, [state.isModelLoaded, language])

  // Start processing from stream
  const startProcessing = useCallback(async (stream: MediaStream) => {
    if (!state.isModelLoaded) {
      const error = 'Model not loaded'
      setState(prev => ({ ...prev, error }))
      onError?.(error)
      return
    }

    try {
      streamRef.current = stream
      audioBufferRef.current = []
      startTimeRef.current = Date.now()

      // Create AudioContext
      const audioContext = new AudioContext({ sampleRate: 48000 })
      audioContextRef.current = audioContext

      // Create source from stream
      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      // Create ScriptProcessor for capturing audio data
      // Note: ScriptProcessor is deprecated but AudioWorklet requires more setup
      const bufferSize = 4096
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0)
        // Copy the data (inputData is reused)
        const copy = new Float32Array(inputData.length)
        copy.set(inputData)
        audioBufferRef.current.push(copy)
      }

      // Connect: source -> processor -> destination (required for ScriptProcessor to work)
      source.connect(processor)
      processor.connect(audioContext.destination)

      setState(prev => ({
        ...prev,
        isProcessing: true,
        error: null,
      }))

      // Process chunks at interval
      chunkTimerRef.current = setInterval(() => {
        processAccumulatedAudio()

        // Update current chunk duration display
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        setState(prev => ({
          ...prev,
          currentChunkDuration: elapsed % chunkDuration,
        }))
      }, chunkDuration * 1000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start processing'
      setState(prev => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage)
    }
  }, [state.isModelLoaded, chunkDuration, processAccumulatedAudio, onError])

  // Stop processing
  const stopProcessing = useCallback(() => {
    if (chunkTimerRef.current) {
      clearInterval(chunkTimerRef.current)
      chunkTimerRef.current = null
    }

    // Process remaining audio
    if (audioBufferRef.current.length > 0 && !isProcessingChunkRef.current) {
      processAccumulatedAudio()
    }

    // Cleanup audio nodes
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setState(prev => ({
      ...prev,
      isProcessing: false,
      currentChunkDuration: 0,
    }))
  }, [processAccumulatedAudio])

  // Reset
  const reset = useCallback(() => {
    stopProcessing()
    chunksRef.current = []
    audioBufferRef.current = []
    setState(prev => ({
      ...prev,
      transcript: '',
      chunks: [],
      error: null,
    }))
  }, [stopProcessing])

  // Cleanup
  useEffect(() => {
    return () => {
      if (chunkTimerRef.current) {
        clearInterval(chunkTimerRef.current)
      }
      if (processorRef.current) {
        processorRef.current.disconnect()
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    ...state,
    loadModel,
    startProcessing,
    stopProcessing,
    reset,
  }
}

export default useRealtimeWhisper
