// components/GuidedOnboarding.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Github, 
  Folder, 
  Sparkles, 
  ChevronRight,
  X,
  Play,
  HelpCircle,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action?: () => void
  videoUrl?: string
  tips?: string[]
}

interface GuidedOnboardingProps {
  onComplete: (source: 'github' | 'local', demoMode?: boolean) => void
  isFirstVisit?: boolean
}

export default function GuidedOnboarding({ onComplete, isFirstVisit = true }: GuidedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [userChoice, setUserChoice] = useState<'github' | 'local' | null>(null)
  const [showTips, setShowTips] = useState(true)

  // Check if user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding')
    if (hasSeenOnboarding && !isFirstVisit) {
      setShowTips(false)
    }
  }, [isFirstVisit])

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Code Visualizer! 👋',
      description: 'Analyze your code structure and dependencies with AI assistance',
      icon: <Sparkles className="text-purple-400" size={32} />,
      tips: [
        'Visualize project dependencies instantly',
        'Get AI-powered refactoring suggestions',
        'Export analysis for ChatGPT/Claude',
        'No subscription required - pay per use'
      ]
    },
    {
      id: 'choose-source',
      title: 'How would you like to start?',
      description: 'Choose your code source',
      icon: <HelpCircle className="text-blue-400" size={32} />,
      tips: [
        'GitHub: Perfect for public repositories',
        'Local Upload: Best for private projects',
        'Demo Mode: Try with sample projects'
      ]
    }
  ]

  const sourceOptions = [
    {
      id: 'github',
      title: 'GitHub Repository',
      description: 'Analyze any public repo',
      icon: <Github size={24} />,
      features: ['No login required', 'Instant analysis', 'Up to 50 files'],
      recommended: true,
      examples: ['facebook/react', 'vercel/next.js', 'microsoft/vscode']
    },
    {
      id: 'local',
      title: 'Local Project',
      description: 'Upload from your computer',
      icon: <Folder size={24} />,
      features: ['100% private', 'No file limits', 'Drag & drop'],
      examples: ['Your React app', 'Node.js project', 'Any codebase']
    },
    {
      id: 'demo',
      title: 'Try Demo Project',
      description: 'Explore with sample code',
      icon: <Play size={24} />,
      features: ['Learn features', 'No setup needed', 'Interactive tutorial'],
      isDemoMode: true
    }
  ]

  const handleSourceSelection = (source: string) => {
    if (source === 'demo') {
      loadDemoProject()
    } else {
      setUserChoice(source as 'github' | 'local')
      localStorage.setItem('has_seen_onboarding', 'true')
      onComplete(source as 'github' | 'local', false)
    }
  }

  const loadDemoProject = () => {
    // Load a pre-defined demo project structure
    localStorage.setItem('has_seen_onboarding', 'true')
    onComplete('github', true) // Use GitHub source with demo flag
  }

  const skipOnboarding = () => {
    localStorage.setItem('has_seen_onboarding', 'true')
    onComplete('github', false)
  }

  return (
    <div className="relative">
      {/* Quick Start Card */}
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 border border-purple-500/20">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {onboardingSteps[currentStep].title}
            </h2>
            <p className="text-gray-300 text-lg">
              {onboardingSteps[currentStep].description}
            </p>
          </div>
          
          {!isFirstVisit && (
            <button
              onClick={skipOnboarding}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
              title="Skip onboarding"
            >
              <X className="text-gray-400" size={20} />
            </button>
          )}
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {onboardingSteps[0].tips?.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-1" size={16} />
                  <span className="text-sm text-gray-300">{tip}</span>
                </div>
              ))}
            </div>

            {/* Video Tutorial Option */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="text-purple-400" size={20} />
                  <div>
                    <p className="text-white font-medium">Watch 2-min Tutorial</p>
                    <p className="text-xs text-gray-400">See all features in action</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVideo(true)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  Watch Now
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Source Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sourceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSourceSelection(option.id)}
                  className={`relative p-6 bg-black/20 hover:bg-black/30 rounded-xl border transition-all text-left group ${
                    option.recommended 
                      ? 'border-purple-500/50 hover:border-purple-400' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {option.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="text-yellow-400" size={12} />
                        <span className="text-xs text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Examples */}
                  {option.examples && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {option.examples.map((example, index) => (
                          <span key={index} className="text-xs bg-white/5 px-2 py-1 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {option.isDemoMode && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="text-yellow-400" size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-400 mt-0.5" size={16} />
                <div className="text-sm text-blue-300">
                  <strong>First time?</strong> Try the Demo Project to explore all features 
                  with guided tutorials. No setup required!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl max-w-4xl w-full">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Quick Tutorial</h3>
              <button
                onClick={() => setShowVideo(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black/50 flex items-center justify-center">
              {/* Embed video here */}
              <p className="text-gray-400">Video tutorial placeholder</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}