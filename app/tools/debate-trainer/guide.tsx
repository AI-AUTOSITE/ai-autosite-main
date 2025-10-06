// app/tools/debate-trainer/guide.tsx

import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertCircle,
  MessageSquare,
  Brain,
  Target,
  Shield,
  Trophy,
  Zap,
  Star,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function DebateTrainerGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const exampleTopics = [
    'Should AI replace human workers?',
    'Is space exploration worth the cost?',
    'Should social media be regulated?',
    'Is remote work better than office work?',
    'Should college education be free?',
  ]

  const coachStyles = [
    {
      name: 'Supportive Coach',
      icon: '🤝',
      level: 'Beginner',
      description: 'Gentle feedback, builds confidence',
      color: 'from-blue-400 to-purple-500',
    },
    {
      name: 'Professor',
      icon: '🎓',
      level: 'Intermediate',
      description: 'Academic rigor, balanced critique',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: "Devil's Advocate",
      icon: '⚔️',
      level: 'Advanced',
      description: 'No mercy, challenges everything',
      color: 'from-red-500 to-orange-600',
    },
  ]

  const scoreCategories = [
    { name: 'Logical Consistency', icon: Brain, description: 'How well arguments connect' },
    { name: 'Persuasiveness', icon: MessageSquare, description: 'Emotional and rational appeal' },
    { name: 'Factual Accuracy', icon: Shield, description: 'Correctness of claims' },
    { name: 'Structural Coherence', icon: Target, description: 'Organization and clarity' },
    { name: 'Rebuttal Resilience', icon: Trophy, description: 'Anticipating counterarguments' },
  ]

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
          <MessageSquare className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">AI Debate Trainer Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">Master the Art of Argumentation</p>
              <p>Practice debates with AI opponents and get scored feedback.</p>
              <p className="mt-2">5 rounds • 3 coaching styles • Real-time scoring</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Start Debating</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Choose Your Topic</p>
                <p className="text-sm text-gray-400 mt-1">
                  Pick any debate topic - the more specific, the better
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Select Coach Style</p>
                <p className="text-sm text-gray-400 mt-1">
                  Choose based on your comfort and skill level
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Debate for 5 Rounds</p>
                <p className="text-sm text-gray-400 mt-1">
                  Exchange arguments with your AI opponent
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Get Your Scores</p>
                <p className="text-sm text-gray-400 mt-1">
                  Receive detailed feedback across 5 categories
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Coaching Styles */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-400" />
            Choose Your AI Coach
          </h4>
          <div className="space-y-3">
            {coachStyles.map((style, index) => (
              <div key={index} className={`bg-gradient-to-r ${style.color} p-[1px] rounded-lg`}>
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{style.name}</p>
                        <p className="text-xs text-gray-400">{style.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                      {style.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Topics */}
        <div>
          <h4 className="font-semibold text-white mb-3">Popular Debate Topics</h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            {exampleTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between group">
                <p className="text-sm text-gray-300">
                  <ChevronRight className="inline w-3 h-3 mr-1 text-purple-400" />
                  {topic}
                </p>
                <button
                  onClick={() => handleCopy(topic, `topic-${index}`)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                >
                  {copiedExample === `topic-${index}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring System */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Scoring Categories (1-5 Scale)
          </h4>
          <div className="space-y-2">
            {scoreCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <Icon className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">{category.name}</p>
                    <p className="text-xs text-gray-400">{category.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            1 = Needs Work • 3 = Good • 5 = Excellent
          </p>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-2">Pro Debate Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Start with Supportive Coach to build confidence</li>
                <li>• Use specific examples and evidence</li>
                <li>• Address potential counterarguments</li>
                <li>• Structure: Strong claim → Evidence → Reasoning</li>
                <li>• Practice daily for rapid improvement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-300 mb-2">Key Features</p>
              <ul className="space-y-1 text-gray-300">
                <li>• 5-round debates for focused practice</li>
                <li>• Real-time AI responses with Claude Haiku</li>
                <li>• Detailed scoring across 5 dimensions</li>
                <li>• Personalized feedback after each debate</li>
                <li>• Anonymous - no signup required</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Privacy Protected</p>
              <p className="text-gray-300">
                No account needed. Anonymous processing. Rate-limited for fairness. Your debates are
                never stored or shared.
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Tip */}
        <div className="bg-purple-500/10 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">💡 Winning Strategy</p>
          <p className="text-xs text-gray-300 mb-2">
            The key to high scores is anticipating counterarguments. Always think: "What would my
            opponent say?" and address it preemptively.
          </p>
          <p className="text-xs text-gray-400">
            Remember: This tool helps you think critically, not win arguments at any cost.
          </p>
        </div>
      </div>
    </div>
  )
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'AI Debate Trainer Guide',
  icon: '💬',
  available: true,
}
