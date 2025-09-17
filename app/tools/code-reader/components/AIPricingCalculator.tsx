// app/tools/code-reader/components/AIPricingCalculator.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Calculator, DollarSign, TrendingUp, AlertCircle, Info, ChevronDown } from 'lucide-react'

// Type definitions
interface ModelPricing {
  input: number
  output: number
  name: string
  description: string
}

interface PlatformData {
  models: Record<string, ModelPricing>
  color: string
}

interface PricingData {
  chatgpt: PlatformData
  claude: PlatformData
  gemini: PlatformData
}

// Pricing data per 1K tokens (in USD)
const AI_PRICING: PricingData = {
  chatgpt: {
    models: {
      'gpt-4o': { 
        input: 0.0025, 
        output: 0.01,
        name: 'GPT-4o',
        description: 'Most capable, best for complex tasks'
      },
      'gpt-4o-mini': { 
        input: 0.00015, 
        output: 0.0006,
        name: 'GPT-4o mini',
        description: 'Affordable and intelligent small model'
      },
      'gpt-4-turbo': { 
        input: 0.01, 
        output: 0.03,
        name: 'GPT-4 Turbo',
        description: 'Previous generation, still powerful'
      },
      'gpt-3.5-turbo': { 
        input: 0.0005, 
        output: 0.0015,
        name: 'GPT-3.5 Turbo',
        description: 'Fast and inexpensive for simple tasks'
      }
    },
    color: 'emerald'
  },
  claude: {
    models: {
      'claude-3-5-sonnet': { 
        input: 0.003, 
        output: 0.015,
        name: 'Claude 3.5 Sonnet',
        description: 'Most intelligent model'
      },
      'claude-3-opus': { 
        input: 0.015, 
        output: 0.075,
        name: 'Claude 3 Opus',
        description: 'Powerful model for complex analysis'
      },
      'claude-3-sonnet': { 
        input: 0.003, 
        output: 0.015,
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance'
      },
      'claude-3-haiku': { 
        input: 0.00025, 
        output: 0.00125,
        name: 'Claude 3 Haiku',
        description: 'Fast and compact'
      }
    },
    color: 'orange'
  },
  gemini: {
    models: {
      'gemini-1.5-pro': { 
        input: 0.00125, 
        output: 0.005,
        name: 'Gemini 1.5 Pro',
        description: 'Advanced reasoning, 2M context'
      },
      'gemini-1.5-flash': { 
        input: 0.000075, 
        output: 0.0003,
        name: 'Gemini 1.5 Flash',
        description: 'Fast and versatile'
      },
      'gemini-1.5-flash-8b': { 
        input: 0.0000375, 
        output: 0.00015,
        name: 'Gemini 1.5 Flash-8B',
        description: 'Smallest and fastest'
      }
    },
    color: 'blue'
  }
}

interface PricingCalculatorProps {
  inputTokens: number
  estimatedOutputTokens?: number
  className?: string
  onCostCalculated?: (cost: number) => void
}

interface CostBreakdown {
  input: number
  output: number
  total: number
}

interface ModelCost {
  platform: string
  modelKey: string
  model: ModelPricing
  total: number
  color: string
}

