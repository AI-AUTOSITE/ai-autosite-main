'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  Copy, 
  Download, 
  Check, 
  Settings,
  Zap,
  FileText,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react'
import { CodeCompressor } from '../lib/code-compressor'

interface AIShareModeProps {
  allFiles: Record<string, string>
  fileStructure: any
}

export default function AIShareMode({ allFiles, fileStructure }: AIShareModeProps) {
  const [isCompressed, setIsCompressed] = useState(false)
  const [compressedFiles, setCompressedFiles] = useState<Record<string, any>>({})
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [options, setOptions] = useState({
    removeComments: true,
    removeEmptyLines: true,
    removeIndentation: true,
    minifySpaces: true,
    preserveImportantComments: true
  })
  const [showOptions, setShowOptions] = useState(false)

  const compressor = new CodeCompressor()

  const handleCompress = () => {
    const results = compressor.compressFiles(allFiles, options)
    setCompressedFiles(results)
    setIsCompressed(true)
    
    // Select first file for preview
    const firstFile = Object.keys(results)[0]
    if (firstFile) {
      setSelectedFile(firstFile)
    }
  }

  const getTotalStats = () => {
    if (!isCompressed) return null
    
    let totalOriginal = 0
    let totalCompressed = 0
    let totalTokensSaved = 0
    
    Object.values(compressedFiles).forEach((result: any) => {
      totalOriginal += result.originalSize
      totalCompressed += result.compressedSize
      totalTokensSaved += result.tokenSaved
    })
    
    const reduction = Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
    
    return {
      totalOriginal,
      totalCompressed,
      totalTokensSaved,
      reduction
    }
  }

  const copyAllCompressed = async () => {
    if (!isCompressed) return
    
    let output = '# AI-Optimized Code Share\n\n'
    output += '## Project Structure\n\n'
    
    // Add file tree
    Object.keys(fileStructure).forEach(dir => {
      output += `${dir}/\n`
      fileStructure[dir].forEach((file: any) => {
        output += `  - ${file.name}\n`
      })
    })
    
    output += '\n## Compressed Code Files\n\n'
    
    // Add compressed code
    Object.entries(compressedFiles).forEach(([path, result]: [string, any]) => {
      output += `### ${path}\n\n`
      output += '```' + path.split('.').pop() + '\n'
      output += result.compressed
      output += '\n```\n\n'
    })
    
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCompressed = () => {
    if (!isCompressed) return
    
    let output = '# AI-Optimized Code Share\n\n'
    const stats = getTotalStats()
    
    if (stats) {
      output += `## Compression Stats\n\n`
      output += `- Original Size: ${CodeCompressor.formatBytes(stats.totalOriginal)}\n`
      output += `- Compressed Size: ${CodeCompressor.formatBytes(stats.totalCompressed)}\n`
      output += `- Reduction: ${stats.reduction}%\n`
      output += `- Tokens Saved: ~${stats.totalTokensSaved.toLocaleString()}\n\n`
    }
    
    output += '## Compressed Code\n\n'
    
    Object.entries(compressedFiles).forEach(([path, result]: [string, any]) => {
      output += `### ${path}\n\n`
      output += '```' + path.split('.').pop() + '\n'
      output += result.compressed
      output += '\n```\n\n'
    })
    
    const blob = new Blob([output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-optimized-code.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAsJson = () => {
    if (!isCompressed) return
    
    // Create a JSON file that contains all compressed files
    const stats = getTotalStats()
    const jsonContent = {
      metadata: {
        created: new Date().toISOString(),
        originalSize: stats?.totalOriginal || 0,
        compressedSize: stats?.totalCompressed || 0,
        reduction: stats?.reduction || 0,
        tokensSaved: stats?.totalTokensSaved || 0
      },
      files: Object.entries(compressedFiles).reduce((acc, [path, result]: [string, any]) => {
        acc[path] = result.compressed
        return acc
      }, {} as Record<string, string>)
    }
    
    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-optimized-code.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAsZip = async () => {
    if (!isCompressed) return
    
    // Check if JSZip is available
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const stats = getTotalStats()
      
      // Add metadata file
      zip.file('metadata.json', JSON.stringify({
        created: new Date().toISOString(),
        originalSize: stats?.totalOriginal || 0,
        compressedSize: stats?.totalCompressed || 0,
        reduction: stats?.reduction || 0,
        tokensSaved: stats?.totalTokensSaved || 0
      }, null, 2))
      
      // Create compressed folder
      const compressedFolder = zip.folder('compressed')
      
      // Add compressed files
      Object.entries(compressedFiles).forEach(([path, result]: [string, any]) => {
        compressedFolder?.file(path, result.compressed)
      })
      
      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ai-optimized-code.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('JSZip not installed. Falling back to JSON download.')
      downloadAsJson()
    }
  }

  const stats = getTotalStats()

  return (
    <div className="mt-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Share Mode</h3>
            <p className="text-sm text-gray-400">Optimize code for AI sharing & token saving</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Settings className="text-gray-400" size={20} />
        </button>
      </div>

      {/* Options Panel */}
      {showOptions && (
        <div className="mb-4 p-4 bg-black/20 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Compression Options</h4>
          <div className="space-y-2">
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="rounded text-purple-500"
                />
                <span className="text-sm text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {!isCompressed ? (
        <div className="text-center">
          <button
            onClick={handleCompress}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Zap size={20} />
            Compress for AI Sharing
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Reduces file size by ~40-60% while maintaining AI readability
          </p>
        </div>
      ) : (
        <>
          {/* Stats Display */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Original</div>
                <div className="text-lg font-bold text-white">
                  {CodeCompressor.formatBytes(stats.totalOriginal)}
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Compressed</div>
                <div className="text-lg font-bold text-green-400">
                  {CodeCompressor.formatBytes(stats.totalCompressed)}
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Reduction</div>
                <div className="text-lg font-bold text-yellow-400">
                  {stats.reduction}%
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Tokens Saved</div>
                <div className="text-lg font-bold text-purple-400">
                  ~{stats.totalTokensSaved.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-300">Preview Compression</h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
            
            {showPreview && (
              <div className="bg-black/20 rounded-lg p-4">
                <select
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="w-full mb-3 px-3 py-1.5 bg-black/30 text-sm rounded text-white border border-white/10"
                >
                  {Object.keys(compressedFiles).map(path => (
                    <option key={path} value={path}>{path}</option>
                  ))}
                </select>
                
                {selectedFile && compressedFiles[selectedFile] && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Original ({CodeCompressor.formatBytes(compressedFiles[selectedFile].originalSize)})</div>
                      <pre className="text-xs bg-black/30 p-2 rounded overflow-auto max-h-40">
                        {compressedFiles[selectedFile].original.substring(0, 500)}...
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Compressed ({CodeCompressor.formatBytes(compressedFiles[selectedFile].compressedSize)})</div>
                      <pre className="text-xs bg-black/30 p-2 rounded overflow-auto max-h-40">
                        {compressedFiles[selectedFile].compressed.substring(0, 500)}...
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={copyAllCompressed}
              className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2 border border-purple-500/30"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy for AI'}
            </button>
            
            <button
              onClick={downloadCompressed}
              className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 border border-blue-500/30"
            >
              <Download size={18} />
              Download .MD
            </button>
            
            <button
              onClick={downloadAsJson}
              className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 border border-green-500/30"
            >
              <FileText size={18} />
              Download .JSON
            </button>
            
            <button
              onClick={downloadAsZip}
              className="flex-1 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2 border border-yellow-500/30"
            >
              <Archive size={18} />
              Download .ZIP
            </button>
            
            <button
              onClick={() => {
                setIsCompressed(false)
                setCompressedFiles({})
              }}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              Reset
            </button>
          </div>

          {/* Usage Tip */}
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="text-green-400 mt-0.5" size={16} />
              <div className="text-xs text-green-400">
                <strong>AI Usage Tip:</strong> Copy the compressed code and paste it into your AI conversation. 
                The AI will understand the code perfectly while using {stats?.reduction}% fewer tokens!
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}