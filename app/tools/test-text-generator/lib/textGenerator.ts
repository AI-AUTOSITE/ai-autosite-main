// app/tools/test-text-generator/lib/textGenerator.ts

import { TextSettings, TextStats } from './types'

// Lorem Ipsum pool (extended)
const LOREM_SIMPLE = [
  'Lorem ipsum dolor sit amet.',
  'Consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt.',
  'Ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam.',
  'Quis nostrud exercitation ullamco.',
  'Laboris nisi ut aliquip ex ea.',
  'Commodo consequat duis aute irure.',
  'Dolor in reprehenderit in voluptate.',
  'Velit esse cillum dolore eu fugiat.',
]

const LOREM_COMPLEX = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
  'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.',
]

const LOREM_TECHNICAL = [
  'The implementation utilizes a polymorphic architecture with dependency injection patterns.',
  'Asynchronous operations are handled through promise-based abstractions and event-driven mechanisms.',
  'Database transactions employ optimistic locking strategies to ensure ACID compliance.',
  'The middleware layer implements cross-cutting concerns including authentication and authorization.',
  'RESTful API endpoints follow OpenAPI specifications with comprehensive schema validation.',
  'Microservices communicate via message queues using publish-subscribe patterns.',
  'Containerization leverages Docker with Kubernetes orchestration for scalable deployment.',
  'Continuous integration pipelines automate testing, building, and deployment processes.',
  'Monitoring solutions aggregate metrics using time-series databases and alerting mechanisms.',
  'Security implementations include JWT tokens, HTTPS encryption, and rate limiting strategies.',
]

// Japanese text pool
const JAPANESE_SIMPLE = [
  'This is test text.',
  'Generate Japanese sentences.',
  'Can be used for system testing.',
  'Simple and readable text.',
  'For application operation verification.',
  'Convenient for data processing verification.',
  'Completely free to use.',
  'Works in browser.',
  'Privacy is protected.',
  'Can be used offline.',
]

const JAPANESE_COMPLEX = [
  'This is Japanese test text with complex structure that enables verification through long sentences.',
  'It can be used for performance evaluation of text processing functions in various applications and confirmation of character count limits.',
  'It is intended to be used as dummy data assuming actual use cases in system development and test processes.',
  'Sample data with sufficient length and complexity is required for text summarization functions and natural language processing system operation verification.',
  'This tool operates completely in the browser, so there are no data uploads or transmissions to external servers.',
  'In an environment where privacy and security are completely protected, you can safely generate test data.',
  'The length and complexity of the generated text can be flexibly customized according to user requirements.',
  'It is a tool designed for developers and QA engineers to efficiently verify system operation.',
  'It has simple and easy-to-use features with no ads and no user registration required.',
  'Provides data suitable for load testing and performance evaluation of text processing systems.',
]

const JAPANESE_TECHNICAL = [
  'The system architecture adopts microservices patterns and event-driven design.',
  'The database access layer implements abstraction and transaction management using ORM framework.',
  'REST API endpoints comply with OpenAPI specifications and integrate validation and error handling.',
  'Authentication functions adopt JWT token-based implementation and realize secure session management with refresh tokens.',
  'Frontend development utilizes React component-based architecture and state management libraries.',
  'CI/CD pipelines integrate automated testing, static analysis, container builds, and deployment stages.',
  'Monitoring systems provide metrics collection, log aggregation, and alert notification functions.',
  'To ensure scalability, horizontal scaling and load balancing strategies are implemented.',
  'Caching strategies use Redis for distributed cache and session management.',
  'As security measures, HTTPS communication, CSRF tokens, rate limiting, and input sanitization are implemented.',
]

