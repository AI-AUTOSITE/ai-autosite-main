'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
import { FloatingPreview } from './FloatingPreview'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { formatOutput, type OutputFormat } from '../lib/formatters'

type GenerationType = 'words' | 'sentences' | 'paragraphs'
type TextTheme = 'latin' | 'corporate' | 'tech' | 'hipster'

const TEXT_THEMES: Record<TextTheme, { name: string; words: string[]; start: string }> = {
  latin: {
    name: 'Classic Latin',
    words: [
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
    ],
    start: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  corporate: {
    name: 'Corporate',
    words: [
      'synergy', 'leverage', 'optimize', 'stakeholder', 'deliverable', 'bandwidth', 'paradigm', 'scalable',
      'proactive', 'innovative', 'streamline', 'benchmark', 'ecosystem', 'holistic', 'agile', 'dynamic',
      'strategy', 'implementation', 'collaboration', 'integration', 'transformation', 'sustainability', 'growth',
      'revenue', 'pipeline', 'roadmap', 'milestone', 'framework', 'methodology', 'initiative', 'objective',
      'performance', 'efficiency', 'productivity', 'engagement', 'alignment', 'value', 'proposition', 'metrics',
      'analytics', 'insights', 'actionable', 'empower', 'facilitate', 'accelerate', 'maximize', 'minimize',
      'enhance', 'cultivate', 'foster', 'drive', 'enable', 'establish', 'maintain', 'develop', 'achieve',
      'deliver', 'execute', 'implement', 'launch', 'deploy', 'solution', 'platform', 'resource', 'capability',
    ],
    start: 'Leveraging synergy across stakeholders, our proactive approach drives scalable innovation while optimizing deliverables and maximizing value.',
  },
  tech: {
    name: 'Tech',
    words: [
      'algorithm', 'API', 'backend', 'frontend', 'microservice', 'container', 'kubernetes', 'docker',
      'serverless', 'cloud', 'distributed', 'scalable', 'latency', 'throughput', 'bandwidth', 'cache',
      'database', 'query', 'index', 'schema', 'migration', 'deployment', 'pipeline', 'integration',
      'continuous', 'automated', 'testing', 'monitoring', 'logging', 'metrics', 'alerting', 'debugging',
      'refactoring', 'optimization', 'performance', 'security', 'authentication', 'authorization', 'encryption',
      'protocol', 'endpoint', 'webhook', 'callback', 'async', 'sync', 'parallel', 'concurrent', 'thread',
      'process', 'memory', 'CPU', 'GPU', 'network', 'socket', 'streaming', 'batch', 'real-time', 'infrastructure',
      'DevOps', 'CI/CD', 'repository', 'branch', 'merge', 'commit', 'pull', 'push', 'clone', 'fork',
    ],
    start: 'Deploying microservices on Kubernetes clusters enables scalable distributed systems with automated CI/CD pipelines and real-time monitoring.',
  },
  hipster: {
    name: 'Hipster',
    words: [
      'artisan', 'craft', 'handmade', 'organic', 'sustainable', 'vintage', 'retro', 'aesthetic',
      'curated', 'bespoke', 'authentic', 'minimalist', 'ethical', 'conscious', 'mindful', 'intentional',
      'slow', 'local', 'farm-to-table', 'single-origin', 'cold-brew', 'pour-over', 'espresso', 'roast',
      'vinyl', 'analog', 'film', 'polaroid', 'typewriter', 'journal', 'zine', 'podcast', 'newsletter',
      'sourdough', 'fermented', 'kombucha', 'matcha', 'oat-milk', 'avocado', 'toast', 'brunch', 'cafe',
      'coworking', 'remote', 'freelance', 'creative', 'studio', 'gallery', 'installation', 'exhibit',
      'thrift', 'upcycle', 'reclaim', 'restore', 'repurpose', 'sustainable', 'eco-friendly', 'zero-waste',
      'plant-based', 'wellness', 'meditation', 'yoga', 'mindfulness', 'breathwork', 'ritual', 'ceremony',
    ],
    start: 'Curating artisan experiences through sustainable craft, our mindful approach celebrates authentic, slow-living aesthetics with intentional design.',
  },
}

const LOREM_WORDS = TEXT_THEMES.latin.words
const LOREM_START = TEXT_THEMES.latin.start

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
  const [textTheme, setTextTheme] = useState<TextTheme>('latin')
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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  
  const { setTheme, theme } = useTheme()

  // Get portal target after mount - with retry for timing issues
  useEffect(() => {
    const findPortalTarget = () => {
      const target = document.getElementById('tool-header-actions')
      if (target) {
        setPortalTarget(target)
        return true
      }
      return false
    }

    // Try immediately
    if (findPortalTarget()) return

    // Retry a few times with increasing delays
    const timeouts = [50, 100, 200, 500]
    const timers: NodeJS.Timeout[] = []
    
    timeouts.forEach((delay) => {
      const timer = setTimeout(() => {
        findPortalTarget()
      }, delay)
      timers.push(timer)
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

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
    const themeWords = TEXT_THEMES[textTheme].words
    for (let i = 0; i < count; i++) {
      words.push(themeWords[Math.floor(Math.random() * themeWords.length)])
    }
    return words.join(' ')
  }

  const generateSentence = (): string => {
    const length = 8 + Math.floor(Math.random() * 10)
    const words: string[] = []
    const themeWords = TEXT_THEMES[textTheme].words
    for (let i = 0; i < length; i++) {
      words.push(themeWords[Math.floor(Math.random() * themeWords.length)])
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
    const themeStart = TEXT_THEMES[textTheme].start

    switch (type) {
      case 'words':
        if (startWithLorem) {
          const startWords = themeStart.split(' ').slice(0, Math.min(num, 19))
          if (num <= 19) {
            result = startWords.join(' ')
          } else {
            result = themeStart + ' ' + generateWords(num - 19)
          }
        } else {
          result = generateWords(num)
        }
        break

      case 'sentences':
        const sentences: string[] = []
        if (startWithLorem) {
          sentences.push(themeStart)
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
          paragraphs.push(themeStart + ' ' + generateParagraph())
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

  // Action buttons component
  const ActionButtons = () => (
    <>
      {/* Keyboard shortcuts - hidden on mobile/tablet */}
      <button
        onClick={() => setShowShortcuts(true)}
        className="hidden lg:flex min-h-[40px] min-w-[40px] p-2 rounded-lg bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all group items-center justify-center"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
      </button>
      <ThemeToggle />
    </>
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Action buttons via Portal - rendered in layout header if available */}
      {portalTarget && createPortal(<ActionButtons />, portalTarget)}
      
      {/* Fallback: show buttons inline if portal target not found */}
      {!portalTarget && (
        <div className="flex justify-end items-center mb-4 -mt-2">
          <div className="flex items-center gap-2">
            <ActionButtons />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 mb-6">
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
            <label className="block text-gray-900 dark:text-white font-medium mb-2">Type</label>
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
                      ? 'bg-purple-600 dark:bg-gray-600 text-white'
                      : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10'
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

        {/* Theme Selection */}
        <div className="mb-4">
          <label className="block text-gray-900 dark:text-white font-medium mb-2">Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(TEXT_THEMES) as TextTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTextTheme(t)
                  vibrate(30)
                }}
                className={`min-h-[44px] px-3 py-2 rounded-lg transition-all text-xs sm:text-sm ${
                  textTheme === t
                    ? 'bg-purple-600 dark:bg-gray-600 text-white'
                    : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10'
                }`}
              >
                {TEXT_THEMES[t].name}
              </button>
            ))}
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
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer min-h-[44px]">
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

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer min-h-[44px]">
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
          className="min-h-[44px] w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-gray-600 dark:to-gray-800 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Generate Lorem Ipsum
        </button>
      </div>

      {/* Generated Text */}
      {generatedText && (
        <div className="bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-4 sm:p-6 mb-6">
          {/* Stats and Actions - responsive layout */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            {/* Word/Character counts */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <span>{getWordCount()} words</span>
              <span>{getCharCount()} chars</span>
              <span>~{Math.max(1, Math.ceil(getWordCount() / 200))} min read</span>
            </div>
            {/* Action buttons - full width on mobile */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className={`min-h-[44px] flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/10'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden xs:inline">Copied!</span>
                    <span className="xs:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <DownloadButton
                content={generatedText}
                onDownload={() => vibrate(30)}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-black/20 rounded-xl p-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-transparent">
            <pre className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-sans text-sm sm:text-base">{generatedText}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-gray-900 dark:text-white font-medium mb-3">About Lorem Ipsum</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Lorem Ipsum has been the industry's standard dummy text since the 1500s. It's used by
          designers and developers to fill layouts with text before final content is ready.
        </p>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Floating Preview */}
      <FloatingPreview
        generatedText={generatedText}
        wordCount={getWordCount()}
        charCount={getCharCount()}
        onCopy={handleCopy}
        copied={copied}
      />
    </div>
  )
}