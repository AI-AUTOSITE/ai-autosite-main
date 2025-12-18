// app/lib/blog-posts/audio-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { voiceTranscriptionPost } from '@/tools/voice-transcription/blog-post'

export const audioToolsPosts: BlogPost[] = [
  voiceTranscriptionPost,
  // Future audio tool blog posts will be added here
]
