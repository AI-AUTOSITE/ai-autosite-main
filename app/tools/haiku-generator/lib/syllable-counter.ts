// app/tools/haiku-generator/lib/syllable-counter.ts

export function countSyllables(word: string): number {
  word = word.toLowerCase().trim()
  
  if (word.length === 0) return 0
  
  // 特殊ケース辞書
  const exceptions: Record<string, number> = {
    'the': 1, 'are': 1, 'were': 1, 'been': 1, 'being': 2,
    'every': 2, 'orange': 2, 'poem': 2, 'heaven': 2,
    'business': 2, 'chocolate': 3, 'camera': 3, 'favorite': 3,
    'people': 2, 'purple': 2, 'circle': 2, 'table': 2,
    'little': 2, 'middle': 2, 'simple': 2, 'bottle': 2,
  }
  
  if (exceptions[word]) {
    return exceptions[word]
  }
  
  // サイレントeを除去
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  // 最初のyを除外
  word = word.replace(/^y/, '')
  
  // 母音グループをカウント
  const vowelGroups = word.match(/[aeiouy]{1,2}/g)
  return vowelGroups ? vowelGroups.length : 1
}

export function countSyllablesInLine(line: string): number {
  if (!line || line.trim().length === 0) return 0
  
  return line
    .split(/\s+/)
    .filter(word => word.length > 0)
    .reduce((total, word) => {
      const cleanWord = word.replace(/[^a-z]/gi, '')
      if (cleanWord.length === 0) return total
      return total + countSyllables(cleanWord)
    }, 0)
}