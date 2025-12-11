'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, Trash2, Clock, Hash, BookOpen, Lock, Mic, TrendingUp, Type, ChevronDown, ChevronUp, AlertTriangle, Sparkles } from 'lucide-react'

interface TextStats {
  characters: number
  charactersNoSpace: number
  words: number
  lines: number
  paragraphs: number
  sentences: number
  readingTime: number
  speakingTime: number
  avgWordLength: number
  avgSentenceLength: number
  uniqueWords: number
  longestWord: string
  typeTokenRatio: number
}

interface ReadabilityScores {
  fleschReadingEase: number
  fleschKincaidGrade: number
  automatedReadabilityIndex: number
  colemanLiauIndex: number
  gunningFogIndex: number
  smogIndex: number
  readingLevel: string
  readingLevelColor: string
}

interface WritingQuality {
  passiveVoiceCount: number
  passiveVoicePercentage: number
  adverbCount: number
  complexSentences: number
}

interface KeywordData {
  word: string
  count: number
  density: number
}

// Platform character limits
const PLATFORMS = [
  { name: 'Twitter/X', limit: 280, icon: '𝕏' },
  { name: 'Instagram Caption', limit: 2200, icon: '📷' },
  { name: 'Instagram Bio', limit: 150, icon: '📷' },
  { name: 'TikTok Caption', limit: 2200, icon: '🎵' },
  { name: 'LinkedIn Post', limit: 3000, icon: '💼' },
  { name: 'YouTube Title', limit: 100, icon: '▶️' },
  { name: 'YouTube Description', limit: 5000, icon: '▶️' },
  { name: 'Facebook Post', limit: 63206, icon: '📘' },
  { name: 'SMS', limit: 160, icon: '💬' },
  { name: 'Meta Title', limit: 60, icon: '🔍' },
  { name: 'Meta Description', limit: 160, icon: '🔍' },
]

// Common adverbs to detect
const COMMON_ADVERBS = ['very', 'really', 'extremely', 'absolutely', 'completely', 'totally', 'basically', 'actually', 'literally', 'simply', 'just', 'quite', 'rather']

// Passive voice indicators
const PASSIVE_PATTERNS = [
  /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi,
  /\b(is|are|was|were|be|been|being)\s+\w+en\b/gi,
  /\b(got|get|gets|getting)\s+\w+ed\b/gi,
]

