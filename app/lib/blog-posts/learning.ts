// app/lib/blog-posts/learning.ts
import type { BlogPost } from './types'

// Import from tool folders
import { aiDevDictionaryPost } from '@/tools/ai-dev-dictionary/blog-post'
import { pomodoroTimerPost } from '@/tools/pomodoro-timer/blog-post'

export const learningPosts: BlogPost[] = [
  aiDevDictionaryPost,
  pomodoroTimerPost,
]