// components/SmartFileSelector.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  FileCode,
  Brain,
  Sparkles,
  Package,
  GitBranch,
  AlertCircle,
  Check,
  X,
  Info,
  Zap,
  Target,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react'

interface FileSelection {
  path: string
  name: string
  size: number
  importance: 'critical' | 'high' | 'medium' | 'low'
  reason: string
  tokens: number
  selected: boolean
}

interface SelectionPreset {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  selector: (files: FileSelection[]) => string[]
  maxTokens: number
}

interface SmartFileSelectorProps {
  fileStructure: any
  allFiles: Record<string, string>
  targetFile?: string | null
  maxTokens?: number
  onSelectionChange: (selectedFiles: string[], estimatedTokens: number) => void
  purpose?: 'refactor' | 'debug' | 'review' | 'explain'
}

export default function SmartFileSelector({
  fileStructure,
  allFiles,
  targetFile,
  maxTokens = 4000,
  onSelectionChange,
  purpose = 'refactor'
}: SmartFileSelectorProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [tokenBudget, setTokenBudget] = useState(maxTokens)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activePreset, setActivePreset] = useState<string>('smart')
  const [showTokenWarning, setShowTokenWarning] = useState(false)

  // Process files and calculate importance
  const processedFiles = useMemo(() => {
    const files: FileSelection[] = []
    
    Object.entries(fileStructure).forEach(([dir, dirFiles]: [string, any]) => {
      dirFiles.forEach((file: any) => {
        const content = allFiles[file.path] || ''
        const tokens = Math.ceil(content.length / 4) // Rough estimate
        
        // Calculate importance based on various factors
        const importance = calculateImportance(file, targetFile)
        const reason = getSelectionReason(file, targetFile, purpose)
        
        files.push({
          path: file.path,
          name: file.name,
          size: file.size,
          importance,
          reason,
          tokens,
          selected: false
        })
      })
    })
    
    return files.sort((a, b) => {
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return importanceOrder[a.importance] - importanceOrder[b.importance]
    })
  }, [fileStructure, allFiles, targetFile, purpose])

  // Presets for different use cases
  const presets: SelectionPreset[] = [
    {
      id: 'smart',
      name: 'Smart Selection',
      description: 'AI picks the most relevant files',
      icon: <Brain className="text-purple-400" size={16} />,
      selector: (files) => smartSelection(files, targetFile, purpose, maxTokens),
      maxTokens: maxTokens
    },
    {
      id: 'minimal',
      name: 'Minimal Context',
      description: 'Only essential files',
      icon: <Zap className="text-yellow-400" size={16} />,
      selector: (files) => minimalSelection(files, targetFile),
      maxTokens: maxTokens / 2
    },
    {
      id: 'comprehensive',
      name: 'Full Context',
      description: 'Maximum relevant files',
      icon: <Package className="text-blue-400" size={16} />,
      selector: (files) => comprehensiveSelection(files, targetFile, maxTokens),
      maxTokens: maxTokens * 1.5
    },
    {
      id: 'deps',
      name: 'Dependencies Only',
      description: 'Focus on imports/exports',
      icon: <GitBranch className="text-green-400" size={16} />,
      selector: (files) => dependencySelection(files, targetFile, fileStructure),
      maxTokens: maxTokens
    }
  ]

  // Apply preset selection
  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (!preset) return

    const selectedPaths = preset.selector(processedFiles)
    setSelectedFiles(new Set(selectedPaths))
    setActivePreset(presetId)
    
    // Calculate total tokens
    const totalTokens = selectedPaths.reduce((sum, path) => {
      const file = processedFiles.find(f => f.path === path)
      return sum + (file?.tokens || 0)
    }, 0)
    
    setShowTokenWarning(totalTokens > maxTokens)
    onSelectionChange(selectedPaths, totalTokens)
  }

  // Manual file toggle
  const toggleFile = (filePath: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(filePath)) {
      newSelection.delete(filePath)
    } else {
      newSelection.add(filePath)
    }
    
    setSelectedFiles(newSelection)
    setActivePreset('custom')
    
    // Calculate total tokens
    const totalTokens = Array.from(newSelection).reduce((sum, path) => {
      const file = processedFiles.find(f => f.path === path)
      return sum + (file?.tokens || 0)
    }, 0)
    
    setShowTokenWarning(totalTokens > maxTokens)
    onSelectionChange(Array.from(newSelection), totalTokens)
  }

  // Auto-select on mount
  useEffect(() => {
    applyPreset('smart')
  }, [targetFile, purpose])

  // Calculate current token usage
  const currentTokens = useMemo(() => {
    return Array.from(selectedFiles).reduce((sum, path) => {
      const file = processedFiles.find(f => f.path === path)
      return sum + (file?.tokens || 0)
    }, 0)
  }, [selectedFiles, processedFiles])

  const tokenPercentage = (currentTokens / maxTokens) * 100

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            Smart File Selection for AI
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Automatically selects the most relevant files for your {purpose} request
          </p>
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-all"
        >
          {showAdvanced ? 'Simple Mode' : 'Advanced Mode'}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className={`p-3 rounded-lg border transition-all ${
              activePreset === preset.id
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/30'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {preset.icon}
              <span className="text-xs font-medium">{preset.name}</span>
              <span className="text-xs opacity-75">{preset.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Token Budget Indicator */}
      <div className="bg-black/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Token Usage</span>
          <span className="text-sm text-gray-400">
            {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
          </span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              tokenPercentage > 100 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : tokenPercentage > 80 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(100, tokenPercentage)}%` }}
          />
        </div>
        
        {showTokenWarning && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-400">
            <AlertCircle size={12} />
            <span>Token limit exceeded. AI may truncate content.</span>
          </div>
        )}
      </div>

      {/* File List (Advanced Mode) */}
      {showAdvanced && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="bg-black/30 px-4 py-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Files</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedFiles(new Set(processedFiles.map(f => f.path)))
                    setActivePreset('custom')
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Select All
                </button>
                <button
                  onClick={() => {
                    setSelectedFiles(new Set())
                    setActivePreset('custom')
                  }}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {processedFiles.map(file => (
              <div
                key={file.path}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-all cursor-pointer ${
                  selectedFiles.has(file.path) ? 'bg-purple-500/10' : ''
                }`}
                onClick={() => toggleFile(file.path)}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.path)}
                  onChange={() => {}}
                  className="rounded text-purple-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileCode size={14} className="text-gray-400" />
                    <span className="text-sm text-white">{file.name}</span>
                    <ImportanceBadge importance={file.importance} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{file.reason}</p>
                </div>
                
                <div className="text-xs text-gray-500">
                  {file.tokens} tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Tips */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Info className="text-purple-400 mt-0.5" size={16} />
          <div className="text-sm text-gray-300">
            <strong className="text-purple-400">Pro Tip:</strong> For {purpose} requests, 
            include {getContextTip(purpose)}. The Smart Selection preset automatically 
            optimizes for your use case.
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-cyan-400">
            {selectedFiles.size}
          </div>
          <div className="text-xs text-gray-400">Files Selected</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(tokenPercentage)}%
          </div>
          <div className="text-xs text-gray-400">Token Usage</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">
            {calculateEfficiencyScore(selectedFiles.size, currentTokens, purpose)}
          </div>
          <div className="text-xs text-gray-400">Efficiency Score</div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function ImportanceBadge({ importance }: { importance: string }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  
  return (
    <span className={`px-1.5 py-0.5 text-xs rounded border ${colors[importance] || colors.low}`}>
      {importance}
    </span>
  )
}

// Helper Functions
function calculateImportance(file: any, targetFile: string | null | undefined): FileSelection['importance'] {
  if (!targetFile) return 'medium'
  
  // Direct dependency
  if (file.analysis?.localImports?.includes(targetFile)) return 'critical'
  
  // Same directory
  const targetDir = targetFile.substring(0, targetFile.lastIndexOf('/'))
  const fileDir = file.path.substring(0, file.path.lastIndexOf('/'))
  if (targetDir === fileDir) return 'high'
  
  // Component or utility
  if (file.analysis?.fileType === 'component' || file.analysis?.fileType === 'util') return 'medium'
  
  return 'low'
}

function getSelectionReason(file: any, targetFile: string | null | undefined, purpose: string): string {
  if (!targetFile) return 'General context file'
  
  if (file.path === targetFile) return 'Target file for analysis'
  if (file.analysis?.localImports?.includes(targetFile)) return 'Imports the target file'
  
  switch (purpose) {
    case 'refactor':
      return 'May need refactoring alongside target'
    case 'debug':
      return 'Could contain related issues'
    case 'review':
      return 'Part of the review scope'
    case 'explain':
      return 'Provides additional context'
    default:
      return 'Related file'
  }
}

function smartSelection(
  files: FileSelection[], 
  targetFile: string | null | undefined, 
  purpose: string,
  maxTokens: number
): string[] {
  const selected: string[] = []
  let currentTokens = 0
  
  // Always include target file
  if (targetFile) {
    const target = files.find(f => f.path === targetFile)
    if (target) {
      selected.push(target.path)
      currentTokens += target.tokens
    }
  }
  
  // Add files by importance
  const prioritized = files
    .filter(f => f.path !== targetFile)
    .sort((a, b) => {
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return importanceOrder[a.importance] - importanceOrder[b.importance]
    })
  
  for (const file of prioritized) {
    if (currentTokens + file.tokens <= maxTokens * 0.9) { // Leave 10% buffer
      selected.push(file.path)
      currentTokens += file.tokens
    }
  }
  
  return selected
}

function minimalSelection(files: FileSelection[], targetFile: string | null | undefined): string[] {
  const selected: string[] = []
  
  if (targetFile) {
    const target = files.find(f => f.path === targetFile)
    if (target) selected.push(target.path)
    
    // Add only critical dependencies
    files
      .filter(f => f.importance === 'critical')
      .forEach(f => selected.push(f.path))
  }
  
  return selected
}

function comprehensiveSelection(
  files: FileSelection[], 
  targetFile: string | null | undefined,
  maxTokens: number
): string[] {
  const selected: string[] = []
  let currentTokens = 0
  
  // Include everything up to token limit
  for (const file of files) {
    if (currentTokens + file.tokens <= maxTokens * 1.5) {
      selected.push(file.path)
      currentTokens += file.tokens
    }
  }
  
  return selected
}

function dependencySelection(
  files: FileSelection[], 
  targetFile: string | null | undefined,
  fileStructure: any
): string[] {
  if (!targetFile) return []
  
  const selected = new Set<string>()
  selected.add(targetFile)
  
  // Find all files that import or are imported by target
  Object.values(fileStructure).flat().forEach((file: any) => {
    if (file.analysis?.localImports?.includes(targetFile)) {
      selected.add(file.path)
    }
  })
  
  return Array.from(selected)
}

function getContextTip(purpose: string): string {
  const tips = {
    refactor: 'related components and their tests',
    debug: 'error locations and their dependencies',
    review: 'all changed files and their connections',
    explain: 'main components and their relationships'
  }
  return tips[purpose] || 'relevant context files'
}

function calculateEfficiencyScore(fileCount: number, tokens: number, purpose: string): string {
  // Simple efficiency calculation
  if (fileCount === 0) return 'N/A'
  
  const ratio = tokens / fileCount
  const targetRatio = purpose === 'minimal' ? 200 : 400
  
  const score = Math.max(0, Math.min(100, 100 - Math.abs(ratio - targetRatio) / 10))
  
  if (score >= 80) return 'A+'
  if (score >= 70) return 'A'
  if (score >= 60) return 'B+'
  if (score >= 50) return 'B'
  return 'C'
}