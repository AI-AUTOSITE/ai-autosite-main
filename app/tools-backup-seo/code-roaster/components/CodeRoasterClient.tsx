'use client'

import { useState, useEffect } from 'react'
import { 
  Flame, 
  BookOpen, 
  Wrench, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  X,
  AlertCircle
} from 'lucide-react'
import { validateInput, checkSubmissionLimit, incrementSubmissionCount } from '../lib/submission-guard'
import { showToast } from '../lib/toast'

export default function CodeRoasterClient() {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<'roast' | 'explain' | 'fix' | null>(null)
  const [copied, setCopied] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(3)

  // Check remaining attempts on mount
  useEffect(() => {
    const checkAttempts = () => {
      const data = JSON.parse(localStorage.getItem('code_roaster_daily_count') || '{}')
      const todayKey = new Date().toLocaleDateString()
      const used = data[todayKey] || 0
      setAttemptsLeft(Math.max(0, 3 - used))
    }
    
    checkAttempts()
    // Check every minute for date change
    const interval = setInterval(checkAttempts, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (mode: 'roast' | 'explain' | 'fix') => {
    const error = validateInput(code)
    if (error) {
      showToast(error)
      return
    }

    if (!checkSubmissionLimit()) {
      showToast("Daily limit reached! Come back tomorrow for 3 more attempts.")
      return
    }

    setIsLoading(true)
    setActiveMode(mode)
    setOutput('Processing your code...')
    incrementSubmissionCount()
    
    // Update attempts counter
    setAttemptsLeft(prev => Math.max(0, prev - 1))

    try {
      const response = await fetch('/api/code-roaster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode })
      })

      const data = await response.json()
      
      if (data.error) {
        setOutput(`Error: ${data.error}`)
        showToast(data.error)
      } else {
        setOutput(data.result || 'No output received')
      }
    } catch (error) {
      setOutput('Network error. Please check your connection.')
      showToast('Network error occurred')
    } finally {
      setIsLoading(false)
      setTimeout(() => setActiveMode(null), 500)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      showToast('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      showToast('Failed to copy')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Content Grid - Directly start with the tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-purple-400" />
              Input Code
            </h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>

          <div className="relative mb-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              placeholder="// Paste your code here..."
              className="w-full h-[400px] p-4 rounded-xl bg-black/40 backdrop-blur-sm 
                       border-2 border-purple-500/30 text-white font-mono text-sm 
                       resize-none placeholder:text-gray-400 focus:outline-none 
                       focus:border-purple-400/60 transition-all duration-300 
                       disabled:opacity-50"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <div className="text-xs text-purple-400 bg-black/50 px-2 py-1 rounded-full">
                {code.length}/10000
              </div>
              {code.length > 0 && (
                <button
                  onClick={() => setCode('')}
                  className="text-xs text-red-400 hover:text-red-300 bg-black/50 
                           px-2 py-1 rounded-full transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleAction('roast')}
              disabled={isLoading || attemptsLeft === 0}
              className={`py-3 px-3 rounded-xl font-bold text-white transition-all duration-300 
                        disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'roast'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 scale-95 ring-4 ring-orange-400/50'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  <span className="hidden sm:inline">Roast</span>
                </div>
                <span className="text-[10px] opacity-70">
                  {attemptsLeft > 0 ? `${attemptsLeft} left` : 'No attempts'}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleAction('explain')}
              disabled={isLoading || attemptsLeft === 0}
              className={`py-3 px-3 rounded-xl font-bold text-white transition-all duration-300 
                        disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'explain'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-95 ring-4 ring-blue-400/50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="hidden sm:inline">Explain</span>
                </div>
                <span className="text-[10px] opacity-70">
                  {attemptsLeft > 0 ? `${attemptsLeft} left` : 'No attempts'}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleAction('fix')}
              disabled={isLoading || attemptsLeft === 0}
              className={`py-3 px-3 rounded-xl font-bold text-white transition-all duration-300 
                        disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'fix'
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 scale-95 ring-4 ring-green-400/50'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  <span className="hidden sm:inline">Fix</span>
                </div>
                <span className="text-[10px] opacity-70">
                  {attemptsLeft > 0 ? `${attemptsLeft} left` : 'No attempts'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl animate-pulse">🤖</span>
              AI Response
            </h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" 
                   style={{ animationDelay: '0.3s' }} />
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" 
                   style={{ animationDelay: '0.6s' }} />
            </div>
          </div>

          <div className="relative">
            {output && !isLoading && (
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs 
                          font-semibold transition-all duration-300 backdrop-blur-sm ${
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
                }`}
              >
                {copied ? (
                  <><Check className="w-3 h-3 inline mr-1" />Copied!</>
                ) : (
                  <><Copy className="w-3 h-3 inline mr-1" />Copy</>
                )}
              </button>
            )}

            <div className="w-full h-[400px] p-4 pr-20 rounded-xl bg-black/40 backdrop-blur-sm 
                          border-2 border-orange-500/30 text-white font-mono text-sm overflow-auto">
              {isLoading ? (
                <div className="flex items-center gap-2 text-orange-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">AI is thinking...</span>
                </div>
              ) : output || (
                <span className="text-gray-400">Your AI feedback will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}