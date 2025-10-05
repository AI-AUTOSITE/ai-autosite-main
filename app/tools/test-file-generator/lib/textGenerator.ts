// app/tools/test-file-generator/lib/textGenerator.ts

import { Language } from './types'

// Lorem Ipsum text pool
const LOREM_IPSUM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident sunt in culpa.',
  'Nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.',
  'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.'
]

// Japanese dummy text pool
const JAPANESE_TEXT = [
  'Kore wa tesuto fairu seisei you no damii tekisuto desu.',
  'Nihongo no bunshou wo fukumu PDF fairu wo sakusei suru koto ga dekimasu.',
  'Appuroodo kinou no tesuto ya fairu shori shisutemu no kenshou ni shiyou dekimasu.',
  'Kono tsūru wa kanzen ni muryou de, koukoku ya torakkingu wa issai arimasen.',
  'Burauza jou de dousasuru tame, puraibashii mo kanzen ni hogosare masu.',
  'Kaihatsusha ya QA enjinia no tame ni sekkei sareta tsūru desu.',
  'Fairu saizu ya naiyou wo jiyuu ni kasutamaizu dekimasu.',
  'Fukuzatsu na gazou patān ya shori shiyasui gazou wo sentaku dekimasu.',
  'Riarutaimu purēbyū kinou ni yori, seisei mae ni kakunin ga kanou desu.',
  'Daunroodo shita fairu wa sugu ni tesuto ni shiyou dekimasu.'
]

/**
 * Generate text based on language and word count
 */
export function generateText(language: Language, wordCount: number): string {
  const pool = language === 'japanese' ? JAPANESE_TEXT : LOREM_IPSUM
  const sentences: string[] = []
  let currentWords = 0
  
  while (currentWords < wordCount) {
    if (language === 'mixed') {
      // Alternate between English and Japanese
      const useJapanese = Math.random() > 0.5
      const sentence = useJapanese 
        ? JAPANESE_TEXT[Math.floor(Math.random() * JAPANESE_TEXT.length)]
        : LOREM_IPSUM[Math.floor(Math.random() * LOREM_IPSUM.length)]
      sentences.push(sentence)
      currentWords += sentence.split(' ').length
    } else {
      const sentence = pool[Math.floor(Math.random() * pool.length)]
      sentences.push(sentence)
      currentWords += sentence.split(' ').length
    }
  }
  
  return sentences.join(' ')
}

/**
 * Calculate word count based on text amount percentage
 */
export function calculateWordCount(textAmountPercent: number): number {
  // Base word count per page (assuming A4 size)
  const baseWordsPerPage = 500
  const multiplier = textAmountPercent / 100
  return Math.floor(baseWordsPerPage * multiplier)
}