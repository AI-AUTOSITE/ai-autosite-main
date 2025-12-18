// app/tools/voice-transcription/lib/types.ts

export interface TranscriptChunk {
  text: string
  timestamp: [number, number] // [start, end] in seconds
}

export interface TranscriptResult {
  text: string
  chunks?: TranscriptChunk[]
  language?: string
  duration?: number
}

export interface TranscriptionProgress {
  status: 'idle' | 'loading_model' | 'transcribing' | 'complete' | 'error'
  progress: number // 0-100
  message?: string
}

export interface ModelConfig {
  id: string
  name: string
  size: string
  languages: string[] | 'multilingual'
  description: string
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'Xenova/whisper-tiny',
    name: 'Tiny (Fastest)',
    size: '~75MB',
    languages: 'multilingual',
    description: 'Fastest, good for quick transcription'
  },
  {
    id: 'Xenova/whisper-tiny.en',
    name: 'Tiny English',
    size: '~75MB',
    languages: ['en'],
    description: 'Fast, English optimized'
  },
  {
    id: 'Xenova/whisper-base',
    name: 'Base (Balanced)',
    size: '~145MB',
    languages: 'multilingual',
    description: 'Good balance of speed and accuracy'
  },
  {
    id: 'Xenova/whisper-base.en',
    name: 'Base English',
    size: '~145MB',
    languages: ['en'],
    description: 'Good accuracy, English optimized'
  },
  {
    id: 'Xenova/whisper-small',
    name: 'Small (Accurate)',
    size: '~500MB',
    languages: 'multilingual',
    description: 'Higher accuracy, slower download'
  },
  {
    id: 'Xenova/whisper-small.en',
    name: 'Small English',
    size: '~500MB',
    languages: ['en'],
    description: 'High accuracy, English optimized'
  },
]

export const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'hi', name: 'Hindi' },
]

export type WorkerMessage = 
  | { type: 'load_model'; modelId: string }
  | { type: 'transcribe'; audio: Float32Array; language: string }

export type WorkerResponse =
  | { type: 'model_loading'; data: { progress: number; message?: string; file?: string } }
  | { type: 'model_ready'; data: { modelId: string } }
  | { type: 'transcription_start'; data: Record<string, unknown> }
  | { type: 'transcription_complete'; data: { text: string; chunks?: TranscriptChunk[]; language?: string } }
  | { type: 'error'; data: { message: string } }
