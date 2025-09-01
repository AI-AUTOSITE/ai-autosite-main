// app/tools/ai-dev-dictionary/lib/terms/types.ts

export interface TechTerm {
  id: string
  term: string
  category: string
  aiSynonyms: string[]
  description: string
  beginnerTip: string
  aiPhrases: string[]
  codeExample: string
  demoType: string
  relatedTerms?: string[]
}