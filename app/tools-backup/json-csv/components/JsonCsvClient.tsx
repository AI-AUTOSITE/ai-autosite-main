'use client'

import { useState } from 'react'
import { Copy, Check, Type } from 'lucide-react'

type GenerationType = 'words' | 'sentences' | 'paragraphs'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export default function LoremIpsumClient() {
  const [amount, setAmount] = useState('5')
  const [type, setType] = useState<GenerationType>('paragraphs')
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)

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
    const sentences = 4 + Math.floor(Math.random() * 3)
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
        const loremWords = LOREM_START.split(' ').slice(0, Math.min(num, 19))
        if (num <= 19) {
          result = loremWords.join(' ')
        } else {
          result = LOREM_START + ' ' + generateWords(num - 19)
        }
        break
        
      case 'sentences':
        const sentences: string[] = []
        sentences.push(LOREM_START)
        for (let i = 1; i < num; i++) {
          sentences.push(generateSentence())
        }
        result = sentences.join(' ')
        break
        
      case 'paragraphs':
        const paragraphs: string[] = []
        paragraphs.push(LOREM_START + ' ' + generateParagraph())
        for (let i = 1; i < num; i++) {
          paragraphs.push(generateParagraph())
        }
        result = paragraphs.join('\n\n')
        break
    }
    
    setGeneratedText(result)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Quick presets
  const presets = [
    { amount: '1', type: 'paragraphs' as GenerationType, label: '1 Paragraph' },
    { amount: '5', type: 'sentences' as GenerationType, label: '5 Sentences' },
    { amount: '50', type: 'words' as GenerationType, label: '50 Words' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Simple subtitle */}
      <p className="text-center text-gray-400 text-sm mb-6">
        Choose amount → Generate → Copy to clipboard
      </p>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Simple Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Amount Input */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              How many?
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="100"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                       placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors
                       hover:bg-white/15"
              autoFocus
            />
          </div>
          
          {/* Type Selection */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Type
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['words', 'sentences', 'paragraphs'] as GenerationType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-3 rounded-lg text-xs capitalize transition-all ${
                    type === t
                      ? 'bg-gray-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-2 mb-6">
          <span className="text-xs text-gray-500">Quick:</span>
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                setAmount(preset.amount)
                setType(preset.type)
                setTimeout(handleGenerate, 100)
              }}
              className="text-xs px-3 py-1 bg-white/5 text-gray-400 rounded-full 
                       hover:bg-white/10 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl 
                   font-medium text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Type className="w-5 h-5" />
          Generate Lorem Ipsum
        </button>

        {/* Generated Text */}
        {generatedText && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-400">
                {generatedText.split(/\s+/).filter(w => w).length} words • 
                {generatedText.length} characters
              </span>
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm font-sans">
                {generatedText}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Always starts with "Lorem ipsum" • Standard placeholder text since 1500s
      </p>
    </div>
  )
}