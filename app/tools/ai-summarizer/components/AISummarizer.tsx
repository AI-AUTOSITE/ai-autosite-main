// app/tools/ai-summarizer/components/AISummarizer.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles,
  FileText,
  Loader,
  Copy,
  Check,
  ChevronDown,
  RefreshCw,
  Brain,
  Zap,
  Shield,
  Target,
  Layers,
} from 'lucide-react'
import { PeopleAlsoUse } from '../../../components/CrossSell'

type SummaryLength = 'brief' | 'standard' | 'detailed'
type SummaryTone = 'professional' | 'casual' | 'technical'

interface Feature {
  icon: () => JSX.Element
  title: string
  desc: string
}

export default function AISummarizer() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('standard')
  const [summaryTone, setSummaryTone] = useState<SummaryTone>('professional')
  const [error, setError] = useState('')

  useEffect(() => {
    setCharCount(inputText.length)
  }, [inputText])

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          length: summaryLength,
          tone: summaryTone,
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

  const features: Feature[] = [
    {
      icon: () => <Brain className="w-4 h-4" />,
      title: 'AI-Powered',
      desc: 'Advanced neural networks',
    },
    {
      icon: () => <Zap className="w-4 h-4" />,
      title: 'Lightning Fast',
      desc: 'Results in seconds',
    },
    {
      icon: () => <Shield className="w-4 h-4" />,
      title: 'Secure',
      desc: 'Your data stays private',
    },
    {
      icon: () => <Target className="w-4 h-4" />,
      title: 'Accurate',
      desc: 'Precise summarization',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main content with sidebar layout - タイトルセクション削除 */}
      <div className="flex gap-8 lg:flex-row flex-col">
        {/* Main content area */}
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
            <div className="space-y-6">
              {/* Header with features */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  AI-Powered Text Summarization
                </h2>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <feature.icon />
                      <span className="text-xs text-gray-300">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Summary Length
                  </label>
                  <div className="relative">
                    <select
                      value={summaryLength}
                      onChange={(e) => setSummaryLength(e.target.value as SummaryLength)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="brief">Brief (2-3 sentences)</option>
                      <option value="standard">Standard (4-5 sentences)</option>
                      <option value="detailed">Detailed (6-8 sentences)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                  <div className="relative">
                    <select
                      value={summaryTone}
                      onChange={(e) => setSummaryTone(e.target.value as SummaryTone)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="technical">Technical</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Text Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Your Text
                  </label>
                  <span className="text-xs text-gray-400">
                    {charCount.toLocaleString()} characters
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSummarize}
                  disabled={isLoading || !inputText.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Summary
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Clear
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  {error}
                </div>
              )}

              {/* Summary Output */}
              {summary && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Summary
                    </label>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1 text-xs bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
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

                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-xl font-bold text-purple-400">
                        {Math.round(((charCount - summary.length) / charCount) * 100)}%
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Reduction</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-xl font-bold text-pink-400">
                        {summary.split(' ').length}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Words</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-xl font-bold text-indigo-400">
                        {summary.split('.').filter((s) => s.trim()).length}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Sentences</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-xl font-bold text-green-400">
                        {Math.ceil(summary.split(' ').length / 200)}m
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Read Time</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Tool Info */}
        <aside className="lg:w-80">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  LIVE
                </span>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                  NEW
                </span>
                <span className="text-yellow-400">⭐</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">⏱ Time to use</span>
                  <span className="text-white">30 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">👥 Active users</span>
                  <span className="text-white">2.5k</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">⚙ Data processing</span>
                  <span className="text-white">Server</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Tool Type</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">🤖</span>
                    <span className="text-sm text-gray-300">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✨</span>
                    <span className="text-sm text-gray-300">Recently Added</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">AI</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                    Summary
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">Text</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">Study</span>
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                    Productivity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Cross-sell section */}
      <div className="mt-12">
        <PeopleAlsoUse currentToolId="ai-summarizer" />
      </div>
    </div>
  )
}
