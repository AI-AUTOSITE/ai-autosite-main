// app/lib/blog-posts/dev-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { testFileGeneratorPost } from '@/tools/test-file-generator/blog-post'
import { testImageGeneratorPost } from '@/tools/test-image-generator/blog-post'
import { testTextGeneratorPost } from '@/tools/test-text-generator/blog-post'
import { pdfTestGeneratorPost } from '@/tools/pdf-test-generator/blog-post'
import { codeDependencyVisualizerPost } from '@/tools/code-dependency-visualizer/blog-post'
import { techStackAnalyzerPost } from '@/tools/tech-stack-analyzer/blog-post'

export const devToolsPosts: BlogPost[] = [
  testFileGeneratorPost,
  testImageGeneratorPost,
  testTextGeneratorPost,
  pdfTestGeneratorPost,
  codeDependencyVisualizerPost,
  techStackAnalyzerPost,
]