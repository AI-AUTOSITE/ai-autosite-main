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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          AI Resume & Cover Letter Generator
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create professional, ATS-friendly resumes and personalized cover letters in minutes. 
          No sign-up required.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white">Instant Generation</h3>
          </div>
          <p className="text-sm text-gray-400">Create documents in under 2 minutes</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">ATS-Optimized</h3>
          </div>
          <p className="text-sm text-gray-400">Formats that pass applicant tracking systems</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">No Sign-up</h3>
          </div>
          <p className="text-sm text-gray-400">Start immediately, 100% privacy</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <form onSubmit={onSubmit}>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${i === step 
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white' 
                      : i < step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-gray-500'}
                  `}>
                    {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < last && (
                    <div className={`
                      w-full h-1 mx-2 transition-all
                      ${i < step ? 'bg-green-500' : 'bg-white/10'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={s.key} className={i === step ? 'block' : 'hidden'}>
                <label className="flex items-center gap-2 text-white font-medium mb-3">
                  {s.icon}
                  {s.label}
                  {s.required && <span className="text-red-400">*</span>}
                </label>
                
                {s.type === 'input' ? (
                  <input
                    name={s.key}
                    required={s.required}
                    placeholder={s.placeholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : (
                  <textarea
                    name={s.key}
                    required={s.required}
                    placeholder={s.placeholder}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
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
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                ${step === 0 || loading 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : 'bg-white/10 text-white hover:bg-white/20'}
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {step < last ? (
              <button
                type="button"
                onClick={gotoNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Documents
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

{/* Results Display */}
{result && (
  <div className="mt-8 space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Generated Documents</h2>
      {/* AI使用インジケーター */}
      <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <span className="text-sm text-purple-300">
          Powered by Claude Opus 4.1
        </span>
      </div>
    </div>
    
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Complete Output</h3>
        <button
          onClick={() => copyToClipboard(result, 'all')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
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
      
      <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono">
        {result}
      </pre>
    </div>
  </div>
)}
      </div>

      {/* Tips Section */}
      <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Use bullet points in your experience section for better readability</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Include measurable achievements with numbers and percentages</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Tailor your skills to match the job description keywords</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300">Keep your resume concise - ideally 1-2 pages maximum</p>
          </div>
        </div>
      </div>
    </div>
  )
}