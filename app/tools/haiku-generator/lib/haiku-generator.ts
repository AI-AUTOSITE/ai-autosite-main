// app/tools/haiku-generator/lib/haiku-generator.ts
import { getRandomSeasonWord, getCurrentSeason } from './season-words'
import { countSyllablesInLine } from './syllable-counter'
import type { Season, Haiku, HaikuLine } from './types'

export function generateLocalHaiku(theme: string, season?: Season): Haiku {
  const selectedSeason = season || getCurrentSeason()
  const seasonWord = getRandomSeasonWord(selectedSeason)
  
  // シンプルなテンプレート
  const templates = [
    [`${seasonWord.word}`, `${theme} whispers soft and clear`, 'peace remains here'],
    [`In ${theme} light`, `${seasonWord.word} gently sway`, 'time drifts away'],
    [`${seasonWord.word}`, `${theme} brings quiet change`, 'life flows on'],
  ]
  
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  const lines = template.map(text => ({
    text,
    syllables: countSyllablesInLine(text),
    words: text.split(' ')
  })) as [HaikuLine, HaikuLine, HaikuLine]
  
  return {
    lines,
    season: selectedSeason,
    seasonWord: seasonWord.word,
    theme,
    generationMethod: 'local',
    timestamp: new Date().toISOString()
  }
}