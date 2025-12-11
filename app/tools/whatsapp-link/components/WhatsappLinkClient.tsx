'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { 
  MessageCircle, Copy, Check, Share2, Download, QrCode, Phone, 
  Palette, Link2, ChevronDown, ChevronUp, Zap, Building2,
  ShoppingCart, Home, Utensils, Briefcase, HeartPulse, GraduationCap
} from 'lucide-react'
import QRCode from 'qrcode'

// ============================================
// Types & Interfaces
// ============================================
interface CountryCode {
  name: string
  code: string
  flag: string
}

interface MessageTemplate {
  id: string
  label: string
  icon: React.ReactNode
  category: string
  templates: { name: string; text: string }[]
}

interface UTMParams {
  source: string
  medium: string
  campaign: string
}

// ============================================
// Country Codes Data
// ============================================
const POPULAR_COUNTRIES: CountryCode[] = [
  { name: 'USA', code: '+1', flag: '🇺🇸' },
  { name: 'UK', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
]

const ALL_COUNTRIES: CountryCode[] = [
  ...POPULAR_COUNTRIES,
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'UAE', code: '+971', flag: '🇦🇪' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
]

// ============================================
// Industry Message Templates
// ============================================
const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: <ShoppingCart className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Order Inquiry', text: "Hi! I'd like to inquire about my order #[ORDER_NUMBER]." },
      { name: 'Product Question', text: "Hello! I have a question about [PRODUCT_NAME]. Is it available?" },
      { name: 'Return Request', text: "Hi, I'd like to request a return for order #[ORDER_NUMBER]." },
      { name: 'Cart Recovery', text: "Hi! I noticed you left items in your cart. Need any help completing your order?" },
    ]
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: <Home className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Property Inquiry', text: "Hello! I'm interested in the property at [ADDRESS]. Is it still available?" },
      { name: 'Schedule Viewing', text: "Hi! I'd like to schedule a viewing for the property listing #[ID]." },
      { name: 'Price Negotiation', text: "Hello, I'm interested in making an offer on [PROPERTY]. Can we discuss?" },
    ]
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: <Utensils className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Reservation', text: "Hi! I'd like to make a reservation for [NUMBER] people on [DATE] at [TIME]." },
      { name: 'Menu Inquiry', text: "Hello! Do you have vegetarian/vegan options on your menu?" },
      { name: 'Delivery Order', text: "Hi! I'd like to place a delivery order to [ADDRESS]." },
    ]
  },
  {
    id: 'services',
    label: 'Services',
    icon: <Briefcase className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Quote Request', text: "Hello! I'd like to request a quote for [SERVICE]." },
      { name: 'Appointment', text: "Hi! I'd like to book an appointment for [DATE/TIME]." },
      { name: 'Support', text: "Hello, I need help with [ISSUE]. Can you assist?" },
    ]
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: <HeartPulse className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Appointment', text: "Hello! I'd like to schedule an appointment with Dr. [NAME]." },
      { name: 'Prescription', text: "Hi! I need to refill my prescription for [MEDICATION]." },
      { name: 'General Inquiry', text: "Hello, I have a question about [TOPIC]. Can you help?" },
    ]
  },
  {
    id: 'education',
    label: 'Education',
    icon: <GraduationCap className="w-4 h-4" />,
    category: 'business',
    templates: [
      { name: 'Course Inquiry', text: "Hi! I'm interested in the [COURSE_NAME] course. Can you provide more details?" },
      { name: 'Enrollment', text: "Hello! I'd like to enroll in [PROGRAM]. What are the requirements?" },
      { name: 'Schedule', text: "Hi! Can you send me the class schedule for [COURSE]?" },
    ]
  },
]

