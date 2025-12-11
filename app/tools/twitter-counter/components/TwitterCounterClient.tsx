'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  Twitter, Copy, Check, Scissors, AlertCircle, 
  TrendingUp, Zap, ChevronDown, ChevronUp, Sparkles,
  Image as ImageIcon, Link2, Hash, AtSign, BarChart3
} from 'lucide-react'

// ============================================
// Twitter Character Counting Rules (Official)
// ============================================
// Based on Twitter's official rules:
// - Standard characters: 1 weight
// - URLs: Always 23 characters (t.co shortening)
// - Emojis: 2 characters each
// - CJK characters (Chinese, Japanese, Korean): 2 characters each

const TWITTER_LIMITS = {
  tweet: 280,
  name: 50,
  bio: 160,
  dm: 10000,
}

// URL regex pattern
const URL_REGEX = /https?:\/\/[^\s]+/gi

// Emoji regex (covers most emojis including compound ones)
const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu

// CJK character ranges
const CJK_REGEX = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g

// ============================================
// Character Counting Function
// ============================================
function countTwitterCharacters(text: string): {
  total: number
  breakdown: {
    standard: number
    urls: number
    urlCount: number
    emojis: number
    emojiCount: number
    cjk: number
    cjkCount: number
  }
} {
  let workingText = text
  let totalWeight = 0
  
  // Count URLs (each URL = 23 characters regardless of actual length)
  const urls = workingText.match(URL_REGEX) || []
  const urlCount = urls.length
  const urlWeight = urlCount * 23
  
  // Remove URLs from working text
  workingText = workingText.replace(URL_REGEX, '')
  
  // Count emojis (each emoji = 2 characters)
  const emojis = workingText.match(EMOJI_REGEX) || []
  const emojiCount = emojis.length
  const emojiWeight = emojiCount * 2
  
  // Remove emojis from working text
  workingText = workingText.replace(EMOJI_REGEX, '')
  
  // Count CJK characters (each = 2 characters)
  const cjkChars = workingText.match(CJK_REGEX) || []
  const cjkCount = cjkChars.length
  const cjkWeight = cjkCount * 2
  
  // Remove CJK from working text
  workingText = workingText.replace(CJK_REGEX, '')
  
  // Remaining characters are standard (1 each)
  const standardWeight = workingText.length
  
  totalWeight = urlWeight + emojiWeight + cjkWeight + standardWeight
  
  return {
    total: totalWeight,
    breakdown: {
      standard: standardWeight,
      urls: urlWeight,
      urlCount,
      emojis: emojiWeight,
      emojiCount,
      cjk: cjkWeight,
      cjkCount,
    }
  }
}

// ============================================
// Thread Splitter Function
// ============================================
function splitIntoThread(text: string, maxLength: number = 280): string[] {
  const tweets: string[] = []
  const words = text.split(/(\s+)/)
  let currentTweet = ''
  
  for (const word of words) {
    const testTweet = currentTweet + word
    const { total } = countTwitterCharacters(testTweet)
    
    if (total <= maxLength - 10) { // Leave room for thread numbering
      currentTweet = testTweet
    } else {
      if (currentTweet.trim()) {
        tweets.push(currentTweet.trim())
      }
      currentTweet = word.trim() ? word : ''
    }
  }
  
  if (currentTweet.trim()) {
    tweets.push(currentTweet.trim())
  }
  
  return tweets
}