export default function AIPricingCalculator({ 
  inputTokens, 
  estimatedOutputTokens = Math.floor(inputTokens * 0.3), // Default: 30% of input
  className = '',
  onCostCalculated
}: PricingCalculatorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<keyof PricingData>('chatgpt')
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [monthlyBudget, setMonthlyBudget] = useState(10)
  const [monthlyUsage, setMonthlyUsage] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [customOutputTokens, setCustomOutputTokens] = useState(estimatedOutputTokens)

  // Update customOutputTokens when estimatedOutputTokens changes
  useEffect(() => {
    setCustomOutputTokens(estimatedOutputTokens)
  }, [estimatedOutputTokens])

  // Calculate cost for current selection
  const currentCost = useMemo((): CostBreakdown => {
    const platform = AI_PRICING[selectedPlatform]
    const model = platform.models[selectedModel]
    
    if (!model) {
      return {
        input: 0,
        output: 0,
        total: 0
      }
    }
    
    const inputCost = (inputTokens / 1000) * model.input
    const outputCost = (customOutputTokens / 1000) * model.output
    const total = inputCost + outputCost
    
    return {
      input: inputCost,
      output: outputCost,
      total
    }
  }, [selectedPlatform, selectedModel, inputTokens, customOutputTokens])

  // Calculate costs for all models for comparison
  const allCosts = useMemo((): ModelCost[] => {
    const costs: ModelCost[] = []
    
    // Use type assertion to help TypeScript understand the structure
    const pricingEntries = Object.entries(AI_PRICING) as Array<[keyof PricingData, PlatformData]>
    
    pricingEntries.forEach(([platform, data]) => {
      const modelEntries = Object.entries(data.models) as Array<[string, ModelPricing]>
      
      modelEntries.forEach(([modelKey, model]) => {
        const inputCost = (inputTokens / 1000) * model.input
        const outputCost = (customOutputTokens / 1000) * model.output
        costs.push({
          platform,
          modelKey,
          model,
          total: inputCost + outputCost,
          color: data.color
        })
      })
    })
    
    return costs.sort((a, b) => a.total - b.total)
  }, [inputTokens, customOutputTokens])

  useEffect(() => {
    if (onCostCalculated) {
      onCostCalculated(currentCost.total)
    }
  }, [currentCost.total, onCostCalculated])

  const formatCost = (cost: number): string => {
    if (cost < 0.01) return `$${cost.toFixed(4)}`
    if (cost < 1) return `$${cost.toFixed(3)}`
    return `$${cost.toFixed(2)}`
  }

  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`
    return tokens.toString()
  }

  const budgetPercentage = ((monthlyUsage + currentCost.total) / monthlyBudget) * 100

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Cost Calculator</h3>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} Details
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Token Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Input Tokens</label>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTokens(inputTokens)}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Output Tokens (est.)</label>
            <input
              type="number"
              value={customOutputTokens}
              onChange={(e) => setCustomOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Platform & Model Selection */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {(Object.keys(AI_PRICING) as Array<keyof PricingData>).map((platform) => {
              const data = AI_PRICING[platform]
              return (
                <button
                  key={platform}
                  onClick={() => {
                    setSelectedPlatform(platform)
                    setSelectedModel(Object.keys(data.models)[0])
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlatform === platform
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={selectedPlatform === platform ? {
                    backgroundColor: data.color === 'emerald' ? 'rgb(16 185 129 / 0.1)' : 
                                     data.color === 'orange' ? 'rgb(251 146 60 / 0.1)' : 
                                     'rgb(59 130 246 / 0.1)',
                    color: data.color === 'emerald' ? 'rgb(16 185 129)' : 
                           data.color === 'orange' ? 'rgb(251 146 60)' : 
                           'rgb(59 130 246)'
                  } : {}}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              )
            })}
          </div>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            {Object.entries(AI_PRICING[selectedPlatform].models).map(([key, model]) => (
              <option key={key} value={key}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCost(currentCost.total)}
              </span>
            </div>
          </div>
          
          {showDetails && (
            <div className="text-xs space-y-1 pt-2 border-t border-blue-200 dark:border-blue-800">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Input cost:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatCost(currentCost.input)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Output cost:</span>
                <span className="text-gray-700 dark:text-gray-300">{formatCost(currentCost.output)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Budget Tracking */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</label>
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-20 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Usage: ${monthlyUsage.toFixed(2)} / ${monthlyBudget}</span>
              <span className={`font-medium ${budgetPercentage > 80 ? 'text-red-500' : budgetPercentage > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  budgetPercentage > 80 ? 'bg-red-500' : budgetPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, budgetPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        {showDetails && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Cost Comparison (all models)</span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {allCosts.slice(0, 5).map((item, index) => (
                <div 
                  key={`${item.platform}-${item.modelKey}`}
                  className={`flex items-center justify-between p-2 rounded text-xs ${
                    item.platform === selectedPlatform && item.modelKey === selectedModel
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: item.color === 'emerald' ? 'rgb(16 185 129)' : 
                                       item.color === 'orange' ? 'rgb(251 146 60)' : 
                                       'rgb(59 130 246)'
                      }}
                    />
                    <span className="font-medium">{item.model.name}</span>
                  </div>
                  <span className={`font-semibold ${index === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {formatCost(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1">Cost Optimization Tips:</p>
            <ul className="space-y-0.5">
              <li>• Use smaller models for simple tasks</li>
              <li>• Compress your code before sending (saves 40-60%)</li>
              <li>• Cache responses to avoid repeated API calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}