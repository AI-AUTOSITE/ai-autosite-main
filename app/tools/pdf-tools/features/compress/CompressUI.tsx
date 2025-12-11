'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Minimize2,
  X,
  Download,
  FileText,
  Mail,
  Target,
  Gauge,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  Info
} from 'lucide-react'
import { EnhancedCompressHandler as CompressHandler, CompressionLevel, CompressionResult, CompressionEstimate } from './EnhancedCompressHandler'

interface CompressUIProps {
  file: File | null
  totalPages: number
  onClose: () => void
  onCompress: (level: CompressionLevel | 'target', targetSizeMB?: number) => Promise<void>
}

// Color scheme for compression levels
const LEVEL_COLORS = {
  low: { 
    bg: 'bg-green-500/20', 
    border: 'border-green-400', 
    text: 'text-green-400',
    fill: 'bg-green-400'
  },
  medium: { 
    bg: 'bg-blue-500/20', 
    border: 'border-blue-400', 
    text: 'text-blue-400',
    fill: 'bg-blue-400'
  },
  high: { 
    bg: 'bg-orange-500/20', 
    border: 'border-orange-400', 
    text: 'text-orange-400',
    fill: 'bg-orange-400'
  },
  extreme: { 
    bg: 'bg-red-500/20', 
    border: 'border-red-400', 
    text: 'text-red-400',
    fill: 'bg-red-400'
  }
}

// Common email limits
const EMAIL_LIMITS = [
  { name: 'Gmail', limit: 25, icon: '📧' },
  { name: 'Outlook', limit: 25, icon: '📮' },
  { name: 'Yahoo', limit: 25, icon: '✉️' },
  { name: 'Custom', limit: 0, icon: '🎯' }
]

