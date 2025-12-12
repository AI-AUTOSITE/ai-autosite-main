// Status types
export type Status = 'idle' | 'loading-model' | 'processing' | 'done' | 'editing' | 'error'
export type OutputFormat = 'png' | 'webp' | 'jpg' | 'svg'
export type EditTool = 'eraser' | 'restore' | 'pan'

// Data interfaces
export interface ProcessedImage {
  originalUrl: string
  resultUrl: string
  originalFile: File
  resultBlob: Blob | null
  width: number
  height: number
}

export interface HistoryState {
  imageData: ImageData
}

// Hook return types
export interface UseBgRemovalReturn {
  loadModel: () => Promise<void>
  removeBackground: (file: File) => Promise<{ blob: Blob; width: number; height: number }>
  modelLoaded: boolean
}

export interface UseEditCanvasReturn {
  editCanvasRef: React.RefObject<HTMLCanvasElement>
  initEditCanvas: () => Promise<void>
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  handlePointerDown: (e: React.MouseEvent | React.TouchEvent) => void
  handlePointerMove: (e: React.MouseEvent | React.TouchEvent) => void
  handlePointerUp: () => void
  finishEditing: () => Promise<void>
  history: HistoryState[]
  historyIndex: number
  isDrawing: boolean
  isPanning: boolean
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  pan: { x: number; y: number }
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  brushSize: number
  setBrushSize: React.Dispatch<React.SetStateAction<number>>
  editTool: EditTool
  setEditTool: React.Dispatch<React.SetStateAction<EditTool>>
}
