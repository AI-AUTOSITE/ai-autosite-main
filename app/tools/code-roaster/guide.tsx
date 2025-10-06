'use client'

import { X, Flame, BookOpen, Wrench, AlertCircle, Lightbulb, Code2 } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Code Roaster',
  steps: [
    { icon: '1', text: 'Paste your code in the input area' },
    { icon: '2', text: 'Choose your mode: Roast, Explain, or Fix' },
    { icon: '3', text: 'Get instant AI-powered feedback' },
  ],
  tips: [
    'Keep code under 10,000 characters',
    'English code only (no CJK characters)',
    'You have 3 attempts per day',
  ],
  modes: [
    {
      icon: Flame,
      name: 'Roast Mode',
      color: 'text-orange-500',
      description: 'Get brutally honest feedback with humor',
    },
    {
      icon: BookOpen,
      name: 'Explain Mode',
      color: 'text-blue-500',
      description: 'Understand your code step by step',
    },
    {
      icon: Wrench,
      name: 'Fix Mode',
      color: 'text-green-500',
      description: 'Get bugs fixed and code improved',
    },
  ],
  troubleshooting: [
    {
      problem: 'Daily limit reached',
      solution: 'Wait 24 hours for reset (3 attempts/day)',
    },
    {
      problem: 'Code not accepted',
      solution: 'Check for non-English characters',
    },
    {
      problem: 'No response',
      solution: 'Check internet connection and try again',
    },
  ],
}

interface GuideProps {
  onClose?: () => void
}

export default function CodeRoasterGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-purple-400" />
          {toolGuide.title}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Quick Steps */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Steps</h4>
        <div className="space-y-2">
          {toolGuide.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 
                             flex items-center justify-center text-sm font-bold"
              >
                {step.icon}
              </span>
              <span className="text-gray-300 text-sm">{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modes */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Available Modes</h4>
        <div className="space-y-2">
          {toolGuide.modes.map((mode, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
              <mode.icon className={`w-5 h-5 ${mode.color} mt-0.5`} />
              <div className="flex-1">
                <div className="font-medium text-white text-sm">{mode.name}</div>
                <div className="text-xs text-gray-400">{mode.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          Tips
        </h4>
        <ul className="space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <li key={index} className="text-gray-400 text-sm flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Troubleshooting */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          Troubleshooting
        </h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="text-red-400">Issue:</span>
              <span className="text-gray-300 ml-2">{item.problem}</span>
              <div className="text-gray-400 ml-4 text-xs mt-1">→ {item.solution}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
        <h4 className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">
          Important Info
        </h4>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>For educational & entertainment purposes only</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Your code is never stored or shared</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>All processing is temporary & secure</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>No signup required - instant feedback</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Built with ❤️ by indie developers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
