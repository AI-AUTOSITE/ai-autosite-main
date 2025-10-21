// app/lib/blog-posts/dev-tools.ts
import type { BlogPost } from './types'
import { textCasePost } from '@/tools/text-case/blog-post'
import { testFileGeneratorPost } from '@/tools/test-file-generator/blog-post'
import { testImageGeneratorPost } from '@/tools/test-image-generator/blog-post'
import { networkCheckerPost } from '@/tools/network-checker/blog-post'
import { pdfTestGeneratorPost } from '@/tools/pdf-test-generator/blog-post'
import { testTextGeneratorPost } from '@/tools/test-text-generator/blog-post'
import { base64Post } from '@/tools/base64/blog-post'
import { aiProjectVisualizerPost } from '@/tools/ai-project-visualizer/blog-post'
import { markdownHtmlPost } from '@/tools/markdown-html/blog-post'
import { codeRoasterPost, codeRoasterTutorialPost } from '@/tools/code-roaster/blog-post'
import { jsonFormatPost } from '@/tools/json-format/blog-post'
import { jsonCsvPost } from '@/tools/json-csv/blog-post'
import { faviconGeneratorPost } from '@/tools/favicon-generator/blog-post'
import { loremIpsumPost } from '@/tools/lorem-ipsum/blog-post'
import { uuidGeneratorPost } from '@/tools/uuid-generator/blog-post'
import { codeDependencyVisualizerPost } from '@/tools/code-dependency-visualizer/blog-post'
import { stackRecommenderPost } from '@/tools/stack-recommender/blog-post'
import { techStackAnalyzerPost } from '@/tools/tech-stack-analyzer/blog-post'

export const devToolsPosts: BlogPost[] = [
  textCasePost,
  testFileGeneratorPost,
  testImageGeneratorPost,
  networkCheckerPost,
  pdfTestGeneratorPost,
  testTextGeneratorPost,
  base64Post,
  aiProjectVisualizerPost,
  markdownHtmlPost,
  codeRoasterPost,
  codeRoasterTutorialPost,
  jsonFormatPost,
  jsonCsvPost,
  faviconGeneratorPost,
  loremIpsumPost,
  uuidGeneratorPost,
  codeDependencyVisualizerPost,
  stackRecommenderPost,
  techStackAnalyzerPost,
]