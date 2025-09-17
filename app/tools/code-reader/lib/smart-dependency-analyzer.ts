// lib/smart-dependency-analyzer.ts - Simplified version without error detection
import { SmartDependency, DependencyInsight, ProjectStats } from './types'

export class SmartDependencyAnalyzer {
  private files: Map<string, SmartDependency> = new Map()
  private fileContents: Map<string, string> = new Map()
  
  analyze(fileStructure: any, allFiles?: Record<string, string>): DependencyInsight {
    // Store file contents if provided
    if (allFiles) {
      Object.entries(allFiles).forEach(([path, content]) => {
        this.fileContents.set(path, content)
      })
    }
    
    // Build dependency graph only (no error detection)
    this.buildSimpleGraph(fileStructure)
    
    return {
      hotspots: this.getHotspots(),
      orphans: this.getOrphans(),
      cycles: this.detectSimpleCycles(),
      depth: this.calculateMaxDepth(),
      suggestions: this.generateSuggestions(),
      stats: this.calculateProjectStats(),
      errors: [] // Always return empty errors array for compatibility
    }
  }
  
  private buildSimpleGraph(fileStructure: any) {
    const allFiles = Object.values(fileStructure).flat() as any[]
    
    // Clear previous data
    this.files.clear()
    
    // Step 1: Create nodes
    allFiles.forEach(file => {
      this.files.set(file.path, {
        id: file.path,
        name: file.name,
        path: file.path,
        type: file.analysis.fileType,
        imports: [],
        importedBy: [],
        score: 0,
        risk: 'low'
      })
    })
    
    // Step 2: Build dependencies
    allFiles.forEach(file => {
      const node = this.files.get(file.path)!
      
      if (file.analysis.localImports && Array.isArray(file.analysis.localImports)) {
        file.analysis.localImports.forEach((imp: string) => {
          const targetFile = this.findExactMatch(imp, allFiles)
          if (targetFile && targetFile.path !== file.path) {
            node.imports.push(targetFile.path)
            const targetNode = this.files.get(targetFile.path)!
            if (!targetNode.importedBy.includes(file.path)) {
              targetNode.importedBy.push(file.path)
            }
          }
        })
      }
    })
    
    // Step 3: Calculate scores and risks
    this.files.forEach(node => {
      node.score = this.calculateScore(node)
      node.risk = this.calculateRisk(node)
    })
  }
  
