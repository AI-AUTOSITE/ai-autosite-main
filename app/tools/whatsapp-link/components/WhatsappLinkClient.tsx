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
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('Custom')

  // Get current country
  const currentCountry = useMemo(() => {
    return ALL_COUNTRIES.find((c) => c.code === countryCode) || ALL_COUNTRIES[0]
  }, [countryCode])

  // Full phone number
  const fullPhoneNumber = useMemo(() => {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
    if (!cleanPhone) return ''
    return `${countryCode} ${cleanPhone}`
  }, [countryCode, phoneNumber])

  // Generate link automatically
  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')

    if (!cleanPhone || !/^\d+$/.test(cleanPhone)) {
      setGeneratedLink('')
      setQrCodeUrl('')
      return
    }

    const fullNumber = countryCode.replace('+', '') + cleanPhone
    const encodedMessage = message ? encodeURIComponent(message) : ''
    const waLink = message
      ? `https://wa.me/${fullNumber}?text=${encodedMessage}`
      : `https://wa.me/${fullNumber}`

    setGeneratedLink(waLink)
    generateQRCode(waLink)
  }, [phoneNumber, countryCode, message])

  // Generate QR code
  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#25D366', // WhatsApp green
          light: '#FFFFFF',
        },
      })
      setQrCodeUrl(qrDataUrl)
    } catch (err) {
      console.error('QR code generation failed:', err)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedLink) return

    await navigator.clipboard.writeText(generatedLink)
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
  }

  // Apply template
  const applyTemplate = (template: (typeof MESSAGE_TEMPLATES)[0]) => {
    setSelectedTemplate(template.label)
    setMessage(template.text)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Live Preview */}
      {generatedLink && (
        <div className="text-center mb-8">
          <div className="text-xs text-gray-500 mb-2">Ready to share</div>
          <div className="text-3xl font-bold text-green-400 mb-2">{fullPhoneNumber}</div>
          {message && (
            <div className="text-sm text-gray-400 max-w-md mx-auto line-clamp-2">"{message}"</div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {generatedLink && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <a
            href={generatedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl 
                     font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Open Chat
          </a>

          <button
            onClick={handleCopy}
            className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            className="py-3 bg-white/5 text-gray-300 rounded-xl font-medium 
                     hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
        </div>
      )}

      {/* Main Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Phone Number Section */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block">Phone Number</label>

          {/* Country Quick Select */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {POPULAR_COUNTRIES.map((country) => (
              <button
                key={country.code + country.name}
                onClick={() => setCountryCode(country.code)}
                className={`p-2 rounded-lg transition-all flex flex-col items-center ${
                  countryCode === country.code
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="text-xl mb-1">{country.flag}</span>
                <span className="text-xs">{country.code}</span>
              </button>
            ))}
          </div>

          {/* Phone Input */}
          <div className="flex gap-2">
            <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="text-2xl">{currentCountry.flag}</span>
              <span className="text-white font-medium">{countryCode}</span>
            </div>

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                       text-white text-lg placeholder-gray-500 focus:outline-none 
                       focus:border-green-400 transition-all"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Without country code</p>
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
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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
                className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
                         transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 
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
