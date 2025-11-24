// ============================================
// QR Code Generator - Type Definitions
// ============================================

export type QRSize = 256 | 512 | 1024
export type QRType = 'text' | 'url' | 'wifi' | 'vcard'
export type OutputFormat = 'png' | 'svg' | 'jpeg'
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type ColorTabType = 'preset' | 'custom'
export type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'

export interface PresetColor {
  name: string
  foreground: string
  background: string
}

export interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean
}

export interface VCardData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title: string
  website: string
}

export interface QROptions {
  size: QRSize
  outputFormat: OutputFormat
  errorLevel: ErrorCorrectionLevel
  dotStyle: DotStyle
  foregroundColor: string
  backgroundColor: string
  logo: string | null
  logoSize: number
}

export interface QRState {
  qrType: QRType
  textInput: string
  wifiData: WiFiData
  vcardData: VCardData
  options: QROptions
  colorTab: ColorTabType
  selectedPreset: number
}
