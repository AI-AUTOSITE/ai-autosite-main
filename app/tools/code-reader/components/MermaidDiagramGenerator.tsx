'use client'

import { useState } from 'react'
import { 
  GitBranch, 
  Copy, 
  Check, 
  Eye,
  EyeOff,
  Download,
  Settings
} from 'lucide-react'

interface MermaidDiagramGeneratorProps {
  fileStructure: any
  allFiles: Record<string, string>
}

export default function MermaidDiagramGenerator({ fileStructure, allFiles }: MermaidDiagramGeneratorProps) {
  const [diagramType, setDiagramType] = useState<'flowchart' | 'classDiagram' | 'graph'>('flowchart')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [includeExternalDeps, setIncludeExternalDeps] = useState(false)
  const [maxDepth, setMaxDepth] = useState(3)

  // Generate component dependency flowchart
  const generateComponentFlowchart = (): string => {
    let mermaid = 'flowchart TD\n'
    const processedFiles = new Set<string>()
    
    // Analyze imports for each file
    Object.entries(allFiles).forEach(([filePath, content]) => {
      if (processedFiles.has(filePath)) return
      processedFiles.add(filePath)
      
      const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || filePath
      const nodeId = fileName.replace(/[^a-zA-Z0-9]/g, '_')
      
      // Extract imports
      const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"](.+)['"]/g
      let match
      
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1]
        
        // Handle local imports
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          const importedFile = importPath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || importPath
          const importedNodeId = importedFile.replace(/[^a-zA-Z0-9]/g, '_')
          
          mermaid += `    ${nodeId}[${fileName}] --> ${importedNodeId}[${importedFile}]\n`
        } else if (includeExternalDeps) {
          // Handle external dependencies
          const packageName = importPath.split('/')[0]
          const packageNodeId = packageName.replace(/[^a-zA-Z0-9]/g, '_')
          
          mermaid += `    ${nodeId}[${fileName}] --> ${packageNodeId}([${packageName}])\n`
        }
      }
    })
    
    // Add styling
    mermaid += '\n    %% Styling\n'
    mermaid += '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n'
    mermaid += '    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px,stroke-dasharray: 5 5\n'
    
    return mermaid
  }

  // Generate folder structure diagram
  const generateFolderStructure = (): string => {
    let mermaid = 'graph TD\n'
    const processedDirs = new Set<string>()
    
    // Create root node
    mermaid += '    root[Project Root]\n'
    
    Object.entries(fileStructure).forEach(([dir, files]: [string, any]) => {
      if (processedDirs.has(dir)) return
      processedDirs.add(dir)
      
      const dirParts = dir.split('/')
      const dirName = dirParts[dirParts.length - 1] || 'root'
      const dirId = dir.replace(/[^a-zA-Z0-9]/g, '_') || 'root'
      
      // Connect directory to parent
      if (dirParts.length > 1) {
        const parentDir = dirParts.slice(0, -1).join('/')
        const parentId = parentDir.replace(/[^a-zA-Z0-9]/g, '_') || 'root'
        mermaid += `    ${parentId} --> ${dirId}[${dirName}/]\n`
      } else if (dir !== '/') {
        mermaid += `    root --> ${dirId}[${dirName}/]\n`
      }
      
      // Add files in directory (limit to avoid clutter)
      if (files.length <= 5) {
        files.forEach((file: any) => {
          const fileId = file.path.replace(/[^a-zA-Z0-9]/g, '_')
          mermaid += `    ${dirId} --> ${fileId}[${file.name}]\n`
        })
      } else {
        mermaid += `    ${dirId} --> ${dirId}_files[${files.length} files]\n`
      }
    })
    
    // Add styling
    mermaid += '\n    %% Styling\n'
    mermaid += '    classDef folder fill:#fff9c4,stroke:#f57c00,stroke-width:2px\n'
    mermaid += '    classDef file fill:#f3e5f5,stroke:#6a1b9a,stroke-width:1px\n'
    
    return mermaid
  }

  // Generate class diagram for TypeScript/JavaScript files
  const generateClassDiagram = (): string => {
    let mermaid = 'classDiagram\n'
    
    Object.entries(allFiles).forEach(([filePath, content]) => {
      // Only process TypeScript/JavaScript files
      if (!filePath.match(/\.(tsx?|jsx?)$/)) return
      
      const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || filePath
      const className = fileName.replace(/[^a-zA-Z0-9]/g, '_')
      
      // Extract interfaces
      const interfaceRegex = /interface\s+(\w+)\s*{([^}]*)}/g
      let match
      
      while ((match = interfaceRegex.exec(content)) !== null) {
        const interfaceName = match[1]
        const interfaceBody = match[2]
        
        mermaid += `    class ${interfaceName} {\n`
        mermaid += '        <<interface>>\n'
        
        // Extract properties
        const propRegex = /(\w+)\s*:\s*([^;,\n]+)/g
        let propMatch
        while ((propMatch = propRegex.exec(interfaceBody)) !== null) {
          const propName = propMatch[1]
          const propType = propMatch[2].trim()
          mermaid += `        +${propName}: ${propType}\n`
        }
        
        mermaid += '    }\n'
      }
      
      // Extract React components
      const componentRegex = /(?:export\s+)?(?:default\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g
      while ((match = componentRegex.exec(content)) !== null) {
        const componentName = match[1] || match[2]
        if (componentName) {
          mermaid += `    class ${componentName} {\n`
          mermaid += '        <<React Component>>\n'
          
          // Extract props if defined
          const propsRegex = new RegExp(`${componentName}.*?\\(\\s*{([^}]*)}\\s*:\\s*(\\w+)`)
          const propsMatch = content.match(propsRegex)
          if (propsMatch) {
            const propsType = propsMatch[2]
            mermaid += `        +props: ${propsType}\n`
          }
          
          mermaid += '    }\n'
        }
      }
    })
    
    return mermaid
  }

  const generateDiagram = () => {
    switch (diagramType) {
      case 'flowchart':
        return generateComponentFlowchart()
      case 'classDiagram':
        return generateClassDiagram()
      case 'graph':
        return generateFolderStructure()
      default:
        return generateComponentFlowchart()
    }
  }

  const copyDiagram = async () => {
    const diagram = generateDiagram()
    try {
      await navigator.clipboard.writeText(diagram)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadDiagram = () => {
    const diagram = generateDiagram()
    const blob = new Blob([diagram], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mermaid-${diagramType}.mmd`
    a.click()
    URL.revokeObjectURL(url)
  }

  const diagram = generateDiagram()

  return (
    <div className="mt-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <GitBranch className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mermaid Diagram Generator</h3>
            <p className="text-sm text-gray-400">Generate diagrams from your code structure</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {showPreview ? <EyeOff className="text-gray-400" size={20} /> : <Eye className="text-gray-400" size={20} />}
        </button>
      </div>

      {/* Diagram Type Selector */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 mb-2 block">Diagram Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDiagramType('flowchart')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              diagramType === 'flowchart'
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-black/20 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            Component Flow
          </button>
          <button
            onClick={() => setDiagramType('graph')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              diagramType === 'graph'
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-black/20 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            Folder Structure
          </button>
          <button
            onClick={() => setDiagramType('classDiagram')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              diagramType === 'classDiagram'
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                : 'bg-black/20 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            Class Diagram
          </button>
        </div>
      </div>

      {/* Options */}
      {diagramType === 'flowchart' && (
        <div className="mb-4 p-3 bg-black/20 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={includeExternalDeps}
              onChange={(e) => setIncludeExternalDeps(e.target.checked)}
              className="rounded text-cyan-500"
            />
            Include external dependencies
          </label>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="mb-4 bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Mermaid Code Preview</span>
            <span className="text-xs text-gray-400">{diagram.split('\n').length} lines</span>
          </div>
          <pre className="text-xs text-gray-300 overflow-auto max-h-60 font-mono">
            {diagram}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={copyDiagram}
          className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 border border-cyan-500/30"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy Mermaid Code'}
        </button>
        
        <button
          onClick={downloadDiagram}
          className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2 border border-blue-500/30"
        >
          <Download size={18} />
          Download .mmd
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="text-xs text-yellow-400">
          <strong>How to use:</strong>
          <ol className="mt-1 ml-4 list-decimal">
            <li>Copy the Mermaid code above</li>
            <li>Paste into any Mermaid-compatible tool (GitHub, Notion, etc.)</li>
            <li>Or use online editor: mermaid.live</li>
          </ol>
        </div>
      </div>
    </div>
  )
}