// ============================================
// QR Color Presets
// ============================================
const QR_COLOR_PRESETS = [
  { name: 'WhatsApp Green', fg: '#25D366', bg: '#FFFFFF' },
  { name: 'Classic Black', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Ocean Blue', fg: '#0088CC', bg: '#FFFFFF' },
  { name: 'Purple', fg: '#7C3AED', bg: '#FFFFFF' },
  { name: 'Coral', fg: '#FF6B6B', bg: '#FFFFFF' },
  { name: 'Dark Mode', fg: '#FFFFFF', bg: '#1F2937' },
]

// ============================================
// Main Component
// ============================================
export default function WhatsappLinkClient() {
  // Core state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [inputError, setInputError] = useState('')
  const [showLengthWarning, setShowLengthWarning] = useState(false)

  // UI state
  const [showQR, setShowQR] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showUTM, setShowUTM] = useState(false)
  const [showQRCustomize, setShowQRCustomize] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)

  // QR customization
  const [qrFgColor, setQrFgColor] = useState('#25D366')
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF')

  // UTM params
  const [utmParams, setUtmParams] = useState<UTMParams>({
    source: '',
    medium: '',
    campaign: ''
  })

  // Refs
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // Vibration feedback helper
  const vibrate = (duration: number = 30) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Handle phone number input with validation
  const handlePhoneInput = (value: string) => {
    const cleanValue = value.replace(/[^0-9+\s]/g, '')
    const digitsOnly = cleanValue.replace(/[^0-9]/g, '')
    const hasInvalidChars = /[^0-9+\s]/.test(value)
    
    if (hasInvalidChars) {
      setInputError('Only numbers, +, and spaces allowed')
      vibrate(50)
      setTimeout(() => setInputError(''), 2000)
      setPhoneNumber(cleanValue)
      return
    }
    
    if (digitsOnly.length > 15) {
      setInputError('Phone number too long (max 15 digits)')
      vibrate(50)
      setTimeout(() => setInputError(''), 2000)
      return
    }
    
    setInputError('')
    setPhoneNumber(cleanValue)
  }

  // Detect country code from phone number
  const detectedCountry = useMemo(() => {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
    const sortedCountries = [...ALL_COUNTRIES].sort((a, b) => 
      b.code.length - a.code.length
    )
    
    for (const country of sortedCountries) {
      const code = country.code.replace('+', '')
      if (cleanPhone.startsWith(code) || cleanPhone.startsWith('+' + code)) {
        return country
      }
    }
    
    return ALL_COUNTRIES[0]
  }, [phoneNumber])

  const fullPhoneNumber = useMemo(() => {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '')
    if (!cleanPhone) return ''
    return '+' + cleanPhone
  }, [phoneNumber])

  const digitCount = useMemo(() => {
    return phoneNumber.replace(/[^0-9]/g, '').length
  }, [phoneNumber])

  const isValidLength = useMemo(() => {
    return digitCount >= 8 && digitCount <= 15
  }, [digitCount])

  // Build UTM string
  const utmString = useMemo(() => {
    const params = []
    if (utmParams.source) params.push(`utm_source=${encodeURIComponent(utmParams.source)}`)
    if (utmParams.medium) params.push(`utm_medium=${encodeURIComponent(utmParams.medium)}`)
    if (utmParams.campaign) params.push(`utm_campaign=${encodeURIComponent(utmParams.campaign)}`)
    return params.length > 0 ? '&' + params.join('&') : ''
  }, [utmParams])

  // Generate link automatically
  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '')
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '')

    if (!cleanPhone || !/^\d+$/.test(cleanPhone) || digitsOnly.length < 8 || digitsOnly.length > 15) {
      setGeneratedLink('')
      setQrCodeUrl('')
      return
    }

    const encodedMessage = message ? encodeURIComponent(message) : ''
    let waLink = message
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/${cleanPhone}`
    
    // Add UTM params if any (for tracking purposes in the message or redirect)
    if (utmString && message) {
      // UTM params are typically for landing pages, but we can append to show user
      waLink = waLink + utmString
    }

    setGeneratedLink(waLink)
    generateQRCode(waLink)
  }, [phoneNumber, message, utmString])

  // Generate QR code with custom colors
  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: qrFgColor,
          light: qrBgColor,
        },
      })
      setQrCodeUrl(qrDataUrl)
    } catch (err) {
      console.error('QR code generation failed:', err)
    }
  }

  // Regenerate QR when colors change
  useEffect(() => {
    if (generatedLink) {
      generateQRCode(generatedLink)
    }
  }, [qrFgColor, qrBgColor])

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedLink) return
    await navigator.clipboard.writeText(generatedLink)
    vibrate()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share link
  const handleShare = async () => {
    if (!generatedLink) return
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'WhatsApp Chat Link',
          text: message || 'Start a WhatsApp chat',
          url: generatedLink,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopy()
    }
  }

  // Download QR
  const handleDownloadQR = () => {
    if (!qrCodeUrl) return
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `whatsapp-qr-${phoneNumber.replace(/[^0-9]/g, '')}.png`
    link.click()
    vibrate()
  }

  // Apply template
  const applyTemplate = (templateText: string) => {
    setMessage(templateText)
    setShowTemplates(false)
    vibrate()
  }

  // Apply QR color preset
  const applyColorPreset = (preset: typeof QR_COLOR_PRESETS[0]) => {
    setQrFgColor(preset.fg)
    setQrBgColor(preset.bg)
    vibrate()
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Live Preview */}
      <div className="text-center mb-8 min-h-[120px] flex flex-col items-center justify-center">
        {generatedLink ? (
          <>
            <div className="text-xs text-gray-500 mb-2">Ready to share</div>
            <div className="text-3xl font-bold text-green-400 mb-2">{fullPhoneNumber}</div>
            {message && (
              <div className="text-sm text-gray-400 max-w-md mx-auto line-clamp-2">"{message}"</div>
            )}
          </>
        ) : (
          <div className="text-gray-600">
            <Phone className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Enter a phone number to get started</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <a
          href={generatedLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => !generatedLink && e.preventDefault()}
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            generatedLink
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Open Chat
        </a>

        <button
          onClick={handleCopy}
          disabled={!generatedLink}
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            generatedLink
              ? copied
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={() => setShowQR(!showQR)}
          disabled={!generatedLink}
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            generatedLink
              ? showQR
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>

        <button
          onClick={handleShare}
          disabled={!generatedLink}
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            generatedLink
              ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Main Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Phone Number Section */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block">Phone Number (with country code)</label>

          {/* Quick fill */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick fill:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_COUNTRIES.map((country) => (
                <button
                  key={country.code + country.name}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handlePhoneInput(country.code)
                  }}
                  className="min-h-[44px] px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all 
                           flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
                >
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
              <span className="text-2xl">{detectedCountry.flag}</span>
            </div>
            
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              value={phoneNumber}
              onChange={(e) => handlePhoneInput(e.target.value)}
              onBlur={() => phoneNumber && !isValidLength && setShowLengthWarning(true)}
              onFocus={() => setShowLengthWarning(false)}
              placeholder="+12345678900"
              className={`w-full pl-16 pr-4 py-4 bg-black/30 border rounded-xl 
                       text-white text-lg placeholder-gray-500 focus:outline-none 
                       transition-all ${
                         inputError 
                           ? 'border-red-500 focus:border-red-500' 
                           : 'border-white/10 focus:border-green-400'
                       }`}
            />
            
            {(inputError || (showLengthWarning && phoneNumber && !isValidLength)) && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className={`text-xl ${inputError ? 'text-red-400' : 'text-yellow-400'}`}>
                  ⚠️
                </span>
              </div>
            )}
          </div>
          
          {/* Error or Help Text */}
          <div className="flex items-center justify-between mt-2">
            {inputError ? (
              <p className="text-xs text-red-400 flex items-center gap-1 animate-pulse">
                <span>❌</span> {inputError}
              </p>
            ) : showLengthWarning && phoneNumber && !isValidLength ? (
              <p className="text-xs text-yellow-400 flex items-center gap-1">
                <span>⚠️</span> 
                {digitCount < 8 
                  ? `Too short (min 8 digits, current: ${digitCount})`
                  : `Too long (max 15 digits, current: ${digitCount})`
                }
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Include country code (e.g., +1 for USA)
              </p>
            )}
            {phoneNumber && !inputError && (
              <p className={`text-xs ${isValidLength ? 'text-green-400' : 'text-gray-400'}`}>
                {digitCount}/15 digits {isValidLength ? '✓' : ''}
              </p>
            )}
          </div>

          {/* Country Info */}
          {phoneNumber && !inputError && !showLengthWarning && isValidLength && (
            <div className="mt-1 flex justify-end">
              <p className="text-xs text-gray-400">
                Detected: {detectedCountry.name} {detectedCountry.code}
              </p>
            </div>
          )}
        </div>

        {/* Message Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm text-gray-400">Pre-filled Message (optional)</label>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Building2 className="w-3 h-3" />
              Industry Templates
              {showTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Industry Templates */}
          {showTemplates && (
            <div className="mb-4 p-4 bg-black/20 rounded-xl border border-white/10">
              <div className="flex flex-wrap gap-2 mb-3">
                {MESSAGE_TEMPLATES.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedIndustry === industry.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {industry.icon}
                    {industry.label}
                  </button>
                ))}
              </div>

              {selectedIndustry && (
                <div className="space-y-2">
                  {MESSAGE_TEMPLATES.find(t => t.id === selectedIndustry)?.templates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(template.text)}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <p className="text-sm text-white font-medium">{template.name}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{template.text}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message (optional)..."
            rows={3}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-green-400 
                     transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">{message.length} characters</p>
        </div>
      </div>

      {/* UTM Parameters (Collapsible) */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
        <button
          onClick={() => setShowUTM(!showUTM)}
          className="w-full p-4 flex justify-between items-center text-left"
        >
          <span className="flex items-center gap-2 text-white font-medium">
            <Link2 className="w-5 h-5 text-cyan-400" />
            UTM Tracking Parameters
            <span className="text-xs text-gray-500 font-normal">(for marketers)</span>
          </span>
          {showUTM ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showUTM && (
          <div className="px-6 pb-6 space-y-4">
            <p className="text-xs text-gray-400">Track your WhatsApp campaigns in Google Analytics</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Source</label>
                <input
                  type="text"
                  value={utmParams.source}
                  onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                  placeholder="e.g., instagram"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg 
                           text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Medium</label>
                <input
                  type="text"
                  value={utmParams.medium}
                  onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                  placeholder="e.g., social"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg 
                           text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Campaign</label>
                <input
                  type="text"
                  value={utmParams.campaign}
                  onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                  placeholder="e.g., summer_sale"
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg 
                           text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>
            {utmString && (
              <div className="p-3 bg-black/20 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Generated UTM:</p>
                <p className="text-xs text-green-400 font-mono break-all">{utmString.slice(1)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Section */}
      {showQR && qrCodeUrl && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-400" />
              QR Code
            </h3>
            <button
              onClick={() => setShowQRCustomize(!showQRCustomize)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              Customize Colors
              {showQRCustomize ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Color Customization */}
          {showQRCustomize && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl">
              <p className="text-xs text-gray-400 mb-3">Color Presets:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {QR_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                      qrFgColor === preset.fg && qrBgColor === preset.bg
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: preset.fg }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">QR Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg 
                               text-white text-sm font-mono focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg 
                               text-white text-sm font-mono focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div 
              className="p-4 rounded-xl mb-4"
              style={{ backgroundColor: qrBgColor }}
            >
              <img src={qrCodeUrl} alt="WhatsApp QR" className="w-48 h-48 sm:w-64 sm:h-64" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadQR}
                className="min-h-[44px] px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 
                         transition-all flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Link Display */}
      {generatedLink && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            Generated Link
          </h3>
          <div className="p-3 bg-black/30 rounded-lg">
            <p className="text-sm text-green-400 font-mono break-all">{generatedLink}</p>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">💬</div>
          <div className="text-xs text-gray-400">No save needed</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🎨</div>
          <div className="text-xs text-gray-400">Custom QR colors</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📊</div>
          <div className="text-xs text-gray-400">UTM tracking</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🏢</div>
          <div className="text-xs text-gray-400">Industry templates</div>
        </div>
      </div>
    </div>
  )
}