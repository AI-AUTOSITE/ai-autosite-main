'use client'

import { useState } from 'react'
import { Sparkles, Code, FileText, MessageSquare, CreditCard, Check } from 'lucide-react'
import { SmartDependencyAnalyzer } from '../lib/smart-dependency-analyzer'

interface AIAnalysisProps {
  fileStructure: any
  allFiles: Record<string, string>
  analyzer: SmartDependencyAnalyzer
}

export default function AIAnalysis({ fileStructure, allFiles, analyzer }: AIAnalysisProps) {
  const [credits, setCredits] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  
  const features = [
    {
      id: 'refactor',
      icon: <Code className="w-5 h-5" />,
      title: 'AI Refactoring',
      description: 'Get specific refactoring suggestions',
      credits: 1
    },
    {
      id: 'architecture',
      icon: <FileText className="w-5 h-5" />,
      title: 'Architecture Doc',
      description: 'Generate complete documentation',
      credits: 2
    },
    {
      id: 'chat',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Code Chat',
      description: 'Discuss your code with AI',
      credits: 1
    }
  ]
  
  const handleAIRequest = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId)
    if (!feature) return
    
    if (credits < feature.credits) {
      setShowPayment(true)
      return
    }
    
    setIsProcessing(true)
    
    try {
      const context = analyzer.generateAIPrompt()
      
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: featureId,
          context
        })
      })
      
      const data = await response.json()
      setResult(data.result)
      setCredits(prev => prev - feature.credits)
      
    } catch (error) {
      console.error('AI request failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handlePurchaseCredits = async (amount: number) => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount,
          credits: amount * 100 // $1 = 100 credits
        })
      })
      
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          AI-Powered Analysis
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-purple-400">
            Credits: <span className="font-bold">{credits}</span>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <CreditCard size={16} />
            Get Credits
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map(feature => (
          <button
            key={feature.id}
            onClick={() => handleAIRequest(feature.id)}
            disabled={isProcessing || credits < feature.credits}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">
                  {feature.title}
                </div>
                <div className="text-xs text-gray-400">
                  {feature.description}
                </div>
                <div className="text-xs text-purple-400 mt-2">
                  {feature.credits} credit{feature.credits > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md border border-white/10">
            <h3 className="text-xl font-bold mb-4">Purchase Credits</h3>
            <p className="text-gray-400 mb-6">$1 = 100 credits • No subscription</p>
            
            <div className="space-y-3">
              {[5, 10, 20].map(amount => (
                <button
                  key={amount}
                  onClick={() => handlePurchaseCredits(amount)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all flex justify-between items-center"
                >
                  <span>${amount}</span>
                  <span className="text-purple-400">{amount * 100} credits</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Pay as you go • $0.01 per credit • No subscription • Your data is never stored
      </div>
    </div>
  )
}