export function CompressUI({
  file,
  totalPages,
  onClose,
  onCompress
}: CompressUIProps) {
  // State
  const [mode, setMode] = useState<'level' | 'target'>('level')
  const [selectedLevel, setSelectedLevel] = useState<CompressionLevel>('medium')
  const [targetSizeMB, setTargetSizeMB] = useState(10)
  const [customTarget, setCustomTarget] = useState(false)
  
  // Estimates state
  const [estimates, setEstimates] = useState<CompressionEstimate[]>([])
  const [loadingEstimates, setLoadingEstimates] = useState(false)
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CompressionResult | null>(null)

  // Original file size
  const originalSize = file?.size || 0
  const originalSizeMB = originalSize / (1024 * 1024)

  // Load estimates on mount
  useEffect(() => {
    if (file) {
      loadEstimates()
    }
  }, [file])

  const loadEstimates = async () => {
    if (!file) return
    
    setLoadingEstimates(true)
    try {
      const est = await CompressHandler.estimateAllLevels(file)
      setEstimates(est)
    } catch (error) {
      console.error('Failed to load estimates:', error)
    } finally {
      setLoadingEstimates(false)
    }
  }

  const loadPreview = async () => {
    if (!file) return
    
    setLoadingPreview(true)
    try {
      const preview = await CompressHandler.generatePreviewThumbnail(file, 1, 0.3)
      setBeforePreview(preview)
      setShowPreview(true)
    } catch (error) {
      console.error('Failed to load preview:', error)
    } finally {
      setLoadingPreview(false)
    }
  }

  // Get current estimate based on selection
  const currentEstimate = useMemo(() => {
    if (mode === 'level') {
      return estimates.find(e => e.level === selectedLevel)
    } else {
      // For target mode, find recommended level
      const recommendedLevel = CompressHandler.recommendLevelForTargetSize(originalSize, targetSizeMB)
      return estimates.find(e => e.level === recommendedLevel)
    }
  }, [mode, selectedLevel, targetSizeMB, estimates, originalSize])

  // Check if target is achievable
  const isTargetAchievable = useMemo(() => {
    if (mode !== 'target') return true
    const extremeEstimate = estimates.find(e => e.level === 'extreme')
    if (!extremeEstimate) return true
    return targetSizeMB * 1024 * 1024 >= extremeEstimate.estimatedSize
  }, [mode, targetSizeMB, estimates])

  // Recommended level for target
  const recommendedLevel = useMemo(() => {
    if (mode !== 'target') return null
    return CompressHandler.recommendLevelForTargetSize(originalSize, targetSizeMB)
  }, [mode, originalSize, targetSizeMB])

  const handleCompress = async () => {
    setIsProcessing(true)
    try {
      if (mode === 'level') {
        await onCompress(selectedLevel)
      } else {
        await onCompress('target', targetSizeMB)
      }
    } catch (error) {
      console.error('Compression error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const setEmailLimit = (limitMB: number) => {
    setTargetSizeMB(limitMB)
    setCustomTarget(limitMB === 0)
    if (limitMB > 0) {
      setMode('target')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Minimize2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Compress PDF</h2>
              <p className="text-sm text-gray-400">
                {CompressHandler.formatFileSize(originalSize)} • {totalPages} pages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              100% Local
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('level')}
              className={`flex-1 p-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                mode === 'level'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Gauge className="w-4 h-4" />
              By Quality Level
            </button>
            <button
              onClick={() => setMode('target')}
              className={`flex-1 p-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                mode === 'target'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Target className="w-4 h-4" />
              By Target Size
            </button>
          </div>

          {/* Level Selection Mode */}
          {mode === 'level' && (
            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-400 mb-2">Compression Level</div>
              {(['low', 'medium', 'high', 'extreme'] as CompressionLevel[]).map(level => {
                const colors = LEVEL_COLORS[level]
                const estimate = estimates.find(e => e.level === level)
                const info = CompressHandler.getLevelInfo(level)
                const isSelected = selectedLevel === level

                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full p-4 rounded-lg border transition text-left ${
                      isSelected
                        ? `${colors.bg} ${colors.border}`
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors.fill}`} />
                        <span className={`font-medium capitalize ${isSelected ? colors.text : ''}`}>
                          {level}
                        </span>
                      </div>
                      {loadingEstimates ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : estimate ? (
                        <span className={`text-sm ${colors.text}`}>
                          ~{CompressHandler.formatFileSize(estimate.estimatedSize)}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-400">{info.description}</div>
                    
                    {/* Compression bar */}
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.fill} transition-all duration-500`}
                        style={{ width: `${(1 - info.expectedRatio) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ~{Math.round((1 - info.expectedRatio) * 100)}% size reduction
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Target Size Mode */}
          {mode === 'target' && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-3">Quick Presets (Email Limits)</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {EMAIL_LIMITS.map(({ name, limit, icon }) => (
                  <button
                    key={name}
                    onClick={() => setEmailLimit(limit)}
                    className={`p-3 rounded-lg border transition text-center ${
                      (limit > 0 && targetSizeMB === limit) || (limit === 0 && customTarget)
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="text-xs font-medium">{name}</div>
                    {limit > 0 && <div className="text-xs opacity-70">{limit}MB</div>}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-300">Target Size:</span>
                  <input
                    type="number"
                    value={targetSizeMB}
                    onChange={(e) => {
                      setTargetSizeMB(Math.max(1, parseInt(e.target.value) || 1))
                      setCustomTarget(true)
                    }}
                    min={1}
                    max={Math.ceil(originalSizeMB)}
                    className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:border-purple-400 focus:outline-none"
                  />
                  <span className="text-sm text-gray-300">MB</span>
                </div>

                {/* Target size slider */}
                <input
                  type="range"
                  value={targetSizeMB}
                  onChange={(e) => {
                    setTargetSizeMB(parseInt(e.target.value))
                    setCustomTarget(true)
                  }}
                  min={1}
                  max={Math.ceil(originalSizeMB)}
                  className="w-full mb-3"
                />

                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 MB</span>
                  <span>{CompressHandler.formatFileSize(originalSize)}</span>
                </div>

                {/* Achievability warning */}
                {!isTargetAchievable && (
                  <div className="mt-3 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg">
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Target may not be achievable. Extreme compression will be used.
                    </p>
                  </div>
                )}

                {/* Recommended level indicator */}
                {recommendedLevel && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-400" />
                      Recommended level: 
                      <span className={`font-medium capitalize ${LEVEL_COLORS[recommendedLevel].text}`}>
                        {recommendedLevel}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Size Preview */}
          <div className="p-4 bg-gray-800 rounded-lg mb-6">
            <div className="text-sm text-gray-400 mb-3">Estimated Result</div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Original</div>
                <div className="text-lg font-semibold text-gray-300">
                  {CompressHandler.formatFileSize(originalSize)}
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-cyan-400" />
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Compressed</div>
                {loadingEstimates ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500 mx-auto" />
                ) : currentEstimate ? (
                  <div className="text-lg font-semibold text-cyan-400">
                    ~{CompressHandler.formatFileSize(currentEstimate.estimatedSize)}
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-gray-500">--</div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Saved</div>
                {currentEstimate && (
                  <div className="text-lg font-semibold text-green-400">
                    ~{Math.round(currentEstimate.estimatedRatio)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div className="mb-6">
            <button
              onClick={loadPreview}
              disabled={loadingPreview}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              {loadingPreview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? 'Hide Preview' : 'Show Quality Preview'}
            </button>
            
            {showPreview && beforePreview && (
              <div className="mt-3 p-4 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">First Page Preview</div>
                <img
                  src={beforePreview}
                  alt="PDF Preview"
                  className="max-h-48 mx-auto rounded border border-gray-700"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Quality may vary based on compression level
                </p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Your file never leaves your browser. 100% local processing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              !isProcessing
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Compress & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompressUI
