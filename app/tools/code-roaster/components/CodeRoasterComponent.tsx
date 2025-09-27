'use client'

import { useState } from 'react'
import { Flame, BookOpen, Wrench, Code2, Copy, Check, Sparkles, Shield, Lock, Info, X } from 'lucide-react'
import { validateInput, checkSubmissionLimit, incrementSubmissionCount } from '../lib/submission-guard'
import { showToast } from '../lib/toast'

export default function CodeRoasterComponent() {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeMode, setActiveMode] = useState<'roast' | 'explain' | 'fix' | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleAction = async (mode: 'roast' | 'explain' | 'fix') => {
    // Input validation
    const error = validateInput(code)
    if (error) {
      showToast(error)
      return
    }

    // Daily limit check
    if (!checkSubmissionLimit()) {
      showToast("You've reached the daily limit (3 attempts). Please come back tomorrow!")
      return
    }

    setIsLoading(true)
    setActiveMode(mode)
    setOutput('Processing your code...')
    incrementSubmissionCount()

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
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const modalContent = {
    legal: {
      title: 'Legal Disclaimer',
      icon: Shield,
      content: `This tool is provided for educational and entertainment purposes only.
We do not guarantee the accuracy, completeness, or fitness for any particular purpose.
Do not use this tool for evaluating, creating, or distributing malicious code.
By using this tool, you accept full responsibility for any outcome or consequence.
If you are unsure about the results, consult a professional developer.`
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Lock,
      content: `Your privacy is important to us.
We do not store, log, or share any code or personal data you enter.
All code processing is performed server-side, temporarily, and is never saved or used for any other purpose.
Analytics data (Google Analytics) is collected anonymously for site improvement.
If you have privacy concerns, feel free to close this site at any time.`
    },
    about: {
      title: 'About Code Roaster',
      icon: Info,
      content: `Code Roaster is built for curious coders who want to improve, laugh, and learn from their mistakes—without judgment.
Paste your code, get honest (sometimes brutal!) feedback, and see explanations or fixes powered by AI.
No signups. No saving. Just instant feedback and a bit of fun.
Created with love by indie developers who believe that learning to code should never be boring.`
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Code Roaster
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Get instant AI-powered feedback that is both helpful and hilarious
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-white">Roast Mode</h3>
          </div>
          <p className="text-sm text-gray-400">Get brutally honest feedback with a side of humor</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h3 className="font-semibold text-white">Explain Mode</h3>
          </div>
          <p className="text-sm text-gray-400">Understand your code with clear explanations</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-6 h-6 text-green-500" />
            <h3 className="font-semibold text-white">Fix Mode</h3>
          </div>
          <p className="text-sm text-gray-400">Get your bugs fixed and code improved</p>
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-purple-400" />
              Input Code
            </h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="relative mb-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              placeholder="// Paste your code here and let the AI roast it..."
              className="w-full h-[400px] p-4 rounded-xl bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 text-white font-mono text-sm resize-none placeholder:text-gray-500 focus:outline-none focus:border-purple-400/60 transition-all duration-300 disabled:opacity-50"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <div className="text-xs text-purple-400 bg-black/50 px-2 py-1 rounded-full">
                {code.length} / 10000
              </div>
              {code.length > 0 && (
                <button
                  onClick={() => setCode('')}
                  className="text-xs text-red-400 hover:text-red-300 bg-black/50 px-2 py-1 rounded-full transition-colors"
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
              disabled={isLoading}
              className={`py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'roast' 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 scale-95 ring-4 ring-orange-400/50' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" />
                <span className="hidden sm:inline">Roast</span>
              </div>
            </button>

            <button
              onClick={() => handleAction('explain')}
              disabled={isLoading}
              className={`py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'explain' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-95 ring-4 ring-blue-400/50' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Explain</span>
              </div>
            </button>

            <button
              onClick={() => handleAction('fix')}
              disabled={isLoading}
              className={`py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeMode === 'fix' 
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 scale-95 ring-4 ring-green-400/50' 
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-105'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Wrench className="w-5 h-5" />
                <span className="hidden sm:inline">Fix</span>
              </div>
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl animate-pulse">🤖</span>
              AI Response
            </h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>

          <div className="relative">
            {output && !isLoading && (
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 backdrop-blur-sm ${
                  copied 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 inline mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 inline mr-1" />
                    Copy
                  </>
                )}
              </button>
            )}

            <div className="w-full h-[400px] p-4 pr-20 rounded-xl bg-black/40 backdrop-blur-sm border-2 border-orange-500/30 text-white font-mono text-sm overflow-auto">
              {isLoading ? (
                <div className="flex items-center gap-2 text-orange-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="animate-pulse">AI is thinking...</span>
                </div>
              ) : output || (
                <span className="text-gray-500">
                  // AI response will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setActiveModal('legal')}
          className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105"
        >
          Legal
        </button>
        <button
          onClick={() => setActiveModal('privacy')}
          className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105"
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveModal('about')}
          className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105"
        >
          About
        </button>
      </div>

      {/* Modal */}
      {activeModal && modalContent[activeModal as keyof typeof modalContent] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-[90vw] p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {modalContent[activeModal as keyof typeof modalContent].title}
              </span>
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
              {modalContent[activeModal as keyof typeof modalContent].content}
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-transform"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}