'use client'

import { 
  Eraser, 
  Paintbrush, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Move 
} from 'lucide-react'
import { createEraserCursor, createRestoreCursor } from './constants'
import type { EditTool, HistoryState } from './types'

interface EditingModeProps {
  editCanvasRef: React.RefObject<HTMLCanvasElement>
  editTool: EditTool
  setEditTool: (tool: EditTool) => void
  brushSize: number
  setBrushSize: (size: number) => void
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  pan: { x: number; y: number }
  history: HistoryState[]
  historyIndex: number
  isPanning: boolean
  isTouchDevice: boolean
  onUndo: () => void
  onRedo: () => void
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void
  onPointerMove: (e: React.MouseEvent | React.TouchEvent) => void
  onPointerUp: () => void
  onCancel: () => void
  onFinish: () => void
}

export function EditingMode({
  editCanvasRef,
  editTool,
  setEditTool,
  brushSize,
  setBrushSize,
  zoom,
  setZoom,
  pan,
  history,
  historyIndex,
  isPanning,
  isTouchDevice,
  onUndo,
  onRedo,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onCancel,
  onFinish,
}: EditingModeProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Desktop Toolbar */}
      {!isTouchDevice && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${editTool === 'eraser' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Eraser"
            >
              <Eraser className="w-5 h-5" />
            </button>
            <button
              onClick={() => setEditTool('restore')}
              className={`p-2 rounded-lg transition-colors ${editTool === 'restore' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Restore"
            >
              <Paintbrush className="w-5 h-5" />
            </button>
            <button
              onClick={() => setEditTool('pan')}
              className={`p-2 rounded-lg transition-colors ${editTool === 'pan' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Pan"
            >
              <Move className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-gray-600 mx-2" />
            
            <button onClick={onUndo} disabled={historyIndex <= 0} className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <Undo2 className="w-5 h-5" />
            </button>
            <button onClick={onRedo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Size:</span>
              <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 accent-violet-500" />
              <span className="text-sm text-white w-8">{brushSize}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-white w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Canvas */}
      <div 
        className="relative overflow-auto rounded-2xl bg-gray-900 flex items-center justify-center"
        style={{ 
          height: isTouchDevice ? '50vh' : '400px',
          minHeight: '250px',
          backgroundImage: 'linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        <canvas
          ref={editCanvasRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            cursor: isTouchDevice 
              ? 'default'
              : editTool === 'pan' 
                ? (isPanning ? 'grabbing' : 'grab')
                : editTool === 'eraser'
                  ? createEraserCursor(Math.max(16, Math.min(brushSize, 64)))
                  : createRestoreCursor(Math.max(16, Math.min(brushSize, 64))),
            maxWidth: '100%',
            maxHeight: '100%',
            touchAction: 'none',
          }}
        />
      </div>

      {/* Mobile Toolbar - Bottom Fixed */}
      {isTouchDevice && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 p-3 z-40">
          <div className="max-w-lg mx-auto space-y-3">
            {/* Tool buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setEditTool('eraser')}
                className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  editTool === 'eraser' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Eraser className="w-6 h-6" />
                <span className="text-xs">Eraser</span>
              </button>
              <button
                onClick={() => setEditTool('restore')}
                className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  editTool === 'restore' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Paintbrush className="w-6 h-6" />
                <span className="text-xs">Restore</span>
              </button>
              <button
                onClick={() => setEditTool('pan')}
                className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  editTool === 'pan' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <Move className="w-6 h-6" />
                <span className="text-xs">Move</span>
              </button>
              <button
                onClick={onUndo}
                disabled={historyIndex <= 0}
                className="flex-1 max-w-[80px] py-3 rounded-xl flex flex-col items-center gap-1 bg-gray-800 text-gray-300 disabled:opacity-40"
              >
                <Undo2 className="w-6 h-6" />
                <span className="text-xs">Undo</span>
              </button>
            </div>
            
            {/* Brush size slider */}
            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-gray-400 w-8">Size</span>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={brushSize} 
                onChange={(e) => setBrushSize(Number(e.target.value))} 
                className="flex-1 accent-violet-500 h-2"
              />
              <span className="text-sm text-white w-8 text-right">{brushSize}</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onFinish}
                className="flex-1 py-3 bg-violet-500 text-white rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop hint and buttons */}
      {!isTouchDevice && (
        <>
          <p className="text-xs text-gray-500 text-center">
            💡 Use Eraser to remove unwanted areas, Restore to bring back parts
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              Cancel
            </button>
            <button onClick={onFinish} className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 font-semibold">
              Done Editing
            </button>
          </div>
        </>
      )}
      
      {/* Spacer for mobile toolbar */}
      {isTouchDevice && <div className="h-48" />}
    </div>
  )
}
