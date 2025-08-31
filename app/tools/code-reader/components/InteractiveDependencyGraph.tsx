'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { FileCode, Package, FileText, Settings, Maximize2, Minimize2 } from 'lucide-react'

interface FileNode {
  id: string
  name: string
  path: string
  type: string
  x: number
  y: number
  imports: string[]
  importedBy: string[]
  group?: number
}

interface Edge {
  source: string
  target: string
}

interface InteractiveDependencyGraphProps {
  fileStructure: any
  allFiles: Record<string, string>
  selectedFile: string | null
  setSelectedFile: (path: string | null) => void
}

export default function InteractiveDependencyGraph({ 
  fileStructure, 
  allFiles,
  selectedFile,
  setSelectedFile
}: InteractiveDependencyGraphProps) {
  
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<FileNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Initialize graph data
  useEffect(() => {
    const newNodes: FileNode[] = []
    const newEdges: Edge[] = []
    const nodeMap = new Map<string, FileNode>()
    
    // Flatten all files
    const allFilesFlat = Object.values(fileStructure).flat() as any[]
    
    // Create nodes with import/export info
    allFilesFlat.forEach((file, index) => {
      const node: FileNode = {
        id: file.path,
        name: file.name,
        path: file.path,
        type: file.analysis.fileType,
        x: 0,
        y: 0,
        imports: file.analysis.localImports || [],
        importedBy: []
      }
      newNodes.push(node)
      nodeMap.set(file.path, node)
    })
    
    // Create edges and track imported-by relationships
    allFilesFlat.forEach(file => {
      if (file.analysis.localImports && file.analysis.localImports.length > 0) {
        file.analysis.localImports.forEach((imp: string) => {
          const targetFile = allFilesFlat.find(f => {
            const importName = imp.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
            const fileName = f.name.replace(/\.(tsx?|jsx?)$/, '')
            return fileName === importName || f.path.includes(imp.replace(/^\.\//, ''))
          })
          
          if (targetFile) {
            newEdges.push({
              source: file.path,
              target: targetFile.path
            })
            
            // Track who imports this file
            const targetNode = nodeMap.get(targetFile.path)
            if (targetNode && !targetNode.importedBy.includes(file.path)) {
              targetNode.importedBy.push(file.path)
            }
          }
        })
      }
    })
    
    // Group related nodes and calculate positions
    const groups = identifyGroups(newNodes, newEdges)
    layoutNodes(newNodes, groups, newEdges)
    
    setNodes(newNodes)
    setEdges(newEdges)
  }, [fileStructure])
  
  // Identify groups of related files
  const identifyGroups = (nodes: FileNode[], edges: Edge[]): Map<string, number> => {
    const groups = new Map<string, number>()
    let groupId = 0
    
    // Group by directory first
    const dirGroups = new Map<string, FileNode[]>()
    nodes.forEach(node => {
      const dir = node.path.substring(0, node.path.lastIndexOf('/')) || 'root'
      if (!dirGroups.has(dir)) {
        dirGroups.set(dir, [])
      }
      dirGroups.get(dir)!.push(node)
    })
    
    // Assign group IDs
    dirGroups.forEach((groupNodes) => {
      groupNodes.forEach(node => {
        node.group = groupId
        groups.set(node.id, groupId)
      })
      groupId++
    })
    
    return groups
  }
  
  // Layout nodes using force-directed layout simulation
  const layoutNodes = (nodes: FileNode[], groups: Map<string, number>, edges: Edge[]) => {
    const width = 1200
    const height = 800
    const centerX = width / 2
    const centerY = height / 2
    
    // Group nodes by their group ID
    const groupedNodes = new Map<number, FileNode[]>()
    nodes.forEach(node => {
      const groupId = node.group || 0
      if (!groupedNodes.has(groupId)) {
        groupedNodes.set(groupId, [])
      }
      groupedNodes.get(groupId)!.push(node)
    })
    
    // Layout each group in a circle around the center
    const numGroups = groupedNodes.size
    let groupIndex = 0
    
    groupedNodes.forEach((groupNodes, groupId) => {
      const angle = (groupIndex / numGroups) * 2 * Math.PI
      const groupRadius = 300
      const groupCenterX = centerX + Math.cos(angle) * groupRadius
      const groupCenterY = centerY + Math.sin(angle) * groupRadius
      
      // Layout nodes within group
      if (groupNodes.length === 1) {
        groupNodes[0].x = groupCenterX
        groupNodes[0].y = groupCenterY
      } else {
        const nodeRadius = Math.min(100, 200 / Math.sqrt(groupNodes.length))
        groupNodes.forEach((node, i) => {
          const nodeAngle = (i / groupNodes.length) * 2 * Math.PI
          node.x = groupCenterX + Math.cos(nodeAngle) * nodeRadius
          node.y = groupCenterY + Math.sin(nodeAngle) * nodeRadius
        })
      }
      
      groupIndex++
    })
    
    // Adjust positions based on connections (simple force simulation)
    for (let iteration = 0; iteration < 50; iteration++) {
      nodes.forEach(node => {
        let fx = 0
        let fy = 0
        
        // Repulsion from other nodes
        nodes.forEach(other => {
          if (node.id !== other.id) {
            const dx = node.x - other.x
            const dy = node.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy) || 1
            const force = 1000 / (distance * distance)
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        })
        
        // Attraction to connected nodes
        edges.forEach(edge => {
          let other: FileNode | undefined
          if (edge.source === node.id) {
            other = nodes.find(n => n.id === edge.target)
          } else if (edge.target === node.id) {
            other = nodes.find(n => n.id === edge.source)
          }
          
          if (other) {
            const dx = other.x - node.x
            const dy = other.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy) || 1
            const force = distance * 0.01
            fx += dx * force
            fy += dy * force
          }
        })
        
        // Apply forces with damping
        node.x += fx * 0.01
        node.y += fy * 0.01
        
        // Keep nodes within bounds
        node.x = Math.max(50, Math.min(width - 50, node.x))
        node.y = Math.max(50, Math.min(height - 50, node.y))
      })
    }
  }
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'page': return '#8b5cf6'
      case 'component': return '#3b82f6'
      case 'util': return '#10b981'
      case 'type': return '#f59e0b'
      default: return '#6b7280'
    }
  }
  
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄'
      case 'component': return '🧩'
      case 'util': return '🔧'
      case 'type': return '📝'
      default: return '📁'
    }
  }
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setDraggingNode(nodeId)
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - node.x,
        y: (e.clientY - rect.top) / zoom - node.y
      })
      setSelectedFile(nodeId)
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const newX = (e.clientX - rect.left) / zoom - dragOffset.x
      const newY = (e.clientY - rect.top) / zoom - dragOffset.y
      
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === draggingNode 
            ? { ...node, x: newX, y: newY }
            : node
        )
      )
    }
  }
  
  const handleMouseUp = () => {
    setDraggingNode(null)
  }
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prevZoom => Math.max(0.5, Math.min(2, prevZoom * delta)))
  }
  
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    layoutNodes(nodes, new Map(), edges)
  }
  
  return (
    <div className={`bg-white/5 rounded-lg border border-white/10 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">
          Interactive Dependency Graph
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetView}
            className="px-3 py-1 bg-white/10 rounded text-sm text-gray-300 hover:bg-white/20"
          >
            Reset View
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 bg-white/10 rounded text-gray-300 hover:bg-white/20"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      <div 
        className="overflow-hidden bg-black/30"
        style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '600px' }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${pan.x} ${pan.y} ${1200 / zoom} ${800 / zoom}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: draggingNode ? 'grabbing' : 'grab' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#60a5fa"
              />
            </marker>
          </defs>
          
          {/* Draw edges */}
          {edges.map((edge, index) => {
            const sourceNode = nodes.find(n => n.id === edge.source)
            const targetNode = nodes.find(n => n.id === edge.target)
            
            if (sourceNode && targetNode) {
              const dx = targetNode.x - sourceNode.x
              const dy = targetNode.y - sourceNode.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance > 0) {
                const nodeRadius = 35
                const startRatio = nodeRadius / distance
                const endRatio = (distance - nodeRadius) / distance
                
                const x1 = sourceNode.x + dx * startRatio
                const y1 = sourceNode.y + dy * startRatio
                const x2 = sourceNode.x + dx * endRatio
                const y2 = sourceNode.y + dy * endRatio
                
                return (
                  <line
                    key={`edge-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#60a5fa"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    opacity="0.6"
                  />
                )
              }
            }
            return null
          })}
          
          {/* Draw nodes */}
          {nodes.map((node) => {
            const isSelected = selectedFile === node.path
            const importCount = node.importedBy.length
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Tooltip on hover */}
                <title>{`${node.path}\nImports: ${node.imports.length}\nImported by: ${importCount}`}</title>
                
                <circle
                  r="35"
                  fill={getNodeColor(node.type)}
                  stroke={isSelected ? '#fbbf24' : '#ffffff'}
                  strokeWidth={isSelected ? '3' : '1'}
                  opacity={node.imports.length > 0 || importCount > 0 ? '1' : '0.4'}
                />
                
                <text
                  textAnchor="middle"
                  dy="-5"
                  fontSize="20"
                  className="select-none pointer-events-none"
                >
                  {getNodeIcon(node.type)}
                </text>
                
                <text
                  textAnchor="middle"
                  dy="20"
                  fontSize="10"
                  fill="white"
                  className="select-none pointer-events-none"
                >
                  {node.name.length > 15 ? node.name.substring(0, 12) + '...' : node.name}
                </text>
                
                {importCount > 0 && (
                  <>
                    <circle
                      cx="25"
                      cy="-25"
                      r="12"
                      fill="#10b981"
                    />
                    <text
                      x="25"
                      y="-20"
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                      className="select-none pointer-events-none"
                    >
                      {importCount}
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Info panel */}
      <div className="p-4 border-t border-white/10">
        <div className="flex justify-between items-start">
          <div className="text-xs text-gray-400">
            <p>Drag nodes to rearrange • Scroll to zoom • Click to select</p>
            <p className="mt-1">Files: {nodes.length} • Dependencies: {edges.length}</p>
          </div>
          
          {selectedFile && (
            <div className="text-xs text-cyan-400">
              <p className="font-semibold">{selectedFile.split('/').pop()}</p>
              <p>Imports: {nodes.find(n => n.id === selectedFile)?.imports.length || 0}</p>
              <p>Imported by: {nodes.find(n => n.id === selectedFile)?.importedBy.length || 0}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}