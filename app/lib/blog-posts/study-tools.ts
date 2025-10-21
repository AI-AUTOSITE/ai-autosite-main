// app/lib/blog-posts/study-tools.ts
import type { BlogPost } from './types'

import { debateTrainerPost } from '@/tools/debate-trainer/blog-post'
import { aiSummarizerPost } from '@/tools/ai-summarizer/blog-post'
import { pdfSummarizerPost } from '@/tools/pdf-summarizer/blog-post'
import { haikuGeneratorPost } from '@/tools/haiku-generator/blog-post'
import { japaneseOcrPost } from '@/tools/japanese-ocr/blog-post'
import { cornellNotePost } from '@/tools/cornell-note/blog-post'
import { pomodoroTimerPost } from '@/tools/pomodoro-timer/blog-post'


export const studyToolsPosts: BlogPost[] = [
  debateTrainerPost,
  aiSummarizerPost,
  pdfSummarizerPost,
  haikuGeneratorPost,
  japaneseOcrPost,
  cornellNotePost,
  pomodoroTimerPost, 
]