'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download, History, Info, Lightbulb, AlertTriangle } from 'lucide-react'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

interface ChatMessage {
  role: 'user' | 'gpt' | 'system'
  content: string
}

interface Scores {
  'Logical Consistency': number
  Persuasiveness: number
  'Factual Accuracy': number
  'Structural Coherence': number
  'Rebuttal Resilience': number
}

interface DebateHistory {
  id: string
  topic: string
  style: string
  date: string
  scores: Scores
  turns: number
}

// Sample topics for quick start
const SAMPLE_TOPICS = [
  'Should social media be regulated by governments?',
  'Is artificial intelligence a threat to humanity?',
  'Should college education be free for everyone?',
  'Is remote work better than office work?',
  'Should we colonize Mars?',
  'Is cryptocurrency the future of money?',
  'Should animals have legal rights?',
  'Is cancel culture harmful to society?',
]

const SCORE_LABELS: Record<string, string> = {
  'Logical Consistency': 'Logic',
  Persuasiveness: 'Persuasion',
  'Factual Accuracy': 'Facts',
  'Structural Coherence': 'Structure',
  'Rebuttal Resilience': 'Resilience',
}

const SCORE_DESCRIPTIONS: Record<string, string> = {
  'Logical Consistency':
    'Are the premises valid? Does the conclusion logically follow from the arguments presented?',
  Persuasiveness:
    'How compelling is the argument both emotionally and rationally? Would it convince a skeptical audience?',
  'Factual Accuracy':
    'Are the claims supported by evidence or reasonable assumptions? Are there any factual errors?',
  'Structural Coherence':
    'Is the argument well-organized, easy to follow, and properly structured?',
  'Rebuttal Resilience':
    'How well would this argument hold up against counterarguments and challenges?',
}

