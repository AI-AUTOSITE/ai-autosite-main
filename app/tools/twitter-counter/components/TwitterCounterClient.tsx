'use client'

import { useState, useMemo, useEffect } from 'react'
import { Twitter, Copy, Check, Trash2, Scissors, Hash, AtSign, Link, Zap, Smartphone } from 'lucide-react'

const TWITTER_LIMIT = 280
const URL_LENGTH = 23

interface ThreadPart {
  text: string
  number: number
  total: number
  charCount: number
}

// Vibration helper
const vibrate = (duration: number) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

// Twitter character counting
function getTwitterLength(text: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g
  const modifiedText = text.replace(urlRegex, 'x'.repeat(URL_LENGTH))
  return modifiedText.length
}

// Smart thread splitting
function splitIntoThread(text: string): ThreadPart[] {
  if (getTwitterLength(text) <= TWITTER_LIMIT) {
    return [{ text, number: 1, total: 1, charCount: getTwitterLength(text) }]
  }

  const parts: ThreadPart[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  let currentPart = ''
  let partNumber = 1

  const roughTotal = Math.ceil(getTwitterLength(text) / (TWITTER_LIMIT - 10))

  for (const sentence of sentences) {
    const testPart = currentPart ? `${currentPart} ${sentence}` : sentence
    const suffix = ` (${partNumber}/${roughTotal})`

    if (getTwitterLength(testPart + suffix) <= TWITTER_LIMIT) {
      currentPart = testPart
    } else {
      if (currentPart) {
        const finalText = currentPart + suffix
        parts.push({
          text: finalText,
          number: partNumber,
          total: roughTotal,
          charCount: getTwitterLength(finalText),
        })
        partNumber++
        currentPart = sentence
      } else {
        const words = sentence.split(' ')
        let wordPart = ''

        for (const word of words) {
          const testWord = wordPart ? `${wordPart} ${word}` : word
          if (getTwitterLength(testWord + suffix) <= TWITTER_LIMIT) {
            wordPart = testWord
          } else {
            if (wordPart) {
              const finalText = wordPart + suffix
              parts.push({
                text: finalText,
                number: partNumber,
                total: roughTotal,
                charCount: getTwitterLength(finalText),
              })
              partNumber++
              wordPart = word
            }
          }
        }

        if (wordPart) {
          currentPart = wordPart
        }
      }
    }
  }

  if (currentPart) {
    const finalText = currentPart + ` (${partNumber}/${roughTotal})`
    parts.push({
      text: finalText,
      number: partNumber,
      total: roughTotal,
      charCount: getTwitterLength(finalText),
    })
  }

  const actualTotal = parts.length
  return parts.map((part) => {
    const updatedText = part.text.replace(/\(\d+\/\d+\)/, `(${part.number}/${actualTotal})`)
    return {
      ...part,
      text: updatedText,
      total: actualTotal,
      charCount: getTwitterLength(updatedText),
    }
  })
}

export default function TwitterCounterClient() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedThread, setCopiedThread] = useState<number | null>(null)
  const [showThread, setShowThread] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const charCount = getTwitterLength(text)
    const remaining = TWITTER_LIMIT - charCount
    const percentage = Math.min((charCount / TWITTER_LIMIT) * 100, 100)
    const isOverLimit = charCount > TWITTER_LIMIT

    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const hashtags = (text.match(/#[\w]+/g) || []).length
    const mentions = (text.match(/@[\w]+/g) || []).length
    const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length
    const lines = text ? text.split('\n').length : 0

    return {
      charCount,
      remaining,
      percentage,
      isOverLimit,
      words,
      hashtags,
      mentions,
      urls,
      lines,
    }
  }, [text])

  // Thread generation
  const thread = useMemo(() => {
    if (stats.isOverLimit && showThread) {
      return splitIntoThread(text)
    }
    return null
  }, [text, stats.isOverLimit, showThread])

  // Progress bar color
  const progressColor = useMemo(() => {
    if (stats.percentage <= 70) return 'from-green-400 to-emerald-400'
    if (stats.percentage <= 90) return 'from-yellow-400 to-orange-400'
    return 'from-orange-400 to-red-400'
  }, [stats.percentage])

  // Status color
  const statusColor = useMemo(() => {
    if (stats.percentage <= 70) return 'text-green-400'
    if (stats.percentage <= 90) return 'text-yellow-400'
    if (stats.percentage <= 100) return 'text-orange-400'
    return 'text-red-400'
  }, [stats.percentage])

  // Copy handlers
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleCopyThread = async (part: ThreadPart) => {
    try {
      await navigator.clipboard.writeText(part.text)
      setCopiedThread(part.number)
      vibrate(30)
      setTimeout(() => setCopiedThread(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleCopyAllThread = async () => {
    if (!thread) return
    try {
      const fullThread = thread.map((p) => p.text).join('\n\n')
      await navigator.clipboard.writeText(fullThread)
      setCopiedThread(-1)
      vibrate(30)
      setTimeout(() => setCopiedThread(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleClear = () => {
    setText('')
    setCopied(false)
    setCopiedThread(null)
    vibrate(30)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
          <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Mobile Optimized</p>
            <p className="text-blue-400/70 text-xs mt-1">
              Count X/Twitter characters - Auto-split threads - Works offline
            </p>
          </div>
        </div>
      )}

      {/* Main Display */}
      <div className="text-center mb-6 sm:mb-8">
        {/* Big Character Count */}
        <div className="mb-4">
          <div className={`text-5xl sm:text-6xl md:text-7xl font-bold ${statusColor} transition-colors`}>
            {stats.charCount}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {stats.remaining > 0 ? `${stats.remaining} left` : `${Math.abs(stats.remaining)} over`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{TWITTER_LIMIT} character limit</div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {(stats.words > 0 || stats.hashtags > 0 || stats.mentions > 0) && (
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="text-center min-w-[60px]">
              <div className="text-2xl font-bold text-white">{stats.words}</div>
              <div className="text-xs text-gray-500">Words</div>
            </div>
            {stats.hashtags > 0 && (
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-blue-400">{stats.hashtags}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                  <Hash className="w-3 h-3" />
                  Tags
                </div>
              </div>
            )}
            {stats.mentions > 0 && (
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-cyan-400">{stats.mentions}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                  <AtSign className="w-3 h-3" />
                  Mentions
                </div>
              </div>
            )}
            {stats.urls > 0 && (
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-purple-400">{stats.urls}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                  <Link className="w-3 h-3" />
                  Links
                </div>
              </div>
            )}
            {stats.lines > 1 && (
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-green-400">{stats.lines}</div>
                <div className="text-xs text-gray-500">Lines</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your tweet..."
          className="w-full h-32 sm:h-36 p-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 
                   focus:outline-none focus:border-cyan-400 transition-all resize-none font-sans text-base"
          autoFocus={!isMobile}
        />

        {/* Actions - Mobile optimized buttons (48px height) */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleClear}
            disabled={!text}
            className="min-h-[48px] px-6 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
                     transition-all disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>

          {stats.isOverLimit && (
            <button
              onClick={() => setShowThread(!showThread)}
              className="min-h-[48px] px-6 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all
                       flex items-center justify-center gap-2 active:scale-95"
            >
              <Scissors className="w-4 h-4" />
              <span>{showThread ? 'Hide' : 'Show'} Thread</span>
            </button>
          )}

          <button
            onClick={stats.isOverLimit ? handleCopyAllThread : handleCopy}
            disabled={!text}
            className={`flex-1 min-h-[48px] px-6 rounded-lg font-medium transition-all disabled:opacity-30 
                      disabled:cursor-not-allowed flex items-center justify-center gap-2
                      shadow-lg active:scale-95 ${
                        copied || copiedThread === -1
                          ? 'bg-green-500 text-white shadow-green-500/30'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/30 hover:opacity-90'
                      }`}
          >
            {copied || copiedThread === -1 ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy {stats.isOverLimit ? 'Thread' : 'Tweet'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Thread Preview */}
      {thread && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Auto-split into {thread.length} tweets</span>
          </div>

          {thread.map((part) => (
            <div
              key={part.number}
              className="group relative bg-white/5 rounded-xl p-4 border border-white/10 
                       hover:bg-white/[0.07] transition-all"
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <span className="text-xs font-medium text-cyan-400 flex-shrink-0">
                  Tweet {part.number}/{part.total}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs ${
                      part.charCount > TWITTER_LIMIT ? 'text-red-400' : 'text-gray-500'
                    }`}
                  >
                    {part.charCount}/{TWITTER_LIMIT}
                  </span>
                  <button
                    onClick={() => handleCopyThread(part)}
                    className={`min-h-[48px] min-w-[80px] px-4 rounded-lg text-sm font-medium transition-all active:scale-95 
                              flex items-center justify-center gap-2 ${
                                copiedThread === part.number
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                  >
                    {copiedThread === part.number ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                {part.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tips - No emojis, using Lucide icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
          <Smartphone className="w-6 h-6 mb-2 mx-auto text-cyan-400" />
          <div className="text-xs text-gray-400 text-center">
            Best under
            <br />
            100 chars
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
          <Link className="w-6 h-6 mb-2 mx-auto text-purple-400" />
          <div className="text-xs text-gray-400 text-center">
            Links = 23
            <br />
            characters
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
          <Hash className="w-6 h-6 mb-2 mx-auto text-blue-400" />
          <div className="text-xs text-gray-400 text-center">
            1-2 hashtags
            <br />
            optimal
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
          <Twitter className="w-6 h-6 mb-2 mx-auto text-cyan-400" />
          <div className="text-xs text-gray-400 text-center">
            Threads get
            <br />
            more reach
          </div>
        </div>
      </div>

      {/* Mobile specific tip */}
      {isMobile && (
        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <p className="text-cyan-300 text-xs text-center">
            All processing happens on your device - No data sent anywhere
          </p>
        </div>
      )}
    </div>
  )
}