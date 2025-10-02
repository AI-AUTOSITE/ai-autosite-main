// app/tools/ai-summarizer/lib/types.ts

export type SummaryLength = 'brief' | 'standard' | 'detailed'
export type SummaryTone = 'professional' | 'casual' | 'technical'

export interface SummarizeRequest {
  text: string
  length?: SummaryLength
  tone?: SummaryTone
}

export interface SummarizeResponse {
  summary: string
  originalLength: number
  summaryLength: number
  reductionPercentage: number
}

export interface SummarizeError {
  error: string
  status: number
}