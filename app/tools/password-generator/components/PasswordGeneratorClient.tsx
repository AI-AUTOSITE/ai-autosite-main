'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, RefreshCw, Check, Shield, Smartphone } from 'lucide-react'

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('medium')
  const [isMobile, setIsMobile] = useState(false)

  // Vibration helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Character sets
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  const NUMBERS = '0123456789'
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  // Generate password
  const generatePassword = useCallback(() => {
    let chars = ''
    let newPassword = ''

    if (options.uppercase) chars += UPPERCASE
    if (options.lowercase) chars += LOWERCASE
    if (options.numbers) chars += NUMBERS
    if (options.symbols) chars += SYMBOLS

    if (chars === '') {
      chars = LOWERCASE
      setOptions((prev) => ({ ...prev, lowercase: true }))
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      newPassword += chars[randomIndex]
    }

    const ensureChars: string[] = []
    if (options.uppercase && !UPPERCASE.split('').some((c) => newPassword.includes(c))) {
      ensureChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)])
    }
    if (options.lowercase && !LOWERCASE.split('').some((c) => newPassword.includes(c))) {
      ensureChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)])
    }
    if (options.numbers && !NUMBERS.split('').some((c) => newPassword.includes(c))) {
      ensureChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
    }
    if (options.symbols && !SYMBOLS.split('').some((c) => newPassword.includes(c))) {
      ensureChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    }

    if (ensureChars.length > 0) {
      let passwordArray = newPassword.split('')
      ensureChars.forEach((char) => {
        const randomPos = Math.floor(Math.random() * passwordArray.length)
        passwordArray[randomPos] = char
      })
      newPassword = passwordArray.join('')
    }

    setPassword(newPassword)
    vibrate(30) // Generate feedback
  }, [length, options])

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string) => {
    let score = 0

    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (pwd.length >= 20) score++

    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    if (score <= 3) setStrength('weak')
    else if (score <= 5) setStrength('medium')
    else if (score <= 7) setStrength('strong')
    else setStrength('very-strong')
  }, [])

  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  // Update strength when password changes
  useEffect(() => {
    calculateStrength(password)
  }, [password, calculateStrength])

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      vibrate(30) // Copy feedback
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Toggle option
  const toggleOption = (option: keyof PasswordOptions) => {
    const newOptions = { ...options, [option]: !options[option] }
    const hasSelection = Object.values(newOptions).some((v) => v)

    if (hasSelection) {
      setOptions(newOptions)
      vibrate(30) // Toggle feedback
    }
  }

  // Get strength color
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
      case 'very-strong':
        return 'bg-cyan-500'
    }
  }

  // Get strength text
  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak'
      case 'medium':
        return 'OK'
      case 'strong':
        return 'Strong'
      case 'very-strong':
        return 'Excellent'
    }
  }

  // Get strength width
  const getStrengthWidth = () => {
    switch (strength) {
      case 'weak':
        return '25%'
      case 'medium':
        return '50%'
      case 'strong':
        return '75%'
      case 'very-strong':
        return '100%'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <style jsx>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          outline: none;
        }
        
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6 182 212), rgb(37 99 235));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
          transition: all 0.2s;
        }
        
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.6);
        }
        
        .custom-slider::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        
        .custom-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6 182 212), rgb(37 99 235));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
          transition: all 0.2s;
        }
        
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.6);
        }
        
        .custom-slider::-moz-range-thumb:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          .custom-slider::-webkit-slider-thumb {
            width: 28px;
            height: 28px;
          }
          .custom-slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>

      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
          <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Mobile Optimized</p>
            <p className="text-blue-400/70 text-xs mt-1">
              Never stored • Works offline • Tap to select & copy
            </p>
          </div>
        </div>
      )}

      {/* Password Display */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        <div className="bg-black/20 rounded-xl p-4 sm:p-6 mb-4 font-mono">
          <div className="text-lg sm:text-xl md:text-2xl text-white text-center break-all select-all min-h-[2em] leading-relaxed">
            {password || 'Generating...'}
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Strength</span>
            <span
              className={`text-sm font-medium ${
                strength === 'weak'
                  ? 'text-red-400'
                  : strength === 'medium'
                    ? 'text-yellow-400'
                    : strength === 'strong'
                      ? 'text-green-400'
                      : 'text-cyan-400'
              }`}
            >
              {getStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: getStrengthWidth() }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generatePassword}
            className="min-h-[44px] py-3 sm:py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl 
                     font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2
                     shadow-lg shadow-cyan-600/30 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">Generate</span>
            <span className="sm:hidden">New</span>
          </button>
          <button
            onClick={handleCopy}
            className={`min-h-[44px] py-3 sm:py-3.5 rounded-xl font-medium transition-all flex items-center 
                      justify-center gap-2 active:scale-95 ${
                        copied
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span className="hidden sm:inline">Copied!</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-white font-medium text-sm sm:text-base">Length</label>
            <span className="text-cyan-400 font-bold text-2xl min-w-[3ch] text-right">{length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value))
              vibrate(10) // Subtle slider feedback
            }}
            className="w-full custom-slider cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((length - 8) / 24) * 100}%, rgba(255, 255, 255, 0.1) ${((length - 8) / 24) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-3">
            <span>8</span>
            <span className="hidden sm:inline">12</span>
            <span className="hidden sm:inline">16</span>
            <span className="hidden sm:inline">24</span>
            <span>32</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <label className="text-white font-medium block text-sm sm:text-base">Characters</label>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => toggleOption('uppercase')}
              className={`min-h-[44px] p-4 sm:p-4 rounded-lg border transition-all active:scale-95 ${
                options.uppercase
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-lg sm:text-xl">ABC</div>
              <div className="text-xs mt-1 opacity-80">Uppercase</div>
            </button>

            <button
              onClick={() => toggleOption('lowercase')}
              className={`min-h-[44px] p-4 sm:p-4 rounded-lg border transition-all active:scale-95 ${
                options.lowercase
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-lg sm:text-xl">abc</div>
              <div className="text-xs mt-1 opacity-80">Lowercase</div>
            </button>

            <button
              onClick={() => toggleOption('numbers')}
              className={`min-h-[44px] p-4 sm:p-4 rounded-lg border transition-all active:scale-95 ${
                options.numbers
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-lg sm:text-xl">123</div>
              <div className="text-xs mt-1 opacity-80">Numbers</div>
            </button>

            <button
              onClick={() => toggleOption('symbols')}
              className={`min-h-[44px] p-4 sm:p-4 rounded-lg border transition-all active:scale-95 ${
                options.symbols
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-lg sm:text-xl">!@#</div>
              <div className="text-xs mt-1 opacity-80">Symbols</div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 text-white font-medium mb-3 text-sm sm:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          Security Tips
        </div>
        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Use 12+ characters</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Mix different types</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Unique for each account</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-cyan-400 flex-shrink-0">•</span>
            <span>Never share passwords</span>
          </div>
          {isMobile && (
            <div className="flex items-start gap-2 text-sm text-blue-400 pt-2 border-t border-white/10 sm:col-span-2">
              <span className="flex-shrink-0">📱</span>
              <span>Generated passwords are never stored anywhere</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}