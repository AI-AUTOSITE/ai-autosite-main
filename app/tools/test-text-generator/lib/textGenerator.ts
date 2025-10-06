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
  'これはテストテキストです。',
  '日本語の文章を生成します。',
  'システムのテストに使用できます。',
  'シンプルで読みやすい文章です。',
  'アプリケーションの動作確認用です。',
  'データ処理の検証に便利です。',
  '完全に無料で使用できます。',
  'ブラウザ上で動作します。',
  'プライバシーが保護されます。',
  'オフラインでも利用可能です。',
]

const JAPANESE_COMPLEX = [
  'これは複雑な構造を持つ日本語のテストテキストであり、長い文章による検証が可能となっています。',
  '様々なアプリケーションにおけるテキスト処理機能の性能評価や、文字数制限の確認などに活用することができます。',
  'システム開発やテスト工程において、実際のユースケースを想定したダミーデータとして利用されることを目的としています。',
  'テキスト要約機能や自然言語処理システムの動作検証において、十分な長さと複雑さを持つサンプルデータが必要とされます。',
  'このツールは完全にブラウザ上で動作するため、データのアップロードや外部サーバーへの送信は一切行われません。',
  'プライバシーとセキュリティが完全に保護された環境で、安心してテストデータを生成することが可能です。',
  '生成されるテキストの長さや複雑さは、ユーザーの要件に応じて柔軟にカスタマイズすることができます。',
  '開発者やQAエンジニアが、効率的にシステムの動作を検証するために設計されたツールとなっています。',
  '無料で広告なし、ユーザー登録も不要という、シンプルで使いやすい特徴を持っています。',
  'テキスト処理システムの負荷テストや、パフォーマンス評価にも適したデータを提供します。',
]

const JAPANESE_TECHNICAL = [
  'システムアーキテクチャは、マイクロサービスパターンとイベント駆動型設計を採用しています。',
  'データベースアクセス層では、ORMフレームワークを使用した抽象化とトランザクション管理を実装しています。',
  'REST APIエンドポイントは、OpenAPI仕様に準拠し、バリデーションとエラーハンドリングを統合しています。',
  '認証機能にはJWTトークンベースの実装を採用し、リフレッシュトークンによるセキュアなセッション管理を実現しています。',
  'フロントエンド開発では、Reactを使用したコンポーネントベースのアーキテクチャと状態管理ライブラリを活用しています。',
  'CI/CDパイプラインは、自動テスト、静的解析、コンテナビルド、デプロイメントの各ステージを統合しています。',
  'モニタリングシステムは、メトリクス収集、ログ集約、アラート通知の機能を提供します。',
  'スケーラビリティを確保するため、水平スケーリングとロードバランシングの戦略を実装しています。',
  'キャッシング戦略では、Redisを活用した分散キャッシュとセッション管理を行っています。',
  'セキュリティ対策として、HTTPS通信、CSRFトークン、レート制限、入力サニタイゼーションを実装しています。',
]

const EMOJIS = [
  '😊',
  '🚀',
  '💡',
  '🎯',
  '✨',
  '🔥',
  '💪',
  '🌟',
  '👍',
  '🎉',
  '📊',
  '🔧',
  '💻',
  '🎨',
  '🌈',
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
