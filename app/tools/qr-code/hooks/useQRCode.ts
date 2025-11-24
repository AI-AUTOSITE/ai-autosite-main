// ============================================
// QR Code Generator - Custom Hook
// ============================================

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  QRType, 
  QRSize, 
  OutputFormat, 
  ErrorCorrectionLevel, 
  DotStyle,
  WiFiData, 
  VCardData 
} from '../lib/types'
import { formatWiFiString, formatVCardString } from '../lib/utils'
import { PRESET_COLORS, DEFAULT_SIZE, DEFAULT_ERROR_LEVEL, DEFAULT_DOT_STYLE } from '../lib/constants'

interface UseQRCodeOptions {
  debounceMs?: number
}

interface UseQRCodeReturn {
  // Refs
  qrRef: React.RefObject<HTMLDivElement | null>
  
  // State
  qrType: QRType
  textInput: string
  wifiData: WiFiData
  vcardData: VCardData
  size: QRSize
  outputFormat: OutputFormat
  errorLevel: ErrorCorrectionLevel
  dotStyle: DotStyle
  colorTab: 'preset' | 'custom'
  selectedPreset: number
  customForeground: string
  customBackground: string
  logo: string | null
  showPassword: boolean
  error: string
  isGenerated: boolean
  
  // Computed
  currentColors: { foreground: string; background: string; name: string }
  
  // Actions
  setQrType: (type: QRType) => void
  setTextInput: (text: string) => void
  setWifiData: (data: WiFiData) => void
  setVcardData: (data: VCardData) => void
  setSize: (size: QRSize) => void
  setOutputFormat: (format: OutputFormat) => void
  setErrorLevel: (level: ErrorCorrectionLevel) => void
  setDotStyle: (style: DotStyle) => void
  setColorTab: (tab: 'preset' | 'custom') => void
  setSelectedPreset: (index: number) => void
  setCustomForeground: (color: string) => void
  setCustomBackground: (color: string) => void
  setLogo: (logo: string | null) => void
  setShowPassword: (show: boolean) => void
  handleDownload: () => void
  handleClear: () => void
  loadExample: () => void
}

