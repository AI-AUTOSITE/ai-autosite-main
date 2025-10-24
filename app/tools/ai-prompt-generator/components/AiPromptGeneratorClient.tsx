'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Code,
  PenTool,
  BarChart3,
  Lightbulb,
  Zap,
  Loader2,
} from 'lucide-react'

// ✅ AI Warning Hook と Modal をインポート
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

type TaskType = 'writing' | 'coding' | 'analysis' | 'creative' | 'learning'
type ToneType = 'professional' | 'casual' | 'technical' | 'friendly' | 'academic'

interface PromptTemplate {
  structure: string[]
  examples: string[]
  tips: string[]
}

const TASK_ICONS = {
  writing: <PenTool className="w-4 h-4" />,
  coding: <Code className="w-4 h-4" />,
  analysis: <BarChart3 className="w-4 h-4" />,
  creative: <Lightbulb className="w-4 h-4" />,
  learning: <Zap className="w-4 h-4" />,
}

const TASK_LABELS: Record<TaskType, string> = {
  writing: 'Writing',
  coding: 'Coding',
  analysis: 'Analysis',
  creative: 'Creative',
  learning: 'Learning',
}

// PROMPT_TEMPLATES は変更なし（既存のものをそのまま使用）
const PROMPT_TEMPLATES: Record<TaskType, PromptTemplate> = {
  // ... 既存のテンプレート定義
  writing: {
    structure: [
      'Act as a [ROLE] with expertise in [DOMAIN].',
      'I need you to write [TYPE] about [TOPIC].',
      'The target audience is [AUDIENCE].',
      'The tone should be [TONE].',
      'Key points to include: [POINTS]',
      'Length: approximately [LENGTH].',
      'Format the output with clear sections and headings.',
    ],
    examples: [
      'blog post',
      'article',
      'email',
      'report',
      'proposal',
      'social media post',
      'product description',
      'newsletter',
    ],
    tips: [
      'Be specific about your audience',
      'Include key points you want covered',
      'Specify desired length',
    ],
  },
  coding: {
    structure: [
      'Act as a senior [LANGUAGE] developer.',
      'I need you to [TASK] that [FUNCTIONALITY].',
      'Requirements:',
      '- [REQUIREMENT_1]',
      '- [REQUIREMENT_2]',
      'The code should be [QUALITY] and include comments.',
      'Please also provide [EXTRAS].',
    ],
    examples: [
      'function',
      'class',
      'API endpoint',
      'component',
      'script',
      'algorithm',
      'data structure',
      'test cases',
    ],
    tips: [
      'Mention the programming language',
      'List specific requirements',
      'Ask for comments and documentation',
    ],
  },
  analysis: {
    structure: [
      'Act as a [ROLE] analyst.',
      'Analyze [SUBJECT] focusing on [ASPECTS].',
      'Consider the following data/information: [DATA]',
      'Provide insights on:',
      '1. [INSIGHT_1]',
      '2. [INSIGHT_2]',
      'Include [DELIVERABLES] in your analysis.',
      'Format: structured report with conclusions.',
    ],
    examples: [
      'market trends',
      'data patterns',
      'competitor analysis',
      'SWOT analysis',
      'financial metrics',
      'user behavior',
    ],
    tips: [
      'Provide context and data',
      'Specify what insights you need',
      'Request specific deliverables',
    ],
  },
  creative: {
    structure: [
      'Act as a creative [ROLE].',
      'Create [TYPE] about/for [SUBJECT].',
      'Style: [STYLE]',
      'Mood/Tone: [MOOD]',
      'Include elements of: [ELEMENTS]',
      'Length/Format: [FORMAT]',
      'Make it [QUALITIES].',
    ],
    examples: [
      'story',
      'poem',
      'song lyrics',
      'slogan',
      'brand name',
      'character',
      'plot',
      'dialogue',
      'scene description',
    ],
    tips: [
      'Describe the style you want',
      'Specify mood and atmosphere',
      'Give creative constraints',
    ],
  },
  learning: {
    structure: [
      'Act as an expert [SUBJECT] teacher.',
      'Explain [TOPIC] to someone who [LEVEL].',
      'Use [METHOD] to make it clear.',
      'Include:',
      '- Key concepts',
      '- [EXAMPLES] examples',
      '- Common mistakes to avoid',
      'Check understanding with [ASSESSMENT].',
    ],
    examples: [
      'concept explanation',
      'step-by-step tutorial',
      'study guide',
      'practice problems',
      'summary',
      'cheat sheet',
    ],
    tips: [
      'Specify your current knowledge level',
      'Ask for examples and analogies',
      'Request practice exercises',
    ],
  },
}