const EMOJIS = [
  String.fromCodePoint(0x1F60A), // smile
  String.fromCodePoint(0x1F680), // rocket
  String.fromCodePoint(0x1F4A1), // bulb
  String.fromCodePoint(0x1F3AF), // target
  String.fromCodePoint(0x2728), // sparkles
  String.fromCodePoint(0x1F525), // fire
  String.fromCodePoint(0x1F4AA), // muscle
  String.fromCodePoint(0x1F31F), // star
  String.fromCodePoint(0x1F44D), // thumbs up
  String.fromCodePoint(0x1F389), // party
  String.fromCodePoint(0x1F4CA), // chart
  String.fromCodePoint(0x1F527), // wrench
  String.fromCodePoint(0x1F4BB), // laptop
  String.fromCodePoint(0x1F3A8), // palette
  String.fromCodePoint(0x1F308), // rainbow
]

const NUMBERS = ['123', '456', '789', '2024', '100%', '3.14', '42', '1000', '50/50', '24/7']
const SPECIAL_CHARS = ['@', '#', '$', '%', '&', '*', '!', '?', '~', '+', '=', '<', '>']

/**
 * Generate test text based on settings
 */
export function generateText(settings: TextSettings): string {
  let text = ''
  let targetLength = 0

  // Determine target length based on mode
  switch (settings.lengthMode) {
    case 'characters':
      targetLength = settings.characterCount
      text = generateByCharacters(settings, targetLength)
      break
    case 'words':
      targetLength = settings.wordCount
      text = generateByWords(settings, targetLength)
      break
    case 'paragraphs':
      targetLength = settings.paragraphCount
      text = generateByParagraphs(settings, targetLength)
      break
  }

  // Apply enhancements
  if (settings.includeEmojis) {
    text = addEmojis(text)
  }
  if (settings.includeNumbers) {
    text = addNumbers(text)
  }
  if (settings.includeSpecialChars) {
    text = addSpecialChars(text)
  }
  if (settings.addLineBreaks) {
    text = addExtraLineBreaks(text)
  }

  // Format output
  return formatOutput(text, settings.outputFormat)
}

/**
 * Generate text by character count
 */
function generateByCharacters(settings: TextSettings, targetChars: number): string {
  const sentences: string[] = []
  let currentLength = 0

  while (currentLength < targetChars) {
    const sentence = getRandomSentence(settings)
    sentences.push(sentence)
    currentLength += sentence.length + 1 // +1 for space
  }

  const text = sentences.join(' ')
  return text.substring(0, targetChars)
}

/**
 * Generate text by word count
 */
function generateByWords(settings: TextSettings, targetWords: number): string {
  const sentences: string[] = []
  let currentWords = 0

  while (currentWords < targetWords) {
    const sentence = getRandomSentence(settings)
    sentences.push(sentence)
    currentWords += countWords(sentence)
  }

  return sentences.join(' ')
}

/**
 * Generate text by paragraph count
 */
function generateByParagraphs(settings: TextSettings, targetParagraphs: number): string {
  const paragraphs: string[] = []

  for (let i = 0; i < targetParagraphs; i++) {
    const sentenceCount = Math.floor(Math.random() * 4) + 3 // 3-6 sentences per paragraph
    const sentences: string[] = []

    for (let j = 0; j < sentenceCount; j++) {
      sentences.push(getRandomSentence(settings))
    }

    paragraphs.push(sentences.join(' '))
  }

  return paragraphs.join('\n\n')
}

/**
 * Get random sentence based on language and complexity
 */
