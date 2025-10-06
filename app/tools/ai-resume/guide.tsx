// app/tools/ai-resume/guide.tsx

import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertCircle,
  Briefcase,
  Zap,
  User,
  FileText,
  Clock,
  Shield,
  Target,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function AIResumeGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const experienceExample = `• Led development of React application with 50k+ users
• Implemented CI/CD pipeline reducing deployment time by 40%
• Mentored team of 3 junior developers
• Improved system performance by 60% through optimization`

  const skillsExample =
    'React, TypeScript, Node.js, SQL, AWS, Team Leadership, Agile, Problem Solving'

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedExample(id)
    setTimeout(() => setCopiedExample(null), 2000)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white">AI Resume Generator Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-1">Professional Resumes in 2 Minutes</p>
              <p>Create ATS-friendly resumes and cover letters with Claude Opus 4.1.</p>
              <p className="mt-2">No sign-up required • 100% privacy • Instant results</p>
            </div>
          </div>
        </div>

        {/* Time Breakdown */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Quick Process Timeline</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Step 1: Name</span>
              <span className="text-cyan-400">10 sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Step 2: Job Title</span>
              <span className="text-cyan-400">10 sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Step 3: Experience</span>
              <span className="text-cyan-400">30 sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Step 4: Skills</span>
              <span className="text-cyan-400">20 sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Step 5: Cover Letter (Optional)</span>
              <span className="text-cyan-400">30 sec</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-semibold">
              <span className="text-white">Total Time:</span>
              <span className="text-green-400">2 minutes</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div>
          <h4 className="font-semibold text-white mb-3">5 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Enter Your Name</p>
                <p className="text-sm text-gray-400 mt-1">
                  <User className="inline w-3 h-3 mr-1" />
                  Simple - just your full name as you want it to appear
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Target Job Title</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Target className="inline w-3 h-3 mr-1" />
                  The position you're applying for (e.g., "Senior Developer")
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Add Your Experience</p>
                <p className="text-sm text-gray-400 mt-1 mb-2">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  Use bullet points with measurable achievements
                </p>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap flex-1">
                      {experienceExample}
                    </pre>
                    <button
                      onClick={() => handleCopy(experienceExample, 'experience')}
                      className="ml-2 p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedExample === 'experience' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">List Your Skills</p>
                <p className="text-sm text-gray-400 mt-1 mb-2">
                  <Zap className="inline w-3 h-3 mr-1" />
                  Include both technical and soft skills
                </p>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-gray-300 flex-1">{skillsExample}</p>
                    <button
                      onClick={() => handleCopy(skillsExample, 'skills')}
                      className="ml-2 p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedExample === 'skills' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                5
              </span>
              <div>
                <p className="font-medium text-white">Generate & Copy</p>
                <p className="text-sm text-gray-400 mt-1">
                  <FileText className="inline w-3 h-3 mr-1" />
                  Click generate and get your tailored documents instantly
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-green-300 mb-2">Pro Tips for Better Results</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Start bullet points with action verbs (Led, Implemented, Improved)</li>
                <li>• Include specific numbers and percentages (50k users, 40% faster)</li>
                <li>• Match skills to the job description keywords</li>
                <li>• Keep descriptions concise but impactful</li>
                <li>• Highlight leadership and collaboration experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Your Privacy is Protected</p>
              <ul className="space-y-1 text-gray-300">
                <li>• No account creation required</li>
                <li>• No data is stored or saved</li>
                <li>• Information is processed and immediately forgotten</li>
                <li>• 100% anonymous and secure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ATS Optimization */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">ATS-Optimized Format</p>
              <p className="text-gray-300">
                Our generated resumes are designed to pass Applicant Tracking Systems (ATS) with
                clean formatting, proper structure, and keyword optimization.
              </p>
            </div>
          </div>
        </div>

        {/* AI Power Badge */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-300 font-medium">
            ✨ Powered by Claude Opus 4.1 - Advanced AI for Professional Content
          </p>
        </div>

        {/* Common Mistakes to Avoid */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-400 font-semibold mb-2">❌ Common Mistakes to Avoid</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• Generic descriptions without specific achievements</li>
            <li>• Missing keywords from the job description</li>
            <li>• Too long (keep it 1-2 pages maximum)</li>
            <li>• Forgetting to customize for each application</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'AI Resume Generator Guide',
  icon: '💼',
  available: true,
}