function generatePrompt(task: TaskType, topic: string, tone: ToneType, details: string): string {
  const template = PROMPT_TEMPLATES[task]
  let prompt = template.structure.join('\n\n')

  switch (task) {
    case 'writing':
      prompt = prompt
        .replace('[ROLE]', 'professional content writer')
        .replace('[DOMAIN]', topic)
        .replace('[TYPE]', 'comprehensive content')
        .replace('[TOPIC]', topic)
        .replace('[AUDIENCE]', 'general readers')
        .replace('[TONE]', tone)
        .replace('[POINTS]', details || 'relevant key points')
        .replace('[LENGTH]', '500-800 words')
      break

    case 'coding':
      prompt = prompt
        .replace('[LANGUAGE]', 'full-stack')
        .replace('[TASK]', 'create code')
        .replace('[FUNCTIONALITY]', topic)
        .replace('[REQUIREMENT_1]', 'Clean and efficient')
        .replace('[REQUIREMENT_2]', details || 'Follow best practices')
        .replace('[QUALITY]', tone === 'professional' ? 'production-ready' : 'well-structured')
        .replace('[EXTRAS]', 'usage examples and edge cases')
      break

    case 'analysis':
      prompt = prompt
        .replace('[ROLE]', 'data')
        .replace('[SUBJECT]', topic)
        .replace('[ASPECTS]', details || 'key metrics and trends')
        .replace('[DATA]', 'available information')
        .replace('[INSIGHT_1]', 'Main findings')
        .replace('[INSIGHT_2]', 'Recommendations')
        .replace('[DELIVERABLES]', 'charts, metrics, and actionable insights')
      break

    case 'creative':
      prompt = prompt
        .replace('[ROLE]', 'writer')
        .replace('[TYPE]', 'creative content')
        .replace('[SUBJECT]', topic)
        .replace('[STYLE]', tone)
        .replace('[MOOD]', 'engaging and original')
        .replace('[ELEMENTS]', details || 'creativity and imagination')
        .replace('[FORMAT]', 'appropriate length')
        .replace('[QUALITIES]', 'unique, memorable, and impactful')
      break

    case 'learning':
      prompt = prompt
        .replace('[SUBJECT]', topic.split(' ')[0] || 'subject')
        .replace('[TOPIC]', topic)
        .replace('[LEVEL]', 'is a beginner')
        .replace('[METHOD]', 'simple examples and analogies')
        .replace('[EXAMPLES]', 'practical')
        .replace('[ASSESSMENT]', 'quiz questions')
      break
  }

  return prompt
}

