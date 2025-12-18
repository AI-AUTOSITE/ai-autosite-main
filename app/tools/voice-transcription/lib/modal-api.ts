// app/tools/voice-transcription/lib/modal-api.ts
// Modal GPU API Utility

const WHISPER_API_URL = "https://ai-autosite--whisper-api-whisperapi-transcribe.modal.run"

// ============================================
// Limits
// ============================================
export const GPU_LIMITS = {
  maxFileSizeMB: 25,          // Max file size (MB)
  maxFileSizeBytes: 25 * 1024 * 1024,  // 25MB in bytes
  maxDurationMinutes: 10,     // Max audio duration (minutes)
  maxDurationSeconds: 10 * 60, // 10 minutes in seconds
} as const

// ============================================
// Whisper Transcription API
// ============================================
export interface WhisperSegment {
  start: number
  end: number
  text: string
}

export interface WhisperResult {
  success: boolean
  text?: string
  language?: string
  segments?: WhisperSegment[]
  error?: string
}

export interface TranscribeOptions {
  language?: string  // 'auto', 'ja', 'en', etc.
}

/**
 * Transcribe audio file (GPU version)
 */
export async function transcribeAudioGPU(
  audioBlob: Blob,
  options: TranscribeOptions = {}
): Promise<WhisperResult> {
  const { language = "auto" } = options

  try {
    // Convert Blob to Base64
    const base64 = await blobToBase64(audioBlob)

    const response = await fetch(WHISPER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio: base64,
        language: language,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Convert Blob to Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      // Remove "data:audio/wav;base64," prefix
      const base64Data = base64.split(",")[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Validate file size for GPU mode
 */
export function validateFileSizeGPU(file: File | Blob): { valid: boolean; error?: string } {
  if (file.size > GPU_LIMITS.maxFileSizeBytes) {
    return {
      valid: false,
      error: `File size too large (max ${GPU_LIMITS.maxFileSizeMB}MB)`,
    }
  }
  return { valid: true }
}

/**
 * Validate audio duration for GPU mode
 */
export async function validateAudioDurationGPU(
  file: File | Blob
): Promise<{ valid: boolean; duration?: number; error?: string }> {
  return new Promise((resolve) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url)
      const duration = audio.duration
      
      if (duration > GPU_LIMITS.maxDurationSeconds) {
        resolve({
          valid: false,
          duration,
          error: `Audio too long (max ${GPU_LIMITS.maxDurationMinutes} minutes)`,
        })
      } else {
        resolve({ valid: true, duration })
      }
    })
    
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url)
      // If error, pass size check only
      resolve({ valid: true })
    })
    
    audio.src = url
  })
}
