'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, Lock, FileText, Twitter, Instagram, Linkedin, Youtube, Target, Clock, BookOpen } from 'lucide-react'

// ===== SOCIAL MEDIA LIMITS =====
const SOCIAL_LIMITS = [
  { name: 'Twitter/X', icon: Twitter, limit: 280, color: 'sky' },
  { name: 'Instagram Caption', icon: Instagram, limit: 2200, color: 'pink' },
  { name: 'Instagram Bio', icon: Instagram, limit: 150, color: 'pink' },
  { name: 'LinkedIn Post', icon: Linkedin, limit: 3000, color: 'blue' },
  { name: 'TikTok Caption', icon: Target, limit: 2200, color: 'purple' },
  { name: 'YouTube Description', icon: Youtube, limit: 5000, color: 'red' },
  { name: 'Meta Title (SEO)', icon: FileText, limit: 60, color: 'green' },
  { name: 'Meta Description (SEO)', icon: FileText, limit: 160, color: 'green' },
]

// ===== ANALYSIS FUNCTIONS =====
function countWords(text: string): number {
  if (!text.trim()) return 0
  const englishWords = text.match(/[a-zA-Z]+/g) || []
  const japaneseChars = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []
  return englishWords.length + japaneseChars.length
}

function countSentences(text: string): number {
  if (!text.trim()) return 0
  const matches = text.match(/[.!?。！？]+/g)
  return matches ? matches.length : (text.trim() ? 1 : 0)
}

function countParagraphs(text: string): number {
  if (!text.trim()) return 0
  return text.split(/\n\s*\n/).filter(p => p.trim()).length || 1
}

function getReadingTime(words: number): string {
  const minutes = Math.ceil(words / 200)
  if (minutes < 1) return '< 1 min'
  return `${minutes} min`
}

function getSpeakingTime(words: number): string {
  const minutes = Math.ceil(words / 150)
  if (minutes < 1) return '< 1 min'
  return `${minutes} min`
}

function getKeywordDensity(text: string): { word: string; count: number; density: number }[] {
  if (!text.trim()) return []
  
  const words = text.toLowerCase().match(/[a-zA-Z]+/g) || []
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'it', 'this', 'that', 'with', 'as', 'by', 'be', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he', 'she', 'they', 'we', 'my', 'your', 'his', 'her', 'their', 'our'])
  
  const wordCount: Record<string, number> = {}
  words.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })
  
  const total = words.length || 1
  return Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function getReadabilityScore(text: string, words: number, sentences: number): { score: number; level: string; color: string } {
  if (words < 10 || sentences < 1) return { score: 0, level: 'N/A', color: 'gray' }
  
  const avgWordsPerSentence = words / sentences
  const syllables = text.match(/[aeiouAEIOU]/g)?.length || 0
  const avgSyllablesPerWord = syllables / words
  
  const score = Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord)
  const clampedScore = Math.max(0, Math.min(100, score))
  
  if (clampedScore >= 80) return { score: clampedScore, level: 'Very Easy', color: 'green' }
  if (clampedScore >= 60) return { score: clampedScore, level: 'Easy', color: 'emerald' }
  if (clampedScore >= 40) return { score: clampedScore, level: 'Medium', color: 'yellow' }
  if (clampedScore >= 20) return { score: clampedScore, level: 'Difficult', color: 'orange' }
  return { score: clampedScore, level: 'Very Difficult', color: 'red' }
}

// ===== MAIN COMPONENT =====
export default function WordCounterProClient() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  
  const stats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = countWords(text)
    const sentences = countSentences(text)
    const paragraphs = countParagraphs(text)
    const readingTime = getReadingTime(words)
    const speakingTime = getSpeakingTime(words)
    const readability = getReadabilityScore(text, words, sentences)
    const keywords = getKeywordDensity(text)
    
    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      readability,
      keywords
    }
  }, [text])
  
  const copyStats = async () => {
    const statsText = `Words: ${stats.words}\nCharacters: ${stats.characters}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nReading time: ${stats.readingTime}`
    try {
      await navigator.clipboard.writeText(statsText)
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All analysis done locally in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-sm font-medium text-gray-300">Your Text</span>
              <button
                onClick={() => setText('')}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-[300px] bg-transparent px-4 py-3 outline-none resize-none text-base"
              spellCheck={false}
            />
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Words', value: stats.words, color: 'fuchsia' },
              { label: 'Characters', value: stats.characters, color: 'pink' },
              { label: 'Sentences', value: stats.sentences, color: 'purple' },
              { label: 'Paragraphs', value: stats.paragraphs, color: 'violet' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Social Media Limits */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Platform Character Limits</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SOCIAL_LIMITS.map((platform) => {
                const percent = Math.min((stats.characters / platform.limit) * 100, 100)
                const isOver = stats.characters > platform.limit
                return (
                  <div key={platform.name} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <platform.icon className={`w-4 h-4 text-${platform.color}-400`} />
                      <span className="text-xs text-gray-400 truncate">{platform.name}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : `bg-${platform.color}-500`}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className={`text-xs mt-1 ${isOver ? 'text-red-400' : 'text-gray-500'}`}>
                      {stats.characters}/{platform.limit}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Time Estimates */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Time Estimates</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Reading Time</span>
                </div>
                <span className="text-blue-400 font-medium">{stats.readingTime}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Speaking Time</span>
                </div>
                <span className="text-purple-400 font-medium">{stats.speakingTime}</span>
              </div>
            </div>
          </div>
          
          {/* Readability */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Readability Score</h3>
            <div className="text-center py-4">
              <div className={`text-4xl font-bold text-${stats.readability.color}-400`}>
                {stats.readability.score || '—'}
              </div>
              <div className={`text-sm text-${stats.readability.color}-400 mt-1`}>
                {stats.readability.level}
              </div>
              <p className="text-xs text-gray-500 mt-2">Flesch Reading Ease</p>
            </div>
          </div>
          
          {/* Keyword Density */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <button
              onClick={() => setShowKeywords(!showKeywords)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-300"
            >
              <span>Top Keywords</span>
              <span className="text-gray-500">{showKeywords ? '▲' : '▼'}</span>
            </button>
            {showKeywords && stats.keywords.length > 0 && (
              <div className="mt-3 space-y-2">
                {stats.keywords.slice(0, 5).map((kw, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{kw.word}</span>
                    <span className="text-fuchsia-400">{kw.count}x ({kw.density.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            )}
            {showKeywords && stats.keywords.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">Enter more text to see keywords</p>
            )}
          </div>
          
          {/* Copy Stats */}
          <button
            onClick={copyStats}
            className="w-full flex items-center justify-center gap-2 p-3 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">{copied ? 'Copied!' : 'Copy Stats'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}