// ============================================
// Engagement Score Calculator
// ============================================
function calculateEngagementScore(text: string, charCount: number): {
  score: number
  tips: string[]
  level: 'low' | 'medium' | 'high' | 'optimal'
} {
  const tips: string[] = []
  let score = 50
  
  // Character count optimization
  // Research shows 71-100 chars get 17% more engagement
  // 240-259 chars get maximum reach
  if (charCount >= 71 && charCount <= 100) {
    score += 20
    tips.push('✨ Sweet spot: 71-100 chars = 17% more engagement')
  } else if (charCount >= 240 && charCount <= 259) {
    score += 15
    tips.push('📈 Maximum reach zone: 240-259 chars')
  } else if (charCount > 280) {
    score -= 30
    tips.push('⚠️ Over limit - consider splitting into thread')
  } else if (charCount < 50) {
    score -= 10
    tips.push('💡 Longer tweets often perform better')
  }
  
  // Hashtags
  const hashtagCount = (text.match(/#\w+/g) || []).length
  if (hashtagCount === 1 || hashtagCount === 2) {
    score += 10
    tips.push('👍 1-2 hashtags is optimal')
  } else if (hashtagCount > 3) {
    score -= 10
    tips.push('⚠️ Too many hashtags can reduce engagement')
  } else if (hashtagCount === 0) {
    tips.push('💡 Consider adding 1-2 relevant hashtags')
  }
  
  // Mentions
  const mentionCount = (text.match(/@\w+/g) || []).length
  if (mentionCount > 0 && mentionCount <= 2) {
    score += 5
  } else if (mentionCount > 3) {
    score -= 5
    tips.push('⚠️ Too many mentions can look spammy')
  }
  
  // Has URL
  const hasUrl = URL_REGEX.test(text)
  if (hasUrl) {
    score += 5
    tips.push('🔗 Links can drive traffic')
  }
  
  // Emojis
  const emojiCount = (text.match(EMOJI_REGEX) || []).length
  if (emojiCount >= 1 && emojiCount <= 3) {
    score += 10
    tips.push('😊 Emojis increase engagement by up to 25%')
  } else if (emojiCount > 5) {
    tips.push('⚠️ Consider using fewer emojis')
  }
  
  // Question mark (increases replies)
  if (text.includes('?')) {
    score += 5
    tips.push('❓ Questions encourage replies')
  }
  
  // Clamp score
  score = Math.max(0, Math.min(100, score))
  
  let level: 'low' | 'medium' | 'high' | 'optimal' = 'low'
  if (score >= 80) level = 'optimal'
  else if (score >= 60) level = 'high'
  else if (score >= 40) level = 'medium'
  
  return { score, tips: tips.slice(0, 3), level }
}

// ============================================
// Main Component
// ============================================
export default function TwitterCounterClient() {
  const [text, setText] = useState('')
  const [limitType, setLimitType] = useState<keyof typeof TWITTER_LIMITS>('tweet')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showTips, setShowTips] = useState(true)

  const limit = TWITTER_LIMITS[limitType]
  
  // Calculate character count
  const charData = useMemo(() => countTwitterCharacters(text), [text])
  const remaining = limit - charData.total
  const percentage = Math.min((charData.total / limit) * 100, 100)
  const isOverLimit = charData.total > limit
  
  // Thread data
  const threadTweets = useMemo(() => {
    if (limitType !== 'tweet' || charData.total <= limit) return []
    return splitIntoThread(text)
  }, [text, charData.total, limit, limitType])
  
  // Engagement analysis
  const engagement = useMemo(() => {
    if (!text.trim()) return null
    return calculateEngagementScore(text, charData.total)
  }, [text, charData.total])
  
  // Copy to clipboard
  const handleCopy = useCallback(async (textToCopy: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedIndex(index ?? -1)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])
  
  // Get color based on percentage
  const getProgressColor = () => {
    if (isOverLimit) return 'bg-red-500'
    if (percentage > 90) return 'bg-orange-500'
    if (percentage > 70) return 'bg-yellow-500'
    return 'bg-cyan-500'
  }
  
  const getTextColor = () => {
    if (isOverLimit) return 'text-red-400'
    if (percentage > 90) return 'text-orange-400'
    if (percentage > 70) return 'text-yellow-400'
    return 'text-cyan-400'
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Character Counter Display */}
      <div className="text-center mb-8">
        <div className={`text-6xl sm:text-7xl font-bold mb-2 transition-colors ${getTextColor()}`}>
          {remaining}
        </div>
        <p className="text-gray-400 text-sm">
          characters remaining
          {isOverLimit && <span className="text-red-400 ml-2">({Math.abs(remaining)} over limit)</span>}
        </p>
        
        {/* Progress Ring */}
        <div className="mt-4 flex justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${percentage * 2.26} 226`}
                className={`transition-all duration-300 ${getProgressColor().replace('bg-', 'text-')}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${getTextColor()}`}>
                {charData.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Type Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {Object.entries(TWITTER_LIMITS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setLimitType(key as keyof typeof TWITTER_LIMITS)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              limitType === key
                ? 'bg-cyan-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)} ({value})
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Twitter className="w-5 h-5 text-cyan-400" />
            Your Tweet
          </h3>
          <button
            onClick={() => handleCopy(text)}
            disabled={!text}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                       disabled:opacity-50 disabled:cursor-not-allowed ${
              copiedIndex === -1
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {copiedIndex === -1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedIndex === -1 ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening? Start typing your tweet..."
          className={`w-full h-40 p-4 bg-black/20 border rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none 
                     transition-colors resize-none text-base ${
                       isOverLimit 
                         ? 'border-red-500/50 focus:border-red-500' 
                         : 'border-white/10 focus:border-cyan-400'
                     }`}
          spellCheck={false}
        />

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {(text.match(/#\w+/g) || []).length} hashtags
          </span>
          <span className="flex items-center gap-1">
            <AtSign className="w-3 h-3" />
            {(text.match(/@\w+/g) || []).length} mentions
          </span>
          <span className="flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            {charData.breakdown.urlCount} links
          </span>
          <span className="flex items-center gap-1">
            <span>😊</span>
            {charData.breakdown.emojiCount} emojis
          </span>
        </div>
      </div>

      {/* Character Breakdown */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-white font-medium flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Character Breakdown
          </span>
          {showBreakdown ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        
        {showBreakdown && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Standard</p>
                <p className="text-xl font-bold text-white">{charData.breakdown.standard}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">URLs ({charData.breakdown.urlCount}×23)</p>
                <p className="text-xl font-bold text-blue-400">{charData.breakdown.urls}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Emojis ({charData.breakdown.emojiCount}×2)</p>
                <p className="text-xl font-bold text-yellow-400">{charData.breakdown.emojis}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">CJK ({charData.breakdown.cjkCount}×2)</p>
                <p className="text-xl font-bold text-pink-400">{charData.breakdown.cjk}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * URLs are always counted as 23 chars (t.co). Emojis & CJK characters count as 2 each.
            </p>
          </div>
        )}
      </div>

      {/* Engagement Analysis */}
      {engagement && text.trim() && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-4 flex justify-between items-center"
          >
            <span className="text-white font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Engagement Analysis
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                engagement.level === 'optimal' ? 'bg-green-500/20 text-green-400' :
                engagement.level === 'high' ? 'bg-cyan-500/20 text-cyan-400' :
                engagement.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {engagement.score}/100
              </span>
            </span>
            {showTips ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {showTips && (
            <div className="px-6 pb-6">
              {/* Score Bar */}
              <div className="mb-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      engagement.level === 'optimal' ? 'bg-green-500' :
                      engagement.level === 'high' ? 'bg-cyan-500' :
                      engagement.level === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${engagement.score}%` }}
                  />
                </div>
              </div>
              
              {/* Tips */}
              <div className="space-y-2">
                {engagement.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thread Preview (if over limit) */}
      {threadTweets.length > 1 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-cyan-400" />
            Auto-Split Thread Preview
            <span className="text-xs text-gray-400 font-normal ml-2">
              ({threadTweets.length} tweets)
            </span>
          </h3>
          
          <div className="space-y-4">
            {threadTweets.map((tweet, index) => {
              const tweetCount = countTwitterCharacters(tweet)
              return (
                <div key={index} className="bg-black/20 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-cyan-400 font-medium">
                      Tweet {index + 1}/{threadTweets.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {tweetCount.total}/280
                      </span>
                      <button
                        onClick={() => handleCopy(tweet, index)}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedIndex === index
                            ? 'bg-green-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{tweet}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tweet Preview (Mock Twitter UI) */}
      {text.trim() && !isOverLimit && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            Tweet Preview
          </h3>
          
          <div className="bg-black rounded-xl p-4 border border-gray-800">
            <div className="flex gap-3">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-white">Your Name</span>
                  <span className="text-gray-500">@username</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">now</span>
                </div>
                
                {/* Content */}
                <p className="text-white text-[15px] whitespace-pre-wrap break-words">
                  {text}
                </p>
                
                {/* Engagement buttons */}
                <div className="flex justify-between mt-3 text-gray-500 max-w-[300px]">
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Over Limit Warning */}
      {isOverLimit && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Tweet exceeds {limit} character limit</p>
            <p className="text-gray-400 text-sm mt-1">
              Your tweet is {Math.abs(remaining)} characters over the limit. 
              {threadTweets.length > 1 && ` We've auto-split it into ${threadTweets.length} tweets above.`}
            </p>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📊</div>
          <div className="text-xs text-gray-400">Accurate counting</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🔗</div>
          <div className="text-xs text-gray-400">URL detection (23ch)</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">✂️</div>
          <div className="text-xs text-gray-400">Auto thread split</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📈</div>
          <div className="text-xs text-gray-400">Engagement tips</div>
        </div>
      </div>
    </div>
  )
}