'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditor } from '../../contexts/EditorContext'

interface HistogramData {
  red: number[]
  green: number[]
  blue: number[]
  luminance: number[]
  max: number
}

export default function Histogram() {
  const { state } = useEditor()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [histogramData, setHistogramData] = useState<HistogramData | null>(null)
  const [channel, setChannel] = useState<'all' | 'red' | 'green' | 'blue' | 'luminance'>('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [statistics, setStatistics] = useState({
    mean: { r: 0, g: 0, b: 0 },
    median: { r: 0, g: 0, b: 0 },
    stdDev: { r: 0, g: 0, b: 0 },
    min: { r: 0, g: 0, b: 0 },
    max: { r: 0, g: 0, b: 0 },
  })

  const calculateHistogram = (imageData: ImageData): HistogramData => {
    const data = imageData.data
    const red = new Array(256).fill(0)
    const green = new Array(256).fill(0)
    const blue = new Array(256).fill(0)
    const luminance = new Array(256).fill(0)

    // Count pixel values
    for (let i = 0; i < data.length; i += 4) {
      red[data[i]]++
      green[data[i + 1]]++
      blue[data[i + 2]]++
      
      // Calculate luminance
      const lum = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      luminance[lum]++
    }

    // Find max value for scaling
    const max = Math.max(
      ...red,
      ...green,
      ...blue,
      ...luminance
    )

    return {
      red,
      green,
      blue,
      luminance,
      max,
    }
  }

  const calculateStatistics = (imageData: ImageData) => {
    const data = imageData.data
    const totalPixels = data.length / 4

    // Collect all values
    const redValues: number[] = []
    const greenValues: number[] = []
    const blueValues: number[] = []

    for (let i = 0; i < data.length; i += 4) {
      redValues.push(data[i])
      greenValues.push(data[i + 1])
      blueValues.push(data[i + 2])
    }

    // Sort for median calculation
    redValues.sort((a, b) => a - b)
    greenValues.sort((a, b) => a - b)
    blueValues.sort((a, b) => a - b)

    // Calculate mean
    const mean = {
      r: redValues.reduce((a, b) => a + b, 0) / totalPixels,
      g: greenValues.reduce((a, b) => a + b, 0) / totalPixels,
      b: blueValues.reduce((a, b) => a + b, 0) / totalPixels,
    }

    // Calculate median
    const mid = Math.floor(totalPixels / 2)
    const median = {
      r: redValues[mid],
      g: greenValues[mid],
      b: blueValues[mid],
    }

    // Calculate standard deviation
    const variance = {
      r: redValues.reduce((sum, val) => sum + Math.pow(val - mean.r, 2), 0) / totalPixels,
      g: greenValues.reduce((sum, val) => sum + Math.pow(val - mean.g, 2), 0) / totalPixels,
      b: blueValues.reduce((sum, val) => sum + Math.pow(val - mean.b, 2), 0) / totalPixels,
    }

    const stdDev = {
      r: Math.sqrt(variance.r),
      g: Math.sqrt(variance.g),
      b: Math.sqrt(variance.b),
    }

    setStatistics({
      mean,
      median,
      stdDev,
      min: {
        r: redValues[0],
        g: greenValues[0],
        b: blueValues[0],
      },
      max: {
        r: redValues[totalPixels - 1],
        g: greenValues[totalPixels - 1],
        b: blueValues[totalPixels - 1],
      },
    })
  }

  const drawHistogram = () => {
    const canvas = canvasRef.current
    if (!canvas || !histogramData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / 256

    // Clear canvas
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    
    // Vertical lines at quarters
    for (let i = 0; i <= 4; i++) {
      const x = (width / 4) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw histogram bars
    const drawChannel = (data: number[], color: string, opacity: number = 0.7) => {
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      
      ctx.beginPath()
      ctx.moveTo(0, height)
      
      for (let i = 0; i < 256; i++) {
        const barHeight = (data[i] / histogramData.max) * height * 0.9
        const x = i * barWidth
        ctx.lineTo(x, height - barHeight)
      }
      
      ctx.lineTo(width, height)
      ctx.closePath()
      ctx.fill()
      
      ctx.globalAlpha = 1
    }

    // Draw selected channels
    if (channel === 'all') {
      drawChannel(histogramData.red, '#ff0000', 0.5)
      drawChannel(histogramData.green, '#00ff00', 0.5)
      drawChannel(histogramData.blue, '#0000ff', 0.5)
    } else if (channel === 'red') {
      drawChannel(histogramData.red, '#ff0000')
    } else if (channel === 'green') {
      drawChannel(histogramData.green, '#00ff00')
    } else if (channel === 'blue') {
      drawChannel(histogramData.blue, '#0000ff')
    } else if (channel === 'luminance') {
      drawChannel(histogramData.luminance, '#ffffff', 0.8)
    }

    // Draw labels
    ctx.fillStyle = 'white'
    ctx.font = '10px Arial'
    ctx.fillText('0', 2, height - 2)
    ctx.fillText('128', width / 2 - 10, height - 2)
    ctx.fillText('255', width - 20, height - 2)
  }

  useEffect(() => {
    if (state.activeLayerId) {
      const activeLayer = state.layers.find(l => l.id === state.activeLayerId)
      if (activeLayer?.data) {
        const histogram = calculateHistogram(activeLayer.data)
        setHistogramData(histogram)
        calculateStatistics(activeLayer.data)
      }
    }
  }, [state.activeLayerId, state.layers])

  useEffect(() => {
    drawHistogram()
  }, [histogramData, channel])

  return (
    <div className={`fixed ${isExpanded ? 'inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center' : 'bottom-4 left-4 z-40'}`}>
      <div className={`bg-gray-900 rounded-lg shadow-lg ${isExpanded ? 'w-full max-w-3xl' : 'w-80'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <h3 className="text-sm font-medium">Histogram</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? '⊟' : '⊞'}
            </button>
          </div>
        </div>

        {/* Histogram Display */}
        <div className="p-4">
          {/* Channel Selector */}
          <div className="flex space-x-1 mb-3">
            <button
              onClick={() => setChannel('all')}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                channel === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => setChannel('red')}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                channel === 'red' ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              R
            </button>
            <button
              onClick={() => setChannel('green')}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                channel === 'green' ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              G
            </button>
            <button
              onClick={() => setChannel('blue')}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                channel === 'blue' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              B
            </button>
            <button
              onClick={() => setChannel('luminance')}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                channel === 'luminance' ? 'bg-gray-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              L
            </button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={isExpanded ? 600 : 256}
            height={isExpanded ? 300 : 128}
            className="w-full bg-gray-800 rounded"
          />

          {/* Statistics (shown when expanded) */}
          {isExpanded && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {/* Red Stats */}
              <div className="bg-gray-800 rounded p-3">
                <h4 className="text-xs font-medium text-red-400 mb-2">Red Channel</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>Mean: {statistics.mean.r.toFixed(1)}</div>
                  <div>Median: {statistics.median.r}</div>
                  <div>Std Dev: {statistics.stdDev.r.toFixed(1)}</div>
                  <div>Range: {statistics.min.r} - {statistics.max.r}</div>
                </div>
              </div>

              {/* Green Stats */}
              <div className="bg-gray-800 rounded p-3">
                <h4 className="text-xs font-medium text-green-400 mb-2">Green Channel</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>Mean: {statistics.mean.g.toFixed(1)}</div>
                  <div>Median: {statistics.median.g}</div>
                  <div>Std Dev: {statistics.stdDev.g.toFixed(1)}</div>
                  <div>Range: {statistics.min.g} - {statistics.max.g}</div>
                </div>
              </div>

              {/* Blue Stats */}
              <div className="bg-gray-800 rounded p-3">
                <h4 className="text-xs font-medium text-blue-400 mb-2">Blue Channel</h4>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>Mean: {statistics.mean.b.toFixed(1)}</div>
                  <div>Median: {statistics.median.b}</div>
                  <div>Std Dev: {statistics.stdDev.b.toFixed(1)}</div>
                  <div>Range: {statistics.min.b} - {statistics.max.b}</div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Tips */}
          {isExpanded && (
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded">
              <h4 className="text-xs font-medium text-yellow-400 mb-1">Histogram Analysis</h4>
              <div className="text-xs text-yellow-300 space-y-1">
                {statistics.mean.r + statistics.mean.g + statistics.mean.b < 300 && (
                  <p>⚠️ Image appears underexposed. Consider increasing brightness.</p>
                )}
                {statistics.mean.r + statistics.mean.g + statistics.mean.b > 600 && (
                  <p>⚠️ Image appears overexposed. Consider reducing brightness.</p>
                )}
                {statistics.stdDev.r < 30 && statistics.stdDev.g < 30 && statistics.stdDev.b < 30 && (
                  <p>⚠️ Low contrast detected. Consider increasing contrast.</p>
                )}
                {Math.abs(statistics.mean.r - statistics.mean.g) > 30 && (
                  <p>⚠️ Color cast detected. Consider color correction.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}