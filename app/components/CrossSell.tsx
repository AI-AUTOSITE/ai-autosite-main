// app/components/CrossSell.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles, Users, TrendingUp, Zap } from 'lucide-react'
import type { Tool } from '../lib/categories'
import { TOOLS } from '../lib/categories'

interface RelatedTool extends Tool {
  correlationScore: number
  matchReasons: string[]
}

// 関連性スコアの計算ロジック
const calculateCorrelation = (currentTool: Tool, targetTool: Tool): { score: number; reasons: string[] } => {
  let score = 0
  const reasons: string[] = []
  
  // 1. 同じカテゴリ（+40点）
  if (currentTool.category === targetTool.category) {
    score += 40
    reasons.push('Same category')
  }
  
  // 2. タグの重複（各タグ+15点、最大45点）
  const currentTags = currentTool.tags || []
  const targetTags = targetTool.tags || []
  const sharedTags = currentTags.filter(tag => targetTags.includes(tag))
  if (sharedTags.length > 0) {
    score += Math.min(sharedTags.length * 15, 45)
    reasons.push(`${sharedTags.length} shared tags`)
  }
  
  // 3. 処理タイプの一致（+20点）
  if (currentTool.dataProcessing === targetTool.dataProcessing) {
    score += 20
    reasons.push('Similar processing')
  }
  
  // 4. API要件の一致（+10点）
  if (currentTool.apiRequired === targetTool.apiRequired) {
    score += 10
  }
  
  // 5. 難易度の近さ（+15点）
  const difficultyMap: Record<string, number> = {
    'Instant': 1,
    'Simple': 2,
    'Intermediate': 3,
    'Advanced': 4
  }
  const currentDiff = difficultyMap[currentTool.difficulty || 'Simple']
  const targetDiff = difficultyMap[targetTool.difficulty || 'Simple']
  if (Math.abs(currentDiff - targetDiff) <= 1) {
    score += 15
  }
  
  // 6. 補完関係の検出（特定のパターン）
  const complementaryPairs: Record<string, string[]> = {
    'pdf-tools': ['ai-summarizer', 'pdf-summarizer', 'pdf-to-data'],
    'ai-summarizer': ['pdf-tools', 'text-case'],
    'json-format': ['json-csv', 'api-testing'],
    'json-csv': ['json-format', 'code-reader'],
    'text-case': ['ai-summarizer', 'text-counter'],
  }
  
  if (complementaryPairs[currentTool.id]?.includes(targetTool.id)) {
    score += 25
    reasons.push('Complementary tools')
  }
  
  // 7. 人気度ボーナス（+5点）
  if (targetTool.featured) {
    score += 5
    reasons.push('Popular')
  }
  
  // 8. 新しいツールボーナス（+3点）
  if (targetTool.new) {
    score += 3
    reasons.push('New')
  }
  
  return { score: Math.min(score, 100), reasons }
}

export function PeopleAlsoUse({ currentToolId }: { currentToolId: string }) {
  const [relatedTools, setRelatedTools] = useState<RelatedTool[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // セッション内の閲覧履歴を管理
    const visited = JSON.parse(sessionStorage.getItem('visitedTools') || '[]')
    if (!visited.includes(currentToolId)) {
      visited.push(currentToolId)
      sessionStorage.setItem('visitedTools', JSON.stringify(visited))
    }
    
    // 動的に関連ツールを計算
    const calculateRelatedTools = () => {
      const currentTool = TOOLS.find(t => t.id === currentToolId)
      if (!currentTool) return []
      
      // すべてのツールとの関連性を計算
      const toolsWithScores = TOOLS
        .filter(t => t.id !== currentToolId && t.status === 'live')
        .map(tool => {
          const { score, reasons } = calculateCorrelation(currentTool, tool)
          
          return {
            ...tool,
            correlationScore: score,
            matchReasons: reasons
          }
        })
        .filter(t => t.correlationScore > 30) // 30%以上の関連性のみ
        .sort((a, b) => b.correlationScore - a.correlationScore)
        .slice(0, 3)
      
      return toolsWithScores
    }
    
    // データ取得をシミュレート
    setTimeout(() => {
      setRelatedTools(calculateRelatedTools())
      setLoading(false)
    }, 200)
  }, [currentToolId])
  
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          People also use
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-700/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (relatedTools.length === 0) return null
  
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
        <Users className="w-5 h-5 text-cyan-400" />
        People also use
        <span className="text-xs text-gray-400 ml-auto">
          Dynamically matched
        </span>
      </h3>
      
      <div className="space-y-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.url}
            className="block group hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {tool.description}
                  </p>
                  {/* マッチ理由の表示 */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.matchReasons.slice(0, 2).map((reason, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400/80 rounded"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {tool.correlationScore >= 70 ? (
                    <Zap className="w-3 h-3 text-yellow-400" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  )}
                  <span className={`text-sm font-semibold ${
                    tool.correlationScore >= 70 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {tool.correlationScore}%
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Explore all tools
        </Link>
      </div>
    </div>
  )
}

// 使用パターン分析コンポーネント
export function UsagePatterns({ toolId }: { toolId: string }) {
  const [patterns, setPatterns] = useState<any>(null)
  
  useEffect(() => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    
    // ツールの特性から使用パターンを動的に生成
    const tool = TOOLS.find(t => t.id === toolId)
    if (!tool) return
    
    // カテゴリベースのワークフロー生成
    const generateWorkflows = () => {
      const workflows: string[] = []
      
      if (tool.category === 'quick-tools') {
        workflows.push('Input → Process → Result')
        workflows.push('Upload → Transform → Download')
      } else if (tool.category === 'dev-tools') {
        workflows.push('Code → Analyze → Optimize')
        workflows.push('Debug → Test → Deploy')
      } else if (tool.category === 'creative') {
        workflows.push('Design → Edit → Export')
        workflows.push('Create → Refine → Publish')
      } else if (tool.category === 'business') {
        workflows.push('Input → AI Process → Review')
        workflows.push('Generate → Edit → Finalize')
      } else {
        workflows.push('Select → Transform → Save')
        workflows.push('Upload → Process → Share')
      }
      
      if (tool.apiRequired) {
        workflows.push('Connect → Process → Output')
      }
      
      return workflows.slice(0, 3)
    }
    
    // 平均使用時間を難易度から推定
    const avgTimeMap: Record<string, string> = {
      'Instant': '30 seconds',
      'Simple': '2-3 minutes',
      'Intermediate': '5-7 minutes',
      'Advanced': '10-15 minutes'
    }
    
    setPatterns({
      timeOfDay,
      commonWorkflows: generateWorkflows(),
      peakHours: tool.featured ? '9-11 AM, 2-4 PM' : '2-4 PM UTC',
      averageTime: avgTimeMap[tool.difficulty || 'Simple']
    })
  }, [toolId])
  
  if (!patterns) return null
  
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-cyan-400" />
        Usage Insights
      </h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Peak usage:</span>
          <span className="text-gray-300">{patterns.peakHours}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Avg. session:</span>
          <span className="text-gray-300">{patterns.averageTime}</span>
        </div>
        <div className="mt-3">
          <p className="text-gray-400 mb-2">Common workflows:</p>
          <div className="space-y-1">
            {patterns.commonWorkflows.map((flow: string, i: number) => (
              <div key={i} className="text-gray-500 text-xs flex items-start gap-1">
                <span className="text-cyan-400 mt-0.5">→</span>
                <span>{flow}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// デフォルトエクスポート（互換性のため）
export default PeopleAlsoUse