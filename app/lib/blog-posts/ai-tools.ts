// app/lib/blog-posts/ai-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { aiResumePost } from '@/tools/ai-resume/blog-post'
import { aiPromptGeneratorPost } from '@/tools/ai-prompt-generator/blog-post'
import { spamEmailCheckerPost } from '@/tools/spam-email-checker/blog-post'
import { aiSummarizerPost } from '@/tools/ai-summarizer/blog-post'
import { pdfSummarizerPost } from '@/tools/pdf-summarizer/blog-post'
import { pdfToDataPost } from '@/tools/pdf-to-data/blog-post'
import { debateTrainerPost } from '@/tools/debate-trainer/blog-post'
import { haikuGeneratorPost } from '@/tools/haiku-generator/blog-post'
import { codeRoasterPost, codeRoasterTutorialPost } from '@/tools/code-roaster/blog-post'
import { stackRecommenderPost } from '@/tools/stack-recommender/blog-post'
import { aiProjectVisualizerPost } from '@/tools/ai-project-visualizer/blog-post'

export const aiToolsPosts: BlogPost[] = [
  aiResumePost,
  aiPromptGeneratorPost,
  spamEmailCheckerPost,
  aiSummarizerPost,
  pdfSummarizerPost,
  pdfToDataPost,
  debateTrainerPost,
  haikuGeneratorPost,
  codeRoasterPost,
  codeRoasterTutorialPost,
  stackRecommenderPost,
  aiProjectVisualizerPost,
]