  private findExactMatch(importPath: string, allFiles: any[]) {
    const cleanPath = importPath.replace(/^['"`]|['"`]$/g, '')
    
    return allFiles.find(file => {
      const fileName = file.name.replace(/\.(tsx?|jsx?)$/, '')
      const importName = cleanPath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
      
      if (fileName === importName) return true
      if (file.path.includes(cleanPath)) return true
      if (file.path.endsWith(cleanPath + '.tsx') || 
          file.path.endsWith(cleanPath + '.ts') ||
          file.path.endsWith(cleanPath + '.jsx') || 
          file.path.endsWith(cleanPath + '.js')) return true
      
      return false
    })
  }
  
  private calculateScore(node: SmartDependency): number {
    let score = node.importedBy.length * 2 + node.imports.length * 1
    
    const typeBonus = {
      'page': 10,
      'component': 5,
      'util': 3,
      'type': 1,
      'other': 0
    }
    
    return score + typeBonus[node.type]
  }
  
  private calculateRisk(node: SmartDependency): 'low' | 'medium' | 'high' {
    const importedByCount = node.importedBy.length
    
    if (importedByCount > 10) return 'high'
    if (importedByCount > 5) return 'medium'
    return 'low'
  }
  
  private getHotspots(): SmartDependency[] {
    return Array.from(this.files.values())
      .filter(f => f.importedBy.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }
  
  private getOrphans(): SmartDependency[] {
    return Array.from(this.files.values())
      .filter(f => f.importedBy.length === 0 && f.imports.length === 0)
  }
  
  private detectSimpleCycles(): string[][] {
    const cycles: string[][] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    
    const dfs = (nodeId: string, path: string[]) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId)
        if (cycleStart >= 0) {
          cycles.push([...path.slice(cycleStart), nodeId])
        }
        return
      }
      
      if (visited.has(nodeId)) return
      
      visited.add(nodeId)
      recursionStack.add(nodeId)
      
      const node = this.files.get(nodeId)
      if (node) {
        node.imports.forEach(importId => {
          dfs(importId, [...path, nodeId])
        })
      }
      
      recursionStack.delete(nodeId)
    }
    
    this.files.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId, [])
      }
    })
    
    return cycles.slice(0, 3)
  }
  
  private calculateMaxDepth(): number {
    let maxDepth = 0
    
    const calculateNodeDepth = (nodeId: string, depth = 0, visited = new Set<string>()): number => {
      if (visited.has(nodeId)) return depth
      visited.add(nodeId)
      
      const node = this.files.get(nodeId)
      if (!node || node.imports.length === 0) return depth
      
      let nodeMaxDepth = depth
      node.imports.forEach(importId => {
        const importDepth = calculateNodeDepth(importId, depth + 1, new Set(visited))
        nodeMaxDepth = Math.max(nodeMaxDepth, importDepth)
      })
      
      return nodeMaxDepth
    }
    
    this.files.forEach((_, nodeId) => {
      const depth = calculateNodeDepth(nodeId)
      maxDepth = Math.max(maxDepth, depth)
    })
    
    return maxDepth
  }
  
  private calculateProjectStats(): ProjectStats {
    const totalFiles = this.files.size
    const totalDependencies = Array.from(this.files.values())
      .reduce((sum, file) => sum + file.imports.length, 0)
    
    const averageImportsPerFile = totalFiles > 0 ? totalDependencies / totalFiles : 0
    
    const filesWithDependencies = Array.from(this.files.values())
      .filter(f => f.importedBy.length > 0).length
    const reuseabilityScore = totalFiles > 0 ? Math.round((filesWithDependencies / totalFiles) * 100) : 0
    
    const maxDepth = this.calculateMaxDepth()
    const complexityScore = Math.max(0, 100 - (maxDepth * 15))
    const maintainabilityScore = Math.round((reuseabilityScore + complexityScore) / 2)
    
    return {
      totalFiles,
      totalDependencies,
      averageImportsPerFile: Math.round(averageImportsPerFile * 10) / 10,
      reuseabilityScore,
      complexityScore,
      maintainabilityScore
    }
  }
  
  private generateSuggestions(): string[] {
    const suggestions: string[] = []
    
    const hotspots = this.getHotspots()
    if (hotspots.length > 0) {
      const topHotspot = hotspots[0]
      suggestions.push(`🔥 "${topHotspot.name}" is referenced by ${topHotspot.importedBy.length} files. Consider abstraction.`)
    }
    
    const orphans = this.getOrphans()
    if (orphans.length > 0) {
      suggestions.push(`🗑️ ${orphans.length} unused files found. Consider removal.`)
    }
    
    const cycles = this.detectSimpleCycles()
    if (cycles.length > 0) {
      suggestions.push(`♻️ ${cycles.length} circular dependencies detected. Refactoring needed.`)
    }
    
    const depth = this.calculateMaxDepth()
    if (depth > 5) {
      suggestions.push(`📊 Dependency depth is ${depth} levels deep. Consider structural review.`)
    }
    
    const highRiskFiles = Array.from(this.files.values()).filter(f => f.risk === 'high')
    if (highRiskFiles.length > 0) {
      suggestions.push(`⚠️ ${highRiskFiles.length} files have high change risk. Monitor closely.`)
    }
    
    return suggestions
  }
  
  generateAIPrompt(): string {
    const insight = this.getCurrentInsight()
    if (!insight) return ''
    
    const healthGrade = this.getHealthGrade(insight.stats.maintainabilityScore)
    
    return `# Project Analysis Request

## Context
I'm sharing my project's dependency analysis. Please review and provide architectural guidance.

## Project Health Score: ${healthGrade}

### Key Metrics
- **Files**: ${insight.stats.totalFiles}
- **Dependencies**: ${insight.stats.totalDependencies}  
- **Reusability**: ${insight.stats.reuseabilityScore}%
- **Maintainability**: ${insight.stats.maintainabilityScore}%

### Critical Files (Hotspots)
${insight.hotspots.map(f => `- **${f.name}** (${f.importedBy.length} dependencies)`).join('\n')}

### Issues Found
${insight.suggestions.map(s => `- ${s}`).join('\n')}

### Circular Dependencies
${insight.cycles.length > 0 
  ? insight.cycles.map((cycle, i) => `- Cycle ${i + 1}: ${cycle.map(f => f.split('/').pop()).join(' → ')}`).join('\n')
  : '- None detected ✅'
}

## What I Need Help With:
1. **Architecture Review** - Is my current structure scalable?
2. **Refactoring Priority** - Which issues should I tackle first?
3. **Best Practices** - What patterns should I adopt?
4. **Performance** - Any potential bottlenecks?

Please provide specific, actionable advice for improvement.`
  }
  
  generateMarkdownReport(): string {
    const insight = this.getCurrentInsight()
    if (!insight) return ''
    
    const healthGrade = this.getHealthGrade(insight.stats.maintainabilityScore)
    
    return `# 📊 Project Dependency Analysis

## Overview
- **Generated**: ${new Date().toISOString()}
- **Total Files**: ${insight.stats.totalFiles}
- **Total Dependencies**: ${insight.stats.totalDependencies}
- **Average Imports/File**: ${insight.stats.averageImportsPerFile}
- **Health Grade**: ${healthGrade}

## Health Metrics
| Metric | Score | Status |
|--------|-------|--------|
| Reusability | ${insight.stats.reuseabilityScore}% | ${this.getScoreStatus(insight.stats.reuseabilityScore)} |
| Complexity | ${insight.stats.complexityScore}% | ${this.getScoreStatus(insight.stats.complexityScore)} |
| Maintainability | ${insight.stats.maintainabilityScore}% | ${this.getScoreStatus(insight.stats.maintainabilityScore)} |

## Critical Files (Hotspots)
${insight.hotspots.length > 0 
  ? insight.hotspots.map((file, i) => 
    `${i + 1}. **${file.name}** \`${file.path}\`
   - Referenced by: ${file.importedBy.length} files
   - Risk Level: ${file.risk}
`).join('\n')
  : 'No critical dependencies found.'
}

