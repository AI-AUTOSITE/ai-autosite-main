// types/index.ts

// ========== JSON Processing Types ==========
export type ProcessMode = 'beautify' | 'minify'

export interface JsonStats {
  keys: number
  arrays: number
  objects: number
  size: number
}

export interface ProcessResult {
  success: boolean
  output: string
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  parsedData?: any
}

// ========== UI State Types ==========
export interface JsonBeautifyState {
  inputJson: string
  outputJson: string
  error: string
  success: string
  copied: boolean
  indentSize: IndentSize
  mode: ProcessMode
}

export type IndentSize = 2 | 4 | 8

export interface MessageState {
  type: 'error' | 'success' | 'info' | 'warning'
  message: string
  duration?: number
}

// ========== File Operation Types ==========
export interface FileReadResult {
  success: boolean
  content?: string
  error?: string
}

export interface FileDownloadOptions {
  filename?: string
  mimeType?: string
  prettify?: boolean
  indentSize?: number
}

export interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList
  }
}

// ========== Component Props Types ==========
export interface JsonEditorProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  label?: string
  className?: string
  height?: string | number
  onClear?: () => void
  onCopy?: () => void
  onDownload?: () => void
  showActions?: boolean
}

export interface ControlPanelProps {
  mode: ProcessMode
  onModeChange: (mode: ProcessMode) => void
  indentSize: IndentSize
  onIndentChange: (size: IndentSize) => void
  onLoadSample: () => void
  onFileUpload: (event: FileUploadEvent) => void
  disabled?: boolean
}

export interface StatsDisplayProps {
  stats: JsonStats
  className?: string
  compact?: boolean
}

export interface MessageDisplayProps {
  error?: string
  success?: string
  warning?: string
  info?: string
  onClose?: () => void
  autoHide?: boolean
  duration?: number
}

// ========== Feature Configuration Types ==========
export interface FeatureFlags {
  enableSyntaxHighlighting: boolean
  enableJsonPath: boolean
  enableDiffView: boolean
  enableSchemaValidation: boolean
  enableThemeToggle: boolean
  enableKeyboardShortcuts: boolean
  maxFileSize: number
  defaultIndentSize: IndentSize
  defaultMode: ProcessMode
}

export interface AppConfig {
  features: FeatureFlags
  theme: ThemeConfig
  shortcuts: KeyboardShortcuts
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
}

export interface KeyboardShortcuts {
  format: string
  minify: string
  clear: string
  copy: string
  download: string
  upload: string
  toggleMode: string
}

// ========== Utility Types ==========
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ValueOf<T> = T[keyof T]

// ========== API Types (for future backend integration) ==========
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface JsonDocument {
  id: string
  name: string
  content: string
  size: number
  createdAt: Date
  updatedAt: Date
  metadata?: DocumentMetadata
}

export interface DocumentMetadata {
  author?: string
  description?: string
  tags?: string[]
  version?: string
  isPublic?: boolean
}

// ========== Event Handler Types ==========
export type JsonChangeHandler = (value: string) => void
export type ModeChangeHandler = (mode: ProcessMode) => void
export type IndentChangeHandler = (size: IndentSize) => void
export type FileUploadHandler = (event: FileUploadEvent) => void
export type ErrorHandler = (error: Error | string) => void
export type SuccessHandler = (message: string) => void

// ========== Hook Return Types ==========
export interface UseJsonProcessorReturn {
  inputJson: string
  outputJson: string
  error: string
  success: string
  mode: ProcessMode
  indentSize: IndentSize
  stats: JsonStats
  isProcessing: boolean
  processJson: (text: string) => void
  setMode: (mode: ProcessMode) => void
  setIndentSize: (size: IndentSize) => void
  clear: () => void
}

export interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<boolean>
  paste: () => Promise<string | null>
}

export interface UseFileHandlerReturn {
  isLoading: boolean
  error: string | null
  uploadFile: (file: File) => Promise<FileReadResult>
  downloadFile: (data: any, options?: FileDownloadOptions) => void
}

// ========== Constants Types ==========
export const INDENT_OPTIONS = [2, 4, 8] as const
export const PROCESS_MODES = ['beautify', 'minify'] as const
export const MESSAGE_TYPES = ['error', 'success', 'info', 'warning'] as const

// ========== Sample Data Type ==========
export interface SampleData {
  name: string
  description: string
  data: any
}

export const SAMPLE_DATA_SETS: SampleData[] = [
  {
    name: 'Basic Object',
    description: 'Simple JSON object with various data types',
    data: {
      name: 'AI AutoSite',
      version: '1.0.0',
      active: true,
      count: 42
    }
  },
  {
    name: 'Nested Structure',
    description: 'Complex nested JSON with arrays and objects',
    data: {
      users: [
        { id: 1, name: 'Alice', roles: ['admin', 'user'] },
        { id: 2, name: 'Bob', roles: ['user'] }
      ],
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          push: false
        }
      }
    }
  },
  {
    name: 'API Response',
    description: 'Typical API response structure',
    data: {
      status: 'success',
      data: {
        items: [],
        pagination: {
          page: 1,
          totalPages: 10,
          totalItems: 100
        }
      },
      timestamp: new Date().toISOString()
    }
  }
]