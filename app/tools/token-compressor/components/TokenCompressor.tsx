'use client'

import { useState, useCallback, useRef } from 'react'
import { FileText, Zap, Shield, Download, AlertTriangle, Sparkles, GitBranch, Cloud, Upload, FolderOpen, Loader2, Copy, Check, Package, TrendingDown, X, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { ProcessedFile, SecurityIssue, OutputFormat, CompressionOptions } from '../lib/types'
import { processFiles } from '../lib/fileProcessor'
import { checkSecurity, removeSensitiveData } from '../lib/security'
import { compressFiles } from '../lib/compress'
import { countTokens } from '../lib/tokenCounter'

// Import JSZip and file-saver for ZIP generation
// Note: These need to be installed: npm install jszip file-saver @types/file-saver

export default function TokenCompressor() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([])
  const [showSecurityWarning, setShowSecurityWarning] = useState(false)
  const [totalOriginalTokens, setTotalOriginalTokens] = useState(0)
  const [totalCompressedTokens, setTotalCompressedTokens] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('markdown')
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSource, setUploadSource] = useState<'local' | 'github' | 'gdrive' | 'dropbox'>('local')
  const [gitUrl, setGitUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFilesUpload = useCallback(async (uploadedFiles: File[]) => {
    setIsProcessing(true)
    try {
      // Process files
      const processedFiles = await processFiles(uploadedFiles)
      
      // Merge with existing files if adding more
      const allFiles = [...files, ...processedFiles]
      
      // Security check on all files
      const issues = await checkSecurity(allFiles)
      if (issues.length > 0) {
        setSecurityIssues(issues)
        setShowSecurityWarning(true)
      }
      
      // Token counting
      let origTokens = 0
      let compTokens = 0
      
      for (const file of processedFiles) {
        const originalTokens = await countTokens(file.content)
        const compressed = await compressFiles([file])
        const compressedTokens = await countTokens(compressed[0].content)
        
        file.originalTokens = originalTokens
        file.compressedTokens = compressedTokens
        file.compressedContent = compressed[0].content
        
        origTokens += originalTokens
        compTokens += compressedTokens
      }
      
      // Update total tokens
      setFiles(allFiles)
      setTotalOriginalTokens(totalOriginalTokens + origTokens)
      setTotalCompressedTokens(totalCompressedTokens + compTokens)
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [files, totalOriginalTokens, totalCompressedTokens])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const items = e.dataTransfer.items
    const files: File[] = []
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
    
    if (files.length > 0) {
      handleFilesUpload(files)
    }
  }, [handleFilesUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFilesUpload(Array.from(files))
    }
  }, [handleFilesUpload])

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const removedFile = files[index]
    
    // Update token counts
    const origTokens = removedFile.originalTokens || 0
    const compTokens = removedFile.compressedTokens || 0
    
    setFiles(updatedFiles)
    setTotalOriginalTokens(Math.max(0, totalOriginalTokens - origTokens))
    setTotalCompressedTokens(Math.max(0, totalCompressedTokens - compTokens))
  }

  const handleClearAll = () => {
    setFiles([])
    setTotalOriginalTokens(0)
    setTotalCompressedTokens(0)
    setSecurityIssues([])
    setShowSecurityWarning(false)
  }

  const handleContinueWithWarning = () => {
    setShowSecurityWarning(false)
  }

  const handleRemoveSensitiveData = () => {
    const cleanedFiles = files.map(file => ({
      ...file,
      content: removeSensitiveData(file.content),
      compressedContent: removeSensitiveData(file.compressedContent || '')
    }))
    setFiles(cleanedFiles)
    setShowSecurityWarning(false)
    setSecurityIssues([])
  }

  const generateMarkdown = (): string => {
    let markdown = '# Compressed Files for AI Sharing\n\n'
    markdown += `## Summary\n\n`
    markdown += `- Total Files: ${files.length}\n`
    markdown += `- Compression Rate: ${compressionRate}%\n`
    markdown += `- Total Tokens Saved: ${files.reduce((acc, f) => acc + ((f.originalTokens || 0) - (f.compressedTokens || 0)), 0)}\n\n`
    
    files.forEach(file => {
      markdown += `## ${file.name}\n\n`
      markdown += `- Original Tokens: ${file.originalTokens?.toLocaleString()}\n`
      markdown += `- Compressed Tokens: ${file.compressedTokens?.toLocaleString()}\n`
      markdown += `- Type: ${file.type}\n\n`
      markdown += '```' + (file.type.split('/')[1] || '') + '\n'
      markdown += file.compressedContent || file.content
      markdown += '\n```\n\n---\n\n'
    })
    
    return markdown
  }

  const generateJSON = (): string => {
    const output = {
      metadata: {
        totalFiles: files.length,
        compressionRate: compressionRate,
        timestamp: new Date().toISOString()
      },
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        originalTokens: file.originalTokens,
        compressedTokens: file.compressedTokens,
        content: file.compressedContent || file.content
      }))
    }
    return JSON.stringify(output, null, 2)
  }

  const generateZip = async () => {
    // Dynamic import for jszip
    try {
      const JSZip = (await import('jszip')).default
      const { saveAs } = await import('file-saver')
      
      const zip = new JSZip()
      
      // Add metadata
      zip.file('metadata.json', JSON.stringify({
        compressionRate: compressionRate,
        totalFiles: files.length,
        tokensSaved: totalOriginalTokens - totalCompressedTokens,
        timestamp: new Date().toISOString()
      }, null, 2))
      
      // Add compressed files
      const compressedFolder = zip.folder('compressed')
      files.forEach(file => {
        if (compressedFolder) {
          compressedFolder.file(file.name, file.compressedContent || file.content)
        }
      })
      
      // Add original files
      const originalFolder = zip.folder('original')
      files.forEach(file => {
        if (originalFolder) {
          originalFolder.file(file.name, file.content)
        }
      })
      
      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, `compressed-files-${Date.now()}.zip`)
    } catch (error) {
      console.error('ZIP generation error:', error)
      alert('Please install jszip and file-saver: npm install jszip file-saver')
    }
  }

  const generateText = (): string => {
    let text = 'COMPRESSED FILES FOR AI SHARING\n'
    text += '=' .repeat(50) + '\n\n'
    
    files.forEach(file => {
      text += `FILE: ${file.name}\n`
      text += '-'.repeat(30) + '\n'
      text += file.compressedContent || file.content
      text += '\n\n'
    })
    
    return text
  }

  const handleCopy = async () => {
    let content = ''
    switch (selectedFormat) {
      case 'markdown':
        content = generateMarkdown()
        break
      case 'json':
        content = generateJSON()
        break
      case 'txt':
        content = generateText()
        break
      default:
        content = generateMarkdown()
    }
    
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (selectedFormat === 'zip') {
      await generateZip()
      return
    }
    
    let content = ''
    let filename = ''
    let mimeType = ''
    
    switch (selectedFormat) {
      case 'markdown':
        content = generateMarkdown()
        filename = 'compressed-files.md'
        mimeType = 'text/markdown'
        break
      case 'json':
        content = generateJSON()
        filename = 'compressed-files.json'
        mimeType = 'application/json'
        break
      case 'txt':
        content = generateText()
        filename = 'compressed-files.txt'
        mimeType = 'text/plain'
        break
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const compressionRate = totalOriginalTokens > 0 
    ? Math.round((1 - totalCompressedTokens / totalOriginalTokens) * 100) 
    : 0

  const tokensSaved = totalOriginalTokens - totalCompressedTokens
  const estimatedCostSaved = (tokensSaved / 1000) * 0.02

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tool Title Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-50"></div>
            <Sparkles className="relative w-16 h-16 text-cyan-400" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          AI Token Compressor
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Visualize and compress tokens from any file format. Support for Git repos, 
          cloud storage, and batch processing with automatic security checks.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          AI-Powered Token Optimization
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
            <h3 className="font-semibold mb-2 text-white">Multi-Format Support</h3>
            <p className="text-gray-400 text-sm">
              Code, documents, images, PDFs and more
            </p>
          </div>
          <div className="text-center">
            <Shield className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h3 className="font-semibold mb-2 text-white">Security Scanning</h3>
            <p className="text-gray-400 text-sm">
              Automatic API key and PII detection
            </p>
          </div>
          <div className="text-center">
            <Zap className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-semibold mb-2 text-white">Smart Compression</h3>
            <p className="text-gray-400 text-sm">
              Optimize tokens while preserving meaning
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/10">
        <div className="space-y-6">
          {/* Upload Source Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setUploadSource('local')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                uploadSource === 'local'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Upload className="inline mr-2" size={16} />
              Local Files
            </button>
            <button
              onClick={() => setUploadSource('github')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                uploadSource === 'github'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <GitBranch className="inline mr-2" size={16} />
              GitHub
            </button>
            <button
              onClick={() => setUploadSource('gdrive')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                uploadSource === 'gdrive'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Cloud className="inline mr-2" size={16} />
              Google Drive
            </button>
          </div>

          {/* Upload Area */}
          {uploadSource === 'local' ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="*"
              />
              
              <input
                ref={folderInputRef}
                type="file"
                /* @ts-ignore */
                webkitdirectory=""
                directory=""
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-gray-300 mb-4">
                  Drag and drop files or folders here
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Select Files'}
                  </button>
                  <button
                    onClick={() => folderInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                  >
                    <FolderOpen className="inline mr-2" size={16} />
                    Select Folder
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Supports all file types • Automatic security scanning
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {uploadSource === 'github' ? 'GitHub' : uploadSource === 'gdrive' ? 'Google Drive' : 'Dropbox'} integration requires API setup. Coming soon!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Warning Modal */}
      {showSecurityWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-white">Security Warning</h2>
                </div>
                <button
                  onClick={() => {
                    setShowSecurityWarning(false)
                    setFiles([])
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-gray-300 mb-6">
                We've detected potentially sensitive information in your files. Please review and decide how to proceed.
              </p>
              <div className="space-y-3">
                {securityIssues.slice(0, 10).map((issue, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-3 border border-yellow-500/30">
                    <div className="text-sm text-white font-medium">{issue.description}</div>
                    <div className="text-xs text-gray-500">Found {issue.count} instance(s)</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSecurityWarning(false)
                    setFiles([])
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinueWithWarning}
                  className="flex-1 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium hover:bg-yellow-500/30 transition-all border border-yellow-500/30"
                >
                  Continue Anyway
                </button>
                <button
                  onClick={handleRemoveSensitiveData}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Remove & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {files.length > 0 && !showSecurityWarning && (
        <>
          {/* Token Analysis */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Token Analysis</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add More Files
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{files.length}</div>
                <div className="text-sm text-gray-400">Files</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{totalOriginalTokens.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Original Tokens</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{totalCompressedTokens.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Compressed Tokens</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 text-center">
                <TrendingDown className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{compressionRate}%</div>
                <div className="text-sm text-gray-400">Saved</div>
              </div>
            </div>
            
            {/* File List */}
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Uploaded Files</h4>
              {files.map((file, index) => {
                const fileCompressionRate = file.originalTokens && file.compressedTokens
                  ? Math.round((1 - file.compressedTokens / file.originalTokens) * 100)
                  : 0

                return (
                  <div key={index} className="bg-black/30 rounded-lg p-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-white text-sm">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-400">
                        {file.originalTokens?.toLocaleString() || 0} → {file.compressedTokens?.toLocaleString() || 0}
                      </div>
                      <div className={`text-sm font-medium ${fileCompressionRate > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                        -{fileCompressionRate}%
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {tokensSaved > 0 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Estimated Cost Saved</div>
                    <div className="text-xl font-bold text-green-400">${estimatedCostSaved.toFixed(2)}</div>
                  </div>
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
              </div>
            )}
          </div>

          {/* Output Options */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Output Options</h3>
            
            {/* Format Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {(['markdown', 'json', 'zip', 'txt'] as OutputFormat[]).map(format => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFormat === format
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={selectedFormat === 'zip'}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <>
                    <Check className="inline mr-2" size={20} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="inline mr-2" size={20} />
                    Copy to Clipboard
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Download className="inline mr-2" size={20} />
                Download
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}