## Issues Detected
${insight.suggestions.length > 0 
  ? insight.suggestions.map(s => `- ${s}`).join('\n')
  : '✅ No issues detected!'
}

## Circular Dependencies
${insight.cycles.length > 0 
  ? insight.cycles.map((cycle, i) => 
    `### Cycle ${i + 1}
\`\`\`
${cycle.join(' → ')}
\`\`\``
  ).join('\n\n')
  : '✅ No circular dependencies found.'
}

## Unused Files
${insight.orphans.length > 0 
  ? insight.orphans.map(f => `- \`${f.path}\``).join('\n')
  : '✅ No unused files found.'
}`
  }
  
  generateCompactJSON(): string {
    const insight = this.getCurrentInsight()
    if (!insight) return '{}'
    
    const compactData = {
      meta: {
        timestamp: new Date().toISOString(),
        totalFiles: insight.stats.totalFiles,
        healthGrade: this.getHealthGrade(insight.stats.maintainabilityScore)
      },
      metrics: insight.stats,
      hotspots: insight.hotspots.slice(0, 3).map(f => ({
        name: f.name,
        path: f.path,
        dependencies: f.importedBy.length,
        risk: f.risk
      })),
      issues: {
        unused: insight.orphans.length,
        cycles: insight.cycles.length,
        maxDepth: insight.depth
      },
      suggestions: insight.suggestions.slice(0, 5)
    }
    
    return JSON.stringify(compactData, null, 2)
  }
  
  private getCurrentInsight(): DependencyInsight | null {
    if (this.files.size === 0) return null
    
    return {
      hotspots: this.getHotspots(),
      orphans: this.getOrphans(),
      cycles: this.detectSimpleCycles(),
      depth: this.calculateMaxDepth(),
      suggestions: this.generateSuggestions(),
      stats: this.calculateProjectStats(),
      errors: []
    }
  }
  
  private getHealthGrade(score: number): string {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B+'
    if (score >= 60) return 'B'
    if (score >= 50) return 'C+'
    if (score >= 40) return 'C'
    return 'D'
  }
  
  private getScoreStatus(score: number): string {
    if (score >= 80) return '✅ Excellent'
    if (score >= 60) return '⚠️ Good'
    if (score >= 40) return '🔶 Fair'
    return '❌ Poor'
  }
  
  getChangeImpact(filePath: string): {
    directDependents: string[]
    indirectDependents: string[]
    allAffectedFiles: string[]
    requiredFiles: string[]
  } {
    const target = this.files.get(filePath)
    if (!target) {
      return { directDependents: [], indirectDependents: [], allAffectedFiles: [], requiredFiles: [] }
    }

    const directDependents = [...target.importedBy]
    const requiredFiles = [...target.imports]
    const indirectDependents: string[] = []
    const visited = new Set<string>()

    const findIndirectDependents = (nodeId: string, depth = 0) => {
      if (depth > 3 || visited.has(nodeId)) return
      visited.add(nodeId)

      const node = this.files.get(nodeId)
      if (node) {
        node.importedBy.forEach(dependent => {
          if (!directDependents.includes(dependent) && !indirectDependents.includes(dependent)) {
            indirectDependents.push(dependent)
            findIndirectDependents(dependent, depth + 1)
          }
        })
      }
    }

    directDependents.forEach(dependent => findIndirectDependents(dependent))

    return {
      directDependents,
      indirectDependents,
      allAffectedFiles: [...directDependents, ...indirectDependents],
      requiredFiles
    }
  }

  generateImpactReport(filePath: string): string {
    const target = this.files.get(filePath)
    if (!target) {
      return `# File not found: ${filePath}\n\nPlease check the file path and try again.`
    }

    const impact = this.getChangeImpact(filePath)
    const fileName = filePath.split('/').pop() || filePath

    let report = `# Change Impact Analysis\n\n`
    report += `## Target File: \`${fileName}\`\n`
    report += `**Path**: \`${filePath}\`\n`
    report += `**Type**: ${target.type}\n`
    report += `**Risk Level**: ${target.risk}\n\n`

    if (impact.requiredFiles.length > 0) {
      report += `## 📋 Required Files (Dependencies)\n`
      report += `**Include these files when modifying \`${fileName}\`:**\n\n`
      impact.requiredFiles.forEach(file => {
        const fileInfo = this.files.get(file)
        const shortName = file.split('/').pop() || file
        report += `- \`${shortName}\` - ${fileInfo?.type || 'unknown'}\n`
      })
      report += '\n'
    }

    if (impact.directDependents.length > 0) {
      report += `## ⚠️ Direct Impact (Files Using This File)\n`
      report += `**These files will be directly affected:**\n\n`
      impact.directDependents.forEach(file => {
        const fileInfo = this.files.get(file)
        const shortName = file.split('/').pop() || file
        report += `- \`${shortName}\` - ${fileInfo?.type || 'unknown'}\n`
      })
      report += '\n'
    }

    if (impact.indirectDependents.length > 0) {
      report += `## 🔄 Indirect Impact (Chain Effects)\n`
      report += `**These files may be indirectly affected:**\n\n`
      impact.indirectDependents.forEach(file => {
        const fileInfo = this.files.get(file)
        const shortName = file.split('/').pop() || file
        report += `- \`${shortName}\` - ${fileInfo?.type || 'unknown'}\n`
      })
      report += '\n'
    }

    const allRelatedFiles = [...impact.requiredFiles, ...impact.allAffectedFiles]
    if (allRelatedFiles.length > 0) {
      report += `## 🤖 AI Sharing Summary\n`
      report += `**When asking AI about \`${fileName}\`, include these ${allRelatedFiles.length} related files:**\n\n`
      report += '```\n'
      allRelatedFiles.forEach(file => {
        report += `${file.split('/').pop()}\n`
      })
      report += '```\n\n'
      report += `**Total context size**: ~${Math.ceil(allRelatedFiles.length * 100 / 4)} tokens (estimated)\n\n`
    }

    if (impact.requiredFiles.length === 0 && impact.allAffectedFiles.length === 0) {
      report += `## ✅ Isolated File\n`
      report += `This file has no dependencies and is not used by other files.\n`
      report += `It can be safely modified or removed without affecting other parts of the codebase.\n\n`
    }

    return report
  }

  generateRelationshipMap(): string {
    let report = `# Project Relationship Map\n\n`
    report += `**Generated**: ${new Date().toISOString()}\n`
    report += `**Files**: ${this.files.size}\n\n`

    const filesByType = {
      'page': [] as string[],
      'component': [] as string[],
      'util': [] as string[],
      'type': [] as string[],
      'other': [] as string[]
    }

    this.files.forEach(file => {
      filesByType[file.type].push(file.path)
    })

    Object.entries(filesByType).forEach(([type, files]) => {
      if (files.length === 0) return

      report += `## ${type.toUpperCase()} Files\n\n`
      
      files.forEach(filePath => {
        const file = this.files.get(filePath)!
        const fileName = filePath.split('/').pop() || filePath
        const directory = filePath.substring(0, filePath.lastIndexOf('/')) || 'root'
        
        if (file.imports.length > 0 || file.importedBy.length > 0) {
          report += `### \`${fileName}\` [${directory}]\n`
          
          if (file.imports.length > 0) {
            report += `**Imports** (${file.imports.length}):\n`
            file.imports.forEach(imp => {
              const impName = imp.split('/').pop() || imp
              const impDir = imp.substring(0, imp.lastIndexOf('/')) || 'root'
              report += `  ↳ ${impName} [${impDir}]\n`
            })
          }
          
          if (file.importedBy.length > 0) {
            report += `**Imported by** (${file.importedBy.length}):\n`
            file.importedBy.forEach(imp => {
              const impName = imp.split('/').pop() || imp
              const impDir = imp.substring(0, imp.lastIndexOf('/')) || 'root'
              report += `  ↰ ${impName} [${impDir}]\n`
            })
          }
          
          report += '\n'
        }
      })
    })

    return report
  }

  estimateTokens(format: 'markdown' | 'json' | 'prompt' | 'impact' | 'relationship'): number {
    let content = ''
    switch (format) {
      case 'markdown':
        content = this.generateMarkdownReport()
        break
      case 'json':
        content = this.generateCompactJSON()
        break
      case 'prompt':
        content = this.generateAIPrompt()
        break
      case 'impact':
        content = this.generateRelationshipMap()
        break
      case 'relationship':
        content = this.generateRelationshipMap()
        break
    }
    
    return Math.ceil(content.length / 4)
  }
}