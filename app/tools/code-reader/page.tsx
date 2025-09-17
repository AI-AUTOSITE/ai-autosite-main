// app/tools/code-reader/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import GitHubFetcher from './components/GitHubFetcher'
import FileUploader from './components/FileUploader'
import UnifiedViewer from './components/UnifiedViewer'
import AutoSaveIndicator from './components/AutoSaveIndicator'
import { useAutoSave } from './hooks/useAutoSave'
import { SmartDependencyAnalyzer } from './lib/smart-dependency-analyzer'

// Import types from lib/types.ts
import type { 
  ProjectStructure, 
  FileData, 
  CodeError,
  AutoSaveData 
} from './lib/types'

import { 
  Upload, 
  Github, 
  Folder, 
  HelpCircle,
  X,
  AlertCircle,
  FileCode,
  Save,
  RotateCcw
} from 'lucide-react'

// Constants
const FILE_LIMITS = {
  maxFiles: 500,
  maxFileSize: 10 * 1024 * 1024, // 10MB per file
  maxTotalSize: 50 * 1024 * 1024, // 50MB total
  supportedExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json', '.md', '.mdx']
}

const IGNORED_FOLDERS = ['node_modules', '.git', '.next', 'dist', 'build']
const ALLOWED_EXTENSIONS = FILE_LIMITS.supportedExtensions

