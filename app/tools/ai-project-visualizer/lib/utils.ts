// app/tools/ai-project-visualizer/lib/utils.ts

import { TreeNode, ExportFormat, ProjectData } from './types'

// Export format definitions
export const exportFormats: ExportFormat[] = [
  {
    id: 'mermaid',
    name: 'Mermaid Diagram',
    description: 'Text-based diagram that auto-generates visual flowcharts',
    example: 'graph TD\n    A[Project] --> B[src]\n    B --> C[components]',
    bestFor: 'GitHub, Notion, Documentation',
    icon: '🌊'
  },
  {
    id: 'tree',
    name: 'Tree Format',
    description: 'Simple and readable text-based tree structure',
    example: 'project/\n├── src/\n│   └── components/\n└── README.md',
    bestFor: 'Claude, ChatGPT, Text Editors',
    icon: '🌳'
  },
  {
    id: 'json',
    name: 'JSON Format',
    description: 'Structured data format for programmatic processing',
    example: '{"name": "project", "children": [...]}',
    bestFor: 'API Integration, Automation',
    icon: '📊'
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Hierarchical list for documentation',
    example: '## Project Structure\n- src/\n  - components/\n- README.md',
    bestFor: 'README, Documentation',
    icon: '📝'
  }
]

// Generate sample tree data
export const generateSampleTree = (): ProjectData => {
  return {
    name: 'my-ai-project',
    totalFiles: 8,
    totalFolders: 5,
    createdAt: new Date().toISOString(),
    structure: {
      id: 'root',
      name: 'my-ai-project',
      type: 'folder',
      children: [
        {
          id: '1',
          name: 'src',
          type: 'folder',
          children: [
            { 
              id: '1-1', 
              name: 'components', 
              type: 'folder',
              children: [
                { id: '1-1-1', name: 'Header.tsx', type: 'file' },
                { id: '1-1-2', name: 'Footer.tsx', type: 'file' }
              ]
            },
            { 
              id: '1-2', 
              name: 'utils', 
              type: 'folder',
              children: [
                { id: '1-2-1', name: 'helpers.ts', type: 'file' }
              ]
            },
            { id: '1-3', name: 'App.tsx', type: 'file' }
          ]
        },
        {
          id: '2',
          name: 'public',
          type: 'folder',
          children: [
            { id: '2-1', name: 'index.html', type: 'file' }
          ]
        },
        { id: '3', name: 'package.json', type: 'file' },
        { id: '4', name: 'README.md', type: 'file' }
      ]
    }
  }
}

// Convert to Mermaid format
export const toMermaid = (node: TreeNode): string => {
  const lines: string[] = ['```mermaid', 'graph TD']
  let nodeCounter = 0
  
  const processNode = (node: TreeNode, parentId: string | null = null) => {
    const currentId = `N${nodeCounter++}`
    const label = node.type === 'folder' ? `[${node.name}/]` : `[${node.name}]`
    
    if (parentId) {
      lines.push(`    ${parentId} --> ${currentId}${label}`)
    } else {
      lines.push(`    ${currentId}${label}`)
    }
    
    if (node.children) {
      node.children.forEach(child => processNode(child, currentId))
    }
  }
  
  processNode(node)
  lines.push('```')
  return lines.join('\n')
}

// Convert to Tree text format
export const toTree = (node: TreeNode): string => {
  const lines: string[] = []
  
  const processNode = (node: TreeNode, prefix: string = '', isLast: boolean = true) => {
    const connector = isLast ? '└── ' : '├── '
    const name = node.type === 'folder' ? `${node.name}/` : node.name
    
    if (prefix === '') {
      lines.push(name)
    } else {
      lines.push(prefix + connector + name)
    }
    
    if (node.children && node.children.length > 0) {
      const extension = isLast ? '    ' : '│   '
      node.children.forEach((child, index) => {
        processNode(
          child, 
          prefix + extension, 
          index === node.children!.length - 1
        )
      })
    }
  }
  
  processNode(node)
  return lines.join('\n')
}

// Convert to JSON format
export const toJSON = (node: TreeNode): string => {
  const cleanNode = (n: TreeNode): any => {
    const clean: any = {
      name: n.name,
      type: n.type
    }
    if (n.children && n.children.length > 0) {
      clean.children = n.children.map(cleanNode)
    }
    return clean
  }
  
  return JSON.stringify(cleanNode(node), null, 2)
}

// Convert to Markdown format
export const toMarkdown = (node: TreeNode): string => {
  const lines: string[] = [`# ${node.name} Structure\n`]
  
  const processNode = (node: TreeNode, depth: number = 0) => {
    const indent = '  '.repeat(depth)
    const bullet = depth === 0 ? '##' : '-'
    const name = node.type === 'folder' ? `**${node.name}/**` : node.name
    
    if (depth === 0) {
      lines.push(`## Directory Structure\n`)
    } else {
      lines.push(`${indent}${bullet} ${name}`)
    }
    
    if (node.children) {
      node.children.forEach(child => processNode(child, depth + 1))
    }
  }
  
  processNode(node)
  return lines.join('\n')
}

// Main export function
export const exportData = (
  node: TreeNode, 
  format: 'mermaid' | 'tree' | 'json' | 'markdown'
): string => {
  switch (format) {
    case 'mermaid':
      return toMermaid(node)
    case 'tree':
      return toTree(node)
    case 'json':
      return toJSON(node)
    case 'markdown':
      return toMarkdown(node)
    default:
      return ''
  }
}