function getRandomSentence(settings: TextSettings): string {
  let pool: string[]

  if (settings.language === 'mixed') {
    // Mix English and Japanese
    const useJapanese = Math.random() > 0.5
    pool = useJapanese ? getJapanesePool(settings.complexity) : getEnglishPool(settings.complexity)
  } else if (settings.language === 'japanese') {
    pool = getJapanesePool(settings.complexity)
  } else {
    pool = getEnglishPool(settings.complexity)
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Get English sentence pool
 */
function getEnglishPool(complexity: string): string[] {
  switch (complexity) {
    case 'simple':
      return LOREM_SIMPLE
    case 'complex':
      return LOREM_COMPLEX
    case 'technical':
      return LOREM_TECHNICAL
    default:
      return LOREM_SIMPLE
  }
}

/**
 * Get Japanese sentence pool
 */
function getJapanesePool(complexity: string): string[] {
  switch (complexity) {
    case 'simple':
      return JAPANESE_SIMPLE
    case 'complex':
      return JAPANESE_COMPLEX
    case 'technical':
      return JAPANESE_TECHNICAL
    default:
      return JAPANESE_SIMPLE
  }
}

/**
 * Add random emojis to text
 */
function addEmojis(text: string): string {
  const sentences = text.split('. ')
  const emojiFrequency = 0.3 // 30% of sentences get an emoji

  const enhanced = sentences.map((sentence) => {
    if (Math.random() < emojiFrequency) {
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      return `${sentence} ${emoji}`
    }
    return sentence
  })

  return enhanced.join('. ')
}

/**
 * Add random numbers to text
 */
function addNumbers(text: string): string {
  const sentences = text.split('. ')
  const numberFrequency = 0.2 // 20% of sentences get a number

  const enhanced = sentences.map((sentence) => {
    if (Math.random() < numberFrequency) {
      const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
      const words = sentence.split(' ')
      const insertPos = Math.floor(Math.random() * words.length)
      words.splice(insertPos, 0, number)
      return words.join(' ')
    }
    return sentence
  })

  return enhanced.join('. ')
}

/**
 * Add random special characters
 */
function addSpecialChars(text: string): string {
  const sentences = text.split('. ')
  const charFrequency = 0.15 // 15% of sentences get special chars

  const enhanced = sentences.map((sentence) => {
    if (Math.random() < charFrequency) {
      const char = SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)]
      return `${sentence} ${char}`
    }
    return sentence
  })

  return enhanced.join('. ')
}

/**
 * Add extra line breaks
 */
function addExtraLineBreaks(text: string): string {
  const sentences = text.split('. ')
  const breakFrequency = 0.25 // Add line break after 25% of sentences

  const enhanced = sentences.map((sentence, index) => {
    if (index > 0 && Math.random() < breakFrequency) {
      return `\n${sentence}`
    }
    return sentence
  })

  return enhanced.join('. ')
}

/**
 * Format output based on format type
 */
function formatOutput(text: string, format: string): string {
  switch (format) {
    case 'markdown':
      return formatAsMarkdown(text)
    case 'html':
      return formatAsHTML(text)
    case 'plain':
    default:
      return text
  }
}

/**
 * Format as Markdown
 */
function formatAsMarkdown(text: string): string {
  const paragraphs = text.split('\n\n')

  let markdown = '# Generated Test Text\n\n'

  paragraphs.forEach((para, index) => {
    if (index % 3 === 0 && index > 0) {
      markdown += `\n## Section ${Math.floor(index / 3) + 1}\n\n`
    }
    markdown += `${para}\n\n`
  })

  return markdown
}

/**
 * Format as HTML
 */
function formatAsHTML(text: string): string {
  const paragraphs = text.split('\n\n')

  let html = '<div class="generated-text">\n'
  html += '  <h1>Generated Test Text</h1>\n'

  paragraphs.forEach((para, index) => {
    if (index % 3 === 0 && index > 0) {
      html += `  <h2>Section ${Math.floor(index / 3) + 1}</h2>\n`
    }
    html += `  <p>${para}</p>\n`
  })

  html += '</div>'

  return html
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

/**
 * Calculate text statistics
 */
export function calculateStats(text: string): TextStats {
  const characters = text.length
  const words = countWords(text)
  const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0).length
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
  const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words/min

  return {
    characters,
    words,
    paragraphs,
    sentences,
    readingTime,
  }
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(format: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const ext = format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'txt'
  return `test-text-${year}${month}${day}-${hours}${minutes}${seconds}.${ext}`
}