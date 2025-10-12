// app/tools/competitive-analyzer/components/CompetitiveAnalyzerClient.tsx

'use client'

import { useState, useCallback } from 'react'
import {
  Search,
  TrendingUp,
  Lightbulb,
  Download,
  Copy,
  Check,
  Shield,
  Zap,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface AnalysisResult {
  competitors: Array<{
    name: string
    strengths: string[]
    weaknesses: string[]
  }>
  marketGaps: string[]
  productIdeas: string[]
  summary: string
}

export default function CompetitiveAnalyzerClient() {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('saas')
  const [targetMarket, setTargetMarket] = useState('')
  const [features, setFeatures] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dailyUsage, setDailyUsage] = useState(0)
  const MAX_DAILY = 3

  // Analyze competitors
  const handleAnalyze = useCallback(async () => {
    if (!productName || !targetMarket) {
      setError('Please fill in all required fields')
      return
    }

    if (dailyUsage >= MAX_DAILY) {
      setError(`Daily limit reached (${MAX_DAILY} analyses). Try again tomorrow!`)
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      // Simulated API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock result (replace with actual API response)
      const mockResult: AnalysisResult = {
        competitors: [
          {
            name: 'Competitor A',
            strengths: ['Market leader', 'Strong brand', 'Good UX'],
            weaknesses: ['Expensive', 'Limited features', 'Poor support'],
          },
          {
            name: 'Competitor B',
            strengths: ['Affordable', 'Many integrations', 'Fast'],
            weaknesses: ['Complex UI', 'Limited docs', 'No mobile app'],
          },
        ],
        marketGaps: [
          'No solution for small businesses under 10 employees',
          'Lack of AI-powered automation in this space',
          'Missing localization for Asian markets',
        ],
        productIdeas: [
          'Freemium model with AI assistant',
          'Mobile-first approach with offline mode',
          'Vertical solution for specific industry',
        ],
        summary:
          'The market shows opportunity for a streamlined, affordable solution targeting SMBs with AI-powered features.',
      }

      setResult(mockResult)
      setDailyUsage((prev) => prev + 1)
    } catch (err) {
      setError('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [productName, targetMarket, dailyUsage])

  // Copy results to clipboard
  const handleCopy = useCallback(() => {
    if (!result) return

    const text = `
COMPETITIVE ANALYSIS REPORT

Product: ${productName}
Category: ${category}
Target Market: ${targetMarket}

COMPETITORS:
${result.competitors
  .map(
    (c) => `
${c.name}
Strengths: ${c.strengths.join(', ')}
Weaknesses: ${c.weaknesses.join(', ')}
`
  )
  .join('\n')}

MARKET GAPS:
${result.marketGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

PRODUCT IDEAS:
${result.productIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

SUMMARY:
${result.summary}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Vibration feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }, [result, productName, category, targetMarket])

  // Download as JSON
  const handleDownload = useCallback(() => {
    if (!result) return

    const data = {
      metadata: {
        product: productName,
        category,
        targetMarket,
        analyzedAt: new Date().toISOString(),
      },
      analysis: result,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `competitive-analysis-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [result, productName, category, targetMarket])

  // Clear all
  const handleClear = () => {
    setProductName('')
    setCategory('saas')
    setTargetMarket('')
    setFeatures('')
    setResult(null)
    setError('')
  }

  // Load sample
  const loadSample = () => {
    setProductName('TaskFlow Pro')
    setCategory('productivity')
    setTargetMarket('Remote teams and freelancers')
    setFeatures('Task management, time tracking, team collaboration')
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      {/* Usage Tracker */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 sm:p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-white">AI Analysis Credits</span>
          </div>
          <span className="text-xs sm:text-sm text-yellow-400 font-medium">
            {MAX_DAILY - dailyUsage}/{MAX_DAILY} left
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Competitive Analysis</h2>
          <p className="text-gray-400 text-xs sm:text-sm">AI-powered market research in seconds</p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="p-4 bg-white/5 rounded-xl border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-white font-semibold text-sm flex-1">Input Details</h3>
              <button
                onClick={loadSample}
                className="px-3 py-1.5 text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg transition-all min-h-[32px]"
              >
                Sample
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., TaskFlow Pro"
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px]
                             [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="productivity">Productivity</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthtech">Healthtech</option>
                  <option value="edtech">Edtech</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Target Market *</label>
                <input
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="e.g., Remote teams and freelancers"
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px]"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Key Features (optional)</label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="List main features, separated by commas"
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm sm:text-base h-20 resize-none"
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || dailyUsage >= MAX_DAILY || !productName || !targetMarket}
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base ${
                  isAnalyzing || dailyUsage >= MAX_DAILY || !productName || !targetMarket
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 shadow-lg'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Analyze Competition
                  </>
                )}
              </button>

              {/* Clear button */}
              {(productName || targetMarket || features) && (
                <button
                  onClick={handleClear}
                  className="w-full py-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all text-sm min-h-[44px]"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="p-4 bg-white/5 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <h3 className="text-white font-semibold text-sm truncate">Analysis Results</h3>
              </div>
              {result && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1 min-h-[36px] ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-400/50'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-all flex items-center gap-1 border border-purple-400/50 min-h-[36px]"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">JSON</span>
                  </button>
                </div>
              )}
            </div>

            {!result ? (
              <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center text-gray-500 text-sm">
                {isAnalyzing ? (
                  <div className="text-center px-4">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
                    <p className="text-white text-sm sm:text-base">Analyzing market data...</p>
                    <p className="text-xs mt-2">This usually takes 3-5 seconds</p>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm sm:text-base">Your analysis will appear here</p>
                    <p className="text-xs mt-2">Fill in the details and click Analyze</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto space-y-4 text-sm">
                {/* Competitors */}
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm">Competitors</h4>
                  {result.competitors.map((comp, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-3 mb-2">
                      <h5 className="text-cyan-400 font-medium mb-1.5 text-sm">{comp.name}</h5>
                      <p className="text-green-400 text-xs mb-1">
                        <span className="font-medium">Strengths:</span> {comp.strengths.join(', ')}
                      </p>
                      <p className="text-red-400 text-xs">
                        <span className="font-medium">Weaknesses:</span> {comp.weaknesses.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Market Gaps */}
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm">Market Gaps</h4>
                  <ul className="space-y-1.5">
                    {result.marketGaps.map((gap, i) => (
                      <li key={i} className="text-gray-300 text-xs flex items-start">
                        <span className="text-yellow-400 mr-2 flex-shrink-0">•</span>
                        <span className="flex-1">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product Ideas */}
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm">Product Ideas</h4>
                  <ul className="space-y-1.5">
                    {result.productIdeas.map((idea, i) => (
                      <li key={i} className="text-gray-300 text-xs flex items-start">
                        <span className="mr-2 flex-shrink-0">💡</span>
                        <span className="flex-1">{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
                  <h4 className="text-white font-medium mb-1.5 text-sm">Summary</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">{result.summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="text-center">Your data is processed securely and never stored</span>
        </div>
      </div>

      {/* Tips */}
      <div className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
        <span>💡</span>
        <span>Pro tip: Be specific about your target market for better analysis</span>
      </div>
    </div>
  )
}