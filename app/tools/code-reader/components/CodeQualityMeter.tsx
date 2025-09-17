// components/CodeQualityMeter.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Sparkles
} from 'lucide-react'

interface QualityMetrics {
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  trend: 'improving' | 'stable' | 'declining'
  metrics: {
    complexity: number
    maintainability: number
    reusability: number
    testCoverage: number
  }
  issues: {
    critical: number
    warning: number
    info: number
  }
  recommendations: string[]
}

interface CodeQualityMeterProps {
  fileStructure: any
  allFiles: Record<string, string>
  errors?: any[]
  showDetails?: boolean
  variant?: 'compact' | 'full' | 'widget'
  onImprove?: () => void
}

export default function CodeQualityMeter({
  fileStructure,
  allFiles,
  errors = [],
  showDetails = true,
  variant = 'full',
  onImprove
}: CodeQualityMeterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousScore, setPreviousScore] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [celebrationMode, setCelebrationMode] = useState(false)

  // Calculate quality metrics
  const metrics = useMemo(() => calculateQualityMetrics(fileStructure, allFiles, errors), [
    fileStructure,
    allFiles,
    errors
  ])

  // Track score changes for animation
  useEffect(() => {
    if (previousScore !== null && metrics.score !== previousScore) {
      setIsAnimating(true)
      
      // Celebration if score improved significantly
      if (metrics.score - previousScore >= 10) {
        setCelebrationMode(true)
        setTimeout(() => setCelebrationMode(false), 3000)
      }
      
      setTimeout(() => setIsAnimating(false), 1000)
    }
    setPreviousScore(metrics.score)
  }, [metrics.score, previousScore])

  // Compact Widget Variant
  if (variant === 'widget') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg border border-white/10">
        <div className={`text-2xl font-bold ${getGradeColor(metrics.grade)}`}>
          {metrics.grade}
        </div>
        <div className="text-xs text-gray-400">
          Code Quality
        </div>
        {metrics.trend === 'improving' && (
          <TrendingUp className="text-green-400" size={14} />
        )}
        {metrics.trend === 'declining' && (
          <TrendingDown className="text-red-400" size={14} />
        )}
      </div>
    )
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="text-purple-400" size={16} />
            Code Quality
          </h3>
          <div className={`text-xl font-bold ${getGradeColor(metrics.grade)} ${isAnimating ? 'animate-pulse' : ''}`}>
            {metrics.grade}
          </div>
        </div>
        
        {/* Mini Progress Bars */}
        <div className="space-y-2">
          {Object.entries(metrics.metrics).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getMetricColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {value}%
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {metrics.recommendations.length > 0 && (
          <button
            onClick={onImprove}
            className="mt-3 w-full py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all text-xs font-medium flex items-center justify-center gap-1"
          >
            <Sparkles size={12} />
            {metrics.recommendations.length} Improvements Available
          </button>
        )}
      </div>
    )
  }

  // Full Variant (default)
  return (
    <div className={`bg-gradient-to-br from-slate-900 to-purple-900/30 rounded-2xl border border-purple-500/20 overflow-hidden ${celebrationMode ? 'animate-bounce' : ''}`}>
      {/* Header with Score */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="text-purple-400" />
              Real-Time Code Quality
            </h2>
            <p className="text-sm text-gray-400">
              AI-powered analysis of your codebase health
            </p>
          </div>
          
          {/* Grade Display */}
          <div className="text-center">
            <div className={`text-5xl font-bold ${getGradeColor(metrics.grade)} ${isAnimating ? 'animate-pulse scale-110' : ''} transition-all`}>
              {metrics.grade}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Score: {metrics.score}/100
            </div>
            {metrics.trend !== 'stable' && (
              <div className="flex items-center justify-center gap-1 mt-2">
                {metrics.trend === 'improving' ? (
                  <>
                    <TrendingUp className="text-green-400" size={14} />
                    <span className="text-xs text-green-400">Improving</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-red-400" size={14} />
                    <span className="text-xs text-red-400">Needs Attention</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Celebration Mode */}
        {celebrationMode && (
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30 flex items-center gap-2">
            <Award className="text-green-400" />
            <span className="text-green-400 font-medium">
              Great job! Your code quality improved significantly! 🎉
            </span>
          </div>
        )}
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="p-6 space-y-6">
          {/* Metric Bars */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics.metrics).map(([key, value]) => (
              <div 
                key={key}
                className="relative"
                onMouseEnter={() => setShowTooltip(key)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-gray-400">
                    {value}%
                  </span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${getMetricColor(value)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                
                {/* Tooltip */}
                {showTooltip === key && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 p-2 bg-slate-800 rounded-lg text-xs text-gray-300 z-10">
                    {getMetricDescription(key)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Issues Summary */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">
                  {metrics.issues.critical} Critical
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm text-gray-300">
                  {metrics.issues.warning} Warnings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-300">
                  {metrics.issues.info} Info
                </span>
              </div>
            </div>
            
            {metrics.issues.critical > 0 && (
              <AlertTriangle className="text-red-400 animate-pulse" size={20} />
            )}
            {metrics.issues.critical === 0 && metrics.issues.warning === 0 && (
              <CheckCircle className="text-green-400" size={20} />
            )}
          </div>

          {/* AI Recommendations */}
          {metrics.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={16} />
                AI Recommendations
              </h3>
              <div className="space-y-2">
                {metrics.recommendations.slice(0, 3).map((rec, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer"
                    onClick={onImprove}
                  >
                    <Target className="text-purple-400 mt-0.5" size={16} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{rec}</p>
                    </div>
                    <Zap className="text-yellow-400" size={14} />
                  </div>
                ))}
              </div>
              
              {metrics.recommendations.length > 3 && (
                <button
                  onClick={onImprove}
                  className="w-full py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all text-sm font-medium"
                >
                  View All {metrics.recommendations.length} Recommendations
                </button>
              )}
            </div>
          )}

          {/* Perfect Score Message */}
          {metrics.score >= 90 && (
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-3">
                <Award className="text-green-400" size={24} />
                <div>
                  <h4 className="font-semibold text-green-400">Excellent Code Quality!</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Your code meets professional standards. Keep up the great work!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper Functions
function calculateQualityMetrics(
  fileStructure: any, 
  allFiles: Record<string, string>, 
  errors: any[]
): QualityMetrics {
  // Basic calculation logic
  const fileCount = Object.keys(allFiles).length
  const errorCount = errors.length
  
  // Calculate individual metrics
  const complexity = Math.max(0, 100 - (errorCount * 5))
  const maintainability = Math.max(0, 85 - (errors.filter(e => e.severity === 'error').length * 10))
  const reusability = fileCount > 0 ? Math.min(100, 70 + (fileCount / 2)) : 0
  const testCoverage = Math.random() * 30 + 40 // Placeholder - would need actual test analysis
  
  const avgScore = Math.round((complexity + maintainability + reusability + testCoverage) / 4)
  
  // Determine grade
  let grade: QualityMetrics['grade'] = 'D'
  if (avgScore >= 90) grade = 'A+'
  else if (avgScore >= 80) grade = 'A'
  else if (avgScore >= 70) grade = 'B+'
  else if (avgScore >= 60) grade = 'B'
  else if (avgScore >= 50) grade = 'C+'
  else if (avgScore >= 40) grade = 'C'
  
  // Generate recommendations
  const recommendations: string[] = []
  if (complexity < 70) recommendations.push('Reduce code complexity by extracting functions')
  if (maintainability < 70) recommendations.push('Improve maintainability with better naming and structure')
  if (reusability < 70) recommendations.push('Create reusable components to reduce duplication')
  if (testCoverage < 60) recommendations.push('Add unit tests to improve coverage')
  
  return {
    score: avgScore,
    grade,
    trend: avgScore > 70 ? 'improving' : avgScore < 50 ? 'declining' : 'stable',
    metrics: {
      complexity: Math.round(complexity),
      maintainability: Math.round(maintainability),
      reusability: Math.round(reusability),
      testCoverage: Math.round(testCoverage)
    },
    issues: {
      critical: errors.filter(e => e.severity === 'error').length,
      warning: errors.filter(e => e.severity === 'warning').length,
      info: errors.filter(e => e.severity === 'info').length
    },
    recommendations
  }
}

function getGradeColor(grade: QualityMetrics['grade']): string {
  const colors = {
    'A+': 'text-green-400',
    'A': 'text-green-400',
    'B+': 'text-blue-400',
    'B': 'text-blue-400',
    'C+': 'text-yellow-400',
    'C': 'text-orange-400',
    'D': 'text-red-400'
  }
  return colors[grade] || 'text-gray-400'
}

function getMetricColor(value: number): string {
  if (value >= 80) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (value >= 60) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  if (value >= 40) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
}

function getMetricDescription(key: string): string {
  const descriptions = {
    complexity: 'Measures how complex your code structure is. Lower is better.',
    maintainability: 'How easy it is to update and maintain your code.',
    reusability: 'How well your code can be reused across the project.',
    testCoverage: 'Percentage of code covered by tests.'
  }
  return descriptions[key] || 'Code quality metric'
}