// app/tools/test-text-generator/lib/types.ts

export type Language = 'english' | 'japanese' | 'mixed'
export type Complexity = 'simple' | 'complex' | 'technical'
export type OutputFormat = 'plain' | 'markdown' | 'html'

export interface TextSettings {
  language: Language
  complexity: Complexity
  outputFormat: OutputFormat

  // Length settings (user can choose one method)
  lengthMode: 'characters' | 'words' | 'paragraphs'
  characterCount: number // 100 - 100000
  wordCount: number // 50 - 20000
  paragraphCount: number // 1 - 100

  // Content options
  includeEmojis: boolean
  includeNumbers: boolean
  includeSpecialChars: boolean
  addLineBreaks: boolean
}

export const DEFAULT_SETTINGS: TextSettings = {
  language: 'english',
  complexity: 'simple',
  outputFormat: 'plain',
  lengthMode: 'words',
  characterCount: 1000,
  wordCount: 500,
  paragraphCount: 5,
  includeEmojis: false,
  includeNumbers: false,
  includeSpecialChars: false,
  addLineBreaks: false,
}

export interface TextStats {
  characters: number
  words: number
  paragraphs: number
  sentences: number
  readingTime: number // in minutes
}
