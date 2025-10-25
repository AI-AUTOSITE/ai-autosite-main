// app/lib/blog-posts/converters.ts
import type { BlogPost } from './types'

// Import from tool folders
import { textCasePost } from '@/tools/text-case/blog-post'
import { base64Post } from '@/tools/base64/blog-post'
import { markdownHtmlPost } from '@/tools/markdown-html/blog-post'
import { jsonFormatPost } from '@/tools/json-format/blog-post'
import { jsonCsvPost } from '@/tools/json-csv/blog-post'
import { unitConverterPost } from '@/tools/unit-converter/blog-post'
import { textCounterPost } from '@/tools/text-counter/blog-post'
import { twitterCounterPost } from '@/tools/twitter-counter/blog-post'
import { ageCalculatorPost } from '@/tools/age-calculator/blog-post'
import { bmiCalculatorPost } from '@/tools/bmi-calculator/blog-post'
import { percentageCalculatorPost } from '@/tools/percentage-calculator/blog-post'

export const convertersPosts: BlogPost[] = [
  textCasePost,
  base64Post,
  markdownHtmlPost,
  jsonFormatPost,
  jsonCsvPost,
  unitConverterPost,
  textCounterPost,
  twitterCounterPost,
  ageCalculatorPost,
  bmiCalculatorPost,
  percentageCalculatorPost,
]