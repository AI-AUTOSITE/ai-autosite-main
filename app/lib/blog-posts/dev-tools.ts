// app/lib/blog-posts/dev-tools.ts
import type { BlogPost } from './types'

// Import from tool folders
import { testFileGeneratorPost } from '@/tools/test-file-generator/blog-post'
import { testImageGeneratorPost } from '@/tools/test-image-generator/blog-post'
import { testTextGeneratorPost } from '@/tools/test-text-generator/blog-post'
import { pdfTestGeneratorPost } from '@/tools/pdf-test-generator/blog-post'
import { codeDependencyVisualizerPost } from '@/tools/code-dependency-visualizer/blog-post'
import { techStackAnalyzerPost } from '@/tools/tech-stack-analyzer/blog-post'
import { hashGeneratorPost } from '@/tools/hash-generator/blog-post'
import { regexTesterPost } from '@/tools/regex-tester/blog-post'
import { codeFormatterPost } from '@/tools/code-formatter/blog-post'
import { metaTagGeneratorPost } from '@/tools/meta-tag-generator/blog-post'
import { cronGeneratorPost } from '@/tools/cron-generator/blog-post'
import { diffCheckerPost } from '@/tools/diff-checker/blog-post'

export const devToolsPosts: BlogPost[] = [
  testFileGeneratorPost,
  testImageGeneratorPost,
  testTextGeneratorPost,
  pdfTestGeneratorPost,
  codeDependencyVisualizerPost,
  techStackAnalyzerPost,
  hashGeneratorPost,
  regexTesterPost,
  codeFormatterPost,
  metaTagGeneratorPost,
  cronGeneratorPost,
  diffCheckerPost,
]