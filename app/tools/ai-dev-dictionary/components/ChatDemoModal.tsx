// app/tools/ai-dev-dictionary/components/ChatDemoModal.tsx

'use client'

import { useState, useEffect } from 'react'
import { X, User, Bot, Copy, Check, Send, Lightbulb, Code } from 'lucide-react'
import EnhancedInteractiveDemo from './EnhancedInteractiveDemo'
import type { TechTerm } from '../lib/terms'

interface ChatDemoModalProps {
  term: TechTerm
  onClose: () => void
}

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  showDemo?: boolean
  code?: string
}

export default function ChatDemoModal({ term, onClose }: ChatDemoModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Chat flow simulation
  const chatFlow: ChatMessage[] = [
    {
      role: 'user',
      content: `I keep seeing "${term.term}" in tutorials but I don't know what it actually looks like`,
    },
    {
      role: 'ai',
      content: `Ah, a ${term.term}! Let me show you exactly what it is. ${term.description}`,
    },
    {
      role: 'ai',
      content: `Here's a live demo you can interact with:`,
      showDemo: true,
    },
    {
      role: 'user',
      content: `That's helpful! What do other developers call this?`,
    },
    {
      role: 'ai',
      content: `AI assistants might refer to it as: ${term.aiSynonyms.join(', ')}. When chatting with AI, you can use any of these terms.`,
    },
    {
      role: 'user',
      content: `Can I see the code?`,
    },
    {
      role: 'ai',
      content: `Of course! Here's a basic implementation:`,
      code: term.codeExample,
    },
  ]

  // Auto-progress through chat
  useEffect(() => {
    if (currentStep < chatFlow.length) {
      const timer = setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, chatFlow[currentStep]])
          setCurrentStep(prev => prev + 1)
          setIsTyping(false)
        }, 500)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Learning: {term.term}</h2>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
              {term.category.replace('-', ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {/* Tip Box */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20 mb-6">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-200 font-medium mb-1">Pro Tip</p>
                <p className="text-xs text-gray-300">
                  Now you can tell AI: "Add a {term.term} to my page" or use variations like "{term.aiSynonyms[0]}"
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={index} className="flex gap-3 animate-slideUp">
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-gray-700' 
                  : 'bg-gradient-to-br from-cyan-500 to-purple-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-gray-300" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 max-w-3xl">
                <div className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-gray-800 rounded-tl-none'
                    : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-tl-none'
                }`}>
                  <p className="text-sm text-gray-200">{message.content}</p>
                  
                  {/* Demo Area */}
                  {message.showDemo && (
                    <div className="mt-4 bg-black/30 rounded-lg p-6 border border-white/10">
                      <EnhancedInteractiveDemo term={term} />
                    </div>
                  )}
                  
                  {/* Code Area */}
                  {message.code && (
                    <div className="mt-4 relative">
                      <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-300">
                          <code>{message.code}</code>
                        </pre>
                      </div>
                      <button
                        onClick={() => handleCopy(message.code!, index)}
                        className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded transition-all"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg rounded-tl-none p-4 border border-cyan-500/20">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Input Area (Visual Only) */}
      <div className="bg-slate-900 border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Try asking: What else can I do with this component?"
              className="flex-1 px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-gray-500"
              disabled
            />
            <button className="px-4 py-3 bg-cyan-500 text-white rounded-lg opacity-50 cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            This is a demo showing how AI explains components
          </p>
        </div>
      </div>
    </div>
  )
}