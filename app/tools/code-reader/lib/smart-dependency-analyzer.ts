// lib/smart-dependency-analyzer.ts - Extended with Error Detection
import { SmartDependency, DependencyInsight, ProjectStats } from './types'

// New error types
export interface CodeError {
  type: 'unresolved_import' | 'circular_dependency' | 'missing_export' | 'unused_file' | 'type_error'
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  details?: string
  quickFix?: string
}

export class SmartDependencyAnalyzer {
  private files: Map<string, SmartDependency> = new Map()
  private errors: CodeError[] = []
  private fileContents: Map<string, string> = new Map()
  
  analyze(fileStructure: any, allFiles?: Record<string, string>): DependencyInsight {
    // Store file contents if provided
    if (allFiles) {
      Object.entries(allFiles).forEach(([path, content]) => {
        this.fileContents.set(path, content)
      })
    }
    
    this.buildSimpleGraph(fileStructure)
    this.detectErrors(fileStructure)
    
    return {
      hotspots: this.getHotspots(),
      orphans: this.getOrphans(),
      cycles: this.detectSimpleCycles(),
      depth: this.calculateMaxDepth(),
      suggestions: this.generateSuggestions(),
      stats: this.calculateProjectStats(),
      errors: this.errors // Add errors to the insight
    }
  }
  
  // New: Detect various types of errors
  private detectErrors(fileStructure: any) {
    this.errors = []
    const allFiles = Object.values(fileStructure).flat() as any[]
    
    allFiles.forEach(file => {
      // 1. Check for unresolved imports
      this.checkUnresolvedImports(file, allFiles)
      
      // 2. Check for missing exports (if we have file contents)
      if (this.fileContents.has(file.path)) {
        this.checkMissingExports(file, allFiles)
      }
      
      // 3. Check for type errors (basic)
      this.checkBasicTypeErrors(file)
    })
    
    // 4. Add circular dependency errors
    const cycles = this.detectSimpleCycles()
    cycles.forEach(cycle => {
      this.errors.push({
        type: 'circular_dependency',
        severity: 'error',
        file: cycle[0],
        message: `Circular dependency detected`,
        details: `Dependency chain: ${cycle.map(f => f.split('/').pop()).join(' → ')}`
      })
    })
    
    // 5. Add unused file warnings
    const orphans = this.getOrphans()
    orphans.forEach(orphan => {
      this.errors.push({
        type: 'unused_file',
        severity: 'warning',
        file: orphan.path,
        message: `File appears to be unused`,
        details: `This file is not imported anywhere and doesn't import anything`,
        quickFix: `Consider removing this file or adding it to the project`
      })
    })
  }
  
