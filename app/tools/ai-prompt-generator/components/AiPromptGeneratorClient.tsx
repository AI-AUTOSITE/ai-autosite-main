'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw, Code, PenTool, BarChart3, Lightbulb, Zap } from 'lucide-react'

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
  learning: <Zap className="w-4 h-4" />
}

const PROMPT_TEMPLATES: Record<TaskType, PromptTemplate> = {
  writing: {
    structure: [
      'Act as a [ROLE] with expertise in [DOMAIN].',
      'I need you to write [TYPE] about [TOPIC].',
      'The target audience is [AUDIENCE].',
      'The tone should be [TONE].',
      'Key points to include: [POINTS]',
      'Length: approximately [LENGTH].',
      'Format the output with clear sections and headings.'
    ],
    examples: [
      'blog post', 'article', 'email', 'report', 'proposal',
      'social media post', 'product description', 'newsletter'
    ],
    tips: [
      'Be specific about your audience',
      'Include key points you want covered',
      'Specify desired length'
    ]
  },
  coding: {
    structure: [
      'Act as a senior [LANGUAGE] developer.',
      'I need you to [TASK] that [FUNCTIONALITY].',
      'Requirements:',
      '- [REQUIREMENT_1]',
      '- [REQUIREMENT_2]',
      'The code should be [QUALITY] and include comments.',
      'Please also provide [EXTRAS].'
    ],
    examples: [
      'function', 'class', 'API endpoint', 'component', 'script',
      'algorithm', 'data structure', 'test cases'
    ],
    tips: [
      'Mention the programming language',
      'List specific requirements',
      'Ask for comments and documentation'
    ]
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
      'Format: structured report with conclusions.'
    ],
    examples: [
      'market trends', 'data patterns', 'competitor analysis',
      'SWOT analysis', 'financial metrics', 'user behavior'
    ],
    tips: [
      'Provide context and data',
      'Specify what insights you need',
      'Request specific deliverables'
    ]
  },
  creative: {
    structure: [
      'Act as a creative [ROLE].',
      'Create [TYPE] about/for [SUBJECT].',
      'Style: [STYLE]',
      'Mood/Tone: [MOOD]',
      'Include elements of: [ELEMENTS]',
      'Length/Format: [FORMAT]',
      'Make it [QUALITIES].'
    ],
    examples: [
      'story', 'poem', 'song lyrics', 'slogan', 'brand name',
      'character', 'plot', 'dialogue', 'scene description'
    ],
    tips: [
      'Describe the style you want',
      'Specify mood and atmosphere',
      'Give creative constraints'
    ]
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
      'Check understanding with [ASSESSMENT].'
    ],
    examples: [
      'concept explanation', 'step-by-step tutorial', 'study guide',
      'practice problems', 'summary', 'cheat sheet'
    ],
    tips: [
      'Specify your current knowledge level',
      'Ask for examples and analogies',
      'Request practice exercises'
    ]
  }
}

function generatePrompt(task: TaskType, topic: string, tone: ToneType, details: string): string {
  const template = PROMPT_TEMPLATES[task]
  let prompt = template.structure.join('\n\n')
  
  // Replace placeholders based on task type
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
  const [taskType, setTaskType] = useState<TaskType>('writing')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<ToneType>('professional')
  const [details, setDetails] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleGenerate = () => {
    if (!topic.trim()) return
    
    const prompt = generatePrompt(taskType, topic, tone, details)
    setGeneratedPrompt(prompt)
  }

  const handleCopy = async () => {
    if (!generatedPrompt) return
    
    await navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    if (topic) {
      const variations = [
        `Please provide a detailed response.\n\n${generatePrompt(taskType, topic, tone, details)}`,
        `${generatePrompt(taskType, topic, tone, details)}\n\nBe thorough and comprehensive.`,
        `Context: I need help with ${topic}.\n\n${generatePrompt(taskType, topic, tone, details)}`
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">

      {/* Main Input Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        
        {/* Task Type Pills - Compact */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TASK_ICONS).map(([key, icon]) => (
            <button
              key={key}
              onClick={() => setTaskType(key as TaskType)}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                taskType === key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {icon}
              <span className="capitalize text-sm">{key}</span>
            </button>
          ))}
        </div>

        {/* Main Topic Input - Large and Prominent */}
        <div className="mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you need help with?"
            className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                       placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors
                       hover:bg-white/15"
          />
          
          {/* Quick Examples - Inline */}
          <div className="flex flex-wrap gap-2 mt-3">
            {getExampleTopics().map((example, i) => (
              <button
                key={i}
                onClick={() => setTopic(example)}
                className="text-xs px-3 py-1.5 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 
                          hover:text-white transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selection - Simplified */}
        <div className="flex gap-2 mb-4">
          {(['professional', 'casual', 'technical', 'friendly', 'academic'] as ToneType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded-lg capitalize text-sm transition-all ${
                tone === t
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Optional Details - Collapsible */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 text-sm hover:text-white transition-colors mb-3"
        >
          {showDetails ? '− Hide' : '+ Add'} details
        </button>
        
        {showDetails && (
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Any specific requirements..."
            rows={2}
            className="w-full px-4 py-3 mb-4 bg-white/5 border border-white/10 rounded-xl text-white 
                      placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
          />
        )}

        {/* Generate Button - Large and Prominent */}
        <button
          onClick={handleGenerate}
          disabled={!topic.trim()}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl 
                    font-medium text-lg hover:opacity-90 transition-all disabled:opacity-50 
                    flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Prompt
        </button>
      </div>

      {/* Generated Prompt - Clean Display */}
      {generatedPrompt && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Your AI Prompt</span>
            <button
              onClick={handleRegenerate}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <pre className="text-white whitespace-pre-wrap text-sm font-mono">
              {generatedPrompt}
            </pre>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
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
              className="px-4 py-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                        hover:text-white transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}