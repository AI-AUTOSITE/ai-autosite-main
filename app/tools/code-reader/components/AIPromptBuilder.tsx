// app/tools/code-reader/components/AIPromptBuilder.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import AIPricingCalculator from './AIPricingCalculator'
import { 
  Sparkles,
  Wand2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Bug,
  Zap,
  BookOpen,
  Target,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Settings,
  RefreshCw,
  Send,
  DollarSign
} from 'lucide-react'

interface PromptTemplate {
  id: string
  category: 'refactor' | 'debug' | 'optimize' | 'explain' | 'review'
  title: string
  description: string
  icon: React.ReactNode
  template: string
  variables: string[]
  examples: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
}

interface AIPromptBuilderProps {
  analysis: any
  selectedFiles: string[]
  fileContent?: string
  onPromptGenerated?: (prompt: string) => void
  onSendToAI?: (prompt: string, platform: 'chatgpt' | 'claude' | 'copilot') => void
}

export default function AIPromptBuilder({
  analysis,
  selectedFiles,
  fileContent = '',
  onPromptGenerated,
  onSendToAI
}: AIPromptBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [customizedPrompt, setCustomizedPrompt] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'chatgpt' | 'claude' | 'copilot'>('chatgpt')
  const [additionalContext, setAdditionalContext] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [showPricingCalculator, setShowPricingCalculator] = useState(true)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [compressionEnabled, setCompressionEnabled] = useState(true)

  // Calculate tokens for the current prompt
  const calculateTokens = (text: string): number => {
    // Simple approximation: ~4 characters per token for English, ~3.5 for code
    const baseTokens = Math.ceil(text.length / 3.5)
    return compressionEnabled ? Math.floor(baseTokens * 0.4) : baseTokens
  }

  const promptTokens = useMemo(() => {
    return calculateTokens(customizedPrompt)
  }, [customizedPrompt, compressionEnabled])

  // Prompt templates
  const templates: PromptTemplate[] = [
    {
      id: 'refactor-clean',
      category: 'refactor',
      title: 'Clean Code Refactoring',
      description: 'Improve code readability and maintainability',
      icon: <Code className="text-blue-400" />,
      template: `I need help refactoring this code for better readability and maintainability.

**Current Issues:**
{issues}

**Code Context:**
{context}

**Specific Goals:**
1. Reduce complexity
2. Improve naming conventions
3. Extract reusable functions
4. Add proper TypeScript types

Please provide:
1. Refactored code with explanations
2. List of changes made
3. Why each change improves the code`,
      variables: ['issues', 'context'],
      examples: [
        'Complex nested conditionals',
        'Long functions doing multiple things',
        'Unclear variable names'
      ],
      difficulty: 'beginner',
      estimatedTime: '5-10 min'
    },
    {
      id: 'debug-error',
      category: 'debug',
      title: 'Debug Error',
      description: 'Find and fix bugs in your code',
      icon: <Bug className="text-red-400" />,
      template: `Help me debug this error in my code.

**Error Message:**
{error}

**Code causing the issue:**
{code}

**What I've tried:**
{attempts}

**File Dependencies:**
{dependencies}

Please:
1. Identify the root cause
2. Provide the fix with explanation
3. Suggest how to prevent similar issues`,
      variables: ['error', 'code', 'attempts', 'dependencies'],
      examples: [
        'TypeError: Cannot read property of undefined',
        'Circular dependency detected',
        'Module not found error'
      ],
      difficulty: 'beginner',
      estimatedTime: '3-5 min'
    },
    {
      id: 'optimize-performance',
      category: 'optimize',
      title: 'Performance Optimization',
      description: 'Make your code faster and more efficient',
      icon: <Zap className="text-yellow-400" />,
      template: `Optimize this code for better performance.

**Current Performance Issues:**
{performance_issues}

**Code to Optimize:**
{code}

**Constraints:**
- {constraints}

**Metrics to Improve:**
- Load time
- Memory usage
- Render performance

Provide:
1. Optimized version with benchmarks
2. Explanation of optimizations
3. Trade-offs to consider`,
      variables: ['performance_issues', 'code', 'constraints'],
      examples: [
        'Slow rendering of large lists',
        'Memory leaks in components',
        'Unnecessary re-renders'
      ],
      difficulty: 'intermediate',
      estimatedTime: '10-15 min'
    },
    {
      id: 'explain-code',
      category: 'explain',
      title: 'Code Explanation',
      description: 'Understand how code works',
      icon: <BookOpen className="text-green-400" />,
      template: `Explain this code in simple terms.

**Code to Explain:**
{code}

**My Current Understanding:**
{understanding}

**Specific Questions:**
{questions}

Please explain:
1. What each part does
2. How the parts work together
3. Common use cases
4. Potential improvements

Use analogies and examples for complex concepts.`,
      variables: ['code', 'understanding', 'questions'],
      examples: [
        'How does this hook work?',
        'What is this pattern doing?',
        'Why use this approach?'
      ],
      difficulty: 'beginner',
      estimatedTime: '5 min'
    },
    {
      id: 'architecture-review',
      category: 'review',
      title: 'Architecture Review',
      description: 'Get feedback on your project structure',
      icon: <Target className="text-purple-400" />,
      template: `Review my project architecture and suggest improvements.

**Project Overview:**
{overview}

**Current Structure:**
{structure}

**Dependency Analysis:**
{dependencies}

**Known Issues:**
{issues}

Please provide:
1. Architecture assessment (score 1-10)
2. Identified problems with severity
3. Recommended refactoring plan
4. Best practices to follow
5. Migration strategy if needed`,
      variables: ['overview', 'structure', 'dependencies', 'issues'],
      examples: [
        'Circular dependencies found',
        'Too many orphaned files',
        'Deep dependency chains'
      ],
      difficulty: 'advanced',
      estimatedTime: '15-20 min'
    }
  ]

  // Generate customized prompt based on template
  const generatePrompt = (template: PromptTemplate) => {
    let prompt = template.template

    // Replace variables with actual data
    const replacements: Record<string, string> = {
      issues: analysis?.suggestions?.join('\n') || 'No specific issues identified',
      context: selectedFiles.map(f => `File: ${f}`).join('\n'),
      error: 'Error details here',
      code: fileContent.substring(0, 1000) + (fileContent.length > 1000 ? '...' : ''),
      attempts: 'Previous debugging attempts',
      dependencies: analysis?.hotspots?.map((h: any) => h.name).join(', ') || 'No dependencies',
      performance_issues: 'Performance metrics',
      constraints: 'Project constraints',
      understanding: 'Current level of understanding',
      questions: 'Specific questions',
      overview: `Project with ${selectedFiles.length} files`,
      structure: analysis ? `Files: ${analysis.stats?.totalFiles}, Dependencies: ${analysis.stats?.totalDependencies}` : 'Structure details'
    }

    // Replace all variables
    Object.entries(replacements).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value)
    })

    // Add additional context if provided
    if (additionalContext) {
      prompt += `\n\n**Additional Context:**\n${additionalContext}`
    }

    // Add platform-specific instructions
    prompt += getPlatformInstructions(selectedPlatform)

    return prompt
  }

  // Platform-specific instructions
  const getPlatformInstructions = (platform: string): string => {
    const instructions = {
      chatgpt: '\n\n---\nPlease format your response with clear sections and code blocks.',
      claude: '\n\n---\nProvide detailed explanations and consider edge cases.',
      copilot: '\n\n---\nFocus on practical, production-ready solutions.'
    }
    return instructions[platform] || ''
  }

  // Handle template selection
  const selectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    const generated = generatePrompt(template)
    setCustomizedPrompt(generated)
    onPromptGenerated?.(generated)
  }

  // Copy to clipboard
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(customizedPrompt)
      setCopied(true)
      
      // Add to history
      setPromptHistory(prev => [customizedPrompt, ...prev.slice(0, 4)])
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Send to AI platform
  const sendToAI = () => {
    if (onSendToAI) {
      onSendToAI(customizedPrompt, selectedPlatform)
    } else {
      // Default: copy to clipboard
      copyPrompt()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wand2 className="text-purple-400" />
              AI Prompt Builder
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Generate perfect prompts for ChatGPT, Claude, or GitHub Copilot
            </p>
          </div>
          
          {/* Platform Selector */}
          <div className="flex items-center gap-2">
            {(['chatgpt', 'claude', 'copilot'] as const).map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedPlatform === platform
                    ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                    : 'bg-black/20 text-gray-400 hover:bg-black/30'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-cyan-400">
              {selectedFiles.length}
            </div>
            <div className="text-xs text-gray-400">Files</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-400">
              {analysis?.stats?.totalDependencies || 0}
            </div>
            <div className="text-xs text-gray-400">Dependencies</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {analysis?.suggestions?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Issues</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-purple-400">
              {promptTokens}
            </div>
            <div className="text-xs text-gray-400">Tokens</div>
          </div>
        </div>
      </div>

      {/* AI Pricing Calculator */}
      {promptTokens > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              AI Cost Estimation
            </h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={compressionEnabled}
                  onChange={(e) => setCompressionEnabled(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/30 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                Compression {compressionEnabled && '(60% savings)'}
              </label>
              <button
                onClick={() => setShowPricingCalculator(!showPricingCalculator)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {showPricingCalculator ? 'Hide' : 'Show'} Calculator
              </button>
            </div>
          </div>
          
          {showPricingCalculator && (
            <AIPricingCalculator
              inputTokens={promptTokens}
              estimatedOutputTokens={Math.floor(promptTokens * 0.3)}
              onCostCalculated={setEstimatedCost}
              className="mt-2"
            />
          )}
          
          {!showPricingCalculator && estimatedCost > 0 && (
            <div className="text-sm text-gray-400 bg-black/20 rounded-lg px-3 py-2">
              Estimated cost: <span className="text-green-400 font-medium">${estimatedCost.toFixed(4)}</span>
              {estimatedCost > 0.1 && (
                <span className="ml-2 text-yellow-400 text-xs">(High cost - consider using a smaller model)</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Template Grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkles className="text-yellow-400" size={16} />
          Choose Your Goal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => selectTemplate(template)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedTemplate?.id === template.id
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-black/20 border-white/10 hover:bg-black/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm">
                    {template.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      {template.estimatedTime}
                    </span>
                    <DifficultyBadge difficulty={template.difficulty} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Prompt */}
      {customizedPrompt && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Generated Prompt</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {showPreview && (
            <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {customizedPrompt}
              </pre>
            </div>
          )}

          {/* Additional Context */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-all">
              Add more context (optional)
            </summary>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Add any specific requirements, constraints, or context..."
              className="mt-2 w-full h-24 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </details>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={copyPrompt}
              className="flex-1 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2 border border-purple-500/30 font-medium"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Prompt
                  {estimatedCost > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-purple-600/30 rounded text-xs">
                      ~${estimatedCost.toFixed(3)}
                    </span>
                  )}
                </>
              )}
            </button>
            
            <button
              onClick={sendToAI}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Send size={18} />
              Send to {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-blue-400 mt-0.5" size={16} />
          <div className="text-sm text-blue-300">
            <strong>Pro Tips:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>Be specific about what you want to achieve</li>
              <li>Include error messages and console outputs</li>
              <li>Mention your tech stack and constraints</li>
              <li>Ask for explanations to learn, not just solutions</li>
              <li>Enable compression to save 60% on API costs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Prompt History */}
      {promptHistory.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-all">
            Recent prompts ({promptHistory.length})
          </summary>
          <div className="mt-2 space-y-2">
            {promptHistory.map((prompt, index) => (
              <div key={index} className="p-2 bg-black/20 rounded text-xs text-gray-400 truncate">
                {prompt.substring(0, 100)}...
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

// Helper Component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400'
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded ${colors[difficulty] || colors.beginner}`}>
      {difficulty}
    </span>
  )
}