// app/tools/code-reader/lib/dependency-analyzer.ts
export interface DependencyNode {
  id: string
  name: string
  path: string
  type: 'page' | 'component' | 'util' | 'type' | 'other'
  imports: string[]
  importedBy: string[]
  depth: number
  linesOfCode: number
}

export interface DependencyEdge {
  source: string
  target: string
  type: 'local' | 'external'
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>
  edges: DependencyEdge[]
  hotspots: Array<{ path: string; count: number }>
  circularDependencies: string[][]
  externalLibraries: Map<string, number>
}

export class DependencyAnalyzer {
  private graph: DependencyGraph
  private filePathMap: Map<string, string> = new Map() // ファイル名からフルパスへのマップ
  
  constructor() {
    this.graph = {
      nodes: new Map(),
      edges: [],
      hotspots: [],
      circularDependencies: [],
      externalLibraries: new Map()
    }
  }
  
  analyze(fileStructure: any, allFiles: Record<string, string>): DependencyGraph {
    // ファイルパスマップを作成
    this.buildFilePathMap(fileStructure)
    this.buildGraph(fileStructure)
    this.detectCircularDependencies()
    this.calculateHotspots()
    this.analyzeExternalLibraries(fileStructure)
    return this.graph
  }
  
  private buildFilePathMap(fileStructure: any) {
    const allFiles = Object.values(fileStructure).flat() as any[]
    
    allFiles.forEach(file => {
      // ファイル名のバリエーションを登録
      const fileName = file.name
      const fileNameWithoutExt = fileName.replace(/\.(tsx?|jsx?)$/, '')
      const relativePath = file.path
      
      // フルパスで登録
      this.filePathMap.set(file.path, file.path)
      // ファイル名で登録
      this.filePathMap.set(fileName, file.path)
      // 拡張子なしで登録
      this.filePathMap.set(fileNameWithoutExt, file.path)
      
      // パスの各部分でも登録（例：components/Header -> Header.tsx のマッピング）
      const pathParts = file.path.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      const lastPartWithoutExt = lastPart.replace(/\.(tsx?|jsx?)$/, '')
      
      // 相対パスのバリエーション
      if (pathParts.length > 1) {
        const partialPath = pathParts.slice(-2).join('/')
        const partialPathWithoutExt = partialPath.replace(/\.(tsx?|jsx?)$/, '')
        this.filePathMap.set(partialPath, file.path)
        this.filePathMap.set(partialPathWithoutExt, file.path)
      }
    })
  }
  
  private buildGraph(fileStructure: any) {
    const allFiles = Object.values(fileStructure).flat() as any[]
    
    // Create nodes
    allFiles.forEach(file => {
      this.graph.nodes.set(file.path, {
        id: file.path,
        name: file.name,
        path: file.path,
        type: file.analysis.fileType,
        imports: file.analysis.localImports || [],
        importedBy: [],
        depth: 0,
        linesOfCode: file.analysis.linesOfCode || 0
      })
    })
    
    // Build edges and reverse dependencies
    allFiles.forEach(file => {
      const sourceNode = this.graph.nodes.get(file.path)
      if (!sourceNode) return
      
      // ローカルインポートを処理
      if (file.analysis.localImports && Array.isArray(file.analysis.localImports)) {
        file.analysis.localImports.forEach((imp: string) => {
          const targetPath = this.resolveImportPath(imp, file.path)
          
          if (targetPath && targetPath !== file.path) { // 自己参照を除外
            const targetNode = this.graph.nodes.get(targetPath)
            
            if (targetNode) {
              // エッジを追加
              this.graph.edges.push({
                source: file.path,
                target: targetPath,
                type: 'local'
              })
              
              // 逆依存を追加
              if (!targetNode.importedBy.includes(file.path)) {
                targetNode.importedBy.push(file.path)
              }
            }
          }
        })
      }
    })
    
    console.log('Graph built:', {
      nodes: this.graph.nodes.size,
      edges: this.graph.edges.length,
      filePathMap: this.filePathMap.size
    })
  }
  
  private resolveImportPath(importPath: string, fromFile: string): string | null {
    // 外部ライブラリの場合はnullを返す
    if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
      return null
    }
    
