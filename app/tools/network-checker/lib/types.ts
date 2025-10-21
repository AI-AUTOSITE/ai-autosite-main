// app/tools/network-checker/lib/types.ts

export interface Device {
  id: string
  name: string
  ip: string
  connection: 'wired' | 'wifi'
}

export type DiagnosisType = 
  | 'same-network' 
  | 'different-network' 
  | 'invalid-ip' 
  | 'need-more-devices'
  | null

export interface DiagnosticResult {
  type: DiagnosisType
  severity: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  solutions?: string[]
  technicalDetails?: {
    networks: string[]
    canConnect: boolean
  }
}

export interface NetworkSegment {
  segment: string // e.g., "192.168.1"
  devices: Device[]
  color: string
}

export interface ChatMessage {
  id: string
  role: 'bot' | 'user'
  content: string
  timestamp: Date
}

export interface DiagnosticRule {
  id: string
  name: string
  check: (devices: Device[]) => boolean
  getSolution: (devices: Device[]) => DiagnosticResult
}