// app/tools/haiku-generator/lib/types.ts
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface SeasonWord {
  word: string
  japanese: string
  syllables: number
  category: string
  imagery: 'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory'
  commonality: 1 | 2 | 3 | 4 | 5
  tags: string[]
}

export interface SeasonWordDatabase {
  spring: SeasonWord[]
  summer: SeasonWord[]
  autumn: SeasonWord[]
  winter: SeasonWord[]
}

export interface HaikuLine {
  text: string
  syllables: number
  words: string[]
}

export interface Haiku {
  lines: [HaikuLine, HaikuLine, HaikuLine]
  season: Season
  seasonWord: string
  theme: string
  generationMethod: 'local' | 'claude' | 'cohere'
  timestamp: string
}