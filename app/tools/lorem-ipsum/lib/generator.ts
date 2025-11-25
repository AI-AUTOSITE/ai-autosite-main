// Shared Lorem Ipsum generation logic

export type GenerationType = 'words' | 'sentences' | 'paragraphs'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
  'eius', 'modi', 'tempora', 'incidunt', 'magnam', 'quaerat', 'etiam',
]

const LOREM_START =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

function generateWords(count: number): string {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
  }
  return words.join(' ')
}

function generateSentence(): string {
  const length = 8 + Math.floor(Math.random() * 10)
  const words: string[] = []
  for (let i = 0; i < length; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateParagraph(): string {
  const sentences = 4 + Math.floor(Math.random() * 4)
  const paragraph: string[] = []
  for (let i = 0; i < sentences; i++) {
    paragraph.push(generateSentence())
  }
  return paragraph.join(' ')
}

export interface GenerateOptions {
  type: GenerationType
  amount: number
  startWithLorem?: boolean
}

export interface GenerateResult {
  content: string
  paragraphs?: string[]
  wordCount: number
  characterCount: number
}

/**
 * Generate Lorem Ipsum text
 */
export function generateLoremIpsum(options: GenerateOptions): GenerateResult {
  const { type, amount, startWithLorem = true } = options
  let content = ''
  let paragraphs: string[] = []

  switch (type) {
    case 'words': {
      if (startWithLorem) {
        const loremWords = LOREM_START.split(' ').slice(0, Math.min(amount, 19))
        if (amount <= 19) {
          content = loremWords.join(' ')
        } else {
          content = LOREM_START + ' ' + generateWords(amount - 19)
        }
      } else {
        content = generateWords(amount)
      }
      break
    }

    case 'sentences': {
      const sentences: string[] = []
      if (startWithLorem) {
        sentences.push(LOREM_START)
        for (let i = 1; i < amount; i++) {
          sentences.push(generateSentence())
        }
      } else {
        for (let i = 0; i < amount; i++) {
          sentences.push(generateSentence())
        }
      }
      content = sentences.join(' ')
      break
    }

    case 'paragraphs': {
      if (startWithLorem) {
        paragraphs.push(LOREM_START + ' ' + generateParagraph())
        for (let i = 1; i < amount; i++) {
          paragraphs.push(generateParagraph())
        }
      } else {
        for (let i = 0; i < amount; i++) {
          paragraphs.push(generateParagraph())
        }
      }
      content = paragraphs.join('\n\n')
      break
    }
  }

  const wordCount = content
    .split(/\s+/)
    .filter((w) => w).length
  const characterCount = content.length

  return {
    content,
    paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    wordCount,
    characterCount,
  }
}