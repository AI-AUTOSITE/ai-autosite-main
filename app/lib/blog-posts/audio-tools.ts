// app/lib/blog-posts/audio-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { voiceTranscriptionPost } from '@/tools/voice-transcription/blog-post'
import { mp3ToWavPost } from '@/tools/mp3-to-wav/blog-post'
import { wavToMp3Post } from '@/tools/wav-to-mp3/blog-post'
import { volumeBoosterPost } from '@/tools/volume-booster/blog-post'
import { recordVoicePost } from '@/tools/record-voice/blog-post'
import { trimAudioPost } from '@/tools/trim-audio/blog-post'
import { speedChangerPost } from '@/tools/speed-changer/blog-post'
import { reverseAudioPost } from '@/tools/reverse-audio/blog-post'
import { fadeAudioPost } from '@/tools/fade-audio/blog-post'
import { extractAudioPost } from '@/tools/extract-audio/blog-post'
import { loopAudioPost } from '@/tools/loop-audio/blog-post'
import { mergeAudioPost } from '@/tools/merge-audio/blog-post'
import { audioConverterPost } from '@/tools/audio-converter/blog-post'
import { textToAudioPost } from '@/tools/text-to-audio/blog-post'

export const audioToolsPosts: BlogPost[] = [
  voiceTranscriptionPost,
  mp3ToWavPost,
  wavToMp3Post,
  volumeBoosterPost,
  recordVoicePost,
  trimAudioPost,
  speedChangerPost,
  reverseAudioPost,
  fadeAudioPost,
  extractAudioPost,
  loopAudioPost,
  mergeAudioPost,
  audioConverterPost,
  textToAudioPost,
]
