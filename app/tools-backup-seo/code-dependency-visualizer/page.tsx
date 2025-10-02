// app/tools/code-dependency-visualizer/page.tsx

'use client'

import { useState } from 'react'
import { GitBranch, Info } from 'lucide-react'
import FileUpload from './components/FileUpload'
import MainView from './components/MainView'

export default function CodeDependencyVisualizerPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleFilesSelect = async (selectedFiles: File[]) => {
    setIsProcessing(true)
    try {
      setFiles(selectedFiles)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleReset = () => {
    setFiles([])
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <GitBranch className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">
              Code Dependency Visualizer
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Analyze project structure, compress code for AI, and visualize dependencies.
            Upload your project files or folder to get started.
          </p>
        </div>
        
        {/* Info Banner */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-4 border border-cyan-400/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-cyan-400 mb-1">✨ Version 2.0 - Simplified & Faster</p>
                <ul className="space-y-1 text-gray-400">
                  <li>• <strong>Map Tree:</strong> Instant project structure visualization</li>
                  <li>• <strong>AI Compress:</strong> Reduce tokens by 60% for AI sharing</li>
                  <li>• <strong>Dependencies:</strong> See all imports and exports</li>
                  <li>• Auto-skips node_modules, .git, and build folders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {files.length === 0 ? (
            <FileUpload 
              onFilesSelect={handleFilesSelect}
              isProcessing={isProcessing}
            />
          ) : (
            <MainView 
              files={files}
              onReset={handleReset}
            />
          )}
        </div>
        
        {/* Features Grid */}
        {files.length === 0 && (
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Map Tree</h3>
              <p className="text-gray-400 text-sm">
                Generate Markdown tree structure for documentation
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-white font-semibold mb-2">AI Compress</h3>
              <p className="text-gray-400 text-sm">
                Optimize code for AI context windows with 60% compression
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Dependencies</h3>
              <p className="text-gray-400 text-sm">
                Visualize imports, exports, and module connections
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}