// app/lib/audio-toolkit/types.ts
// Audio Toolkit - 共通型定義

// ========================================
// Audio File Types
// ========================================

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'flac' | 'm4a' | 'webm';

export interface AudioFile {
  file: File;
  name: string;
  size: number;
  type: string;
  duration?: number;
  url?: string;
}

// ========================================
// Audio Buffer Types
// ========================================

export interface AudioBufferInfo {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  length: number;
}

// ========================================
// Processing Progress
// ========================================

export type ProcessingStatus = 
  | 'idle' 
  | 'loading' 
  | 'processing' 
  | 'encoding' 
  | 'complete' 
  | 'error';

export interface ProcessingProgress {
  status: ProcessingStatus;
  progress: number; // 0-100
  message: string;
  currentStep?: number;
  totalSteps?: number;
}

// ========================================
// Export Options
// ========================================

export type AudioQuality = 'low' | 'medium' | 'high' | 'maximum';

export interface ExportOptions {
  format: AudioFormat;
  quality: AudioQuality;
  sampleRate?: 22050 | 44100 | 48000;
  bitrate?: 128 | 192 | 256 | 320; // for MP3
  bitDepth?: 16 | 24 | 32; // for WAV
  channels?: 1 | 2;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'wav',
  quality: 'high',
  sampleRate: 44100,
  bitDepth: 24,
  channels: 2,
};

// ========================================
// Transcription Types
// ========================================

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface TranscriptionResult {
  text: string;
  segments?: TranscriptionSegment[];
  language?: string;
  duration?: number;
}

export type TranscriptionStatus = 
  | 'idle' 
  | 'loading_model' 
  | 'transcribing' 
  | 'complete' 
  | 'error';

export interface TranscriptionProgress {
  status: TranscriptionStatus;
  progress: number;
  message: string;
}

// ========================================
// Waveform Types
// ========================================

export interface AudioRegion {
  id: string;
  start: number;
  end: number;
  color?: string;
  label?: string;
}

export interface WaveformOptions {
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  responsive?: boolean;
}

// ========================================
// Recording Types
// ========================================

export type RecordingState = 'inactive' | 'recording' | 'paused';

export interface RecordingOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  timeSlice?: number;
}

// ========================================
// Error Types
// ========================================

export type AudioErrorCode =
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'DECODE_ERROR'
  | 'ENCODE_ERROR'
  | 'PERMISSION_DENIED'
  | 'DEVICE_NOT_FOUND'
  | 'BROWSER_NOT_SUPPORTED'
  | 'PROCESSING_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AudioToolError {
  code: AudioErrorCode;
  title: string;
  message: string;
  suggestion?: string;
}

export const AUDIO_ERRORS: Record<AudioErrorCode, Omit<AudioToolError, 'code'>> = {
  FILE_TOO_LARGE: {
    title: 'File Too Large',
    message: 'The selected file exceeds the maximum size limit.',
    suggestion: 'Try a smaller file or compress it first.',
  },
  UNSUPPORTED_FORMAT: {
    title: 'Unsupported Format',
    message: 'This file format is not supported.',
    suggestion: 'Try MP3, WAV, OGG, FLAC, or M4A files.',
  },
  DECODE_ERROR: {
    title: 'Decode Error',
    message: 'Could not decode the audio file.',
    suggestion: 'The file may be corrupted. Try a different file.',
  },
  ENCODE_ERROR: {
    title: 'Encode Error',
    message: 'Could not encode the audio file.',
    suggestion: 'Try a different output format.',
  },
  PERMISSION_DENIED: {
    title: 'Permission Denied',
    message: 'Microphone access was denied.',
    suggestion: 'Allow microphone access in your browser settings.',
  },
  DEVICE_NOT_FOUND: {
    title: 'No Microphone Found',
    message: 'Could not find a microphone device.',
    suggestion: 'Connect a microphone and refresh the page.',
  },
  BROWSER_NOT_SUPPORTED: {
    title: 'Browser Not Supported',
    message: 'This feature is not supported in your browser.',
    suggestion: 'Try using Chrome, Firefox, or Edge.',
  },
  PROCESSING_ERROR: {
    title: 'Processing Error',
    message: 'An error occurred while processing the audio.',
    suggestion: 'Try again or use a different file.',
  },
  NETWORK_ERROR: {
    title: 'Network Error',
    message: 'A network error occurred.',
    suggestion: 'Check your internet connection and try again.',
  },
  UNKNOWN_ERROR: {
    title: 'Unknown Error',
    message: 'An unexpected error occurred.',
    suggestion: 'Please try again.',
  },
};

// ========================================
// Device Detection Types
// ========================================

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';
  supportsWebAudio: boolean;
  supportsMediaRecorder: boolean;
  supportsWebSpeech: boolean;
  maxRecommendedFileSize: number;
}

// ========================================
// Supported Formats
// ========================================

export const SUPPORTED_AUDIO_FORMATS: Record<string, string[]> = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/wave': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
  'audio/aac': ['.aac', '.m4a'],
  'audio/mp4': ['.m4a'],
  'audio/webm': ['.webm'],
};

export const SUPPORTED_VIDEO_FORMATS: Record<string, string[]> = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
};

// ========================================
// File Size Limits
// ========================================

export const FILE_SIZE_LIMITS = {
  audio: {
    desktop: 100 * 1024 * 1024,  // 100MB
    tablet: 50 * 1024 * 1024,    // 50MB
    mobile: 25 * 1024 * 1024,    // 25MB
  },
  video: {
    desktop: 500 * 1024 * 1024,  // 500MB
    tablet: 200 * 1024 * 1024,   // 200MB
    mobile: 100 * 1024 * 1024,   // 100MB
  },
};