export default function AiPromptGeneratorClient() {
  // ✅ Router for redirect
  const router = useRouter()

  // ✅ AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // ✅ Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    setIsRedirecting(true)
    handleDisagree()
    router.push('/')
  }

  // 既存のstate
  const [taskType, setTaskType] = useState<TaskType>('writing')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<ToneType>('professional')
  const [details, setDetails] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // ✅ AI機能用のstate
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [testResult, setTestResult] = useState('')
  const [analysisTips, setAnalysisTips] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleGenerate = () => {
    if (!topic.trim()) return

    const prompt = generatePrompt(taskType, topic, tone, details)
    setGeneratedPrompt(prompt)
    
    // ✅ AI結果をクリア
    setEnhancedPrompt('')
    setTestResult('')
    setAnalysisTips('')
  }

  const handleCopy = async () => {
    if (!generatedPrompt) return

    await navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  const handleRegenerate = () => {
    if (topic) {
      const variations = [
        `Please provide a detailed response.\n\n${generatePrompt(taskType, topic, tone, details)}`,
        `${generatePrompt(taskType, topic, tone, details)}\n\nBe thorough and comprehensive.`,
        `Context: I need help with ${topic}.\n\n${generatePrompt(taskType, topic, tone, details)}`,
      ]
      const randomVariation = variations[Math.floor(Math.random() * variations.length)]
      setGeneratedPrompt(randomVariation)
    }
  }

  const handleClear = () => {
    setTopic('')
    setDetails('')
    setGeneratedPrompt('')
    setShowDetails(false)
    setEnhancedPrompt('')
    setTestResult('')
    setAnalysisTips('')
  }

  // ✅ AI機能: プロンプト強化
  const handleEnhance = async () => {
    if (!generatedPrompt || !hasAgreed) return

    setIsEnhancing(true)
    try {
      const res = await fetch('/api/ai-prompt-generator/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatedPrompt }),
      })

      const data = await res.json()
      setEnhancedPrompt(data.enhancedPrompt)
    } catch (error) {
      console.error('Enhance failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  // ✅ AI機能: プロンプトテスト
  const handleTest = async () => {
    if (!generatedPrompt || !hasAgreed) return

    setIsTesting(true)
    try {
      const res = await fetch('/api/ai-prompt-generator/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatedPrompt }),
      })

      const data = await res.json()
      setTestResult(data.result)
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setIsTesting(false)
    }
  }

  // ✅ AI機能: 改善提案
  const handleAnalyze = async () => {
    if (!generatedPrompt || !hasAgreed) return

    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/ai-prompt-generator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatedPrompt }),
      })

      const data = await res.json()
      setAnalysisTips(data.tips)
    } catch (error) {
      console.error('Analyze failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getExampleTopics = () => {
    switch (taskType) {
      case 'writing':
        return ['blog about AI', 'email to team', 'product description']
      case 'coding':
        return ['login form', 'API endpoint', 'data sorting']
      case 'analysis':
        return ['sales data', 'user feedback', 'market trends']
      case 'creative':
        return ['short story', 'brand name', 'character idea']
      case 'learning':
        return ['explain React', 'Python basics', 'blockchain']
      default:
        return []
    }
  }

  // ✅ Loading state
  if (isChecking || isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex gap-2">
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ✅ AI Tool Warning Modal */}
      <AIToolWarningModal
        isOpen={showWarning}
        onAgree={handleAgree}
        onDisagree={handleCustomDisagree}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        {/* Main Input Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
          {/* Task Type Pills */}
          <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:gap-2 mb-6">
            {Object.entries(TASK_ICONS).map(([key, icon]) => (
              <button
                key={key}
                onClick={() => setTaskType(key as TaskType)}
                className={`min-h-[48px] px-2 sm:px-4 py-2 rounded-xl sm:rounded-full font-medium transition-all flex items-center justify-center sm:justify-start gap-2 ${
                  taskType === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                aria-label={TASK_LABELS[key as TaskType]}
              >
                <span className="flex-shrink-0">{icon}</span>
                <span className="hidden sm:inline capitalize text-sm">{key}</span>
              </button>
            ))}
          </div>

          {/* Main Topic Input */}
          <div className="mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you need help with?"
              className="w-full px-4 sm:px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base sm:text-lg
                       placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors
                       hover:bg-white/15 min-h-[56px]"
            />

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2 mt-3">
              {getExampleTopics().map((example, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(example)}
                  className="text-xs sm:text-sm px-3 py-2 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 
                          hover:text-white transition-all min-h-[36px]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2">
              {(['professional', 'casual', 'technical', 'friendly', 'academic'] as ToneType[]).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-lg capitalize text-sm transition-all ${
                      tone === t
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Optional Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 text-sm hover:text-white transition-colors mb-3 min-h-[44px] flex items-center"
          >
            <span className="mr-1">{showDetails ? '−' : '+'}</span>
            {showDetails ? 'Hide' : 'Add'} details
          </button>

          {showDetails && (
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Any specific requirements..."
              rows={3}
              className="w-full px-4 py-3 mb-4 bg-white/5 border border-white/10 rounded-xl text-white text-base
                      placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
            />
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl 
                    font-medium text-base sm:text-lg hover:opacity-90 transition-all disabled:opacity-50 
                    disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[56px] shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Generate Prompt
          </button>
        </div>

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">Your AI Prompt</span>
              <button
                onClick={handleRegenerate}
                className="text-gray-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Regenerate"
                aria-label="Regenerate prompt"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black/30 rounded-xl p-3 sm:p-4 mb-4 overflow-x-auto">
              <pre className="text-white whitespace-pre-wrap text-xs sm:text-sm font-mono break-words">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <button
                onClick={handleCopy}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="sm:flex-shrink-0 px-4 sm:px-6 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                        hover:text-white transition-all min-h-[48px]"
              >
                Clear
              </button>
            </div>

            {/* ✅ AI機能ボタン（承諾後のみ表示） */}
            {hasAgreed && (
              <>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <p className="text-sm font-semibold text-white">AI-Powered Features</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={handleEnhance}
                      disabled={isEnhancing}
                      className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 
                             transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Enhance
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleTest}
                      disabled={isTesting}
                      className="px-4 py-3 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 
                             transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Test
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-4 py-3 bg-pink-500/20 text-pink-300 rounded-lg hover:bg-pink-500/30 
                             transition-all flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4" />
                          Tips
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ✅ 強化されたプロンプト */}
                {enhancedPrompt && (
                  <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-300">
                          Enhanced Prompt
                        </span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(enhancedPrompt)}
                        className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/20 rounded"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="text-white whitespace-pre-wrap text-xs sm:text-sm font-mono break-words">
                      {enhancedPrompt}
                    </pre>
                  </div>
                )}

                {/* ✅ テスト結果 */}
                {testResult && (
                  <div className="mt-4 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-300">Test Result</span>
                    </div>
                    <p className="text-white text-sm whitespace-pre-wrap">{testResult}</p>
                  </div>
                )}

                {/* ✅ 改善提案 */}
                {analysisTips && (
                  <div className="mt-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-pink-400" />
                      <span className="text-sm font-semibold text-pink-300">Improvement Tips</span>
                    </div>
                    <div className="text-white text-sm whitespace-pre-wrap">{analysisTips}</div>
                  </div>
                )}
              </>
            )}

            {/* ✅ 未承諾の場合の案内 */}
            {!hasAgreed && (
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-300">
                      AI-powered features (Enhance, Test, Tips) are available after agreeing to AI
                      tool terms. Reload the page to see the agreement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}