// Main Component
export default function CodeReaderPage() {
  // Tab Management
  const [activeTab, setActiveTab] = useState<'github' | 'local'>('github')
  
  // File Management
  const [allFiles, setAllFiles] = useState<Record<string, string>>({})
  const [fileStructure, setFileStructure] = useState<ProjectStructure>({})
  const [excludedFiles, setExcludedFiles] = useState<Set<string>>(new Set())
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  
  // Loading & Progress
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCancelled, setIsCancelled] = useState(false)
  
  // UI State
  const [showHelp, setShowHelp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<CodeError[]>([])
  
  // Metadata
  const [githubUrl, setGithubUrl] = useState('')
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [savedSessions, setSavedSessions] = useState<AutoSaveData[]>([])

  // Auto-save hook
  const {
    isAutoSaveEnabled,
    lastSaveTime,
    hasUnsavedChanges,
    isRecoveryAvailable,
    isSaving,
    saveError,
    save,
    loadLatestSave,
    getSavedSessions,
    deleteSave,
    clearAllSaves,
    setAutoSaveEnabled,
    recover
  } = useAutoSave({
    files: Object.entries(allFiles).map(([path, content]) => ({
      name: path.split('/').pop() || '',
      path,
      size: content.length,
      content
    })),
    structure: fileStructure,
    githubUrl,
    selectedFiles,
    compressionSettings: { enabled: compressionEnabled }
  }, {
    interval: 30000, // 30 seconds
    maxHistory: 10
  })

  // Calculate stats
  const stats = {
    totalFiles: Object.keys(allFiles).filter(path => !excludedFiles.has(path)).length,
    excludedFiles: excludedFiles.size,
    totalSize: Object.keys(allFiles)
      .filter(path => !excludedFiles.has(path))
      .reduce((sum, path) => sum + (allFiles[path] || '').length, 0)
  }

  // Load saved sessions
  useEffect(() => {
    const loadSessions = async () => {
      const sessions = await getSavedSessions()
      setSavedSessions(sessions)
    }
    loadSessions()
  }, [lastSaveTime, getSavedSessions])

  // Auto-save on changes
  useEffect(() => {
    if (Object.keys(allFiles).length > 0 && isAutoSaveEnabled && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        save()
      }, 5000) // 5 seconds after changes
      
      return () => clearTimeout(timer)
    }
  }, [allFiles, selectedFiles, fileStructure, isAutoSaveEnabled, hasUnsavedChanges, save])

  /**
   * Analyze files for dependencies and errors
   * @param files - File contents mapping
   * @param structure - Project structure
   * @param forceErrorDetection - Force detailed error detection (optional)
   */
  const analyzeFiles = useCallback((
    files: Record<string, string>, 
    structure: ProjectStructure,
    forceErrorDetection?: boolean  // Optional parameter for future extensibility
  ) => {
    const analyzer = new SmartDependencyAnalyzer()
    
    // Configure analyzer based on detection mode
    if (forceErrorDetection) {
      // Future expansion point: Enable detailed analysis mode
      console.log('[Debug] Running forced error detection...')
      
      // Example future features:
      // analyzer.setMode('detailed')
      // analyzer.enableAllChecks()
      // analyzer.setThreshold('strict')
    }
    
    const insight = analyzer.analyze(structure, files)
    
    // Enhanced error handling for forced detection
    if (forceErrorDetection && insight.errors) {
      // Future expansion point: Additional error processing
      console.log(`[Debug] Found ${insight.errors.length} errors in forced detection`)
      
      // Example future features:
      // - Sort errors by severity
      // - Group errors by file
      // - Add auto-fix suggestions
    }
    
    if (insight.errors) {
      setErrors(insight.errors)
    }
  }, [])

  // Handle tab change
  const handleTabChange = useCallback((tab: 'github' | 'local') => {
    if (tab !== activeTab) {
      // Save current work before switching
      if (hasUnsavedChanges && Object.keys(allFiles).length > 0) {
        save()
      }
      
      // Reset state
      setAllFiles({})
      setFileStructure({})
      setExcludedFiles(new Set())
      setError(null)
      setIsLoading(false)
      setProgress(0)
      setSelectedFile(null)
      setIsCancelled(false)
      setActiveTab(tab)
      setErrors([])
      setGithubUrl('')
      setSelectedFiles([])
    }
  }, [activeTab, hasUnsavedChanges, allFiles, save])

  // Handle files processed from upload/fetch
  const handleFilesProcessed = useCallback((files: Record<string, string>, structure: ProjectStructure) => {
    setAllFiles(files)
    setFileStructure(structure)
    setExcludedFiles(new Set())
    setError(null)
    analyzeFiles(files, structure) // Normal analysis without forced detection
    
    // Extract GitHub URL if available
    const firstFile = Object.keys(files)[0]
    if (firstFile && firstFile.includes('github.com')) {
      const match = firstFile.match(/github\.com\/([^\/]+\/[^\/]+)/)
      if (match) {
        setGithubUrl(`https://github.com/${match[1]}`)
      }
    }
  }, [analyzeFiles])

  // Clear all data
  const clearAll = useCallback(() => {
    if (hasUnsavedChanges && Object.keys(allFiles).length > 0) {
      if (!confirm('You have unsaved changes. Are you sure you want to clear all?')) {
        return
      }
    }
    
    setAllFiles({})
    setFileStructure({})
    setExcludedFiles(new Set())
    setError(null)
    setSelectedFile(null)
    setErrors([])
    setGithubUrl('')
    setSelectedFiles([])
  }, [hasUnsavedChanges, allFiles])

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    setIsCancelled(true)
    setIsLoading(false)
    setProgress(0)
  }, [])

  /**
   * Run manual error detection with enhanced analysis
   * This can be triggered by user action for deeper inspection
   */
  const runErrorDetection = useCallback(() => {
    if (Object.keys(allFiles).length > 0) {
      analyzeFiles(allFiles, fileStructure, true) // Force detailed detection
    }
  }, [allFiles, fileStructure, analyzeFiles])

  const handleRecover = useCallback(async () => {
    const recoveredData = await recover()
    if (recoveredData) {
      // Convert files back to the expected format
      const filesMap: Record<string, string> = {}
      recoveredData.files.forEach((file) => {
        if (file.content) {
          filesMap[file.path] = file.content
        }
      })
      
      setAllFiles(filesMap)
      setFileStructure(recoveredData.structure)
      setGithubUrl(recoveredData.githubUrl || '')
      setSelectedFiles(recoveredData.selectedFiles || [])
      
      if (recoveredData.compressionSettings) {
        setCompressionEnabled(recoveredData.compressionSettings.enabled || true)
      }
      
      // Show success notification
      alert('Session recovered successfully!')
    }
  }, [recover])

  // Load session handler
  const handleLoadSession = useCallback(async (sessionId: string) => {
    const sessions = await getSavedSessions()
    const session = sessions.find(s => s.id === sessionId)
    
    if (session) {
      // Convert files back to the expected format
      const filesMap: Record<string, string> = {}
      session.files.forEach((file) => {
        if (file.content) {
          filesMap[file.path] = file.content
        }
      })
      
      setAllFiles(filesMap)
      if (session.structure) {
        setFileStructure(session.structure)
      }
      setGithubUrl(session.githubUrl || '')
      setSelectedFiles(session.selectedFiles || [])
      
      if (session.compressionSettings) {
        setCompressionEnabled(session.compressionSettings.enabled || true)
      }
      
      alert(`Loaded session: ${session.projectName}`)
    }
  }, [getSavedSessions])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        isAutoSaveEnabled={isAutoSaveEnabled}
        lastSaveTime={lastSaveTime}
        hasUnsavedChanges={hasUnsavedChanges}
        isRecoveryAvailable={isRecoveryAvailable}
        isSaving={isSaving}
        saveError={saveError}
        savedSessions={savedSessions}
        onSave={save}
        onRecover={handleRecover}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSave}
        onClearAll={clearAllSaves}
        onToggleAutoSave={setAutoSaveEnabled}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recovery Notification */}
        {isRecoveryAvailable && Object.keys(allFiles).length === 0 && (
          <RecoveryNotification onRecover={handleRecover} />
        )}

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            hasFiles={Object.keys(allFiles).length > 0}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            showHelp={showHelp}
            onTabChange={handleTabChange}
            onSave={save}
            onClearAll={clearAll}
            onToggleHelp={() => setShowHelp(!showHelp)}
          />

          {/* Error Display */}
          {error && <ErrorAlert error={error} />}

          {/* Content Area */}
          {activeTab === 'github' && Object.keys(allFiles).length === 0 && (
            <GitHubFetcher 
              onFilesProcessed={handleFilesProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onCancel={cancelProcessing}
            />
          )}

          {activeTab === 'local' && Object.keys(allFiles).length === 0 && (
            <FileUploader 
              onFilesProcessed={handleFilesProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {/* File Viewer */}
          {Object.keys(fileStructure).length > 0 && (
            <UnifiedViewer
              fileStructure={fileStructure}
              allFiles={allFiles}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              errors={errors}
              onSelectedFilesChange={setSelectedFiles}
              selectedFiles={selectedFiles}
            />
          )}
        </div>

        {/* Stats Bar */}
        {Object.keys(allFiles).length > 0 && (
          <StatsBar stats={stats} lastSaveTime={lastSaveTime} />
        )}

        {/* Help Modal */}
        {showHelp && (
          <HelpModal 
            fileLimits={FILE_LIMITS} 
            onClose={() => setShowHelp(false)} 
          />
        )}
      </div>
    </div>
  )
}

// Sub-components
function Header({ 
  isAutoSaveEnabled, 
  lastSaveTime, 
  hasUnsavedChanges,
  isRecoveryAvailable,
  isSaving,
  saveError,
  savedSessions,
  onSave,
  onRecover,
  onLoadSession,
  onDeleteSession,
  onClearAll,
  onToggleAutoSave
}: any) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 bg-opacity-20">
              <FileCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Code Dependency Visualizer
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Analyze project structure and dependencies
              </p>
            </div>
          </div>
          
          <AutoSaveIndicator
            isAutoSaveEnabled={isAutoSaveEnabled}
            lastSaveTime={lastSaveTime}
            hasUnsavedChanges={hasUnsavedChanges}
            isRecoveryAvailable={isRecoveryAvailable}
            isSaving={isSaving}
            saveError={saveError}
            savedSessions={savedSessions}
            onSave={onSave}
            onRecover={onRecover}
            onLoadSession={onLoadSession}
            onDeleteSession={onDeleteSession}
            onClearAll={onClearAll}
            onToggleAutoSave={onToggleAutoSave}
          />
        </div>
      </div>
    </div>
  )
}

