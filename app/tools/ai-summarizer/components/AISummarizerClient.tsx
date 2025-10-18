// app/tools/ai-summarizer/components/AISummarizerClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader, Copy, Check, AlertTriangle } from 'lucide-react'

// AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

type SummaryLength = 'brief' | 'standard' | 'detailed'

export default function AISummarizerClient() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()

  // Custom disagree handler (redirect to home)
  const handleCustomDisagree = () => {
    handleDisagree()
    router.push('/')
  }

  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('standard')
  const [error, setError] = useState('')

  useEffect(() => {
    setCharCount(inputText.length)
  }, [inputText])

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Enter text')
      return
    }

    if (inputText.length < 100) {
      setError('Too short (min 100 chars)')
      return
    }

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await fetch('/api/ai-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          length: summaryLength,
          tone: 'professional',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary')
      }

      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setInputText('')
    setSummary('')
    setError('')
    setCharCount(0)
  }

  // Quick example texts
  const exampleTexts = [
    {
      label: 'News',
      text: `Artificial intelligence has made remarkable progress in recent years, transforming industries from healthcare to finance. Major tech companies are investing billions in AI research, with breakthroughs in natural language processing and computer vision leading the charge. Experts predict that AI will revolutionize how we work, learn, and interact with technology. The global AI market is expected to reach $500 billion by 2030, driven by enterprise adoption and consumer applications. However, concerns about job displacement and ethical implications remain important topics for discussion. Governments worldwide are working to establish regulations that balance innovation with public safety. Despite these challenges, the potential benefits of AI in solving complex problems and improving quality of life are immense. From personalized medicine to climate change solutions, AI is becoming an indispensable tool for addressing global challenges.`,
    },
    {
      label: 'Research',
      text: `Recent studies in cognitive psychology have revealed fascinating insights into human memory formation and retention. Researchers at leading universities have discovered that sleep plays a crucial role in consolidating short-term memories into long-term storage. The process, known as memory consolidation, occurs during specific stages of sleep when the brain replays and strengthens neural connections formed during waking hours. This finding has significant implications for educational practices and learning strategies. Students who maintain regular sleep schedules demonstrate better academic performance and information retention compared to those with irregular sleep patterns. The research also suggests that brief naps can enhance memory consolidation, particularly for procedural and declarative memories. Furthermore, the timing of sleep relative to learning appears to be critical, with sleep within 24 hours of learning showing the most beneficial effects. These discoveries are reshaping our understanding of optimal learning environments and study habits. The integration of sleep science into educational curricula could lead to more effective teaching methods and improved student outcomes. As research continues, scientists are exploring how different sleep stages contribute to various types of memory formation, opening new avenues for cognitive enhancement and therapeutic interventions for memory-related disorders.`,
    },
    {
      label: 'Blog',
      text: `Starting a successful blog in today's digital landscape requires more than just good writing skills. Understanding your target audience and creating content that resonates with their interests is fundamental to building a loyal readership. Consistency in posting schedules helps establish trust and keeps readers engaged over time. Search engine optimization techniques can significantly increase your blog's visibility, but authentic, valuable content remains the cornerstone of success. Social media integration allows you to reach broader audiences and engage with readers across multiple platforms. Many successful bloggers emphasize the importance of finding your unique voice and perspective rather than simply following trends. Monetization strategies vary widely, from advertising and affiliate marketing to sponsored content and digital products. Building an email list provides direct communication with your most engaged readers and creates opportunities for deeper connections.`,
    },
  ]

  const loadExample = (index: number) => {
    setInputText(exampleTexts[index].text)
  }

if (isChecking) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-6 text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

  return (
    <>
      {/* AI Tool Warning Modal */}
      <AIToolWarningModal
        isOpen={showWarning}
        onAgree={handleAgree}
        onDisagree={handleCustomDisagree}
      />

      {/* Agreement Required Screen */}
      {!hasAgreed ? (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8">
              <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Agreement Required</h3>
              <p className="text-gray-400 text-sm mb-6">
                You must agree to the terms to use this AI-powered tool.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold shadow-lg"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content - Only shown after agreement */
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            {/* Text Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-medium text-sm sm:text-base">Your Text</label>
                <span className={`text-xs ${charCount < 100 ? 'text-red-400' : 'text-gray-400'}`}>
                  {charCount.toLocaleString()} {charCount < 100 && '(min 100)'}
                </span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 50000))}
                placeholder="Paste or type text here (min 100 chars)"
                className="w-full h-40 sm:h-48 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base
                       placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 
                       transition-colors hover:bg-white/15"
              />

              {/* Quick Examples */}
              {charCount === 0 && (
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  <span className="text-xs text-gray-500">Examples:</span>
                  {exampleTexts.map((example, index) => (
                    <button
                      key={example.label}
                      onClick={() => loadExample(index)}
                      className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full 
                 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Length Selection */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">Length</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'brief', label: 'Brief', desc: '2-3 lines' },
                  { value: 'standard', label: 'Standard', desc: '4-5 lines' },
                  { value: 'detailed', label: 'Detailed', desc: '6-8 lines' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSummaryLength(option.value as SummaryLength)}
                    className={`min-h-[56px] py-3 px-3 rounded-lg text-sm transition-all ${
                      summaryLength === option.value
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-70 hidden sm:block">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSummarize}
                disabled={isLoading || !inputText.trim() || charCount < 100}
                className="flex-1 min-h-[56px] px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                     font-medium text-base sm:text-lg rounded-xl hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Working...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Summarize
                  </>
                )}
              </button>

              {(inputText || summary) && (
                <button
                  onClick={handleClear}
                  className="min-h-[56px] px-4 py-4 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 
                       hover:text-white transition-all border border-white/10"
                  title="Clear all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-fadeIn">
                {error}
              </div>
            )}

            {/* Summary Output */}
            {summary && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium text-sm sm:text-base">Summary</label>
                  <button
                    onClick={handleCopy}
                    className={`min-h-[40px] px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
                      copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl mb-4">
                  <p className="text-white leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {summary}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-center gap-4 sm:gap-6 text-center text-sm">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-purple-400">
                      {Math.round(((charCount - summary.length) / charCount) * 100)}%
                    </span>
                    <span className="text-xs text-gray-400 ml-1">shorter</span>
                  </div>
                  <div className="text-gray-600">-</div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-pink-400">
                      {summary.split(' ').length}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">words</span>
                  </div>
                  <div className="text-gray-600">-</div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-cyan-400">
                      {Math.ceil(summary.split(' ').length / 200)}m
                    </span>
                    <span className="text-xs text-gray-400 ml-1">read</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}