export function useQRCode(options: UseQRCodeOptions = {}): UseQRCodeReturn {
  const { debounceMs = 100 } = options
  
  // Refs
  const qrRef = useRef<HTMLDivElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrCodeInstance = useRef<any>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // QR Type & Content
  const [qrType, setQrType] = useState<QRType>('text')
  const [textInput, setTextInput] = useState('')
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  })
  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    website: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  // QR Options
  const [size, setSize] = useState<QRSize>(DEFAULT_SIZE as QRSize)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png')
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>(DEFAULT_ERROR_LEVEL)
  const [dotStyle, setDotStyle] = useState<DotStyle>(DEFAULT_DOT_STYLE)

  // Color options
  const [colorTab, setColorTab] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [customForeground, setCustomForeground] = useState('#000000')
  const [customBackground, setCustomBackground] = useState('#FFFFFF')

  // Logo
  const [logo, setLogo] = useState<string | null>(null)
  const logoSize = 0.3

  // UI State
  const [error, setError] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)

  // Computed colors
  const currentColors = colorTab === 'preset'
    ? PRESET_COLORS[selectedPreset]
    : { foreground: customForeground, background: customBackground, name: 'Custom' }

  // Get QR data based on type
  const getQRData = useCallback((): string => {
    switch (qrType) {
      case 'text':
      case 'url':
        return textInput
      case 'wifi':
        return formatWiFiString(wifiData)
      case 'vcard':
        return formatVCardString(vcardData)
      default:
        return ''
    }
  }, [qrType, textInput, wifiData, vcardData])

  // Generate QR Code (debounced for real-time updates)
  const generateQR = useCallback(async () => {
    const data = getQRData()

    // Get current color values (use primitives to avoid object reference issues)
    const foreground = colorTab === 'preset' 
      ? PRESET_COLORS[selectedPreset].foreground 
      : customForeground
    const background = colorTab === 'preset' 
      ? PRESET_COLORS[selectedPreset].background 
      : customBackground

    if (!data.trim()) {
      setIsGenerated(false)
      if (qrRef.current) {
        qrRef.current.innerHTML = ''
      }
      return
    }

    if (data.length > 2000) {
      setError('Text too long (max 2000 characters)')
      setIsGenerated(false)
      return
    }

    setError('')

    try {
      // Dynamically import qr-code-styling (client-side only)
      const QRCodeStyling = (await import('qr-code-styling')).default

      // Determine error correction level (auto-increase for logos)
      const effectiveErrorLevel = logo && (errorLevel === 'L' || errorLevel === 'M') 
        ? 'Q' 
        : errorLevel

      // Build QR options object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qrOptions: any = {
        width: size,
        height: size,
        type: 'svg',
        data: data,
        dotsOptions: {
          color: foreground,
          type: dotStyle,
        },
        backgroundOptions: {
          color: background,
        },
        cornersSquareOptions: {
          color: foreground,
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: foreground,
          type: 'dot',
        },
        qrOptions: {
          errorCorrectionLevel: effectiveErrorLevel,
        },
      }

      // Add logo options only if logo exists
      if (logo) {
        qrOptions.image = logo
        qrOptions.imageOptions = {
          hideBackgroundDots: true,
          imageSize: logoSize,
          margin: 4,
          crossOrigin: 'anonymous',
        }
      }

      // Create QR Code instance
      const qrCode = new QRCodeStyling(qrOptions)
      qrCodeInstance.current = qrCode

      // Render to DOM
      if (qrRef.current) {
        qrRef.current.innerHTML = ''
        qrCode.append(qrRef.current)
        
        // Force SVG to fit container
        requestAnimationFrame(() => {
          const svg = qrRef.current?.querySelector('svg')
          if (svg) {
            // Get the original size for viewBox
            const originalSize = size.toString()
            
            // Set viewBox if not present
            if (!svg.getAttribute('viewBox')) {
              svg.setAttribute('viewBox', `0 0 ${originalSize} ${originalSize}`)
            }
            
            // Remove inline width/height attributes (these override CSS)
            svg.removeAttribute('width')
            svg.removeAttribute('height')
            
            // Apply CSS styles to fit container
            svg.style.width = '100%'
            svg.style.height = '100%'
            svg.style.maxWidth = '100%'
            svg.style.maxHeight = '100%'
            svg.style.display = 'block'
            svg.style.objectFit = 'contain'
          }
        })
        
        setIsGenerated(true)
      }
    } catch (err) {
      console.error('QR generation error:', err)
      setError('Failed to generate QR code')
    }
  }, [getQRData, size, dotStyle, colorTab, selectedPreset, customForeground, customBackground, logo, logoSize, errorLevel])

  // Debounced QR generation effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      generateQR()
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [generateQR, debounceMs])

  // Handle download
  const handleDownload = useCallback(() => {
    if (!qrCodeInstance.current) return

    qrCodeInstance.current.download({
      extension: outputFormat,
      name: `qrcode-${Date.now()}`,
    })
  }, [outputFormat])

  // Handle clear
  const handleClear = useCallback(() => {
    setTextInput('')
    setWifiData({ ssid: '', password: '', encryption: 'WPA', hidden: false })
    setVcardData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
    })
    setLogo(null)
    setError('')
    setIsGenerated(false)
  }, [])

  // Load example
  const loadExample = useCallback(() => {
    if (qrType === 'text') {
      setTextInput('Hello World! This is a test QR code.')
    } else if (qrType === 'url') {
      setTextInput('https://example.com')
    } else if (qrType === 'wifi') {
      setWifiData({
        ssid: 'MyNetwork',
        password: 'MyPassword123',
        encryption: 'WPA',
        hidden: false,
      })
    } else if (qrType === 'vcard') {
      setVcardData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Example Inc.',
        title: 'Developer',
        website: 'https://example.com',
      })
    }
  }, [qrType])

  return {
    // Refs
    qrRef,
    
    // State
    qrType,
    textInput,
    wifiData,
    vcardData,
    size,
    outputFormat,
    errorLevel,
    dotStyle,
    colorTab,
    selectedPreset,
    customForeground,
    customBackground,
    logo,
    showPassword,
    error,
    isGenerated,
    
    // Computed
    currentColors,
    
    // Actions
    setQrType,
    setTextInput,
    setWifiData,
    setVcardData,
    setSize,
    setOutputFormat,
    setErrorLevel,
    setDotStyle,
    setColorTab,
    setSelectedPreset,
    setCustomForeground,
    setCustomBackground,
    setLogo,
    setShowPassword,
    handleDownload,
    handleClear,
    loadExample,
  }
}
