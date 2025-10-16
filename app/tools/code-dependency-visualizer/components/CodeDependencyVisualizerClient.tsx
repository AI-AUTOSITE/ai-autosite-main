// app/tools/code-dependency-visualizer/components/CodeDependencyVisualizerClient.tsx
// Mobile optimized version

'use client'

import { useState } from 'react'
import { GitBranch, Info, AlertCircle } from 'lucide-react'
import FileUpload from './FileUpload'
import MainView from './MainView'

export default function CodeDependencyVisualizerClient() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'info' | 'warning'
    message: string
  } | null>(null)

  const handleFilesSelect = async (selectedFiles: File[]) => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setFiles(selectedFiles)
      setNotification(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddFiles = (newFiles: File[]) => {
    const existingPaths = new Set(files.map((f) => f.webkitRelativePath || f.name))
    const finalFiles = [...files]
    const renamedFiles: Array<{ original: string; renamed: string }> = []

    newFiles.forEach((newFile) => {
      const originalPath = newFile.webkitRelativePath || newFile.name
      let path = originalPath
      let counter = 1

      // Check for duplicates and add counter if needed
      while (existingPaths.has(path)) {
        // Split filename and extension properly
        const lastDotIndex = originalPath.lastIndexOf('.')
        const baseName = lastDotIndex > 0 ? originalPath.substring(0, lastDotIndex) : originalPath
        const ext = lastDotIndex > 0 ? originalPath.substring(lastDotIndex) : ''

        path = `${baseName}(${counter})${ext}`
        counter++
      }

      // If path was modified, create new File with updated name
      if (path !== originalPath) {
        const renamedFile = new File([newFile], path, {
          type: newFile.type,
          lastModified: newFile.lastModified,
        })

        // Preserve webkitRelativePath if it exists
        if (newFile.webkitRelativePath) {
          Object.defineProperty(renamedFile, 'webkitRelativePath', {
            value: path,
            writable: false,
          })
        }

        finalFiles.push(renamedFile)
        existingPaths.add(path)
        renamedFiles.push({ original: originalPath, renamed: path })
      } else {
        finalFiles.push(newFile)
        existingPaths.add(path)
      }
    })

    setFiles(finalFiles)

    // Show notification if files were renamed
    if (renamedFiles.length > 0) {
      setNotification({
        type: 'warning',
        message: `${renamedFiles.length} duplicate file(s) were renamed to avoid conflicts`,
      })

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      // Log details for debugging
      console.log('Renamed files:', renamedFiles)
    } else if (newFiles.length > 0) {
      setNotification({
        type: 'info',
        message: `${newFiles.length} file(s) added successfully`,
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleReset = () => {
    setFiles([])
    setNotification(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Notification Banner */}
        {notification && (
          <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
            <div
              className={`rounded-lg p-3 sm:p-4 border animate-slide-down ${
                notification.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-cyan-500/10 border-cyan-500/30'
              }`}
            >
              <div className="flex items-start gap-2">
                {notification.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-xs sm:text-sm ${
                      notification.type === 'warning' ? 'text-yellow-400' : 'text-cyan-400'
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-gray-400 hover:text-white transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {files.length === 0 ? (
            <FileUpload onFilesSelect={handleFilesSelect} isProcessing={isProcessing} />
          ) : (
            <MainView files={files} onReset={handleReset} onAddFiles={handleAddFiles} />
          )}
        </div>
      </div>
    </div>
  )
}