export default function DebateTrainer() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()

  // Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    handleDisagree()
    router.push('/')
  }

  const [isStarted, setIsStarted] = useState(false)
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('kind')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turns, setTurns] = useState(0)
  const [evaluation, setEvaluation] = useState<{
    scores: Scores
    scoreExplanations?: Record<string, string>
    feedback: string
  } | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingText, setCurrentTypingText] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<DebateHistory[]>([])
  const [hoveredScore, setHoveredScore] = useState<string | null>(null)
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false)

  const chatLogRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const maxTurns = 5

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('debate_history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }
  }, [])

  const saveToHistory = () => {
    if (!evaluation || !topic) return

    const newEntry: DebateHistory = {
      id: Date.now().toString(),
      topic,
      style,
      date: new Date().toISOString(),
      scores: evaluation.scores,
      turns,
    }

    const updatedHistory = [newEntry, ...history].slice(0, 10) // Keep latest 10 entries
    setHistory(updatedHistory)
    localStorage.setItem('debate_history', JSON.stringify(updatedHistory))
  }

  const startDebate = () => {
    if (!hasAgreed) return

    if (!topic.trim()) {
      alert('Please enter a topic')
      return
    }
    setIsStarted(true)
    setMessages([])
    setTurns(0)
    setEvaluation(null)
    setShowTopicSuggestions(false)
  }

  const sendMessage = async () => {
    if (!hasAgreed || !userInput.trim() || isLoading || turns >= maxTurns) return

    const newMessage = userInput.trim()
    setUserInput('')
    setIsLoading(true)

    setMessages((prev) => [...prev, { role: 'user', content: newMessage }])

    let userToken = localStorage.getItem('user_token')
    if (!userToken) {
      userToken = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`
      localStorage.setItem('user_token', userToken)
    }

    try {
      const response = await fetch('/api/debate-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: topic,
          message: newMessage,
          style: style,
          user_token: userToken,
          is_new_session: turns === 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API error')
      }

      await typeMessage(data.reply, data.scores, data.scoreExplanations, data.feedback)

      setTurns((prev) => prev + 1)

      if (turns + 1 >= maxTurns) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: 'Debate Complete! Check your evaluation scores below.',
          },
        ])
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Error: ${error.message}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const typeMessage = async (
    text: string,
    scores: Scores,
    scoreExplanations: Record<string, string> | undefined,
    feedback: string
  ) => {
    const responseMatch = text.match(/RESPONSE:\s*([\s\S]*?)(?:SCORES:|FEEDBACK:|$)/i)
    const displayText = responseMatch ? responseMatch[1].trim() : text

    setIsTyping(true)
    setCurrentTypingText('')

    setMessages((prev) => [...prev, { role: 'gpt', content: '...' }])

    for (let i = 0; i < displayText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 12))
      setCurrentTypingText(displayText.slice(0, i + 1))

      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'gpt',
          content: displayText.slice(0, i + 1),
        }
        return newMessages
      })
    }

    setIsTyping(false)

    if (scores && feedback) {
      setEvaluation({ scores, scoreExplanations, feedback })
    }
  }

  const downloadResults = () => {
    if (!evaluation) return

    const content = `
DEBATE RESULTS
==============

Topic: ${topic}
Opponent Style: ${getStyleInfo().label}
Date: ${new Date().toLocaleString()}
Rounds Completed: ${turns}/${maxTurns}

PERFORMANCE SCORES
==================
${Object.entries(evaluation.scores)
  .map(([key, value]) => {
    const explanation = evaluation.scoreExplanations?.[key] || ''
    return `${key}: ${value}/5${explanation ? ` - ${explanation}` : ''}`
  })
  .join('\n')}

FEEDBACK
========
${evaluation.feedback}

CONVERSATION HISTORY
====================
${messages
  .map((msg) => {
    if (msg.role === 'user') return `You: ${msg.content}`
    if (msg.role === 'gpt') return `AI: ${msg.content}`
    return `System: ${msg.content}`
  })
  .join('\n\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `debate-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStyleInfo = () => {
    const styles = {
      kind: { label: 'Supportive Coach', icon: '🤝', color: 'from-blue-400 to-purple-500' },
      teacher: { label: 'Professor', icon: '🎓', color: 'from-emerald-500 to-teal-600' },
      devil: { label: "Devil's Advocate", icon: '⚔️', color: 'from-red-500 to-orange-600' },
    }
    return styles[style as keyof typeof styles] || styles.teacher
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px'
      if (textareaRef.current.scrollHeight > 48) {
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
      }
    }
  }

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages, currentTypingText])

  useEffect(() => {
    if (evaluation && turns >= maxTurns) {
      saveToHistory()
    }
  }, [evaluation, turns])

  const styleInfo = getStyleInfo()

  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.2,
  }

  // ✅ ローディング表示
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* ドット表示（必須） */}
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={patternStyle}></div>
          <div className="relative max-w-md mx-auto text-center">
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
      ) : !isStarted ? (
        /* Setup Screen */
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={patternStyle}></div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full border border-white/20">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-50"></div>

            <div className="relative">
              {/* History Button - Mobile optimized with larger tap area */}
              {history.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
                    aria-label="View history"
                  >
                    <History className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}

              {showHistory ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Recent Debates</h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-white/60 hover:text-white text-sm min-h-[44px] px-3"
                    >
                      Back
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer min-h-[60px]"
                        onClick={() => {
                          setTopic(entry.topic)
                          setStyle(entry.style)
                          setShowHistory(false)
                        }}
                      >
                        <div className="text-white text-sm font-medium mb-1 truncate">
                          {entry.topic}
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <span>
                            Avg:{' '}
                            {(Object.values(entry.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
                            /5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white/90 text-sm font-medium">Debate Topic</label>
                      <button
                        onClick={() => setShowTopicSuggestions(!showTopicSuggestions)}
                        className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 min-h-[44px] px-2"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>Suggestions</span>
                      </button>
                    </div>

                    {showTopicSuggestions && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-xs text-white/60 mb-2">Click to use:</div>
                        <div className="space-y-1">
                          {SAMPLE_TOPICS.map((sampleTopic, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setTopic(sampleTopic)
                                setShowTopicSuggestions(false)
                              }}
                              className="w-full text-left text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/10 p-3 rounded transition-all min-h-[48px] flex items-center"
                            >
                              {sampleTopic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="e.g., Should AI replace human workers?"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all text-base min-h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Choose Your Opponent
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all appearance-none cursor-pointer text-base min-h-[48px]"
                      style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
                    >
                      <option value="kind" style={{ backgroundColor: '#1f2937' }}>
                        🤝 Supportive Coach - Gentle feedback
                      </option>
                      <option value="teacher" style={{ backgroundColor: '#1f2937' }}>
                        🎓 Professor - Academic rigor
                      </option>
                      <option value="devil" style={{ backgroundColor: '#1f2937' }}>
                        ⚔️ Devil&apos;s Advocate - No mercy
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={startDebate}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all shadow-lg min-h-[56px] text-base"
                  >
                    Enter the Arena
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 text-center leading-relaxed">
                  Your debates are processed anonymously. AI responses may vary in accuracy.
                  <br />
                  Practice critical thinking and verify important claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Debate Screen */
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-0 md:p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-none md:rounded-3xl shadow-2xl w-full md:max-w-4xl min-h-screen md:min-h-[85vh] flex flex-col border border-slate-700/50">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 md:p-6 border-b border-slate-700/50 rounded-t-none md:rounded-t-3xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 bg-gradient-to-r ${styleInfo.color} rounded-lg shadow-lg flex-shrink-0`}>
                    <span className="text-xl sm:text-2xl">{styleInfo.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white/60 text-xs uppercase tracking-wider">Debating with</div>
                    <div className="text-white font-bold text-sm sm:text-base truncate">{styleInfo.label}</div>
                  </div>
                </div>
                <div className="text-right min-w-0 max-w-[40%] sm:max-w-xs">
                  <div className="text-white/60 text-xs uppercase tracking-wider">Topic</div>
                  <div className="text-white font-semibold text-xs sm:text-sm truncate">{topic}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-1">
                {[...Array(maxTurns)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < turns ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center mt-2 text-white/60 text-xs">
                Round {turns}/{maxTurns}
              </div>
            </div>

            <div
              ref={chatLogRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-900/50"
              style={{ maxHeight: 'calc(100vh - 320px)' }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
                >
                  {msg.role === 'gpt' && (
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${styleInfo.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <span className="text-sm">{styleInfo.icon}</span>
                      </div>
                      <div className="bg-slate-700/50 backdrop-blur text-white p-3 sm:p-4 rounded-2xl rounded-bl-sm shadow-lg border border-slate-600/30">
                        <div className="text-xs text-purple-400 mb-1 font-semibold">
                          {styleInfo.label}
                        </div>
                        <div className="leading-relaxed text-sm sm:text-base">{msg.content}</div>
                      </div>
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-2xl rounded-br-sm shadow-lg">
                        <div className="text-xs opacity-80 mb-1 font-semibold">You</div>
                        <div className="leading-relaxed text-sm sm:text-base">{msg.content}</div>
                      </div>
                    </div>
                  )}

                  {msg.role === 'system' && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur text-yellow-200 px-4 py-2 rounded-full text-xs sm:text-sm border border-yellow-500/30">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {evaluation && turns >= maxTurns && (
              <div className="p-4 md:p-6 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📊</span> Performance
                  </h3>
                  <button
                    onClick={downloadResults}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-all text-xs sm:text-sm flex items-center gap-2 border border-blue-400/50 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-4">
                  {Object.entries(evaluation.scores).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-slate-700/30 rounded-xl p-3 sm:p-4 border border-slate-600/30 relative group cursor-pointer"
                      onClick={() => setHoveredScore(hoveredScore === key ? null : key)}
                    >
                      <div className="text-white/60 text-xs mb-1">{SCORE_LABELS[key] || key}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-bold text-white">{value}</span>
                        <span className="text-white/40 text-sm">/5</span>
                      </div>
                      <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(value / 5) * 100}%` }}
                        />
                      </div>

                      {/* Mobile-friendly Tooltip - Shows below on tap */}
                      {hoveredScore === key && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 sm:p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-10 w-64 sm:w-72">
                          <div className="text-sm font-semibold text-white mb-2">{key}</div>
                          <div className="flex items-start gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-white/80 leading-relaxed">
                              {SCORE_DESCRIPTIONS[key]}
                            </div>
                          </div>
                          {evaluation.scoreExplanations?.[key] && (
                            <div className="text-xs text-purple-300 mt-2 pt-2 border-t border-slate-700">
                              {evaluation.scoreExplanations[key]}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="text-blue-300 text-sm font-semibold mb-2">Feedback</div>
                  <p className="text-white/80 text-sm leading-relaxed">{evaluation.feedback}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/90 backdrop-blur border-t border-slate-700/50 p-4 rounded-b-none md:rounded-b-3xl">
              <div className="flex gap-2 sm:gap-3">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value)
                    adjustTextareaHeight()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder={turns >= maxTurns ? 'Debate complete!' : 'Type your argument...'}
                  disabled={isLoading || turns >= maxTurns}
                  className="flex-1 p-3 bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-xl resize-none text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:bg-slate-700/70 transition-all min-h-[48px] max-h-[120px] disabled:opacity-50 text-base"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || turns >= maxTurns || !userInput.trim()}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 transition-all shadow-lg min-w-[80px] sm:min-w-[100px] min-h-[48px] text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}