    // importPathをクリーンアップ
    let cleanPath = importPath
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '')
      .replace(/^\.\//, '')
      .replace(/^\.\.\//, '')
      .replace(/^@\//, '')
    
    // 現在のファイルのディレクトリを取得
    const fromDir = fromFile.substring(0, fromFile.lastIndexOf('/'))
    
    // さまざまなパスのバリエーションを試す
    const pathVariations = [
      cleanPath,
      cleanPath + '.tsx',
      cleanPath + '.ts',
      cleanPath + '.jsx',
      cleanPath + '.js',
      cleanPath + '/index.tsx',
      cleanPath + '/index.ts',
      cleanPath + '/index.jsx',
      cleanPath + '/index.js',
    ]
    
    // 相対パスの場合、fromDirからの相対パスも試す
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const relativePath = this.resolveRelativePath(fromDir, cleanPath)
      pathVariations.push(
        relativePath,
        relativePath + '.tsx',
        relativePath + '.ts',
        relativePath + '.jsx',
        relativePath + '.js'
      )
    }
    
    // パスのバリエーションから実際のファイルを探す
    for (const variation of pathVariations) {
      // 直接マッチを試す
      if (this.filePathMap.has(variation)) {
        return this.filePathMap.get(variation)!
      }
      
      // 部分マッチを試す
      for (const [key, value] of this.filePathMap.entries()) {
        if (key.endsWith(variation) || key.includes(variation)) {
          return value
        }
      }
    }
    
    return null
  }
  
  private resolveRelativePath(fromDir: string, relativePath: string): string {
    const fromParts = fromDir.split('/').filter(p => p)
    const pathParts = relativePath.split('/').filter(p => p)
    
    const result = [...fromParts]
    
    for (const part of pathParts) {
      if (part === '..') {
        result.pop()
      } else if (part !== '.') {
        result.push(part)
      }
    }
    
    return result.join('/')
  }
  
  private detectCircularDependencies() {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    const cycles: string[][] = []
    
    const dfs = (node: string, path: string[] = []): void => {
      visited.add(node)
      recursionStack.add(node)
      path.push(node)
      
      const nodeData = this.graph.nodes.get(node)
      if (nodeData && nodeData.imports) {
        nodeData.imports.forEach(imp => {
          const targetPath = this.resolveImportPath(imp, node)
          if (targetPath) {
            if (!visited.has(targetPath)) {
              dfs(targetPath, [...path])
            } else if (recursionStack.has(targetPath)) {
              const cycleStart = path.indexOf(targetPath)
              if (cycleStart !== -1) {
                cycles.push(path.slice(cycleStart))
              }
            }
          }
        })
      }
      
      recursionStack.delete(node)
    }
    
    this.graph.nodes.forEach((_, key) => {
      if (!visited.has(key)) {
        dfs(key)
      }
    })
    
    this.graph.circularDependencies = cycles
  }
  
  private calculateHotspots() {
    const importCounts = new Map<string, number>()
    
    this.graph.nodes.forEach(node => {
      importCounts.set(node.path, node.importedBy.length)
    })
    
    this.graph.hotspots = Array.from(importCounts.entries())
      .filter(([_, count]) => count > 0) // 0より大きいもののみ
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }))
  }
  
  private analyzeExternalLibraries(fileStructure: any) {
    const allFiles = Object.values(fileStructure).flat() as any[]
    
    allFiles.forEach(file => {
      if (file.analysis.externalImports && Array.isArray(file.analysis.externalImports)) {
        file.analysis.externalImports.forEach((lib: string) => {
          const count = this.graph.externalLibraries.get(lib) || 0
          this.graph.externalLibraries.set(lib, count + 1)
        })
      }
    })
  }
  
  // Export methods for different formats
  toText(): string {
    return this.generateTextReport()
  }
  
  toJSON(): string {
    return JSON.stringify({
      nodes: Array.from(this.graph.nodes.values()),
      edges: this.graph.edges,
      hotspots: this.graph.hotspots,
      circularDependencies: this.graph.circularDependencies,
      externalLibraries: Array.from(this.graph.externalLibraries.entries())
    }, null, 2)
  }
  
  toMermaid(): string {
    let mermaid = 'graph TD\n'
    
    // ノードのスタイル定義
    this.graph.nodes.forEach(node => {
      const nodeName = node.path.split('/').pop()?.replace(/\./g, '_') || node.id
      const label = node.name
      
      // ファイルタイプに応じたスタイル
      let style = ''
      switch (node.type) {
        case 'page':
          style = `style ${nodeName} fill:#8b5cf6,stroke:#7c3aed,color:#fff`
          break
        case 'component':
          style = `style ${nodeName} fill:#3b82f6,stroke:#2563eb,color:#fff`
          break
        case 'util':
          style = `style ${nodeName} fill:#10b981,stroke:#059669,color:#fff`
          break
        case 'type':
          style = `style ${nodeName} fill:#f59e0b,stroke:#d97706,color:#fff`
          break
      }
      
      mermaid += `  ${nodeName}["${label}"]\n`
      if (style) {
        mermaid += `  ${style}\n`
      }
    })
    
    // エッジの描画
    this.graph.edges.forEach(edge => {
      const source = edge.source.split('/').pop()?.replace(/\./g, '_')
      const target = edge.target.split('/').pop()?.replace(/\./g, '_')
      if (source && target) {
        mermaid += `  ${source} --> ${target}\n`
      }
    })
    
    return mermaid
  }
  
  private generateTextReport(): string {
    let report = '=== PROJECT DEPENDENCY ANALYSIS ===\n\n'
    report += `Generated: ${new Date().toISOString()}\n`
    report += `Total Files: ${this.graph.nodes.size}\n`
    report += `Total Dependencies: ${this.graph.edges.length}\n\n`
    
    // File Structure with Dependencies
    report += '📁 DEPENDENCY MAP:\n'
    report += '=' .repeat(50) + '\n\n'
    
    // 依存関係があるファイルのみ表示
    const nodesWithDeps = Array.from(this.graph.nodes.values())
      .filter(node => node.imports.length > 0 || node.importedBy.length > 0)
    
    if (nodesWithDeps.length === 0) {
      report += 'No dependencies found. Check import path resolution.\n\n'
    } else {
      nodesWithDeps.forEach(node => {
        report += `📄 ${node.path}\n`
        report += `   Type: ${node.type} | Lines: ${node.linesOfCode}\n`
        
        if (node.imports.length > 0) {
          report += `   Imports (${node.imports.length}):\n`
          node.imports.forEach(imp => {
            const resolvedPath = this.resolveImportPath(imp, node.path)
            if (resolvedPath) {
              report += `     └─→ ${imp} (${resolvedPath})\n`
            } else {
              report += `     └─→ ${imp}\n`
            }
          })
        }
        
        if (node.importedBy.length > 0) {
          report += `   Imported by (${node.importedBy.length}):\n`
          node.importedBy.forEach(imp => {
            report += `     ←── ${imp}\n`
          })
        }
        report += '\n'
      })
    }
    
    // Hotspots
    if (this.graph.hotspots.length > 0) {
      report += '\n🔥 DEPENDENCY HOTSPOTS:\n'
      report += '=' .repeat(50) + '\n\n'
      this.graph.hotspots.forEach((spot, index) => {
        const fileName = spot.path.split('/').pop() || spot.path
        report += `${index + 1}. ${fileName} (${spot.path})\n`
        report += `   Imported by ${spot.count} files\n\n`
      })
    }
    
    // Circular Dependencies
    if (this.graph.circularDependencies.length > 0) {
      report += '\n⚠️ CIRCULAR DEPENDENCIES DETECTED:\n'
      report += '=' .repeat(50) + '\n\n'
      this.graph.circularDependencies.forEach((cycle, index) => {
        report += `Cycle ${index + 1}:\n`
        cycle.forEach((file, i) => {
          report += `  ${i + 1}. ${file}\n`
        })
        report += '\n'
      })
    }
    
    // External Libraries
    if (this.graph.externalLibraries.size > 0) {
      report += '\n📦 EXTERNAL LIBRARIES:\n'
      report += '=' .repeat(50) + '\n\n'
      Array.from(this.graph.externalLibraries.entries())
        .sort(([, a], [, b]) => b - a)
        .forEach(([lib, count]) => {
          report += `  • ${lib} (used ${count} times)\n`
        })
    }
    
    return report
  }
}