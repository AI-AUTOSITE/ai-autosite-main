// app/lib/blog-posts/business-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { competitiveAnalyzerPost } from '@/tools/competitive-analyzer/blog-post'
import { whatsappLinkPost } from '@/tools/whatsapp-link/blog-post'
import { hashtagGeneratorPost } from '@/tools/hashtag-generator/blog-post'
import { aiPromptGeneratorPost } from '@/tools/ai-prompt-generator/blog-post'
import { aiResumePost } from '@/tools/ai-resume/blog-post'

export const businessToolsPosts: BlogPost[] = [
  competitiveAnalyzerPost,
  whatsappLinkPost,
  hashtagGeneratorPost,
  aiPromptGeneratorPost,
  aiResumePost,
]