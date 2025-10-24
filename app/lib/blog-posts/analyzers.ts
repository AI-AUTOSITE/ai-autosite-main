// app/lib/blog-posts/analyzers.ts
import type { BlogPost } from './types'

// Import from tool folders
import { pcOptimizerPost } from '@/tools/pc-optimizer/blog-post'
import { tokenCompressorPost } from '@/tools/token-compressor/blog-post'
import { networkCheckerPost } from '@/tools/network-checker/blog-post'
import { competitiveAnalyzerPost } from '@/tools/competitive-analyzer/blog-post'
import { japaneseOcrPost } from '@/tools/japanese-ocr/blog-post'

export const analyzersPosts: BlogPost[] = [
  pcOptimizerPost,
  tokenCompressorPost,
  networkCheckerPost,
  competitiveAnalyzerPost,
  japaneseOcrPost,
]