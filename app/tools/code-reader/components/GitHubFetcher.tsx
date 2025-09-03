'use client'

import { useState } from 'react'
import { Github, GitBranch, Loader2, X } from 'lucide-react'

interface GitHubFetcherProps {
  onFilesProcessed: (files: Record<string, string>, structure: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  onCancel?: () => void
}

export default function GitHubFetcher({ 
  onFilesProcessed, 
  isLoading, 
  setIsLoading,
  onCancel 
}: GitHubFetcherProps) {
  const [repoInput, setRepoInput] = useState('')
  const [branch, setBranch] = useState('main')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [isCancelled, setIsCancelled] = useState(false)

  const isAllowedFile = (path: string): boolean => {
    const ext = path.split('.').pop()?.toLowerCase()
    const allowedExts = ['tsx', 'ts', 'jsx', 'js', 'css', 'scss', 'json', 'md', 'mdx', 'html', 'vue', 'svelte']
    return allowedExts.includes(ext || '')
  }

  const shouldIgnorePath = (path: string): boolean => {
    const ignoredFolders = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage']
    return ignoredFolders.some(folder => path.includes(folder))
  }

  const analyzeFileContent = (path: string, content: string) => {
    const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))?\s*(?:,\s*(?:\{[^}]*\}|\w+))?\s*from\s+['"`]([^'"`]+)['"`]/g
    const imports: string[] = []
    let match: RegExpExecArray | null
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }
    
    const localImports = imports.filter((imp: string) => imp.startsWith('.') || imp.startsWith('/'))
    const externalImports = imports.filter((imp: string) => !imp.startsWith('.') && !imp.startsWith('/'))
    
    return {
      fileName: path.split('/').pop() || '',
      fullPath: path,
      fileType: determineFileType(path, content),
      localImports,
      externalImports,
      linesOfCode: content.split('\n').length
    }
  }

  const determineFileType = (path: string, content: string): 'page' | 'component' | 'util' | 'type' | 'other' => {
    if (path.includes('page.') || path.includes('layout.')) return 'page'
    if (path.includes('component')) return 'component'
    if (path.includes('utils') || path.includes('lib')) return 'util'
    if (path.includes('types') || path.includes('.d.ts')) return 'type'
    return 'other'
  }

  const handleCancel = () => {
    setIsCancelled(true)
    if (onCancel) {
      onCancel()
    }
  }

  const handleFetch = async () => {
    setError('')
    setIsCancelled(false)
    
    if (!repoInput) {
      setError('Please enter a repository')
      return
    }
    
    const [owner, repo] = repoInput.split('/')
    if (!owner || !repo) {
      setError('Format: owner/repository (e.g., facebook/react)')
      return
    }

    setIsLoading(true)
    setProgress(10)

    try {
      // Check if cancelled before fetch
      if (isCancelled) {
        setIsLoading(false)
        setProgress(0)
        return
      }

      // Fetch repository tree
      const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      const treeResponse = await fetch(treeUrl)
      
      if (!treeResponse.ok) {
        if (treeResponse.status === 404) {
          throw new Error('Repository not found. Check the name and branch.')
        } else if (treeResponse.status === 403) {
          throw new Error('API rate limit exceeded. Please try again later.')
        }
        throw new Error('Failed to fetch repository')
      }
      
      const treeData = await treeResponse.json()
      setProgress(30)
      
      // Filter for code files
      const codeFiles = treeData.tree.filter((item: any) => {
        if (item.type !== 'blob') return false
        if (shouldIgnorePath(item.path)) return false
        return isAllowedFile(item.path)
      })
      
      if (codeFiles.length === 0) {
        throw new Error('No code files found in repository')
      }
      
      setProgress(40)
      
      // Process files
      const allFiles: Record<string, string> = {}
      const fileStructure: any = {}
      
      // Fetch file contents (limiting to first 50 files for demo)
      const filesToFetch = codeFiles.slice(0, 50)
      
      for (let i = 0; i < filesToFetch.length; i++) {
        // Check if cancelled
        if (isCancelled) {
          setIsLoading(false)
          setProgress(0)
          return
        }

        const file = filesToFetch[i]
        const currentProgress = 40 + ((i / filesToFetch.length) * 50)
        setProgress(currentProgress)
        
        try {
          const contentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`
          const contentResponse = await fetch(contentUrl)
          
          if (contentResponse.ok) {
            const content = await contentResponse.text()
            allFiles[file.path] = content
            
            const parts = file.path.split('/')
            const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '/'
            
            if (!fileStructure[dir]) fileStructure[dir] = []
            
            fileStructure[dir].push({
              name: parts[parts.length - 1],
              path: file.path,
              size: file.size || 0,
              analysis: analyzeFileContent(file.path, content)
            })
          }
        } catch (err) {
          console.error(`Error fetching ${file.path}:`, err)
        }
        
        // Small delay to avoid rate limiting
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      if (!isCancelled) {
        setProgress(100)
        onFilesProcessed(allFiles, fileStructure)
      }
      
    } catch (error: any) {
      if (!isCancelled) {
        setError(error.message || 'An error occurred')
      }
    } finally {
      setIsLoading(false)
      setProgress(0)
      setIsCancelled(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={repoInput}
          onChange={(e) => setRepoInput(e.target.value)}
          placeholder="owner/repository (e.g., facebook/react)"
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          disabled={isLoading}
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [&>option]:bg-slate-800 [&>option]:text-white"
          disabled={isLoading}
        >
          <option value="main">main</option>
          <option value="master">master</option>
          <option value="develop">develop</option>
        </select>
        <button
          onClick={handleFetch}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Fetching...
            </>
          ) : (
            <>
              <Github size={18} />
              Fetch Repository
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Processing repository...</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-cyan-400">{Math.round(progress)}%</span>
              {onCancel && (
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors border border-red-500/30 flex items-center gap-1"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-400 flex items-center">
        <GitBranch size={12} className="inline mr-1" />
        Note: Limited to 50 files to avoid API rate limits. For larger repos, use local upload.
      </div>
    </div>
  )
}