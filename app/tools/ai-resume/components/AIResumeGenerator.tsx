'use client'

import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Copy,
  FileText,
  Briefcase,
  User,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

type StepKey = 'name' | 'job_title' | 'experience' | 'skills' | 'cover_letter'

type StepDef = {
  key: StepKey
  label: string
  placeholder?: string
  type: 'input' | 'textarea'
  required?: boolean
  icon?: React.ReactNode
}

const STEPS: StepDef[] = [
  {
    key: 'name',
    label: 'Full Name',
    type: 'input',
    required: true,
    placeholder: 'Jane Doe',
    icon: <User className="w-4 h-4" />,
  },
  {
    key: 'job_title',
    label: 'Target Job Title',
    type: 'input',
    required: true,
    placeholder: 'Full Stack Developer',
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    key: 'experience',
    label: 'Professional Experience',
    type: 'textarea',
    required: true,
    placeholder:
      '• Led development of React application with 50k+ users\n• Implemented CI/CD pipeline reducing deployment time by 40%\n• Mentored team of 3 junior developers',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    key: 'skills',
    label: 'Key Skills',
    type: 'input',
    required: true,
    placeholder: 'React, TypeScript, Node.js, SQL, AWS, Team Leadership',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    key: 'cover_letter',
    label: 'Cover Letter Notes (Optional)',
    type: 'textarea',
    required: false,
    placeholder: 'Add any specific points you want to highlight in your cover letter...',
    icon: <FileText className="w-4 h-4" />,
  },
]

export default function AIResumeGenerator() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning() // ✅ isChecking 追加
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    setIsRedirecting(true)
    handleDisagree()
    router.push('/')
  }

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [aiPowered, setAiPowered] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const last = useMemo(() => STEPS.length - 1, [])
  const currentStep = STEPS[step]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    if (!hasAgreed) return
    if (step !== last) return

    setLoading(true)
    setError(null)
    setResult(null)

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/ai-resume', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || 'Failed to generate documents')

      setResult(data.result)
      setAiPowered(data.aiPowered || false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const gotoNext = () => setStep((s) => Math.min(s + 1, last))
  const gotoPrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleGenerate = () => {
    if (formRef.current && step === last && hasAgreed) {
      formRef.current.requestSubmit()
    }
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)

    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  const downloadAsText = () => {
    if (!result) return

    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isChecking || isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
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

      {/* Show warning message if not agreed */}
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
        /* Main Content - Only show if agreed */
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
          {/* Main Form Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8">
            <form ref={formRef} onSubmit={onSubmit}>
              {/* Progress Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div
                        className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm font-semibold
                        ${
                          i === step
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white scale-110 shadow-lg shadow-indigo-500/50'
                            : i < step
                              ? 'bg-green-500/80 text-white'
                              : 'bg-white/10 text-gray-500'
                        }
                      `}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      {i < last && (
                        <div
                          className={`
                          flex-1 h-0.5 mx-1 sm:mx-2 transition-all
                          ${i < step ? 'bg-green-500/50' : 'bg-white/10'}
                        `}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Step {step + 1} of {STEPS.length}: {currentStep.label}
                </p>
              </div>

              {/* Form Fields */}
              <div className="min-h-[200px] sm:min-h-[220px]">
                {STEPS.map((s, i) => (
                  <div key={s.key} className={i === step ? 'block animate-fadeIn' : 'hidden'}>
                    <label className="flex items-center gap-2 text-white font-medium mb-3 text-sm sm:text-base">
                      {s.icon}
                      {s.label}
                      {s.required && <span className="text-red-400 text-sm">*</span>}
                    </label>

                    {s.type === 'input' ? (
                      <input
                        name={s.key}
                        required={s.required}
                        placeholder={s.placeholder}
                        className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base sm:text-lg
                                   placeholder-gray-400 focus:border-indigo-500 focus:outline-none 
                                   focus:ring-2 focus:ring-indigo-500/20 hover:bg-white/15 transition-all min-h-[48px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (i < last) {
                              gotoNext()
                            }
                          }
                        }}
                      />
                    ) : (
                      <textarea
                        name={s.key}
                        required={s.required}
                        placeholder={s.placeholder}
                        rows={6}
                        className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base
                                   placeholder-gray-400 focus:border-indigo-500 focus:outline-none 
                                   focus:ring-2 focus:ring-indigo-500/20 hover:bg-white/15 transition-all resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault()
                            if (i < last) {
                              gotoNext()
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 sm:mt-8 gap-3">
                <button
                  type="button"
                  onClick={gotoPrev}
                  disabled={step === 0 || loading}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px]
                    ${
                      step === 0 || loading
                        ? 'opacity-0 pointer-events-none'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                {step < last ? (
                  <button
                    type="button"
                    onClick={gotoNext}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-blue-600 
                              text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 
                              transition-all hover:scale-105 min-h-[44px] text-sm sm:text-base"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 
                              text-white rounded-xl font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-purple-500/50 
                              transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span className="hidden sm:inline">Generating with AI...</span>
                        <span className="sm:hidden">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="hidden sm:inline">Generate with AI</span>
                        <span className="sm:hidden">Generate</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fadeIn">
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="mt-6 sm:mt-8 animate-fadeIn">
                <div className="border-t border-white/10 pt-6 sm:pt-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        Your Documents
                      </h3>
                      {aiPowered && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full flex items-center gap-1 border border-purple-400/50">
                          <Sparkles className="w-3 h-3" />
                          AI Generated
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={downloadAsText}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/50 min-h-[40px]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(result, 'all')}
                        className={`
                          flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm min-h-[40px]
                          ${
                            copiedSection === 'all'
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }
                        `}
                      >
                        {copiedSection === 'all' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-white/10">
                    <pre className="whitespace-pre-wrap text-gray-300 text-xs sm:text-sm leading-relaxed font-mono overflow-x-auto">
                      {result}
                    </pre>
                  </div>

                  {/* Action Tip */}
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-xs leading-relaxed">
                      💡 <strong>Next Steps:</strong> Copy to your favorite editor, customize with
                      your details, and save as PDF for applications.
                    </p>
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