function countSyllables(word: string): number {
  word = word.toLowerCase().trim()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

function countComplexWords(words: string[]): number {
  return words.filter(word => countSyllables(word) >= 3).length
}

function countPolysyllableWords(words: string[]): number {
  return words.filter(word => countSyllables(word) >= 3).length
}

export default function TextCounterClient() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [showReadability, setShowReadability] = useState(false)
  const [showWritingQuality, setShowWritingQuality] = useState(false)

  const SOFT_LIMIT = 50000

  // Calculate basic statistics
  const stats = useMemo((): TextStats => {
    const characters = text.length
    const charactersNoSpace = text.replace(/\s/g, '').length
    const wordsArray = text.trim() === '' ? [] : text.trim().split(/\s+/)
    const words = wordsArray.length
    const lines = text === '' ? 0 : text.split('\n').length
    const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim()).length || 1
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim()).length
    const readingTime = Math.ceil(words / 225)
    const speakingTime = Math.ceil(words / 150)
    const avgWordLength = words > 0 ? charactersNoSpace / words : 0
    const avgSentenceLength = sentences > 0 ? words / sentences : 0
    const uniqueWordsSet = new Set(wordsArray.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(w => w.length > 0))
    const uniqueWords = uniqueWordsSet.size
    const longestWord = wordsArray.reduce((longest, word) => word.length > longest.length ? word : longest, '')
    const typeTokenRatio = words > 0 ? (uniqueWords / words) * 100 : 0

    return {
      characters,
      charactersNoSpace,
      words,
      lines,
      paragraphs,
      sentences,
      readingTime,
      speakingTime,
      avgWordLength,
      avgSentenceLength,
      uniqueWords,
      longestWord,
      typeTokenRatio
    }
  }, [text])

  // Calculate readability scores
  const readability = useMemo((): ReadabilityScores => {
    if (stats.words < 10 || stats.sentences === 0) {
      return {
        fleschReadingEase: 0,
        fleschKincaidGrade: 0,
        automatedReadabilityIndex: 0,
        colemanLiauIndex: 0,
        gunningFogIndex: 0,
        smogIndex: 0,
        readingLevel: 'Need more text',
        readingLevelColor: 'text-gray-400'
      }
    }

    const wordsArray = text.trim().split(/\s+/)
    const totalSyllables = wordsArray.reduce((sum, word) => sum + countSyllables(word), 0)
    const complexWords = countComplexWords(wordsArray)
    const polysyllableWords = countPolysyllableWords(wordsArray)
    const ASL = stats.words / stats.sentences
    const ASW = totalSyllables / stats.words

    // Flesch Reading Ease
    const fleschReadingEase = Math.max(0, Math.min(100, 206.835 - (1.015 * ASL) - (84.6 * ASW)))

    // Flesch-Kincaid Grade Level
    const fleschKincaidGrade = Math.max(0, (0.39 * ASL) + (11.8 * ASW) - 15.59)

    // Automated Readability Index
    const automatedReadabilityIndex = Math.max(0, (4.71 * (stats.charactersNoSpace / stats.words)) + (0.5 * ASL) - 21.43)

    // Coleman-Liau Index
    const L = (stats.charactersNoSpace / stats.words) * 100
    const S = (stats.sentences / stats.words) * 100
    const colemanLiauIndex = Math.max(0, (0.0588 * L) - (0.296 * S) - 15.8)

    // Gunning Fog Index: 0.4 × (ASL + (complex words / words × 100))
    const gunningFogIndex = Math.max(0, 0.4 * (ASL + ((complexWords / stats.words) * 100)))

    // SMOG Index: 1.043 × √(polysyllables × (30 / sentences)) + 3.1291
    const smogIndex = stats.sentences >= 30 
      ? 1.043 * Math.sqrt(polysyllableWords * (30 / stats.sentences)) + 3.1291
      : 1.043 * Math.sqrt(polysyllableWords * (30 / Math.max(1, stats.sentences))) + 3.1291

    let readingLevel: string
    let readingLevelColor: string

    if (fleschReadingEase >= 90) {
      readingLevel = 'Very Easy (5th grade)'
      readingLevelColor = 'text-green-400'
    } else if (fleschReadingEase >= 80) {
      readingLevel = 'Easy (6th grade)'
      readingLevelColor = 'text-green-400'
    } else if (fleschReadingEase >= 70) {
      readingLevel = 'Fairly Easy (7th grade)'
      readingLevelColor = 'text-lime-400'
    } else if (fleschReadingEase >= 60) {
      readingLevel = 'Standard (8-9th grade)'
      readingLevelColor = 'text-cyan-400'
    } else if (fleschReadingEase >= 50) {
      readingLevel = 'Fairly Difficult (10-12th)'
      readingLevelColor = 'text-yellow-400'
    } else if (fleschReadingEase >= 30) {
      readingLevel = 'Difficult (College)'
      readingLevelColor = 'text-orange-400'
    } else {
      readingLevel = 'Very Difficult (Graduate)'
      readingLevelColor = 'text-red-400'
    }

    return {
      fleschReadingEase,
      fleschKincaidGrade,
      automatedReadabilityIndex,
      colemanLiauIndex,
      gunningFogIndex,
      smogIndex,
      readingLevel,
      readingLevelColor
    }
  }, [text, stats])

  // Calculate writing quality
  const writingQuality = useMemo((): WritingQuality => {
    if (stats.sentences === 0) {
      return { passiveVoiceCount: 0, passiveVoicePercentage: 0, adverbCount: 0, complexSentences: 0 }
    }

    // Count passive voice
    let passiveVoiceCount = 0
    PASSIVE_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) passiveVoiceCount += matches.length
    })

    // Count weak adverbs
    const wordsArray = text.toLowerCase().split(/\s+/)
    const adverbCount = wordsArray.filter(w => COMMON_ADVERBS.includes(w.replace(/[^a-z]/g, ''))).length

    // Count complex sentences (more than 25 words)
    const sentencesArray = text.split(/[.!?]+/).filter(s => s.trim())
    const complexSentences = sentencesArray.filter(s => s.trim().split(/\s+/).length > 25).length

    return {
      passiveVoiceCount,
      passiveVoicePercentage: stats.sentences > 0 ? (passiveVoiceCount / stats.sentences) * 100 : 0,
      adverbCount,
      complexSentences
    }
  }, [text, stats])

  // Calculate keyword density
  const keywords = useMemo((): KeywordData[] => {
    if (stats.words < 5) return []

    const wordsArray = text.toLowerCase().split(/\s+/)
    const wordCount: { [key: string]: number } = {}
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'it', 'its', "it's", 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very', 'just', 'as', 'if', 'then', 'because', 'while', 'although', 'though', 'after', 'before', 'since', 'until', 'unless', 'about', 'into', 'through', 'during', 'above', 'below', 'between', 'under', 'again', 'further', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'any', 'each', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'])

    wordsArray.forEach(word => {
      const cleanWord = word.replace(/[^a-z]/g, '')
      if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1
      }
    })

    return Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / stats.words) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [text, stats])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  const handleClear = () => setText('')

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase())
        break
      case 'lower':
        setText(text.toLowerCase())
        break
      case 'title':
        setText(text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
        break
      case 'sentence':
        setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()))
        break
    }
  }

  const formatNumber = (n: number) => n.toLocaleString()
  const visiblePlatforms = showAllPlatforms ? PLATFORMS : PLATFORMS.slice(0, 4)

  const getTypeTokenRatioLabel = (ratio: number): { label: string; color: string } => {
    if (ratio >= 70) return { label: 'Excellent variety', color: 'text-green-400' }
    if (ratio >= 50) return { label: 'Good variety', color: 'text-lime-400' }
    if (ratio >= 30) return { label: 'Average variety', color: 'text-yellow-400' }
    return { label: 'Consider more variety', color: 'text-orange-400' }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private</p>
          <p className="text-green-400/70 text-xs mt-1">
            All analysis happens in your browser • Text is never stored or sent anywhere
          </p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
          <Hash className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl sm:text-3xl font-bold text-white">{formatNumber(stats.characters)}</p>
          <p className="text-xs text-gray-400">Characters</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
          <Type className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl sm:text-3xl font-bold text-white">{formatNumber(stats.words)}</p>
          <p className="text-xs text-gray-400">Words</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
          <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.readingTime || 0}</p>
          <p className="text-xs text-gray-400">Min to read</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
          <Mic className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.speakingTime || 0}</p>
          <p className="text-xs text-gray-400">Min to speak</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-48 sm:h-64 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-base leading-relaxed"
          maxLength={SOFT_LIMIT}
        />
        
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-1 ${
                copied ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 text-sm disabled:opacity-50 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
          <span className="text-xs text-gray-500">
            {stats.charactersNoSpace} chars (no spaces)
          </span>
        </div>

        {/* Case Conversion */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-gray-400 self-center">Convert:</span>
          {(['upper', 'lower', 'title', 'sentence'] as const).map(type => (
            <button
              key={type}
              onClick={() => convertCase(type)}
              disabled={!text}
              className="px-3 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 text-sm disabled:opacity-50"
            >
              {type === 'upper' ? 'UPPER' : type === 'lower' ? 'lower' : type === 'title' ? 'Title' : 'Sentence'}
            </button>
          ))}
        </div>
      </div>

      {/* Readability Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <button 
          onClick={() => setShowReadability(!showReadability)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Readability Analysis</span>
            {stats.words >= 10 && (
              <span className={`text-sm ${readability.readingLevelColor}`}>
                ({readability.readingLevel})
              </span>
            )}
          </div>
          {showReadability ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showReadability && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {stats.words < 10 ? (
              <p className="text-gray-400 text-sm">Enter at least 10 words for readability analysis</p>
            ) : (
              <div className="space-y-4">
                {/* Flesch Reading Ease */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Flesch Reading Ease</span>
                    <span className="text-cyan-400 font-bold">{readability.fleschReadingEase.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: `${Math.min(100, readability.fleschReadingEase)}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0 = Very Hard | 100 = Very Easy</p>
                </div>

                {/* Grade Levels - 6 metrics now */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Flesch-Kincaid</p>
                    <p className="text-lg font-bold text-white">{readability.fleschKincaidGrade.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Grade level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Gunning Fog</p>
                    <p className="text-lg font-bold text-white">{readability.gunningFogIndex.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Grade level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">SMOG Index</p>
                    <p className="text-lg font-bold text-white">{readability.smogIndex.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Grade level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Coleman-Liau</p>
                    <p className="text-lg font-bold text-white">{readability.colemanLiauIndex.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Grade level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">ARI</p>
                    <p className="text-lg font-bold text-white">{readability.automatedReadabilityIndex.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Grade level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Vocabulary</p>
                    <p className="text-lg font-bold text-white">{stats.typeTokenRatio.toFixed(0)}%</p>
                    <p className={`text-xs ${getTypeTokenRatioLabel(stats.typeTokenRatio).color}`}>
                      {getTypeTokenRatioLabel(stats.typeTokenRatio).label}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Writing Quality Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <button 
          onClick={() => setShowWritingQuality(!showWritingQuality)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-medium">Writing Quality</span>
          </div>
          {showWritingQuality ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showWritingQuality && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {stats.sentences === 0 ? (
              <p className="text-gray-400 text-sm">Enter some text for writing quality analysis</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${writingQuality.passiveVoicePercentage > 20 ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-black/20'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {writingQuality.passiveVoicePercentage > 20 && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                    <p className="text-xs text-gray-400">Passive Voice</p>
                  </div>
                  <p className={`text-lg font-bold ${writingQuality.passiveVoicePercentage > 20 ? 'text-orange-400' : 'text-white'}`}>
                    {writingQuality.passiveVoiceCount} ({writingQuality.passiveVoicePercentage.toFixed(0)}%)
                  </p>
                  <p className="text-xs text-gray-500">
                    {writingQuality.passiveVoicePercentage > 20 ? 'Consider reducing' : 'Good balance'}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${writingQuality.adverbCount > 5 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-black/20'}`}>
                  <p className="text-xs text-gray-400">Weak Adverbs</p>
                  <p className={`text-lg font-bold ${writingQuality.adverbCount > 5 ? 'text-yellow-400' : 'text-white'}`}>
                    {writingQuality.adverbCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {writingQuality.adverbCount > 5 ? 'Try stronger verbs' : 'Good'}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${writingQuality.complexSentences > 3 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-black/20'}`}>
                  <p className="text-xs text-gray-400">Long Sentences (25+ words)</p>
                  <p className={`text-lg font-bold ${writingQuality.complexSentences > 3 ? 'text-yellow-400' : 'text-white'}`}>
                    {writingQuality.complexSentences}
                  </p>
                  <p className="text-xs text-gray-500">
                    {writingQuality.complexSentences > 3 ? 'Consider breaking up' : 'Good length'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/20">
                  <p className="text-xs text-gray-400">Unique Words</p>
                  <p className="text-lg font-bold text-white">{stats.uniqueWords}</p>
                  <p className="text-xs text-gray-500">of {stats.words} total</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyword Density */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <button 
          onClick={() => setShowKeywords(!showKeywords)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Keyword Density</span>
          </div>
          {showKeywords ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showKeywords && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {keywords.length === 0 ? (
              <p className="text-gray-400 text-sm">Enter more text to see keyword analysis</p>
            ) : (
              <div className="space-y-2">
                {keywords.map((kw, i) => (
                  <div key={kw.word} className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                    <span className="text-white font-medium flex-1">{kw.word}</span>
                    <span className="text-gray-400 text-sm">{kw.count}x</span>
                    <span className="text-cyan-400 text-sm font-medium w-16 text-right">{kw.density.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
        <h3 className="text-white font-medium mb-3">Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Sentences</span>
            <span className="text-white font-medium">{stats.sentences || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Paragraphs</span>
            <span className="text-white font-medium">{stats.paragraphs || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lines</span>
            <span className="text-white font-medium">{stats.lines || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Avg word length</span>
            <span className="text-white font-medium">{stats.avgWordLength > 0 ? stats.avgWordLength.toFixed(1) : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Avg sentence length</span>
            <span className="text-white font-medium">{stats.avgSentenceLength > 0 ? stats.avgSentenceLength.toFixed(1) : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Longest word</span>
            <span className="text-white font-medium truncate max-w-[100px]" title={stats.longestWord}>{stats.longestWord || '-'}</span>
          </div>
        </div>
      </div>

      {/* Platform Limits */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3">Platform Limits</h3>
        <div className="space-y-3">
          {visiblePlatforms.map(platform => (
            <div key={platform.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">
                  <span className="mr-1">{platform.icon}</span>
                  {platform.name}
                </span>
                <span className={`text-xs ${stats.characters <= platform.limit ? 'text-green-400' : 'text-red-400'}`}>
                  {formatNumber(stats.characters)}/{formatNumber(platform.limit)}
                  {stats.characters <= platform.limit ? ' ✓' : ` (${formatNumber(stats.characters - platform.limit)} over)`}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stats.characters <= platform.limit ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, (stats.characters / platform.limit) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setShowAllPlatforms(!showAllPlatforms)}
          className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {showAllPlatforms ? 'Show Less' : `Show ${PLATFORMS.length - 4} More Platforms`}
        </button>
      </div>
    </div>
  )
}