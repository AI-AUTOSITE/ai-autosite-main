// app/tools/haiku-generator/components/HaikuClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Zap, BookOpen, Copy, Check, Loader2, Smartphone, AlertTriangle } from 'lucide-react'
import { countSyllablesInLine } from '../lib/syllable-counter'
import { getCurrentSeason } from '../lib/season-words'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'
type Mode = 'quick' | 'ai' | 'coaching'

interface Haiku {
  lines: Array<{ text: string; syllables: number }>
  season: Season
  seasonWord: string
  method: 'local' | 'claude'
}

export default function HaikuClient() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    setIsRedirecting(true)
    handleDisagree()
    router.push('/')
  }

  const [theme, setTheme] = useState('')
  const [season, setSeason] = useState<Season>(getCurrentSeason())
  const [mode, setMode] = useState<Mode>('quick')
  const [haiku, setHaiku] = useState<Haiku | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  
  const [userLines, setUserLines] = useState(['', '', ''])
  const [analysis, setAnalysis] = useState<any>(null)
  const [coachingFeedback, setCoachingFeedback] = useState<any>(null)
  const [analyzingUser, setAnalyzingUser] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Please enter a theme')
      return
    }

    // Check if AI mode requires agreement
    if (mode !== 'quick' && !hasAgreed) {
      setError('Please agree to the AI tool terms to use AI features')
      return
    }
    
    setLoading(true)
    setError('')
    setHaiku(null)
    
    try {
      const response = await fetch('/api/haiku/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          season,
          useAI: mode !== 'quick'
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Generation failed')
      }
      
      const data = await response.json()
      
      const haikuWithSyllables = {
        ...data.haiku,
        lines: data.haiku.lines.map((line: any) => ({
          ...line,
          syllables: countSyllablesInLine(line.text)
        }))
      }
      
      setHaiku(haikuWithSyllables)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate haiku')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeUser = async () => {
    if (userLines.some(line => !line.trim())) {
      setError('Please fill in all three lines')
      return
    }

    // Check if coaching mode requires agreement
    if (mode === 'coaching' && !hasAgreed) {
      setError('Please agree to the AI tool terms to use coaching features')
      return
    }
    
    setAnalyzingUser(true)
    setError('')
    setCoachingFeedback(null)
    
    try {
      const response = await fetch('/api/haiku/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: userLines,
          coachingType: mode === 'coaching' ? 'full' : 'quick'
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }
      
      const data = await response.json()
      setAnalysis(data.analysis)
      if (data.coaching) {
        setCoachingFeedback(data.coaching)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze haiku')
    } finally {
      setAnalyzingUser(false)
    }
  }

  const copyToClipboard = () => {
    if (!haiku) return
    const text = haiku.lines.map(l => l.text).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle mode change - show warning if switching to AI modes
  const handleModeChange = (newMode: Mode) => {
    if ((newMode === 'ai' || newMode === 'coaching') && !hasAgreed) {
      // Don't allow switching to AI modes without agreement
      return
    }
    setMode(newMode)
  }

  // Loading state
  if (isChecking || isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* Loading animation */}
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {isMobile && (
          <div className="mb-4 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <p className="text-sm text-pink-300">Works offline • AI optional</p>
          </div>
        )}

        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-sm font-semibold text-white mb-3">Choose Mode</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleModeChange('quick')}
              className={`p-3 rounded-lg border-2 transition-all ${
                mode === 'quick'
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <Zap className={`w-5 h-5 mx-auto mb-1 ${mode === 'quick' ? 'text-cyan-400' : 'text-gray-400'}`} />
              <p className="text-xs text-white">Quick</p>
            </button>

            <button
              onClick={() => handleModeChange('ai')}
              disabled={!hasAgreed}
              className={`p-3 rounded-lg border-2 transition-all ${
                mode === 'ai'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 bg-white/5'
              } ${!hasAgreed ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Sparkles className={`w-5 h-5 mx-auto mb-1 ${mode === 'ai' ? 'text-purple-400' : 'text-gray-400'}`} />
              <p className="text-xs text-white">AI</p>
              {!hasAgreed && (
                <p className="text-[10px] text-yellow-400 mt-1">Requires agreement</p>
              )}
            </button>

            <button
              onClick={() => handleModeChange('coaching')}
              disabled={!hasAgreed}
              className={`p-3 rounded-lg border-2 transition-all ${
                mode === 'coaching'
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-white/10 bg-white/5'
              } ${!hasAgreed ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <BookOpen className={`w-5 h-5 mx-auto mb-1 ${mode === 'coaching' ? 'text-pink-400' : 'text-gray-400'}`} />
              <p className="text-xs text-white">Coach</p>
              {!hasAgreed && (
                <p className="text-[10px] text-yellow-400 mt-1">Requires agreement</p>
              )}
            </button>
          </div>

          {/* Agreement warning for AI modes */}
          {!hasAgreed && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  AI and Coaching modes require agreement to AI tool terms. Quick mode works without AI.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Generate Haiku</h2>
          
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter theme (e.g., cherry blossoms)"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                     placeholder-gray-500 focus:outline-none focus:border-cyan-500 mb-3"
            maxLength={100}
          />
          
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                     focus:outline-none focus:border-cyan-500 mb-4 [&>option]:bg-gray-800"
          >
            <option value="spring">Spring 🌸</option>
            <option value="summer">Summer ☀️</option>
            <option value="autumn">Autumn 🍂</option>
            <option value="winter">Winter ❄️</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !theme.trim() || (mode !== 'quick' && !hasAgreed)}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white 
                     rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate
              </>
            )}
          </button>

          {haiku && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                  {haiku.method === 'local' ? 'Quick' : 'AI'}
                </span>
                <button onClick={copyToClipboard} className="text-gray-400 hover:text-white">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-2 font-serif">
                {haiku.lines.map((line, i) => (
                  <div key={i}>
                    <p className="text-xl text-white">{line.text}</p>
                    <p className="text-xs text-gray-400">{line.syllables} syllables</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Write Your Own</h2>
          
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-3">
              <label className="block text-sm text-gray-300 mb-2">
                Line {i + 1} ({i === 1 ? '7' : '5'} syllables)
              </label>
              <input
                type="text"
                value={userLines[i]}
                onChange={(e) => {
                  const newLines = [...userLines]
                  newLines[i] = e.target.value
                  setUserLines(newLines)
                }}
                placeholder={i === 0 ? 'Cherry blossoms fall' : i === 1 ? 'Soft petals dance in spring breeze' : 'Fleeting beauty fades'}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {countSyllablesInLine(userLines[i])} syllables
              </p>
            </div>
          ))}

          <button
            onClick={handleAnalyzeUser}
            disabled={analyzingUser || userLines.some(line => !line.trim()) || (mode === 'coaching' && !hasAgreed)}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                     rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {analyzingUser ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                {mode === 'coaching' ? 'Get Coaching' : 'Check'}
              </>
            )}
          </button>

          {analysis && (
            <div className="mt-4 p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
              <p className="text-sm text-white mb-2">
                {analysis.syllables[0]}-{analysis.syllables[1]}-{analysis.syllables[2]}
                {analysis.isValid ? (
                  <span className="text-green-400 ml-2">✓ Perfect!</span>
                ) : (
                  <span className="text-yellow-400 ml-2">⚠ Needs adjustment</span>
                )}
              </p>
              {analysis.suggestions.length > 0 && (
                <ul className="text-sm text-gray-300 space-y-1">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              )}
              
              {coachingFeedback && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-2">AI Coaching</h3>
                  <div className="text-sm text-gray-300 whitespace-pre-line">
                    {coachingFeedback.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-6">
            {error}
          </div>
        )}

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-3">What is Haiku?</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <p>• <strong>5-7-5 structure:</strong> Three lines with 5, 7, and 5 syllables</p>
            <p>• <strong>Season word (kigo):</strong> Reference to nature or time of year</p>
            <p>• <strong>Present moment:</strong> Capture a single moment with vivid imagery</p>
          </div>
        </div>
      </div>
    </>
  )
}