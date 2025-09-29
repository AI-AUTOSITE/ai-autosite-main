'use client'

import { useState, useMemo } from 'react'
import { Copy, FileText, Briefcase, User, Zap, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

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
    icon: <User className="w-4 h-4" />
  },
  { 
    key: 'job_title', 
    label: 'Target Job Title', 
    type: 'input', 
    required: true, 
    placeholder: 'Full Stack Developer',
    icon: <Briefcase className="w-4 h-4" />
  },
  { 
    key: 'experience', 
    label: 'Professional Experience', 
    type: 'textarea', 
    required: true, 
    placeholder: '• Led development of React application with 50k+ users\n• Implemented CI/CD pipeline reducing deployment time by 40%\n• Mentored team of 3 junior developers',
    icon: <FileText className="w-4 h-4" />
  },
  { 
    key: 'skills', 
    label: 'Key Skills', 
    type: 'input', 
    required: true, 
    placeholder: 'React, TypeScript, Node.js, SQL, AWS, Team Leadership',
    icon: <Zap className="w-4 h-4" />
  },
  { 
    key: 'cover_letter', 
    label: 'Cover Letter Notes (Optional)', 
    type: 'textarea', 
    required: false, 
    placeholder: 'Add any specific points you want to highlight in your cover letter...',
    icon: <FileText className="w-4 h-4" />
  }
]

export default function AIResumeGenerator() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const last = useMemo(() => STEPS.length - 1, [])
  const currentStep = STEPS[step]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/ai-resume', { 
        method: 'POST', 
        body: form 
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Failed to generate documents')
      
      setResult(data.result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const gotoNext = () => setStep((s) => Math.min(s + 1, last))
  const gotoPrev = () => setStep((s) => Math.max(s - 1, 0))

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">

      {/* Main Form Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
        <form onSubmit={onSubmit}>
          {/* Simplified Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all text-sm
                    ${i === step 
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white scale-110' 
                      : i < step 
                        ? 'bg-green-500/80 text-white' 
                        : 'bg-white/10 text-gray-500'}
                  `}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < last && (
                    <div className={`
                      flex-1 h-0.5 mx-1 md:mx-2 transition-all
                      ${i < step ? 'bg-green-500/50' : 'bg-white/10'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              Step {step + 1} of {STEPS.length}: {currentStep.label}
            </p>
          </div>

          {/* Form Fields - One at a time */}
          <div className="min-h-[200px]">
            {STEPS.map((s, i) => (
              <div key={s.key} className={i === step ? 'block animate-fadeIn' : 'hidden'}>
                <label className="flex items-center gap-2 text-white font-medium mb-3">
                  {s.icon}
                  {s.label}
                  {s.required && <span className="text-red-400 text-sm">*</span>}
                </label>
                
                {s.type === 'input' ? (
                  <input
                    name={s.key}
                    required={s.required}
                    placeholder={s.placeholder}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                               placeholder-gray-400 focus:border-indigo-500 focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500/20 hover:bg-white/15 transition-all"
                    autoFocus
                  />
                ) : (
                  <textarea
                    name={s.key}
                    required={s.required}
                    placeholder={s.placeholder}
                    rows={6}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white
                               placeholder-gray-400 focus:border-indigo-500 focus:outline-none 
                               focus:ring-2 focus:ring-indigo-500/20 hover:bg-white/15 transition-all resize-none"
                    autoFocus
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={gotoPrev}
              disabled={step === 0 || loading}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                ${step === 0 || loading 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white/10 text-white hover:bg-white/20'}
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < last ? (
              <button
                type="button"
                onClick={gotoNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 
                          text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 
                          transition-all hover:scale-105"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                          text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 
                          transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fadeIn">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results Display - Simplified */}
        {result && (
          <div className="mt-8 animate-fadeIn">
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your Documents</h3>
                <button
                  onClick={() => copyToClipboard(result, 'all')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm
                    ${copiedSection === 'all' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'}
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
              
              <div className="bg-black/30 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono">
                  {result}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips - Minimized */}
      {!result && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 Tip: Use bullet points and numbers for better impact
          </p>
        </div>
      )}
    </div>
  )
}