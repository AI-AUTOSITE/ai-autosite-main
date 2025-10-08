'use client'

import { useState } from 'react'
import { Copy, Check, FileText } from 'lucide-react'

type GenerationType = 'words' | 'sentences' | 'paragraphs'

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

export default function LoremIpsumClient() {
  const [amount, setAmount] = useState('5')
  const [type, setType] = useState<GenerationType>('paragraphs')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [includeHtml, setIncludeHtml] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)

  // Vibration helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  const generateWords = (count: number): string => {
    const words: string[] = []
    for (let i = 0; i < count; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
    }
    return words.join(' ')
  }

  const generateSentence = (): string => {
    const length = 8 + Math.floor(Math.random() * 10)
    const words: string[] = []
    for (let i = 0; i < length; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }

  const generateParagraph = (): string => {
    const sentences = 4 + Math.floor(Math.random() * 4)
    const paragraph: string[] = []
    for (let i = 0; i < sentences; i++) {
      paragraph.push(generateSentence())
    }
    return paragraph.join(' ')
  }

  const handleGenerate = () => {
    const num = parseInt(amount) || 1
    let result = ''

    switch (type) {
      case 'words':
        if (startWithLorem) {
          const loremWords = LOREM_START.split(' ').slice(0, Math.min(num, 19))
          if (num <= 19) {
            result = loremWords.join(' ')
          } else {
            result = LOREM_START + ' ' + generateWords(num - 19)
          }
        } else {
          result = generateWords(num)
        }
        break

      case 'sentences':
        const sentences: string[] = []
        if (startWithLorem) {
          sentences.push(LOREM_START)
          for (let i = 1; i < num; i++) {
            sentences.push(generateSentence())
          }
        } else {
          for (let i = 0; i < num; i++) {
            sentences.push(generateSentence())
          }
        }
        result = sentences.join(' ')
        break

      case 'paragraphs':
        const paragraphs: string[] = []
        if (startWithLorem) {
          paragraphs.push(LOREM_START + ' ' + generateParagraph())
          for (let i = 1; i < num; i++) {
            paragraphs.push(generateParagraph())
          }
        } else {
          for (let i = 0; i < num; i++) {
            paragraphs.push(generateParagraph())
          }
        }

        if (includeHtml) {
          result = paragraphs.map((p) => `<p>${p}</p>`).join('\n\n')
        } else {
          result = paragraphs.join('\n\n')
        }
        break
    }

    setGeneratedText(result)
    vibrate(30) // Generate feedback
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText)
    vibrate(30) // Copy feedback
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getWordCount = () => {
    return generatedText
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter((w) => w).length
  }

  const getCharCount = () => {
    return generatedText.replace(/<[^>]*>/g, '').length
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Amount Input */}
          <div>
            <label className="block text-white font-medium mb-2">Amount</label>
            <input
              type="number"
              inputMode="numeric"
              autoComplete="off"
              autoFocus={false}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="100"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-white font-medium mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['words', 'sentences', 'paragraphs'] as GenerationType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t)
                    vibrate(30)
                  }}
                  className={`min-h-[44px] px-2 py-3 rounded-lg capitalize transition-all text-xs sm:text-sm ${
                    type === t
                      ? 'bg-gray-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'paragraphs' ? (
                    <>
                      <span className="hidden sm:inline">Paragraphs</span>
                      <span className="sm:hidden">Para</span>
                    </>
                  ) : t === 'sentences' ? (
                    <>
                      <span className="hidden sm:inline">Sentences</span>
                      <span className="sm:hidden">Sent</span>
                    </>
                  ) : (
                    'Words'
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => {
                setStartWithLorem(e.target.checked)
                vibrate(30)
              }}
              className="w-4 h-4 rounded"
            />
            <span>Start with "Lorem ipsum..."</span>
          </label>

          {type === 'paragraphs' && (
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={includeHtml}
                onChange={(e) => {
                  setIncludeHtml(e.target.checked)
                  vibrate(30)
                }}
                className="w-4 h-4 rounded"
              />
              <span>Include HTML <code className="text-xs bg-white/10 px-1 rounded">&lt;p&gt;</code> tags</span>
            </label>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="min-h-[44px] w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Generate Lorem Ipsum
        </button>
      </div>

      {/* Generated Text */}
      {generatedText && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{getWordCount()} words</span>
              <span>{getCharCount()} characters</span>
            </div>
            <button
              onClick={handleCopy}
              className={`min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="bg-black/20 rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-gray-300 whitespace-pre-wrap font-sans">{generatedText}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-3">About Lorem Ipsum</h3>
        <p className="text-gray-400 text-sm">
          Lorem Ipsum has been the industry's standard dummy text since the 1500s. It's used by
          designers and developers to fill layouts with text before final content is ready.
        </p>
      </div>
    </div>
  )
}