  private checkUnresolvedImports(file: any, allFiles: any[]) {
    if (!file.analysis.localImports) return
    
    file.analysis.localImports.forEach((importPath: string) => {
      const cleanPath = importPath.replace(/^['"`]|['"`]$/g, '')
      const resolved = this.findExactMatch(cleanPath, allFiles)
      
      if (!resolved) {
        // Try to find the line number if we have file contents
        let lineNumber: number | undefined
        if (this.fileContents.has(file.path)) {
          const content = this.fileContents.get(file.path)!
          const lines = content.split('\n')
          lineNumber = lines.findIndex(line => 
            line.includes(importPath) || line.includes(cleanPath)
          ) + 1
        }
        
        this.errors.push({
          type: 'unresolved_import',
          severity: 'error',
          file: file.path,
          line: lineNumber,
          message: `Cannot resolve import '${cleanPath}'`,
          details: `The imported module '${cleanPath}' could not be found`,
          quickFix: `Check if the file exists or if the import path is correct`
        })
      }
    })
  }
  
  private checkMissingExports(file: any, allFiles: any[]) {
    const content = this.fileContents.get(file.path)
    if (!content) return
    
    // Files that import this file
    const importingFiles = allFiles.filter(f => 
      f.analysis.localImports?.some((imp: string) => {
        const resolved = this.findExactMatch(imp, allFiles)
        return resolved?.path === file.path
      })
    )
    
    importingFiles.forEach(importingFile => {
      const importingContent = this.fileContents.get(importingFile.path)
      if (!importingContent) return
      
      // Check for named imports
      const namedImportRegex = /import\s*{([^}]+)}\s*from\s*['"`][^'"`]*['"`]/g
      const matches = importingContent.matchAll(namedImportRegex)
      
      for (const match of matches) {
        const imports = match[1].split(',').map(s => s.trim())
        
        imports.forEach(importName => {
          // Check if the export exists in the target file
          const exportExists = this.checkExportExists(content, importName)
          
          if (!exportExists) {
            this.errors.push({
              type: 'missing_export',
              severity: 'error',
              file: importingFile.path,
              message: `Named export '${importName}' not found`,
              details: `'${importName}' is not exported from '${file.name}'`,
              quickFix: `Add 'export' to ${importName} in ${file.name}`
            })
          }
        })
      }
    })
  }
  
  private checkExportExists(content: string, exportName: string): boolean {
    // Simple regex patterns to check for exports
    const patterns = [
      new RegExp(`export\\s+(const|let|var|function|class)\\s+${exportName}\\b`),
      new RegExp(`export\\s*{[^}]*\\b${exportName}\\b[^}]*}`),
      new RegExp(`export\\s*\\*\\s*from`), // export * would export everything
      new RegExp(`export\\s+default\\s+${exportName}\\b`)
    ]
    
    return patterns.some(pattern => pattern.test(content))
  }
  
  private checkBasicTypeErrors(file: any) {
    const content = this.fileContents.get(file.path)
    if (!content) return
    
    // Check for common TypeScript errors
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      // Check for any type usage (basic)
      if (line.includes(': any') && !line.includes('// eslint-disable')) {
        this.errors.push({
          type: 'type_error',
          severity: 'warning',
          file: file.path,
          line: index + 1,
          message: `Avoid using 'any' type`,
          details: `Using 'any' type defeats the purpose of TypeScript`,
          quickFix: `Replace with a specific type or 'unknown'`
        })
      }
      
      // Check for unused variables (simple pattern)
      const unusedVarMatch = line.match(/^\s*(const|let|var)\s+(\w+)\s*=/)
      if (unusedVarMatch) {
        const varName = unusedVarMatch[2]
        const restOfFile = lines.slice(index + 1).join('\n')
        if (!restOfFile.includes(varName)) {
          this.errors.push({
            type: 'type_error',
            severity: 'info',
            file: file.path,
            line: index + 1,
            message: `Variable '${varName}' is declared but never used`,
            quickFix: `Remove unused variable or use it`
          })
        }
      }
    })
  }
  
  // New: Get errors for a specific file
  getFileErrors(filePath: string): CodeError[] {
    return this.errors.filter(error => error.file === filePath)
  }
  
  // New: Get all errors grouped by severity
  getErrorsBySeverity(): {
    errors: CodeError[]
    warnings: CodeError[]
    info: CodeError[]
  } {
    return {
      errors: this.errors.filter(e => e.severity === 'error'),
      warnings: this.errors.filter(e => e.severity === 'warning'),
      info: this.errors.filter(e => e.severity === 'info')
    }
  }
  
  // New: Generate error report
  generateErrorReport(): string {
    const { errors, warnings, info } = this.getErrorsBySeverity()
    
    let report = `# 🔍 Code Analysis Report\n\n`
    report += `**Generated**: ${new Date().toISOString()}\n\n`
    
    // Summary
    report += `## Summary\n`
    report += `- 🔴 **Errors**: ${errors.length}\n`
    report += `- 🟡 **Warnings**: ${warnings.length}\n`
    report += `- 🔵 **Info**: ${info.length}\n\n`
    
    // Errors
    if (errors.length > 0) {
      report += `## 🔴 Errors (${errors.length})\n\n`
      errors.forEach((error, i) => {
        report += `### ${i + 1}. ${error.message}\n`
        report += `- **File**: \`${error.file}\`${error.line ? ` (line ${error.line})` : ''}\n`
        report += `- **Type**: ${error.type.replace(/_/g, ' ')}\n`
        if (error.details) report += `- **Details**: ${error.details}\n`
        if (error.quickFix) report += `- **Quick Fix**: ${error.quickFix}\n`
        report += '\n'
      })
    }
    
    // Warnings
    if (warnings.length > 0) {
      report += `## 🟡 Warnings (${warnings.length})\n\n`
      warnings.forEach((warning, i) => {
        report += `### ${i + 1}. ${warning.message}\n`
        report += `- **File**: \`${warning.file}\`${warning.line ? ` (line ${warning.line})` : ''}\n`
        if (warning.details) report += `- **Details**: ${warning.details}\n`
        if (warning.quickFix) report += `- **Quick Fix**: ${warning.quickFix}\n`
        report += '\n'
      })
    }
    
    // Info
    if (info.length > 0) {
      report += `## 🔵 Info (${info.length})\n\n`
      info.forEach((item, i) => {
        report += `- ${item.message} in \`${item.file}\`${item.line ? ` (line ${item.line})` : ''}\n`
      })
    }
    
    // No issues found
    if (this.errors.length === 0) {
      report += `## ✅ No Issues Found!\n\n`
      report += `Your code looks clean! Keep up the good work.\n`
    }
    
    return report
  }
  
  // Rest of the existing methods remain the same...
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
    
    // Step 2: Build dependencies (simplified approach)
    allFiles.forEach(file => {
      const node = this.files.get(file.path)!
      
      if (file.analysis.localImports && Array.isArray(file.analysis.localImports)) {
        file.analysis.localImports.forEach((imp: string) => {
          const targetFile = this.findExactMatch(imp, allFiles)
          if (targetFile && targetFile.path !== file.path) { // Avoid self-reference
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
    // Clean the import path
    const cleanPath = importPath.replace(/^['"`]|['"`]$/g, '')
    
    // Try different matching strategies
    return allFiles.find(file => {
      const fileName = file.name.replace(/\.(tsx?|jsx?)$/, '')
      const importName = cleanPath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
      
      // Direct file name match (most common)
      if (fileName === importName) return true
      
      // Path contains import
      if (file.path.includes(cleanPath)) return true
      
      // Path ends with import + extension
      if (file.path.endsWith(cleanPath + '.tsx') || 
          file.path.endsWith(cleanPath + '.ts') ||
          file.path.endsWith(cleanPath + '.jsx') || 
          file.path.endsWith(cleanPath + '.js')) return true
      
      return false
    })
  }
  
  private calculateScore(node: SmartDependency): number {
    // Importance = (times imported * 2) + (times imports * 1) + type bonus
    let score = node.importedBy.length * 2 + node.imports.length * 1
    
    const typeBonus = {
      'page': 10,      // Pages are critical
      'component': 5,  // Components are important
      'util': 3,       // Utilities are moderate
      'type': 1,       // Types are low priority
      'other': 0
    }
    
    return score + typeBonus[node.type]
  }
  
  private calculateRisk(node: SmartDependency): 'low' | 'medium' | 'high' {
    const importedByCount = node.importedBy.length
    
    if (importedByCount > 10) return 'high'    // Many files depend on this
    if (importedByCount > 5) return 'medium'   // Moderate dependencies
    return 'low'
  }
  
  private getHotspots(): SmartDependency[] {
    return Array.from(this.files.values())
      .filter(f => f.importedBy.length > 0)     // Only files that are imported
      .sort((a, b) => b.score - a.score)       // Sort by importance
      .slice(0, 5)                             // Top 5
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
        // Found a cycle
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
    
    // Check each node for cycles
    this.files.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId, [])
      }
    })
    
    return cycles.slice(0, 3) // Limit to 3 cycles for readability
  }
  
  private calculateMaxDepth(): number {
    let maxDepth = 0
    
    const calculateNodeDepth = (nodeId: string, depth = 0, visited = new Set<string>()): number => {
      if (visited.has(nodeId)) return depth // Avoid infinite loops
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
    
    // Calculate health scores (0-100)
    const filesWithDependencies = Array.from(this.files.values())
      .filter(f => f.importedBy.length > 0).length
    const reuseabilityScore = totalFiles > 0 ? Math.round((filesWithDependencies / totalFiles) * 100) : 0
    
    const maxDepth = this.calculateMaxDepth()
    const complexityScore = Math.max(0, 100 - (maxDepth * 15)) // Penalty for deep dependencies
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
    
    // Additional intelligent suggestions
    const highRiskFiles = Array.from(this.files.values()).filter(f => f.risk === 'high')
    if (highRiskFiles.length > 0) {
      suggestions.push(`⚠️ ${highRiskFiles.length} files have high change risk. Monitor closely.`)
    }
    
    return suggestions
  }
  
  // Export methods for different formats
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
    
    return `# 🔍 Smart Dependency Analysis Report

## 📊 Project Overview
- **Generated**: ${new Date().toISOString()}
- **Total Files**: ${insight.stats.totalFiles}
- **Total Dependencies**: ${insight.stats.totalDependencies}
- **Average Imports/File**: ${insight.stats.averageImportsPerFile}
- **Health Grade**: ${healthGrade}

## 🎯 Health Metrics
| Metric | Score | Status |
|--------|-------|--------|
| Reusability | ${insight.stats.reuseabilityScore}% | ${this.getScoreStatus(insight.stats.reuseabilityScore)} |
| Complexity | ${insight.stats.complexityScore}% | ${this.getScoreStatus(insight.stats.complexityScore)} |
| Maintainability | ${insight.stats.maintainabilityScore}% | ${this.getScoreStatus(insight.stats.maintainabilityScore)} |

## 🔥 Critical Files (Hotspots)
${insight.hotspots.length > 0 
  ? insight.hotspots.map((file, i) => 
    `${i + 1}. **${file.name}** \`${file.path}\`
   - Referenced by: ${file.importedBy.length} files
   - Risk Level: ${file.risk}
`).join('\n')
  : 'No critical dependencies found.'
}

## ⚠️ Issues Detected
${insight.suggestions.length > 0 
  ? insight.suggestions.map(s => `- ${s}`).join('\n')
  : '✅ No issues detected!'
}

## 🔄 Circular Dependencies
${insight.cycles.length > 0 
  ? insight.cycles.map((cycle, i) => 
    `### Cycle ${i + 1}
\`\`\`
${cycle.join(' → ')}
\`\`\``
  ).join('\n\n')
  : '✅ No circular dependencies found.'
}

## 🗑️ Unused Files
${insight.orphans.length > 0 
  ? insight.orphans.map(f => `- \`${f.path}\``).join('\n')
  : '✅ No unused files found.'
}

## 💡 Recommendations
1. **Focus on hotspots** - Review files with high dependency counts
2. **Clean up orphans** - Remove unused files to reduce maintenance overhead
3. **Break cycles** - Refactor circular dependencies for better modularity
4. **Monitor depth** - Keep dependency chains shallow for better maintainability

---
*Generated by Smart Dependency Analyzer*`
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
      stats: this.calculateProjectStats()
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
  
  // New: Change Impact Analysis
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

    // Find indirect dependents (files that depend on files that depend on this file)
    const findIndirectDependents = (nodeId: string, depth = 0) => {
      if (depth > 3 || visited.has(nodeId)) return // Limit depth to avoid infinite loops
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

  // New: Generate Impact Report for specific file
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

    // Files you need to include when working on this file
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

    // Files that will be affected by changes
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

    // Summary for AI sharing
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

    // No dependencies case
    if (impact.requiredFiles.length === 0 && impact.allAffectedFiles.length === 0) {
      report += `## ✅ Isolated File\n`
      report += `This file has no dependencies and is not used by other files.\n`
      report += `It can be safely modified or removed without affecting other parts of the codebase.\n\n`
    }

    return report
  }

  // New: Generate Relationship Map (lightweight graph as text)
  generateRelationshipMap(): string {
    let report = `# Project Relationship Map\n\n`
    report += `**Generated**: ${new Date().toISOString()}\n`
    report += `**Files**: ${this.files.size}\n\n`

    // Group by file type for better organization
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

    // Show relationships by type
    Object.entries(filesByType).forEach(([type, files]) => {
      if (files.length === 0) return

      report += `## ${type.toUpperCase()} Files\n\n`
      
      files.forEach(filePath => {
        const file = this.files.get(filePath)!
        const fileName = filePath.split('/').pop() || filePath
        
        // Only show files with relationships
        if (file.imports.length > 0 || file.importedBy.length > 0) {
          report += `### \`${fileName}\`\n`
          
          if (file.imports.length > 0) {
            report += `**Imports** (${file.imports.length}):\n`
            file.imports.forEach(imp => {
              const impName = imp.split('/').pop() || imp
              report += `  ↳ ${impName}\n`
            })
          }
          
          if (file.importedBy.length > 0) {
            report += `**Imported by** (${file.importedBy.length}):\n`
            file.importedBy.forEach(imp => {
              const impName = imp.split('/').pop() || imp
              report += `  ↰ ${impName}\n`
            })
          }
          
          report += '\n'
        }
      })
    })

    return report
  }

  // Token estimation for AI sharing
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
    
    // Rough estimation: ~4 characters per token
    return Math.ceil(content.length / 4)
  }
}