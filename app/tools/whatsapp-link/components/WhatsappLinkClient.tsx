'use client'

import { useState, useEffect, useMemo } from 'react'
import { MessageCircle, Copy, Check, Share2, Download, QrCode, Phone, Send } from 'lucide-react'
import QRCode from 'qrcode'

interface CountryCode {
  name: string
  code: string
  flag: string
}

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
]

const MESSAGE_TEMPLATES = [
  { label: 'Business', text: "Hi! I'm interested in your services." },
  { label: 'Support', text: 'Hello, I need help with...' },
  { label: 'Info', text: 'Hi, could you provide more information?' },
  { label: 'Custom', text: '' },
]

export default function WhatsappLinkClient() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('Custom')
  const [inputError, setInputError] = useState('')
  const [showLengthWarning, setShowLengthWarning] = useState(false)

  // Vibration feedback helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
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

  const handlePhoneBlur = () => {
    if (phoneNumber && !isValidLength) {
      setShowLengthWarning(true)
    }
  }

  const handlePhoneFocus = () => {
    setShowLengthWarning(false)
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
    return cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone
  }, [phoneNumber])

  const digitCount = useMemo(() => {
    return phoneNumber.replace(/[^0-9]/g, '').length
  }, [phoneNumber])

  const isValidLength = useMemo(() => {
    return digitCount >= 8 && digitCount <= 15
  }, [digitCount])

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
    const waLink = message
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/${cleanPhone}`

    setGeneratedLink(waLink)
    generateQRCode(waLink)
  }, [phoneNumber, message])

  // Generate QR code
  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#25D366',
          light: '#FFFFFF',
        },
      })
      setQrCodeUrl(qrDataUrl)
      vibrate()
    } catch (err) {
      console.error('QR code generation failed:', err)
    }
  }

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
    if (navigator.share) {
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
    link.download = `whatsapp-${phoneNumber}.png`
    link.click()
    vibrate()
  }

  // Apply template
  const applyTemplate = (template: (typeof MESSAGE_TEMPLATES)[0]) => {
    setSelectedTemplate(template.label)
    setMessage(template.text)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Live Preview - Always reserve space */}
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

      {/* Quick Actions - Always reserve space to prevent layout shift */}
      <div className="grid grid-cols-3 gap-3 mb-6 min-h-[48px]">
        <a
          href={generatedLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            generatedLink
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
              : 'bg-white/5 text-gray-600 cursor-not-allowed pointer-events-none'
          }`}
        >
          <Send className="w-4 h-4" />
          Open Chat
        </a>

        <button
          onClick={handleCopy}
          disabled={!generatedLink}
          className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-green-500 text-white'
              : generatedLink
                ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
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
              ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>

      {/* Main Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Phone Number Section */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block">Phone Number</label>

          {/* Quick fill - NOW AT THE TOP */}
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
              autoFocus={false}
              maxLength={20}
              value={phoneNumber}
              onChange={(e) => handlePhoneInput(e.target.value)}
              onBlur={handlePhoneBlur}
              onFocus={handlePhoneFocus}
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
                Enter with country code
              </p>
            )}
            {phoneNumber && !inputError && (
              <p className={`text-xs ${isValidLength ? 'text-green-400' : 'text-gray-400'}`}>
                {digitCount}/15 digits {isValidLength ? '✓' : ''}
              </p>
            )}
          </div>

          {/* Country Info */}
          {phoneNumber && !inputError && !showLengthWarning && (
            <div className="mt-1 flex justify-end">
              <p className="text-xs text-gray-400">
                {detectedCountry.name} {detectedCountry.code}
              </p>
            </div>
          )}
        </div>

        {/* Message Section */}
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Message Template</label>

          {/* Template Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {MESSAGE_TEMPLATES.map((template) => (
              <button
                key={template.label}
                onClick={() => applyTemplate(template)}
                className={`min-h-[44px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTemplate === template.label
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setSelectedTemplate('Custom')
            }}
            placeholder="Type your message (optional)..."
            rows={2}
            inputMode="text"
            autoComplete="off"
            autoFocus={false}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-green-400 
                     transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">{message.length} characters</p>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && qrCodeUrl && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-400" />
              QR Code
            </h3>
            <button
              onClick={() => setShowQR(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl mb-4">
              <img src={qrCodeUrl} alt="WhatsApp QR" className="w-48 h-48 sm:w-64 sm:h-64" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadQR}
                className="min-h-[44px] px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
                         transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="min-h-[44px] px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
                           transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>
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
          <div className="text-lg mb-1">🌍</div>
          <div className="text-xs text-gray-400">Works globally</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📱</div>
          <div className="text-xs text-gray-400">Mobile ready</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">⚡</div>
          <div className="text-xs text-gray-400">Instant chat</div>
        </div>
      </div>
    </div>
  )
}