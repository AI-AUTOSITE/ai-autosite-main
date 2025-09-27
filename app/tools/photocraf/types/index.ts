// Layer types
export interface Layer {
  id: string
  name: string
  type: 'image' | 'text' | 'shape' | 'adjustment'
  visible: boolean
  opacity: number
  blendMode: BlendMode
  locked: boolean
  data: ImageData | null
  position: { x: number; y: number }
  size: { width: number; height: number }
  filters: string[]
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'color-dodge'
  | 'color-burn'
  | 'darken'
  | 'lighten'
  | 'difference'
  | 'exclusion'

// Filter types
export interface Filter {
  id: string
  name: string
  category: 'basic' | 'advanced' | 'custom'
  params: FilterParam[]
  apply: (imageData: ImageData, params: Record<string, any>) => ImageData
}

export interface FilterParam {
  name: string
  type: 'number' | 'color' | 'select' | 'boolean'
  default: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
}

export interface CustomFilter extends Filter {
  code: string
  author: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  downloads?: number
  rating?: number
}

// Tool types
export type Tool =
  | 'select'
  | 'move'
  | 'crop'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'shape'
  | 'eyedropper'
  | 'zoom'
  | 'hand'

export interface ToolSettings {
  brush: {
    size: number
    hardness: number
    opacity: number
    flow: number
    color: string
  }
  eraser: {
    size: number
    hardness: number
    opacity: number
  }
  text: {
    font: string
    size: number
    color: string
    bold: boolean
    italic: boolean
    align: 'left' | 'center' | 'right'
  }
  shape: {
    type: 'rectangle' | 'ellipse' | 'line' | 'polygon'
    fill: string
    stroke: string
    strokeWidth: number
  }
}

// History types
export interface HistoryState {
  id: string
  timestamp: number
  action: string
  snapshot: ImageData
  layerStates: Layer[]
}

// User plan types
export type PlanType = 'free' | 'starter' | 'pro' | 'unlimited'

export interface UserPlan {
  type: PlanType
  maxSlots: number
  maxResolution: { width: number; height: number }
  features: string[]
  watermark: boolean
}

export const PLAN_CONFIGS: Record<PlanType, UserPlan> = {
  free: {
    type: 'free',
    maxSlots: 3,
    maxResolution: { width: 1920, height: 1080 },
    features: ['basic_filters', 'basic_tools'],
    watermark: true,
  },
  starter: {
    type: 'starter',
    maxSlots: 10,
    maxResolution: { width: 3840, height: 2160 },
    features: ['all_filters', 'custom_filters', 'basic_tools'],
    watermark: false,
  },
  pro: {
    type: 'pro',
    maxSlots: 30,
    maxResolution: { width: 7680, height: 4320 },
    features: ['all_filters', 'custom_filters', 'all_tools', 'batch_processing', 'cloud_storage'],
    watermark: false,
  },
  unlimited: {
    type: 'unlimited',
    maxSlots: Infinity,
    maxResolution: { width: Infinity, height: Infinity },
    features: ['all_filters', 'custom_filters', 'all_tools', 'batch_processing', 'cloud_storage', 'api_access', 'priority_support'],
    watermark: false,
  },
}

// Canvas state
export interface CanvasState {
  width: number
  height: number
  zoom: number
  panX: number
  panY: number
  rotation: number
  flipX: boolean
  flipY: boolean
}

// Editor state
export interface EditorState {
  canvas: CanvasState
  layers: Layer[]
  activeLayerId: string | null
  activeTool: Tool
  toolSettings: ToolSettings
  history: HistoryState[]
  historyIndex: number
  isProcessing: boolean
  error: string | null
}

// Slot system
export interface FilterSlot {
  id: string
  filter: CustomFilter | null
  isActive: boolean
  order: number
}

export interface SlotState {
  slots: FilterSlot[]
  usedSlots: number
  maxSlots: number
  plan: PlanType
}

// Export formats
export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg'

export interface ExportOptions {
  format: ExportFormat
  quality: number
  scale: number
  includeWatermark: boolean
}

// WebGL Shader
export interface Shader {
  vertex: string
  fragment: string
  uniforms: Record<string, any>
}

// Events
export interface EditorEvent {
  type: 'filter_applied' | 'layer_added' | 'layer_removed' | 'tool_changed' | 'canvas_resized'
  payload: any
  timestamp: number
}