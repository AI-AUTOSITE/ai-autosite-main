'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader, Copy, Check } from 'lucide-react'

type SummaryLength = 'brief' | 'standard' | 'detailed'

export default function AISummarizerClient() {
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
      setError('Enter text to summarize')
      return
    }

    if (inputText.length < 100) {
      setError('Text too short (min 100 characters)')
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
          tone: 'professional', // Default to professional
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
    { label: 'News Article', chars: 1500 },
    { label: 'Research Paper', chars: 3000 },
    { label: 'Blog Post', chars: 800 }
  ]

  const loadExample = (chars: number) => {
    const exampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. `.repeat(Math.ceil(chars / 450))
    setInputText(exampleText.substring(0, chars))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Text Input - Large and Prominent */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-white font-medium">
              Your Text
            </label>
            <span className={`text-xs ${charCount < 100 ? 'text-red-400' : 'text-gray-400'}`}>
              {charCount.toLocaleString()} {charCount < 100 && '(min 100)'}
            </span>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 50000))}
            placeholder="Paste or type your text here... (minimum 100 characters)"
            className="w-full h-48 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white 
                       placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 
                       transition-colors hover:bg-white/15"
            autoFocus
          />
          
          {/* Quick Examples */}
          {charCount === 0 && (
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Try example:</span>
              {exampleTexts.map((example) => (
                <button
                  key={example.label}
                  onClick={() => loadExample(example.chars)}
                  className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full 
                           hover:bg-white/10 hover:text-white transition-all"
                >
                  {example.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary Length Selection - Simplified */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Summary Length
          </label>
          <div className="flex gap-2">
            {[
              { value: 'brief', label: 'Brief', desc: '2-3 lines' },
              { value: 'standard', label: 'Standard', desc: '4-5 lines' },
              { value: 'detailed', label: 'Detailed', desc: '6-8 lines' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSummaryLength(option.value as SummaryLength)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                  summaryLength === option.value
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button - Large and Prominent */}
        <div className="flex gap-3">
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim() || charCount < 100}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                     font-medium text-lg rounded-xl hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Summarize Text
              </>
            )}
          </button>
          
          {(inputText || summary) && (
            <button
              onClick={handleClear}
              className="px-4 py-4 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 
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

        {/* Summary Output - Clean Display */}
        {summary && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-medium">
                Summary
              </label>
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-2 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
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

            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl mb-4">
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>

            {/* Simple Stats Bar */}
            <div className="flex justify-center gap-6 text-center">
              <div>
                <span className="text-lg font-bold text-purple-400">
                  {Math.round(((charCount - summary.length) / charCount) * 100)}%
                </span>
                <span className="text-xs text-gray-400 ml-1">shorter</span>
              </div>
              <div className="text-gray-600">•</div>
              <div>
                <span className="text-lg font-bold text-pink-400">
                  {summary.split(' ').length}
                </span>
                <span className="text-xs text-gray-400 ml-1">words</span>
              </div>
              <div className="text-gray-600">•</div>
              <div>
                <span className="text-lg font-bold text-cyan-400">
                  {Math.ceil(summary.split(' ').length / 200)}m
                </span>
                <span className="text-xs text-gray-400 ml-1">read</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}