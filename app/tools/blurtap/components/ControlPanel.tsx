// components/ControlPanel.tsx

import React from 'react'
import { MaskMode, MaskSize, ImageFormat } from '../types'

interface ControlPanelProps {
  mode: MaskMode
  maskSize: MaskSize
  format: ImageFormat
  maskCount: number
  fileName?: string
  onModeChange: (mode: MaskMode) => void
  onMaskSizeChange: (size: MaskSize) => void
  onFormatChange: (format: ImageFormat) => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  maskSize,
  format,
  maskCount,
  fileName,
  onModeChange,
  onMaskSizeChange,
  onFormatChange
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Mode selection */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Mode</label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as MaskMode)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800 [&>option]:text-white"
          >
            <option value="click">Click (fixed)</option>
            <option value="drag">Drag (area)</option>
          </select>
        </div>
        
        {/* Size selection (click mode only) */}
        <div className={mode === 'drag' ? 'opacity-50' : ''}>
          <label className="text-xs text-gray-400 block mb-1">Size</label>
          <select
            value={maskSize}
            onChange={(e) => onMaskSizeChange(e.target.value as MaskSize)}
            disabled={mode === 'drag'}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm disabled:opacity-50 focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800 [&>option]:text-white"
          >
            <option value="xs">XS (80x22)</option>
            <option value="small">Small (100x30)</option>
            <option value="medium">Medium (160x40)</option>
            <option value="large">Large (240x60)</option>
          </select>
        </div>
        
        {/* Format */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Format</label>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800 [&>option]:text-white"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        
        {/* Mask count */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Masks</label>
          <div className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-medium text-center">
            {maskCount}
          </div>
        </div>
        
        {/* File name */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">File</label>
          <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium truncate">
            {fileName || 'No file'}
          </div>
        </div>
      </div>
    </div>
  )
}