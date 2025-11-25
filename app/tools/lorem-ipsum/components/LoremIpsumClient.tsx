'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Copy, Check, FileText, HelpCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { DownloadButton } from './DownloadButton'
import { FormatSelector } from './FormatSelector'
import { PresetButtons } from './PresetButtons'
import { AmountSlider } from './AmountSlider'
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { formatOutput, type OutputFormat } from '../lib/formatters'

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
  const searchParams = useSearchParams()
  
  // Initialize from URL parameters if present
  const [amount, setAmount] = useState(() => searchParams.get('amount') || '5')
  const [type, setType] = useState<GenerationType>(() => {
    const paramType = searchParams.get('type')
    return (paramType === 'words' || paramType === 'sentences' || paramType === 'paragraphs')
      ? paramType
      : 'paragraphs'
  })
  const [startWithLorem, setStartWithLorem] = useState(() => {
    const paramStart = searchParams.get('start')
    return paramStart !== 'false'
  })
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(() => {
    const paramFormat = searchParams.get('format')
    return (paramFormat === 'text' || paramFormat === 'html' || paramFormat === 'markdown' || paramFormat === 'json')
      ? paramFormat
      : 'text'
  })
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(true)
  
  const { setTheme, theme } = useTheme()

  // Debounce values for auto-generation
  const [debouncedAmount] = useDebounce(amount, 300)
  const [debouncedType] = useDebounce(type, 100)
  const [debouncedFormat] = useDebounce(selectedFormat, 100)

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

        // Apply selected format
        result = formatOutput(paragraphs, selectedFormat)
        break
    }

    setGeneratedText(result)
    vibrate(30) // Generate feedback
  }

  // Preset selection handler
  const handlePresetSelect = (presetType: GenerationType, presetAmount: number) => {
    setType(presetType)
    setAmount(presetAmount.toString())
    
    // Auto-generate after a short delay
    setTimeout(() => {
      // Trigger generation with new values
      const num = presetAmount
      let result = ''

      switch (presetType) {
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

          result = formatOutput(paragraphs, selectedFormat)
          break
      }

      setGeneratedText(result)
      vibrate(30)
    }, 100)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText)
    vibrate(30) // Copy feedback
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setGeneratedText('')
    vibrate(30)
  }

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    vibrate(30)
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onCopy: handleCopy,
    onClear: handleClear,
    onToggleTheme: handleToggleTheme,
  })

  // Auto-generate on debounced value changes
  useEffect(() => {
    if (autoGenerate && debouncedAmount && parseInt(debouncedAmount) > 0) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount, debouncedType, debouncedFormat, startWithLorem, autoGenerate])

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
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white">Lorem Ipsum Generator</h1>
          <p className="text-gray-400 dark:text-gray-400 text-sm mt-1">
            Generate placeholder text instantly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcuts(true)}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            aria-label="Show keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/5 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-white/10 p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Amount Slider */}
          <div>
            <AmountSlider
              value={parseInt(amount) || 1}
              onChange={(value) => setAmount(value.toString())}
              min={1}
              max={100}
              label="Amount"
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

        {/* Preset Buttons */}
        <div className="mb-6">
          <PresetButtons
            onSelect={handlePresetSelect}
            currentType={type}
            currentAmount={parseInt(amount) || 0}
            onVibrate={() => vibrate(30)}
          />
        </div>

        {/* Format Selector */}
        {type === 'paragraphs' && (
          <div className="mb-6">
            <FormatSelector
              selected={selectedFormat}
              onChange={setSelectedFormat}
              onVibrate={() => vibrate(30)}
            />
          </div>
        )}

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

          <label className="flex items-center gap-2 text-gray-300 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => {
                setAutoGenerate(e.target.checked)
                vibrate(30)
              }}
              className="w-4 h-4 rounded"
            />
            <span>Auto-generate on change</span>
          </label>
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
            <div className="flex items-center gap-2">
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
              <DownloadButton
                content={generatedText}
                onDownload={() => vibrate(30)}
              />
            </div>
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

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}