// app/tools/network-checker/components/ClaudeAIChat.tsx
'use client'

import { useState } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import type { Device } from '../lib/types'

interface ClaudeAIChatProps {
  devices: Device[]
}

export default function ClaudeAIChat({ devices }: ClaudeAIChatProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAskAI = async () => {
    if (!question.trim() || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Anonymize device data
      const anonymizedData = devices.map((d, i) => ({
        device: `Device ${i + 1}`,
        network: d.ip.split('.').slice(0, 3).join('.') + '.x',
        connection: d.connection
      }))

      const prompt = `
User has ${devices.length} devices with network issues.
Anonymized network info: ${JSON.stringify(anonymizedData, null, 2)}

User question: ${question}

Provide a simple, actionable answer in under 100 words. Use simple English.
Focus on practical solutions, not technical details.
`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      })

      if (!res.ok) {
        throw new Error('AI request failed')
      }

      const data = await res.json()
      const aiResponse = data.content[0].text
      setResponse(aiResponse)

    } catch (err) {
      setError('Could not get AI response. Try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-medium">Ask AI Expert</h3>
        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Still stuck? Ask Claude AI for personalized help.
      </p>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
          placeholder="e.g., How do I find my router?"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white 
                   placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors text-sm
                   disabled:opacity-50"
        />
        <button
          onClick={handleAskAI}
          disabled={!question.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg
                   hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-purple-400">Claude AI</span>
          </div>
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
            {response}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-4">
        AI responses may not always be accurate. Verify important information.
      </p>
    </div>
  )
}