function RecoveryNotification({ onRecover }: { onRecover: () => void }) {
  return (
    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="font-medium text-yellow-400">
              Previous session found
            </h3>
            <p className="text-sm text-yellow-300/70 mt-0.5">
              Would you like to recover your last working session?
            </p>
          </div>
        </div>
        <button
          onClick={onRecover}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium transition-colors"
        >
          Recover Session
        </button>
      </div>
    </div>
  )
}

function TabNavigation({ 
  activeTab, 
  hasFiles, 
  hasUnsavedChanges, 
  isSaving,
  showHelp,
  onTabChange, 
  onSave, 
  onClearAll,
  onToggleHelp 
}: any) {
  return (
    <div className="flex gap-2 mb-6 border-b border-white/10">
      <button
        onClick={() => onTabChange('github')}
        className={`px-6 py-3 font-medium transition-colors relative ${
          activeTab === 'github' 
            ? 'text-cyan-400 border-b-2 border-cyan-400' 
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Github size={18} />
          GitHub Repository
        </div>
      </button>
      
      <button
        onClick={() => onTabChange('local')}
        className={`px-6 py-3 font-medium transition-colors relative ${
          activeTab === 'local' 
            ? 'text-cyan-400 border-b-2 border-cyan-400' 
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Folder size={18} />
          Local Folder
        </div>
      </button>
      
      <div className="ml-auto flex items-center gap-2">
        {hasFiles && (
          <>
            {hasUnsavedChanges && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Save size={16} />
                Save
              </button>
            )}
            <button
              onClick={onClearAll}
              className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <X size={16} />
              Clear All
            </button>
          </>
        )}
        <button
          onClick={onToggleHelp}
          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 rounded-lg hover:bg-white/10"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  )
}

function ErrorAlert({ error }: { error: string }) {
  return (
    <div className="flex items-center gap-2 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
      <span className="text-red-400">{error}</span>
    </div>
  )
}

function StatsBar({ stats, lastSaveTime }: any) {
  return (
    <div className="mt-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Files:</span>
            <span className="text-cyan-400 font-medium">{stats.totalFiles}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Size:</span>
            <span className="text-green-400 font-medium">
              {(stats.totalSize / 1024).toFixed(1)} KB
            </span>
          </div>
          {stats.excludedFiles > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Excluded:</span>
              <span className="text-yellow-400 font-medium">{stats.excludedFiles}</span>
            </div>
          )}
        </div>
        {lastSaveTime && (
          <div className="text-gray-400">
            Last saved: {lastSaveTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

function HelpModal({ fileLimits, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">How to Use</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold mb-2 text-cyan-400">🚀 Quick Start</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Upload files or enter GitHub URL</li>
              <li>View dependency analysis automatically</li>
              <li>Select files for AI prompt generation</li>
              <li>Auto-save keeps your work safe</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-400">💾 Auto-Save Features</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Automatic save every 30 seconds</li>
              <li>Recovery from browser crashes</li>
              <li>Session history (last 10 sessions)</li>
              <li>Switch between projects easily</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-400">💰 AI Cost Calculator</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Real-time cost estimation</li>
              <li>Compare prices across platforms</li>
              <li>Token compression saves 60%</li>
              <li>Monthly budget tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-yellow-400">📊 File Limits</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Max {fileLimits.maxFiles} files per upload</li>
              <li>Max {fileLimits.maxFileSize / 1024 / 1024}MB per file</li>
              <li>Max {fileLimits.maxTotalSize / 1024 / 1024}MB total</li>
              <li>Supported: {fileLimits.supportedExtensions.join(', ')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-400">⌨️ Keyboard Shortcuts</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li><kbd>Ctrl+S</kbd> - Save manually</li>
              <li><kbd>Ctrl+K</kbd> - Search files</li>
              <li><kbd>Ctrl+E</kbd> - Export for AI</li>
              <li><kbd>Escape</kbd> - Close modals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}